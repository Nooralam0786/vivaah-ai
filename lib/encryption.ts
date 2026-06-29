/**
 * Encryption utilities — two layers:
 *
 *  1. E2E message encryption (nacl.box / X25519 + XSalsa20-Poly1305)
 *     - Client-side only; private keys never leave the browser
 *     - Server stores only encrypted ciphertext
 *
 *  2. Legacy symmetric helpers (secretbox) kept for any non-chat uses
 */

import * as nacl from 'tweetnacl';
import { secretbox } from 'tweetnacl';

// ── Encoding helpers ──────────────────────────────────────────────────────────

const toBase64  = (arr: Uint8Array): string => Buffer.from(arr).toString('base64');
const fromBase64 = (str: string): Uint8Array => new Uint8Array(Buffer.from(str, 'base64'));
const toBytes    = (str: string): Uint8Array => new Uint8Array(Buffer.from(str, 'utf8'));
const fromBytes  = (arr: Uint8Array): string => Buffer.from(arr).toString('utf8');

// ── E2E: localStorage key names ───────────────────────────────────────────────

const E2E_PUB = (uid: string) => `vivaah_e2e_pub_${uid}`;
const E2E_SEC = (uid: string) => `vivaah_e2e_sec_${uid}`;

// ── E2E: key management (browser-only) ───────────────────────────────────────

export interface E2EKeyPair {
  publicKey: string;  // base64
  secretKey: string;  // base64 — never sent to server
}

/** Load persisted keypair from localStorage, or null if not set. */
export function getStoredKeyPair(userId: string): E2EKeyPair | null {
  if (typeof localStorage === 'undefined') return null;
  const pub = localStorage.getItem(E2E_PUB(userId));
  const sec = localStorage.getItem(E2E_SEC(userId));
  if (!pub || !sec) return null;
  return { publicKey: pub, secretKey: sec };
}

/** Generate a new X25519 keypair, persist in localStorage, return it. */
export function generateAndStoreKeyPair(userId: string): E2EKeyPair {
  const kp  = nacl.box.keyPair();
  const pub = toBase64(kp.publicKey);
  const sec = toBase64(kp.secretKey);
  localStorage.setItem(E2E_PUB(userId), pub);
  localStorage.setItem(E2E_SEC(userId), sec);
  return { publicKey: pub, secretKey: sec };
}

/** Load existing keypair or generate one if this is the first time. */
export function getOrCreateKeyPair(userId: string): E2EKeyPair {
  return getStoredKeyPair(userId) ?? generateAndStoreKeyPair(userId);
}

// ── E2E: encrypt / decrypt ────────────────────────────────────────────────────

/** Wire format stored in Message.text for encrypted messages. */
export interface E2EPayload {
  nonce:  string;  // base64, 24 bytes
  cipher: string;  // base64
}

/**
 * Encrypt plaintext for a specific partner.
 * Uses nacl.box (DH shared secret), so BOTH parties can decrypt later
 * using `nacl.box.open(cipher, nonce, otherPartyPubKey, mySecretKey)`.
 *
 * Returns a JSON string stored verbatim in Message.text.
 */
export function encryptMsg(
  plaintext: string,
  partnerPublicKeyB64: string,
  mySecretKeyB64: string,
): string {
  const nonce    = nacl.randomBytes(nacl.box.nonceLength);
  const cipher   = nacl.box(
    toBytes(plaintext),
    nonce,
    fromBase64(partnerPublicKeyB64),
    fromBase64(mySecretKeyB64),
  );
  const payload: E2EPayload = { nonce: toBase64(nonce), cipher: toBase64(cipher) };
  return JSON.stringify(payload);
}

/**
 * Decrypt a message encrypted with encryptMsg.
 * Works for BOTH the sender and the recipient because nacl.box uses DH:
 *   shared_secret = DH(mySecretKey, partnerPublicKey)  [same for both sides]
 *
 * Returns null if decryption fails (wrong keys, tampered data, or plaintext msg).
 */
export function decryptMsg(
  encrypted: string,
  partnerPublicKeyB64: string,
  mySecretKeyB64: string,
): string | null {
  try {
    const { nonce, cipher }: E2EPayload = JSON.parse(encrypted);
    const result = nacl.box.open(
      fromBase64(cipher),
      fromBase64(nonce),
      fromBase64(partnerPublicKeyB64),
      fromBase64(mySecretKeyB64),
    );
    return result ? fromBytes(result) : null;
  } catch {
    return null;
  }
}

/**
 * Returns true if the string is an E2E-encrypted payload.
 * Plaintext messages (legacy or from users without keys) return false.
 */
export function isE2EEncrypted(text: string): boolean {
  try {
    const p = JSON.parse(text);
    return typeof p.nonce === 'string' && typeof p.cipher === 'string';
  } catch {
    return false;
  }
}

// ── Legacy symmetric helpers (kept for non-chat uses) ────────────────────────

export interface EncryptionKeypair {
  publicKey: string;
  secretKey: string;
}

export interface EncryptedMessage {
  nonce:      string;
  ciphertext: string;
  publicKey:  string;
}

export function generateKeypair(): EncryptionKeypair {
  const kp = nacl.box.keyPair();
  return { publicKey: toBase64(kp.publicKey), secretKey: toBase64(kp.secretKey) };
}

export function generateSymmetricKey(): string {
  return toBase64(nacl.randomBytes(secretbox.keyLength));
}

export function encryptData(data: string, key: string): EncryptedMessage {
  const nonce   = nacl.randomBytes(secretbox.nonceLength);
  const keyU8   = fromBase64(key);
  const dataU8  = toBytes(data);
  const cipher  = secretbox(dataU8, nonce, keyU8);
  return { nonce: toBase64(nonce), ciphertext: toBase64(cipher), publicKey: '' };
}

export function decryptData(msg: EncryptedMessage, key: string): string {
  const nonce   = fromBase64(msg.nonce);
  const cipher  = fromBase64(msg.ciphertext);
  const keyU8   = fromBase64(key);
  const result  = secretbox.open(cipher, nonce, keyU8);
  if (!result) throw new Error('Decryption failed');
  return fromBytes(result);
}

export function hashString(input: string): string {
  return toBase64(nacl.hash(toBytes(input)));
}
