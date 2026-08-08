import crypto from 'crypto';

/**
 * Calculates the SHA-256 hash of a file buffer or string.
 * @param {Buffer|string} data 
 * @returns {string} Hex-encoded SHA-256 hash
 */
export function generateSHA256(data) {
  const hash = crypto.createHash('sha256').update(data).digest('hex');
  return `0x${hash}`;
}