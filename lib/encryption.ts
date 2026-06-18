/**
 * Encryption Utilities for E2E Message Encryption
 * Uses TweetNaCl.js for NaCl box encryption
 */

import * as nacl from 'tweetnacl';
import { secretbox } from 'tweetnacl';

// Use TextEncoder/TextDecoder instead of tweetnacl-util for compatibility
const encode = (str: string): Uint8Array => new TextEncoder().encode(str);
const decode = (arr: Uint8Array): string => new TextDecoder().decode(arr);
const toBase64 = (arr: Uint8Array): string => Buffer.from(arr).toString('base64');
const fromBase64 = (str: string): Uint8Array => new Uint8Array(Buffer.from(str, 'base64'));

export interface EncryptionKeypair {
  publicKey: string;
  secretKey: string;
}

export interface EncryptedMessage {
  nonce: string;
  ciphertext: string;
  publicKey: string;
}

export function generateKeypair(): EncryptionKeypair {
  const keypair = nacl.box.keyPair();
  return {
    publicKey: toBase64(keypair.publicKey),
    secretKey: toBase64(keypair.secretKey),
  };
}

export function encryptMessage(message: string, recipientPublicKey: string): EncryptedMessage {
  const nonce = nacl.randomBytes(nacl.box.nonceLength);
  const messageUint8 = encode(message);
  const publicKeyUint8 = fromBase64(recipientPublicKey);
  const senderKeypair = nacl.box.keyPair();
  const encrypted = nacl.box(messageUint8, nonce, publicKeyUint8, senderKeypair.secretKey);
  return {
    nonce: toBase64(nonce),
    ciphertext: toBase64(encrypted),
    publicKey: toBase64(senderKeypair.publicKey),
  };
}

export function decryptMessage(
  encryptedMessage: EncryptedMessage,
  userSecretKey: string,
  senderPublicKey: string
): string {
  try {
    const nonce = fromBase64(encryptedMessage.nonce);
    const ciphertext = fromBase64(encryptedMessage.ciphertext);
    const secretKeyUint8 = fromBase64(userSecretKey);
    const senderPublicKeyUint8 = fromBase64(senderPublicKey);
    const decrypted = nacl.box.open(ciphertext, nonce, senderPublicKeyUint8, secretKeyUint8);
    if (!decrypted) throw new Error('Decryption failed - invalid message or keys');
    return decode(decrypted);
  } catch (error) {
    console.error('Message decryption failed:', error);
    throw new Error('Failed to decrypt message');
  }
}

export function generateSymmetricKey(): string {
  return toBase64(nacl.randomBytes(secretbox.keyLength));
}

export function encryptData(data: string, key: string): EncryptedMessage {
  const nonce = nacl.randomBytes(secretbox.nonceLength);
  const keyUint8 = fromBase64(key);
  const dataUint8 = encode(data);
  const encrypted = secretbox(dataUint8, nonce, keyUint8);
  return {
    nonce: toBase64(nonce),
    ciphertext: toBase64(encrypted),
    publicKey: '',
  };
}

export function decryptData(encryptedMessage: EncryptedMessage, key: string): string {
  try {
    const nonce = fromBase64(encryptedMessage.nonce);
    const ciphertext = fromBase64(encryptedMessage.ciphertext);
    const keyUint8 = fromBase64(key);
    const decrypted = secretbox.open(ciphertext, nonce, keyUint8);
    if (!decrypted) throw new Error('Decryption failed');
    return decode(decrypted);
  } catch (error) {
    console.error('Data decryption failed:', error);
    throw new Error('Failed to decrypt data');
  }
}

export function hashString(input: string): string {
  const data = new TextEncoder().encode(input);
  return toBase64(nacl.hash(data));
}
