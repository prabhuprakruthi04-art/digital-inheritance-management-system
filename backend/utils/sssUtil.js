import secrets from 'secrets.js-grempe';

/**
 * Splits an AES Key into SSS shares.
 * @param {string} secretHex 
 * @param {number} shares 
 * @param {number} threshold 
 * @returns {Array<string>}
 */
export function splitSecret(secretHex, shares = 3, threshold = 2) {
  const hexSecret = secrets.str2hex(secretHex);
  return secrets.share(hexSecret, shares, threshold);
}

/**
 * Reconstructs the original secret from key shares.
 * @param {Array<string>} sharesArray 
 * @returns {string}
 */
export function combineShares(sharesArray) {
  const combinedHex = secrets.combine(sharesArray);
  return secrets.hex2str(combinedHex);
}