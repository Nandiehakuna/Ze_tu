import test from 'node:test';
import assert from 'node:assert/strict';
import { validateTransferRequest } from './transfer.ts';

test('validateTransferRequest rejects missing fields', () => {
  const result = validateTransferRequest({ amountGBP: 10 });
  assert.equal(result.ok, false);
});

test('validateTransferRequest rejects out-of-range amount', () => {
  const result = validateTransferRequest({ senderId: 's', recipientId: 'r', amountGBP: 0.5 });
  assert.equal(result.ok, false);
});

test('validateTransferRequest accepts valid payload', () => {
  const result = validateTransferRequest({ senderId: 's', recipientId: 'r', amountGBP: 50 });
  assert.equal(result.ok, true);
});
