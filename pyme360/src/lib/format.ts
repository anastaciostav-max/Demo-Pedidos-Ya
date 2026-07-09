export function formatCurrency(value: number, currency = 'USD'): string {
  const symbol = currency === 'USD' ? '$' : currency;
  const rounded = Math.round((value + Number.EPSILON) * 100) / 100;
  return `${symbol}${rounded.toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Rounded, no-decimals currency for tight spaces like dashboard stat tiles. */
export function formatCurrencyCompact(value: number, currency = 'USD'): string {
  const symbol = currency === 'USD' ? '$' : currency;
  return `${symbol}${Math.round(value).toLocaleString('es-MX')}`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString('es-MX');
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return `${formatDate(iso)} · ${d.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
}

export function formatRelative(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = Math.max(0, now - then);
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diffMs < minute) return 'ahora mismo';
  if (diffMs < hour) return `hace ${Math.floor(diffMs / minute)} min`;
  if (diffMs < day) return `hace ${Math.floor(diffMs / hour)} h`;
  if (diffMs < 7 * day) return `hace ${Math.floor(diffMs / day)} d`;
  return formatDate(iso);
}
