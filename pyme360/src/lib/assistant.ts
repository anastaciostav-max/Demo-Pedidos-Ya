import {
  lowStockProducts,
  monthSales,
  staleProducts,
  sumProfit,
  sumTotal,
  topClients,
  topProducts,
} from '@/lib/analytics';
import { formatCurrency } from '@/lib/format';
import type { Business, Client, Order, Product, Sale } from '@/types/models';

interface AssistantContext {
  sales: Sale[];
  products: Product[];
  clients: Client[];
  orders: Order[];
  business: Business | null;
}

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function matchesAny(text: string, keywords: string[]) {
  return keywords.some((k) => text.includes(k));
}

export const SUGGESTED_QUESTIONS = [
  '¿Cuál fue mi producto más vendido?',
  '¿Qué productos están por agotarse?',
  '¿Qué cliente compra más?',
  '¿Cuánto vendí este mes?',
  '¿Cuál fue mi utilidad?',
  '¿Qué productos llevan más tiempo sin venderse?',
];

export function answerQuestion(rawQuery: string, ctx: AssistantContext): string {
  const q = normalize(rawQuery);
  const currency = ctx.business?.currency ?? 'USD';

  if (matchesAny(q, ['producto mas vendido', 'que mas se vende', 'mas vendido', 'top producto'])) {
    const [top] = topProducts(ctx.sales, 1);
    if (!top) return 'Aún no tienes ventas registradas para calcular tu producto más vendido.';
    return `Tu producto más vendido es "${top.productName}", con ${top.quantity} unidades vendidas y ${formatCurrency(top.revenue, currency)} en ingresos.`;
  }

  if (matchesAny(q, ['por agotarse', 'poco stock', 'stock bajo', 'agotando', 'se estan acabando', 'falta poco'])) {
    const low = lowStockProducts(ctx.products);
    if (low.length === 0) return 'Ningún producto está por agotarse. Tu inventario está en buen nivel.';
    const list = low
      .slice(0, 5)
      .map((p) => `${p.name} (${p.stock} en stock, mínimo ${p.minStock})`)
      .join(', ');
    return `Tienes ${low.length} producto(s) por agotarse: ${list}${low.length > 5 ? '…' : ''}.`;
  }

  if (matchesAny(q, ['cliente que mas compra', 'mejor cliente', 'cliente mas frecuente', 'quien compra mas'])) {
    const [top] = topClients(ctx.sales, 1);
    if (!top) return 'Aún no tienes ventas asociadas a clientes.';
    return `Tu mejor cliente es "${top.clientName}", con ${formatCurrency(top.total, currency)} en compras acumuladas en ${top.orders} venta(s).`;
  }

  if (matchesAny(q, ['cuanto vendi', 'ventas del mes', 'ventas este mes', 'cuanto he vendido'])) {
    const month = monthSales(ctx.sales);
    const total = sumTotal(month);
    return `Este mes llevas ${formatCurrency(total, currency)} en ventas, con ${month.length} venta(s) registradas.`;
  }

  if (matchesAny(q, ['utilidad', 'ganancia', 'cuanto gane', 'margen de ganancia'])) {
    const month = monthSales(ctx.sales);
    const profit = sumProfit(month);
    return `Tu utilidad estimada de este mes es ${formatCurrency(profit, currency)}, después de restar el costo de los productos vendidos.`;
  }

  if (matchesAny(q, ['sin venderse', 'no se ha vendido', 'tiempo sin venderse', 'productos estancados', 'no se vende'])) {
    const stale = staleProducts(ctx.products, ctx.sales);
    const top = stale.slice(0, 5);
    if (top.length === 0) return 'No encontré productos activos para analizar.';
    const list = top
      .map((s) => (s.daysSince === null ? `${s.product.name} (nunca vendido)` : `${s.product.name} (${s.daysSince} días sin venderse)`))
      .join(', ');
    return `Los productos con más tiempo sin venderse son: ${list}.`;
  }

  if (matchesAny(q, ['pedidos pendientes', 'cuantos pedidos'])) {
    const pending = ctx.orders.filter((o) => o.status === 'pendiente' || o.status === 'preparando');
    return `Tienes ${pending.length} pedido(s) pendientes de preparar o enviar.`;
  }

  if (matchesAny(q, ['clientes nuevos', 'cuantos clientes'])) {
    return `Tienes ${ctx.clients.length} clientes registrados en total.`;
  }

  return 'No tengo una respuesta exacta para eso todavía. Puedo ayudarte con ventas, utilidad, inventario y clientes según la información registrada en tu negocio. Intenta con una de las preguntas sugeridas.';
}
