/**
 * @jest-environment node
 *
 * Unit tests for lib/encryption.ts — E2E message encryption utilities.
 * localStorage is mocked via jest.setup.js global for key storage tests.
 */

import * as nacl from 'tweetnacl';
import {
  encryptMsg,
  decryptMsg,
  isE2EEncrypted,
  generateAndStoreKeyPair,
  getStoredKeyPair,
  getOrCreateKeyPair,
  type E2EKeyPair,
} from '@/lib/encryption';

// ── Helpers ───────────────────────────────────────────────────────────────────

const toBase64 = (arr: Uint8Array) => Buffer.from(arr).toString('base64');

function freshKeyPair(): E2EKeyPair {
  const kp = nacl.box.keyPair();
  return { publicKey: toBase64(kp.publicKey), secretKey: toBase64(kp.secretKey) };
}

// ── encryptMsg / decryptMsg roundtrip ─────────────────────────────────────────

describe('E2E encrypt/decrypt roundtrip', () => {
  const alice = freshKeyPair();
  const bob   = freshKeyPair();

  it('recipient can decrypt message from sender', () => {
    const plaintext  = 'Hello Bob, nice to meet you!';
    const ciphertext = encryptMsg(plaintext, bob.publicKey, alice.secretKey);
    const decrypted  = decryptMsg(ciphertext, alice.publicKey, bob.secretKey);
    expect(decrypted).toBe(plaintext);
  });

  it('sender can re-read their own message (DH symmetry)', () => {
    const plaintext  = 'Can you see this?';
    const ciphertext = encryptMsg(plaintext, bob.publicKey, alice.secretKey);
    // Alice re-reads using Bob's public key + her own secret key
    const decrypted  = decryptMsg(ciphertext, bob.publicKey, alice.secretKey);
    expect(decrypted).toBe(plaintext);
  });

  it('handles empty string message', () => {
    const ciphertext = encryptMsg('', bob.publicKey, alice.secretKey);
    expect(decryptMsg(ciphertext, alice.publicKey, bob.secretKey)).toBe('');
  });

  it('handles long message (2000 chars)', () => {
    const plaintext  = 'A'.repeat(2000);
    const ciphertext = encryptMsg(plaintext, bob.publicKey, alice.secretKey);
    expect(decryptMsg(ciphertext, alice.publicKey, bob.secretKey)).toBe(plaintext);
  });

  it('handles unicode / Devanagari text', () => {
    const plaintext  = 'नमस्ते, आप कैसे हैं? 🙏';
    const ciphertext = encryptMsg(plaintext, bob.publicKey, alice.secretKey);
    expect(decryptMsg(ciphertext, alice.publicKey, bob.secretKey)).toBe(plaintext);
  });

  it('each encryption produces different ciphertext (nonce randomness)', () => {
    const ct1 = encryptMsg('same message', bob.publicKey, alice.secretKey);
    const ct2 = encryptMsg('same message', bob.publicKey, alice.secretKey);
    expect(ct1).not.toBe(ct2);
  });
});

// ── decryptMsg error cases ────────────────────────────────────────────────────

describe('decryptMsg error handling', () => {
  const alice = freshKeyPair();
  const bob   = freshKeyPair();
  const carol = freshKeyPair();

  it('returns null with wrong keys (different third party)', () => {
    const ciphertext = encryptMsg('secret', bob.publicKey, alice.secretKey);
    // Carol tries to decrypt — should fail
    const result = decryptMsg(ciphertext, alice.publicKey, carol.secretKey);
    expect(result).toBeNull();
  });

  it('returns null for tampered ciphertext', () => {
    const ciphertext = encryptMsg('tamper me', bob.publicKey, alice.secretKey);
    const parsed     = JSON.parse(ciphertext);
    // Corrupt the cipher bytes
    const cipherBytes = Buffer.from(parsed.cipher, 'base64');
    cipherBytes[5] ^= 0xff;
    parsed.cipher    = cipherBytes.toString('base64');
    const result = decryptMsg(JSON.stringify(parsed), alice.publicKey, bob.secretKey);
    expect(result).toBeNull();
  });

  it('returns null for non-JSON input', () => {
    expect(decryptMsg('plain text message', alice.publicKey, bob.secretKey)).toBeNull();
  });

  it('returns null for JSON missing nonce/cipher', () => {
    expect(decryptMsg('{"foo":"bar"}', alice.publicKey, bob.secretKey)).toBeNull();
  });
});

// ── isE2EEncrypted ────────────────────────────────────────────────────────────

describe('isE2EEncrypted', () => {
  const alice = freshKeyPair();
  const bob   = freshKeyPair();

  it('returns true for a real encrypted payload', () => {
    const ct = encryptMsg('hello', bob.publicKey, alice.secretKey);
    expect(isE2EEncrypted(ct)).toBe(true);
  });

  it('returns false for plaintext', () => {
    expect(isE2EEncrypted('Hey how are you?')).toBe(false);
  });

  it('returns false for unrelated JSON', () => {
    expect(isE2EEncrypted('{"message":"hello"}')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isE2EEncrypted('')).toBe(false);
  });

  it('returns false for partial payload (missing cipher)', () => {
    expect(isE2EEncrypted('{"nonce":"abc123"}')).toBe(false);
  });
});

// ── localStorage key management ───────────────────────────────────────────────

describe('key pair storage', () => {
  const userId = 'test-user-storage';

  beforeEach(() => {
    // Reset localStorage between tests
    localStorage.clear();
  });

  it('generateAndStoreKeyPair stores and returns a valid keypair', () => {
    const kp = generateAndStoreKeyPair(userId);
    expect(kp.publicKey).toBeTruthy();
    expect(kp.secretKey).toBeTruthy();
    expect(kp.publicKey.length).toBeGreaterThan(20);
  });

  it('getStoredKeyPair returns null when nothing stored', () => {
    expect(getStoredKeyPair(userId)).toBeNull();
  });

  it('getStoredKeyPair returns stored keypair', () => {
    generateAndStoreKeyPair(userId);
    const stored = getStoredKeyPair(userId);
    expect(stored).not.toBeNull();
    expect(stored!.publicKey).toBeTruthy();
  });

  it('getOrCreateKeyPair generates on first call, reuses on second', () => {
    const kp1 = getOrCreateKeyPair(userId);
    const kp2 = getOrCreateKeyPair(userId);
    expect(kp1.publicKey).toBe(kp2.publicKey);
    expect(kp1.secretKey).toBe(kp2.secretKey);
  });

  it('stored keypair can actually encrypt/decrypt', () => {
    const kp       = generateAndStoreKeyPair(userId);
    const other    = freshKeyPair();
    const ct       = encryptMsg('test message', other.publicKey, kp.secretKey);
    const result   = decryptMsg(ct, kp.publicKey, other.secretKey);
    expect(result).toBe('test message');
  });
});
