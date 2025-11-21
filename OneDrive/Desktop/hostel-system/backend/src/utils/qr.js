const crypto = require('crypto');

exports.signQR = (passId, expiryTs) => {
  const payload = JSON.stringify({ passId, expiryTs });
  const hmac = crypto.createHmac('sha256', process.env.QR_SECRET).update(payload).digest('hex');
  const combined = `${Buffer.from(payload).toString('base64')}.${hmac}`;
  return Buffer.from(combined).toString('base64');
};

exports.verifyQR = (token) => {
  const decoded = Buffer.from(token, 'base64').toString('utf8');
  const [payloadB64, hmac] = decoded.split('.');
  const payload = Buffer.from(payloadB64, 'base64').toString('utf8');

  const expected = crypto.createHmac('sha256', process.env.QR_SECRET).update(payload).digest('hex');

  if (expected !== hmac) throw new Error('Invalid QR');

  return JSON.parse(payload);
};
