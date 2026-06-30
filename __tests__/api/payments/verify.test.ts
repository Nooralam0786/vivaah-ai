/**
 * @jest-environment node
 *
 * Integration tests for POST /api/payments/verify.
 * Tests Razorpay signature verification + subscription activation.
 */

import { NextRequest } from 'next/server';
import crypto from 'crypto';

// ── Mocks ─────────────────────────────────────────────────────────────────────

jest.mock('@/lib/db', () => ({
  prisma: {
    subscription: {
      updateMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
    user: {
      findUnique: jest.fn(),
      update:     jest.fn().mockResolvedValue({}),
    },
    $transaction: jest.fn().mockResolvedValue([]),
    referralReward: {
      updateMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
  },
}));

jest.mock('@/lib/email', () => ({
  sendPaymentReceiptEmail: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@/lib/jwt', () => ({
  verifyToken: jest.fn(),
}));

jest.mock('@/lib/razorpay', () => ({
  TIER_AMOUNTS: { gold: 49900, platinum: 99900, diamond: 249900 },
}));

// ── Imports (after mocks) ─────────────────────────────────────────────────────

import { POST } from '@/app/api/payments/verify/route';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';

const mockPrisma   = prisma   as jest.Mocked<typeof prisma>;
const mockVerify   = verifyToken as jest.Mock;

// ── Helpers ───────────────────────────────────────────────────────────────────

const TEST_SECRET = 'test-razorpay-secret'; // matches jest.setup.js RAZORPAY_KEY_SECRET

function makeSignature(orderId: string, paymentId: string): string {
  return crypto
    .createHmac('sha256', TEST_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
}

function makeRequest(body: Record<string, unknown>, token = 'valid-token'): NextRequest {
  return new NextRequest('http://localhost/api/payments/verify', {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
}

const ORDER_ID   = 'order_test123';
const PAYMENT_ID = 'pay_test456';

const validBody = {
  razorpay_order_id:   ORDER_ID,
  razorpay_payment_id: PAYMENT_ID,
  razorpay_signature:  makeSignature(ORDER_ID, PAYMENT_ID),
  tier:                'gold',
};

const mockUser = {
  id:        'user-123',
  email:     'priya@example.com',
  fullName:  'Priya Sharma',
  referredBy: null,
};

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.clearAllMocks();
  mockVerify.mockReturnValue({ userId: 'user-123' });
  (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
  (mockPrisma.$transaction    as jest.Mock).mockResolvedValue([]);
});

describe('POST /api/payments/verify', () => {

  describe('authentication', () => {
    it('returns 401 when no Authorization header', async () => {
      const req = new NextRequest('http://localhost/api/payments/verify', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(validBody),
      });
      const res = await POST(req);
      expect(res.status).toBe(401);
    });

    it('returns 401 when token is invalid', async () => {
      mockVerify.mockReturnValue(null);
      const res = await POST(makeRequest(validBody));
      expect(res.status).toBe(401);
    });
  });

  describe('signature verification', () => {
    it('returns 200 for valid signature', async () => {
      const res  = await POST(makeRequest(validBody));
      const json = await res.json();
      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.tier).toBe('gold');
    });

    it('returns 400 for tampered signature', async () => {
      const res  = await POST(makeRequest({ ...validBody, razorpay_signature: 'bad-signature' }));
      const json = await res.json();
      expect(res.status).toBe(400);
      expect(json.error.code).toBe('INVALID_SIGNATURE');
    });

    it('returns 400 when signature is for different order', async () => {
      const wrongSig = makeSignature('order_other', PAYMENT_ID);
      const res = await POST(makeRequest({ ...validBody, razorpay_signature: wrongSig }));
      expect(res.status).toBe(400);
    });
  });

  describe('validation', () => {
    it('returns 400 for missing razorpay_order_id', async () => {
      const { razorpay_order_id: _, ...body } = validBody;
      const res = await POST(makeRequest(body));
      expect(res.status).toBe(400);
    });

    it('returns 400 for invalid tier', async () => {
      const res = await POST(makeRequest({ ...validBody, tier: 'free' }));
      expect(res.status).toBe(400);
    });

    it('accepts all valid tiers', async () => {
      for (const tier of ['gold', 'platinum', 'diamond']) {
        const body = {
          ...validBody,
          tier,
          razorpay_signature: makeSignature(ORDER_ID, PAYMENT_ID),
        };
        const res  = await POST(makeRequest(body));
        const json = await res.json();
        expect(json.success).toBe(true);
        expect(json.data.tier).toBe(tier);
      }
    });
  });

  describe('subscription activation', () => {
    it('calls $transaction to activate subscription', async () => {
      await POST(makeRequest(validBody));
      expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
    });

    it('returns expiresAt roughly 1 month in the future', async () => {
      const res  = await POST(makeRequest(validBody));
      const json = await res.json();
      const expires = new Date(json.data.expiresAt).getTime();
      const now     = Date.now();
      // Between 27 and 32 days from now
      expect(expires - now).toBeGreaterThan(27 * 24 * 60 * 60 * 1000);
      expect(expires - now).toBeLessThan(32 * 24 * 60 * 60 * 1000);
    });
  });

  describe('server error', () => {
    it('returns 500 when $transaction throws', async () => {
      (mockPrisma.$transaction as jest.Mock).mockRejectedValue(new Error('DB error'));
      const res  = await POST(makeRequest(validBody));
      expect(res.status).toBe(500);
    });
  });
});
