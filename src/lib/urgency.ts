const URGENCY_PATTERNS = [
  'hospital',
  'hospitalini',
  'emergency',
  'haraka',
  'saidia',
  'accident',
  'ajali',
  'urgent',
  'dying',
  'sick',
  'mgonjwa',
  'critical',
  'bleeding',
  'matibabu',
  'help now',
  'asap',
  'mara moja',
  'sasa hivi',
  'hazina chakula',
  'dawa',
  'operation',
  'icu',
];

export function detectUrgency(message: string) {
  const normalized = message.toLowerCase();
  const hits = URGENCY_PATTERNS.filter((pattern) => normalized.includes(pattern)).length;
  if (hits >= 2) return true;
  if (hits === 1 && /(hospital|emergency|urgent|critical|icu|operation|ajali)/.test(normalized)) {
    return true;
  }
  return /\b(sos|911|help)\b/.test(normalized);
}
