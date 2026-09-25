const PAYSTACK_BASE_URL = 'https://api.paystack.co';

async function initializeTransaction({ email, amountSubunit, reference, callbackUrl, metadata }) {
  const res = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      amount: amountSubunit,
      reference,
      callback_url: callbackUrl,
      metadata
    })
  });

  const data = await res.json();
  if (!data.status) {
    throw new Error(data.message || 'Paystack initialization failed');
  }
  return data.data; // { authorization_url, access_code, reference }
}

async function verifyTransaction(reference) {
  const res = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
  });

  const data = await res.json();
  if (!data.status) {
    throw new Error(data.message || 'Paystack verification failed');
  }
  return data.data; // { status, amount, currency, reference, ... }
}

module.exports = { initializeTransaction, verifyTransaction };