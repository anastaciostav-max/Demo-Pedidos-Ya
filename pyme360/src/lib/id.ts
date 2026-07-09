export function generateId(prefix = ''): string {
  const random = Math.random().toString(36).slice(2, 10);
  const time = Date.now().toString(36);
  return `${prefix}${time}${random}`;
}

export function generateFolio(prefix: string, seq: number): string {
  return `${prefix}-${String(seq).padStart(4, '0')}`;
}
