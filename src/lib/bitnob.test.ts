import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { verifyBitnobWebhook } from './bitnob.ts';

test('verifyBitnobWebhook validates signed payload', () => {
  const payload = JSON.stringify({ hello: 'world' });
  process.env.BITNOB_WEBHOOK_SECRET = 'test-secret';
  const signature = crypto.createHmac('sha256', 'test-secret').update(payload).digest('hex');
  assert.equal(verifyBitnobWebhook(payload, signature), true);
});

test('verifyBitnobWebhook rejects invalid signature', () => {
  const payload = JSON.stringify({ hello: 'world' });
  process.env.BITNOB_WEBHOOK_SECRET = 'test-secret';
  assert.equal(verifyBitnobWebhook(payload, 'bad-signature'), false);
});
