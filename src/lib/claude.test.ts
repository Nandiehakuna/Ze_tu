import test from 'node:test';
import assert from 'node:assert/strict';
import { detectUrgency } from './urgency.ts';

test('detectUrgency catches emergency multilingual keywords', () => {
  assert.equal(detectUrgency('baba yuko hospitalini, natuma haraka sana'), true);
});

test('detectUrgency ignores normal transfer request', () => {
  assert.equal(detectUrgency('send 100 to mum on friday'), false);
});
