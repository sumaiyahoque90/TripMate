// TripMate Utility Helper Functions

/**
 * Format currency in Bangladeshi Taka (BDT)
 * @param {number} amount
 * @returns {string} e.g. "৳85,000"
 */
function formatBDT(amount) {
  if (typeof amount !== 'number') return '৳0';
  return `৳${amount.toLocaleString('en-US')}`;
}

/**
 * Format currency in UAE Dirham (AED)
 * @param {number} amount
 * @returns {string} e.g. "AED 250"
 */
function formatAED(amount) {
  if (typeof amount !== 'number') return 'AED 0';
  return `AED ${amount.toLocaleString('en-US')}`;
}

/**
 * Generate a unique booking reference number
 * @param {string} prefix default "TM-DXB"
 * @returns {string} e.g. "TM-DXB-582914"
 */
function generateReferenceNumber(prefix = 'TM-DXB') {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${randomNum}`;
}

/**
 * Generate unique 20% discount voucher code
 * @param {string} prefix default "TRIPMATE20"
 * @returns {string} e.g. "TRIPMATE20-A89E2F"
 */
function generateVoucherCode(prefix = 'TRIPMATE20') {
  const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${randomHex}`;
}

module.exports = {
  formatBDT,
  formatAED,
  generateReferenceNumber,
  generateVoucherCode,
};
