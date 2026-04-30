export const MIN_TRANSFER_GBP = 1;
export const MAX_TRANSFER_GBP = 5000;

export type TransferRequestPayload = {
  recipientId?: string;
  amountGBP?: number;
  senderId?: string;
};

export function validateTransferRequest(body: TransferRequestPayload) {
  if (!body.recipientId || !body.senderId || typeof body.amountGBP !== 'number') {
    return { ok: false, error: 'recipientId, senderId and amountGBP are required', status: 400 };
  }
  if (
    !Number.isFinite(body.amountGBP) ||
    body.amountGBP < MIN_TRANSFER_GBP ||
    body.amountGBP > MAX_TRANSFER_GBP
  ) {
    return {
      ok: false,
      error: `amountGBP must be between ${MIN_TRANSFER_GBP} and ${MAX_TRANSFER_GBP}`,
      status: 400,
    };
  }
  return { ok: true as const };
}
