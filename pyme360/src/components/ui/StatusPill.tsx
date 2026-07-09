import React from 'react';
import { statusColors } from '@/theme';
import { ORDER_STATUS_LABELS } from '@/stores/useOrderStore';
import type { OrderStatus } from '@/types/models';
import { Badge } from './Badge';

export function StatusPill({ status }: { status: OrderStatus }) {
  const c = statusColors[status];
  return <Badge label={ORDER_STATUS_LABELS[status]} fg={c.fg} bg={c.bg} dot />;
}
