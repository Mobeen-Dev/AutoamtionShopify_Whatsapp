// deterministicMapping.js
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

// Use a 32-byte key (256-bit). Replace with your secure key or load from env.
const SECRET_KEY = process.env.ENCRYPTION_KEY;



/* ===================================================================
   2. Using AES-256-ECB for a Deterministic and Reversible Mapping

   Note: ECB mode is deterministic (it always encrypts identical plaintext
   to the same ciphertext when using the same key) but is not semantically secure.
=================================================================== */

/**
 * Deterministically encrypts a phone number using AES-256-ECB.
 * @param {string} plaintext - The phone number to encrypt.
 * @returns {string} The encrypted text encoded in base64.
 */
function deterministicEncrypt(plaintext) {
  // For ECB mode, IV is not used; pass null.
  const cipher = crypto.createCipheriv('aes-256-ecb', Buffer.from(SECRET_KEY, 'utf8'), null);
  // Enable automatic padding (PKCS#7 by default)
  cipher.setAutoPadding(true);
  const encryptedBuffer = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final()
  ]);
  // Return as a base64 string
  return encryptedBuffer.toString('base64');
}

/**
 * Decrypts the text encrypted by deterministicEncrypt (AES-256-ECB).
 * @param {string} ciphertextBase64 - The base64 encoded ciphertext.
 * @returns {string} The decrypted phone number.
 */
function deterministicDecrypt(ciphertextBase64) {
  // Convert base64 string back to buffer.
  const ciphertextBuffer = Buffer.from(ciphertextBase64, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-ecb', Buffer.from(SECRET_KEY, 'utf8'), null);
  decipher.setAutoPadding(true);
  const decryptedBuffer = Buffer.concat([
    decipher.update(ciphertextBuffer),
    decipher.final()
  ]);
  return decryptedBuffer.toString('utf8');
}

/* =======================
   Example Usage
========================= */
const phoneNumber = "923414075054";


// 2. AES-256-ECB (reversible deterministic encryption)
const encryptedDeterministic = deterministicEncrypt(phoneNumber);
console.log("Deterministically Encrypted (AES-ECB):", encryptedDeterministic);

const decryptedDeterministic = deterministicDecrypt(encryptedDeterministic);
console.log("Deterministically Decrypted:", decryptedDeterministic);

/* =======================
   URL Generation Example
========================= */
// If you want to embed the encrypted token in a URL, you might do:
const urlDeterministic = `https://yourdomain.com/${encryptedDeterministic}`;

console.log("URL using deterministic encryption:", urlDeterministic);
