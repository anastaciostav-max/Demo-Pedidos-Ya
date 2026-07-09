import type { Client, Order, Product, Sale } from '@/types/models';

export function isSameDay(iso: string, ref: Date) {
  const d = new Date(iso);
  return (
    d.getFullYear() === ref.getFullYear() &&
    d.getMonth() === ref.getMonth() &&
    d.getDate() === ref.getDate()
  );
}

export function isSameMonth(iso: string, ref: Date) {
  const d = new Date(iso);
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
}

export function daysBetween(a: Date, b: Date) {
  return Math.floor(Math.abs(a.getTime() - b.getTime()) / (24 * 60 * 60 * 1000));
}

export function saleCost(sale: Sale) {
  return sale.items.reduce((s, it) => s + it.unitCost * it.quantity, 0);
}

export function saleProfit(sale: Sale) {
  return sale.total - sale.iva - saleCost(sale);
}

export function salesInRange(sales: Sale[], from: Date, to: Date) {
  const fromT = from.getTime();
  const toT = to.getTime();
  return sales.filter((s) => {
    const t = new Date(s.createdAt).getTime();
    return t >= fromT && t <= toT;
  });
}

export function todaySales(sales: Sale[], now = new Date()) {
  return sales.filter((s) => isSameDay(s.createdAt, now));
}

export function monthSales(sales: Sale[], now = new Date()) {
  return sales.filter((s) => isSameMonth(s.createdAt, now));
}

export function sumTotal(sales: Sale[]) {
  return sales.reduce((s, sale) => s + sale.total, 0);
}

export function sumProfit(sales: Sale[]) {
  return sales.reduce((s, sale) => s + saleProfit(sale), 0);
}

export function unitsSold(sales: Sale[]) {
  return sales.reduce((s, sale) => s + sale.items.reduce((a, it) => a + it.quantity, 0), 0);
}

export interface ProductRanking {
  productId: string;
  productName: string;
  quantity: number;
  revenue: number;
}

export function topProducts(sales: Sale[], limit = 5): ProductRanking[] {
  const map = new Map<string, ProductRanking>();
  sales.forEach((sale) => {
    sale.items.forEach((it) => {
      const existing = map.get(it.productId) ?? {
        productId: it.productId,
        productName: it.productName,
        quantity: 0,
        revenue: 0,
      };
      existing.quantity += it.quantity;
      existing.revenue += it.unitPrice * it.quantity - it.discount;
      map.set(it.productId, existing);
    });
  });
  return Array.from(map.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit);
}

export interface ClientRanking {
  clientId?: string;
  clientName: string;
  total: number;
  orders: number;
}

export function topClients(sales: Sale[], limit = 5): ClientRanking[] {
  const map = new Map<string, ClientRanking>();
  sales.forEach((sale) => {
    const key = sale.clientId ?? sale.clientName;
    const existing = map.get(key) ?? { clientId: sale.clientId, clientName: sale.clientName, total: 0, orders: 0 };
    existing.total += sale.total;
    existing.orders += 1;
    map.set(key, existing);
  });
  return Array.from(map.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
}

export function lowStockProducts(products: Product[]) {
  return products.filter((p) => p.active && p.stock <= p.minStock).sort((a, b) => a.stock - b.stock);
}

export function pendingOrders(orders: Order[]) {
  return orders.filter((o) => o.status === 'pendiente' || o.status === 'preparando');
}

export function newClientsInRange(clients: Client[], from: Date, to: Date) {
  const fromT = from.getTime();
  const toT = to.getTime();
  return clients.filter((c) => {
    const t = new Date(c.createdAt).getTime();
    return t >= fromT && t <= toT;
  });
}

export function salesByDay(sales: Sale[], numDays: number, now = new Date()) {
  const days: { label: string; value: number; date: Date }[] = [];
  for (let i = numDays - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const total = sales
      .filter((s) => isSameDay(s.createdAt, d))
      .reduce((sum, s) => sum + s.total, 0);
    days.push({
      label: d.toLocaleDateString('es-MX', { weekday: 'short' }).replace('.', ''),
      value: Math.round(total * 100) / 100,
      date: d,
    });
  }
  return days;
}

export function staleProducts(products: Product[], sales: Sale[], now = new Date()) {
  const lastSoldAt = new Map<string, number>();
  sales.forEach((sale) => {
    const t = new Date(sale.createdAt).getTime();
    sale.items.forEach((it) => {
      const prev = lastSoldAt.get(it.productId) ?? 0;
      if (t > prev) lastSoldAt.set(it.productId, t);
    });
  });
  return products
    .filter((p) => p.active)
    .map((p) => {
      const last = lastSoldAt.get(p.id);
      const daysSince = last ? daysBetween(now, new Date(last)) : null;
      return { product: p, daysSince };
    })
    .sort((a, b) => {
      if (a.daysSince === null) return -1;
      if (b.daysSince === null) return 1;
      return b.daysSince - a.daysSince;
    });
}
