/**
 * Jest Setup File
 */

import '@testing-library/jest-dom';

// ── Environment variables ─────────────────────────────────────────────────────
process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:3000';
process.env.NEXTAUTH_URL             = 'http://localhost:3000';
process.env.JWT_SECRET               = 'test-jwt-secret-min-32-chars-xxxxxx';
process.env.JWT_REFRESH_SECRET       = 'test-refresh-secret-min-32-chars-xx';
process.env.RAZORPAY_KEY_SECRET      = 'test-razorpay-secret';
process.env.DATABASE_URL             = 'file:./test.db';
process.env.DATABASE_PROVIDER        = 'sqlite';

// ── localStorage mock (node env tests need this for encryption key storage) ───
const _lsStore = {};
if (typeof localStorage === 'undefined') {
  global.localStorage = {
    getItem:    (key)        => _lsStore[key] ?? null,
    setItem:    (key, value) => { _lsStore[key] = String(value); },
    removeItem: (key)        => { delete _lsStore[key]; },
    clear:      ()           => { Object.keys(_lsStore).forEach(k => delete _lsStore[k]); },
    length: 0,
    key: (i) => Object.keys(_lsStore)[i] ?? null,
  };
}

// ── Global fetch mock (Next.js App Router uses native fetch) ──────────────────
global.fetch = jest.fn().mockResolvedValue({
  ok:   true,
  json: async () => ({ success: true }),
});
