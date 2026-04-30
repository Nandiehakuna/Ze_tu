export function normalizePhone(raw: string) {
  const trimmed = raw.trim();
  const digits = trimmed.replace(/[^\d+]/g, '');
  if (!digits) return '';
  if (digits.startsWith('+')) return digits;
  if (digits.startsWith('00')) return `+${digits.slice(2)}`;
  return `+${digits}`;
}

export function phoneVariants(raw: string) {
  const normalized = normalizePhone(raw);
  const set = new Set<string>();
  if (!normalized) return [];
  set.add(normalized);
  set.add(normalized.replace(/^\+/, ''));
  if (normalized.startsWith('+254')) {
    set.add(normalized.replace(/^\+254/, '0'));
  }
  return [...set];
}
