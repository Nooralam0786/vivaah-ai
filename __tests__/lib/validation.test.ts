/**
 * @jest-environment node
 *
 * Unit tests for lib/validation.ts — Zod schemas.
 */

import {
  phoneSchema,
  emailSchema,
  otpSchema,
  signupSchema,
  messageSchema,
  passwordSchema,
} from '@/lib/validation';

// ── phoneSchema ───────────────────────────────────────────────────────────────

describe('phoneSchema', () => {
  it.each([
    '9876543210',
    '8123456789',
    '7000000001',
    '6999999999',
  ])('accepts valid Indian phone: %s', (phone) => {
    expect(phoneSchema.safeParse(phone).success).toBe(true);
  });

  it.each([
    ['1234567890', 'starts with 1'],
    ['5000000000', 'starts with 5'],
    ['98765432',   'too short'],
    ['98765432101','too long'],
    ['9876abc210', 'contains letters'],
    ['',           'empty'],
  ])('rejects invalid phone (%s — %s)', (phone) => {
    expect(phoneSchema.safeParse(phone).success).toBe(false);
  });
});

// ── emailSchema ───────────────────────────────────────────────────────────────

describe('emailSchema', () => {
  it.each([
    'user@example.com',
    'priya.sharma@gmail.com',
    'rahul+test@vivaah.ai',
  ])('accepts valid email: %s', (email) => {
    expect(emailSchema.safeParse(email).success).toBe(true);
  });

  it.each([
    'not-an-email',
    '@nodomain.com',
    'missing@',
    '',
  ])('rejects invalid email: %s', (email) => {
    expect(emailSchema.safeParse(email).success).toBe(false);
  });
});

// ── otpSchema ─────────────────────────────────────────────────────────────────

describe('otpSchema', () => {
  it('accepts a valid 6-digit OTP', () => {
    expect(otpSchema.safeParse('123456').success).toBe(true);
    expect(otpSchema.safeParse('000000').success).toBe(true);
  });

  it.each([
    ['12345',  'too short'],
    ['1234567','too long'],
    ['12345a', 'contains letter'],
    ['',       'empty'],
  ])('rejects invalid OTP (%s — %s)', (otp) => {
    expect(otpSchema.safeParse(otp).success).toBe(false);
  });
});

// ── passwordSchema ────────────────────────────────────────────────────────────

describe('passwordSchema', () => {
  it('accepts password with 8+ characters', () => {
    expect(passwordSchema.safeParse('password').success).toBe(true);
    expect(passwordSchema.safeParse('SecureP@ss123').success).toBe(true);
  });

  it('rejects password shorter than 8 characters', () => {
    expect(passwordSchema.safeParse('short').success).toBe(false);
    expect(passwordSchema.safeParse('1234567').success).toBe(false);
  });
});

// ── signupSchema ──────────────────────────────────────────────────────────────

describe('signupSchema', () => {
  const valid = {
    fullName: 'Priya Sharma',
    email:    'priya@example.com',
    phone:    '9876543210',
    password: 'SecurePass1',
  };

  it('accepts valid signup data', () => {
    expect(signupSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects short fullName', () => {
    expect(signupSchema.safeParse({ ...valid, fullName: 'P' }).success).toBe(false);
  });

  it('rejects invalid email', () => {
    expect(signupSchema.safeParse({ ...valid, email: 'notanemail' }).success).toBe(false);
  });

  it('rejects invalid phone', () => {
    expect(signupSchema.safeParse({ ...valid, phone: '1234567890' }).success).toBe(false);
  });

  it('rejects missing required fields', () => {
    const { fullName: _fn, ...noName } = valid;
    expect(signupSchema.safeParse(noName).success).toBe(false);

    const { email: _em, ...noEmail } = valid;
    expect(signupSchema.safeParse(noEmail).success).toBe(false);
  });

  it('extracts correct data types', () => {
    const result = signupSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(typeof result.data.fullName).toBe('string');
      expect(typeof result.data.email).toBe('string');
      expect(typeof result.data.phone).toBe('string');
    }
  });
});

// ── messageSchema ─────────────────────────────────────────────────────────────

describe('messageSchema', () => {
  it('accepts a normal message', () => {
    const result = messageSchema.safeParse({ content: 'Hello!', toUserId: 'user-abc' });
    expect(result.success).toBe(true);
  });

  it('accepts a large encrypted payload (up to 50000 chars)', () => {
    const big = 'A'.repeat(50000);
    expect(messageSchema.safeParse({ content: big, toUserId: 'user-abc' }).success).toBe(true);
  });

  it('rejects empty content', () => {
    expect(messageSchema.safeParse({ content: '', toUserId: 'user-abc' }).success).toBe(false);
  });

  it('rejects content over 50000 chars', () => {
    const tooBig = 'A'.repeat(50001);
    expect(messageSchema.safeParse({ content: tooBig, toUserId: 'user-abc' }).success).toBe(false);
  });

  it('rejects missing toUserId', () => {
    expect(messageSchema.safeParse({ content: 'hi' }).success).toBe(false);
  });
});
