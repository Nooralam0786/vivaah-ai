/**
 * @jest-environment node
 *
 * Integration tests for POST /api/auth/signup.
 * Prisma, email, and JWT are mocked so no real DB is needed.
 */

import { NextRequest } from 'next/server';

// ── Mocks (must be declared before imports of the route) ─────────────────────

jest.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findFirst: jest.fn(),
      create:    jest.fn(),
    },
    auditLog: {
      create: jest.fn().mockResolvedValue(undefined),
    },
  },
}));

jest.mock('@/lib/email', () => ({
  sendWelcomeEmail: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@/lib/jwt', () => ({
  signAccessToken:  jest.fn().mockReturnValue('mock-access-token'),
  signRefreshToken: jest.fn().mockReturnValue('mock-refresh-token'),
}));

// ── Imports (after mocks) ─────────────────────────────────────────────────────

import { POST } from '@/app/api/auth/signup/route';
import { prisma } from '@/lib/db';

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest('http://localhost/api/auth/signup', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  });
}

const validBody = {
  fullName: 'Priya Sharma',
  email:    'priya@example.com',
  phone:    '9876543210',
  password: 'SecurePass1',
};

const mockCreatedUser = {
  id:            'user-123',
  fullName:      validBody.fullName,
  email:         validBody.email,
  phone:         validBody.phone,
  passwordHash:  '$hashed',
  referralCode:  'ref-abc',
  referredBy:    null,
  createdAt:     new Date(),
  updatedAt:     new Date(),
};

// ── Tests ─────────────────────────────────────────────────────────────────────

beforeEach(() => jest.clearAllMocks());

describe('POST /api/auth/signup', () => {

  describe('success cases', () => {
    beforeEach(() => {
      (mockPrisma.user.findFirst as jest.Mock).mockResolvedValue(null);
      (mockPrisma.user.create   as jest.Mock).mockResolvedValue(mockCreatedUser);
    });

    it('returns 200 with tokens for valid signup', async () => {
      const res  = await POST(makeRequest(validBody));
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      expect(json.data.token).toBe('mock-access-token');
      expect(json.data.refreshToken).toBe('mock-refresh-token');
      expect(json.data.userId).toBe('user-123');
    });

    it('calls prisma.user.create with correct data', async () => {
      await POST(makeRequest(validBody));
      expect(mockPrisma.user.create).toHaveBeenCalledTimes(1);
      const createCall = (mockPrisma.user.create as jest.Mock).mock.calls[0][0];
      expect(createCall.data.email).toBe(validBody.email);
      expect(createCall.data.phone).toBe(validBody.phone);
      expect(createCall.data.fullName).toBe(validBody.fullName);
    });

    it('response includes expiresIn', async () => {
      const res  = await POST(makeRequest(validBody));
      const json = await res.json();
      expect(json.data.expiresIn).toBe(24 * 60 * 60);
    });
  });

  describe('validation errors', () => {
    it('returns 400 for missing fullName', async () => {
      const { fullName: _, ...body } = validBody;
      const res = await POST(makeRequest(body));
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.success).toBe(false);
      expect(json.error.code).toBe('VALIDATION_ERROR');
    });

    it('returns 400 for invalid email', async () => {
      const res = await POST(makeRequest({ ...validBody, email: 'not-an-email' }));
      expect(res.status).toBe(400);
    });

    it('returns 400 for invalid Indian phone number', async () => {
      const res = await POST(makeRequest({ ...validBody, phone: '1234567890' }));
      expect(res.status).toBe(400);
    });

    it('returns 400 for short password', async () => {
      const res = await POST(makeRequest({ ...validBody, password: 'short' }));
      expect(res.status).toBe(400);
    });
  });

  describe('duplicate user', () => {
    it('returns 409 when email already exists', async () => {
      (mockPrisma.user.findFirst as jest.Mock).mockResolvedValue({
        ...mockCreatedUser,
        email: validBody.email,
      });
      const res  = await POST(makeRequest(validBody));
      expect(res.status).toBe(409);
      const json = await res.json();
      expect(json.error.code).toBe('USER_EXISTS');
      expect(json.error.message).toContain('email');
    });

    it('returns 409 when phone already exists', async () => {
      (mockPrisma.user.findFirst as jest.Mock).mockResolvedValue({
        ...mockCreatedUser,
        email: 'other@email.com', // different email → phone conflict
      });
      const res  = await POST(makeRequest(validBody));
      expect(res.status).toBe(409);
      const json = await res.json();
      expect(json.error.code).toBe('USER_EXISTS');
      expect(json.error.message).toContain('phone');
    });
  });

  describe('server error', () => {
    it('returns 500 when prisma throws', async () => {
      (mockPrisma.user.findFirst as jest.Mock).mockRejectedValue(new Error('DB down'));
      const res  = await POST(makeRequest(validBody));
      expect(res.status).toBe(500);
      const json = await res.json();
      expect(json.error.code).toBe('SERVER_ERROR');
    });
  });
});
