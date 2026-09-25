const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { processPaystackReference } = require('../services/paymentProcessingService');

router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['x-paystack-signature'];
  const secret = process.env.PAYSTACK_SECRET_KEY;

  if (!signature || !secret) {
    return res.status(401).send('Missing signature');
  }

  const expectedHash = crypto.createHmac('sha512', secret).update(req.body).digest('hex');

  let isValid = false;
  try {
    isValid = crypto.timingSafeEqual(Buffer.from(expectedHash, 'utf8'), Buffer.from(signature, 'utf8'));
  } catch (err) {
    isValid = false;
  }

  if (!isValid) {
    return res.status(401).send('Invalid signature');
  }

  let event;
  try {
    event = JSON.parse(req.body.toString('utf8'));
  } catch (err) {
    return res.status(400).send('Invalid payload');
  }

  res.sendStatus(200); // ack quickly, per Paystack's guidance

  if (event.event === 'charge.success' && event.data && event.data.reference) {
    try {
      await processPaystackReference(event.data.reference);
    } catch (err) {
      console.error('Paystack webhook processing error:', err.message);
    }
  }
});

module.exports = router;