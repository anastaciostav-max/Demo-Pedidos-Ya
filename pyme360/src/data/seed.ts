import { generateId, generateFolio } from '@/lib/id';
import type {
  Business,
  Category,
  Client,
  InventoryMovement,
  Order,
  OrderStatus,
  Product,
  Purchase,
  Sale,
  Supplier,
  User,
} from '@/types/models';

// Simple deterministic PRNG so the demo dataset is stable across reinstalls.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(20260709);
const pick = <T,>(arr: T[]) => arr[Math.floor(rnd() * arr.length)];
const int = (min: number, max: number) => Math.floor(rnd() * (max - min + 1)) + min;
const daysAgo = (n: number, hour = 9) => {
  const d = new Date();
  d.setHours(hour, int(0, 59), 0, 0);
  d.setDate(d.getDate() - n);
  // Never generate a timestamp in the future (e.g. n=0 with an hour later
  // than the current one) — clamp it to a few minutes before "now" instead,
  // otherwise relative-time labels like "ahora mismo" apply to every
  // future-dated row.
  const now = Date.now();
  if (d.getTime() > now) {
    d.setTime(now - int(1, 45) * 60 * 1000);
  }
  return d.toISOString();
};

export const CATEGORY_DEFS = [
  'Bebidas',
  'Abarrotes',
  'Limpieza',
  'Lácteos',
  'Snacks',
  'Electrónica',
  'Cuidado Personal',
];

export const categories: Category[] = CATEGORY_DEFS.map((name) => ({
  id: generateId('cat_'),
  name,
}));

const catId = (name: string) => categories.find((c) => c.name === name)!.id;

interface ProductDef {
  name: string;
  category: string;
  brand: string;
  purchasePrice: number;
  salePrice: number;
  initialStock: number;
  minStock: number;
  unit: string;
}

const productDefs: ProductDef[] = [
  { name: 'Agua Mineral 600ml', category: 'Bebidas', brand: 'AquaPura', purchasePrice: 5.5, salePrice: 9.0, initialStock: 220, minStock: 40, unit: 'pza' },
  { name: 'Refresco Cola 2L', category: 'Bebidas', brand: 'ColaMax', purchasePrice: 14, salePrice: 22, initialStock: 150, minStock: 30, unit: 'pza' },
  { name: 'Jugo de Naranja 1L', category: 'Bebidas', brand: 'FrutalNat', purchasePrice: 12, salePrice: 19, initialStock: 90, minStock: 25, unit: 'pza' },
  { name: 'Café Molido 500g', category: 'Abarrotes', brand: 'Montaña Alta', purchasePrice: 48, salePrice: 79, initialStock: 60, minStock: 15, unit: 'pza' },
  { name: 'Arroz Premium 1kg', category: 'Abarrotes', brand: 'Grano de Oro', purchasePrice: 18, salePrice: 27, initialStock: 130, minStock: 30, unit: 'pza' },
  { name: 'Aceite Vegetal 1L', category: 'Abarrotes', brand: 'Girasol Puro', purchasePrice: 22, salePrice: 34, initialStock: 70, minStock: 20, unit: 'pza' },
  { name: 'Frijol Negro 900g', category: 'Abarrotes', brand: 'Grano de Oro', purchasePrice: 16, salePrice: 25, initialStock: 85, minStock: 20, unit: 'pza' },
  { name: 'Detergente Líquido 3L', category: 'Limpieza', brand: 'CleanMax', purchasePrice: 45, salePrice: 68, initialStock: 40, minStock: 12, unit: 'pza' },
  { name: 'Cloro 1L', category: 'Limpieza', brand: 'BlancoTotal', purchasePrice: 9, salePrice: 15, initialStock: 100, minStock: 25, unit: 'pza' },
  { name: 'Jabón para Trastes 750ml', category: 'Limpieza', brand: 'CleanMax', purchasePrice: 13, salePrice: 21, initialStock: 75, minStock: 20, unit: 'pza' },
  { name: 'Leche Entera 1L', category: 'Lácteos', brand: 'Granja Feliz', purchasePrice: 15, salePrice: 23, initialStock: 110, minStock: 30, unit: 'pza' },
  { name: 'Yogurt Natural 1kg', category: 'Lácteos', brand: 'Granja Feliz', purchasePrice: 24, salePrice: 36, initialStock: 55, minStock: 15, unit: 'pza' },
  { name: 'Queso Panela 400g', category: 'Lácteos', brand: 'Quesos del Valle', purchasePrice: 32, salePrice: 48, initialStock: 45, minStock: 15, unit: 'pza' },
  { name: 'Papas Fritas 150g', category: 'Snacks', brand: 'CrunchTime', purchasePrice: 11, salePrice: 18, initialStock: 140, minStock: 30, unit: 'pza' },
  { name: 'Galletas Chocolate 200g', category: 'Snacks', brand: 'Dulce Hogar', purchasePrice: 14, salePrice: 22, initialStock: 95, minStock: 25, unit: 'pza' },
  { name: 'Cacahuates Salados 250g', category: 'Snacks', brand: 'CrunchTime', purchasePrice: 10, salePrice: 16, initialStock: 80, minStock: 20, unit: 'pza' },
  { name: 'Cable USB-C 1m', category: 'Electrónica', brand: 'ConectaTech', purchasePrice: 28, salePrice: 55, initialStock: 50, minStock: 15, unit: 'pza' },
  { name: 'Audífonos Bluetooth', category: 'Electrónica', brand: 'SoundGo', purchasePrice: 120, salePrice: 219, initialStock: 24, minStock: 8, unit: 'pza' },
  { name: 'Power Bank 10000mAh', category: 'Electrónica', brand: 'ChargeUp', purchasePrice: 145, salePrice: 259, initialStock: 18, minStock: 8, unit: 'pza' },
  { name: 'Shampoo Anticaspa 400ml', category: 'Cuidado Personal', brand: 'PureCare', purchasePrice: 26, salePrice: 42, initialStock: 65, minStock: 18, unit: 'pza' },
  { name: 'Pasta Dental 100ml', category: 'Cuidado Personal', brand: 'SmileFresh', purchasePrice: 9, salePrice: 16, initialStock: 120, minStock: 30, unit: 'pza' },
  { name: 'Jabón de Baño 3pz', category: 'Cuidado Personal', brand: 'PureCare', purchasePrice: 12, salePrice: 19, initialStock: 70, minStock: 20, unit: 'pza' },
];

export const products: Product[] = productDefs.map((p) => {
  const now = daysAgo(0);
  return {
    id: generateId('prod_'),
    name: p.name,
    photoUri: undefined,
    barcode: `750${int(1000000, 9999999)}`,
    sku: `SKU-${p.category.slice(0, 3).toUpperCase()}-${int(100, 999)}`,
    categoryId: catId(p.category),
    brand: p.brand,
    purchasePrice: p.purchasePrice,
    salePrice: p.salePrice,
    stock: p.initialStock,
    minStock: p.minStock,
    unit: p.unit,
    active: true,
    createdAt: daysAgo(60),
    updatedAt: now,
  };
});

const clientDefs = [
  { name: 'Mariana López', phone: '55 1234 5678', email: 'mariana.lopez@mail.com' },
  { name: 'Carlos Hernández', phone: '55 2345 6789', email: 'carlos.hdz@mail.com' },
  { name: 'Abarrotes El Sol', phone: '55 3456 7890', email: 'contacto@elsol.com' },
  { name: 'Fernanda Ruiz', phone: '55 4567 8901', email: 'fer.ruiz@mail.com' },
  { name: 'Minimarket La Esquina', phone: '55 5678 9012', email: 'compras@laesquina.com' },
  { name: 'Jorge Martínez', phone: '55 6789 0123', email: 'jorge.mtz@mail.com' },
  { name: 'Restaurante Buen Sabor', phone: '55 7890 1234', email: 'gerencia@buensabor.com' },
  { name: 'Paola Sánchez', phone: '55 8901 2345', email: 'paola.sanchez@mail.com' },
  { name: 'Daniel Torres', phone: '55 9012 3456', email: 'daniel.torres@mail.com' },
];

export const clients: Client[] = clientDefs.map((c, i) => ({
  id: generateId('cli_'),
  name: c.name,
  email: c.email,
  phone: c.phone,
  address: 'Av. Reforma 123, CDMX',
  taxId: i % 3 === 0 ? `TAX${int(100000, 999999)}` : undefined,
  notes: i === 2 ? 'Cliente frecuente, pide entrega los martes.' : undefined,
  creditLimit: i % 4 === 0 ? 5000 : 0,
  createdAt: daysAgo(int(5, 200)),
}));

const supplierDefs = [
  { name: 'Distribuidora Central', contact: 'Luis Vega' },
  { name: 'Grupo Comercial del Norte', contact: 'Ana Ibarra' },
  { name: 'Importadora Pacífico', contact: 'Ricardo Solís' },
  { name: 'Alimentos y Más', contact: 'Sandra Flores' },
  { name: 'TecnoSupply', contact: 'Miguel Ángel Cruz' },
];

export const suppliers: Supplier[] = supplierDefs.map((s) => ({
  id: generateId('sup_'),
  name: s.name,
  contactName: s.contact,
  email: `${s.contact.split(' ')[0].toLowerCase()}@${s.name.split(' ')[0].toLowerCase()}.com`,
  phone: `55 ${int(1000, 9999)} ${int(1000, 9999)}`,
  address: 'Zona Industrial, CDMX',
  createdAt: daysAgo(int(30, 300)),
}));

// ---- Movements, sales & purchases simulation ----
const movements: InventoryMovement[] = [];
const stockTracker = new Map<string, number>();
products.forEach((p) => {
  const base = Math.round(p.stock * 1.6);
  stockTracker.set(p.id, base);
  movements.push({
    id: generateId('mov_'),
    productId: p.id,
    type: 'entrada',
    reason: 'inicial',
    quantity: base,
    stockAfter: base,
    note: 'Inventario inicial',
    createdAt: daysAgo(60, 8),
  });
});

function registerMovement(
  productId: string,
  type: InventoryMovement['type'],
  reason: InventoryMovement['reason'],
  qty: number,
  createdAt: string,
  refId?: string,
) {
  const current = stockTracker.get(productId) ?? 0;
  const delta = type === 'salida' ? -qty : qty;
  const after = Math.max(0, current + delta);
  stockTracker.set(productId, after);
  movements.push({
    id: generateId('mov_'),
    productId,
    type,
    reason,
    quantity: qty,
    stockAfter: after,
    refId,
    createdAt,
  });
  return after;
}

export const purchases: Purchase[] = [];
for (let i = 0; i < 7; i++) {
  const day = int(2, 55);
  const supplier = pick(suppliers);
  const items = Array.from({ length: int(2, 4) }).map(() => {
    const product = pick(products);
    const quantity = int(20, 60);
    return {
      productId: product.id,
      productName: product.name,
      quantity,
      unitCost: product.purchasePrice,
    };
  });
  const purchaseId = generateId('pur_');
  const createdAt = daysAgo(day, 10);
  items.forEach((it) => registerMovement(it.productId, 'entrada', 'compra', it.quantity, createdAt, purchaseId));
  purchases.push({
    id: purchaseId,
    folio: generateFolio('COM', i + 1),
    supplierId: supplier.id,
    supplierName: supplier.name,
    items,
    total: items.reduce((s, it) => s + it.quantity * it.unitCost, 0),
    createdAt,
  });
}
purchases.sort((a, b) => a.createdAt.localeCompare(b.createdAt));

const paymentMethods: Sale['paymentMethod'][] = ['efectivo', 'tarjeta', 'transferencia', 'credito'];
export const sales: Sale[] = [];
const SALE_COUNT = 130;
for (let i = 0; i < SALE_COUNT; i++) {
  // weight recent days more heavily for a nicer trend curve
  const day = Math.floor(Math.pow(rnd(), 1.6) * 45);
  const hour = int(9, 20);
  const withClient = rnd() > 0.35;
  const client = withClient ? pick(clients) : undefined;
  const itemCount = int(1, 4);
  const chosen = new Set<string>();
  const items = Array.from({ length: itemCount })
    .map(() => pick(products))
    .filter((p) => {
      if (chosen.has(p.id)) return false;
      chosen.add(p.id);
      return true;
    })
    .map((product) => {
      const quantity = int(1, 6);
      const discount = rnd() > 0.85 ? Math.round(product.salePrice * quantity * 0.1 * 100) / 100 : 0;
      return {
        productId: product.id,
        productName: product.name,
        quantity,
        unitPrice: product.salePrice,
        unitCost: product.purchasePrice,
        discount,
      };
    });
  if (items.length === 0) continue;
  const subtotal = items.reduce((s, it) => s + it.unitPrice * it.quantity, 0);
  const discount = items.reduce((s, it) => s + it.discount, 0);
  const iva = Math.round((subtotal - discount) * 0.16 * 100) / 100;
  const total = Math.round((subtotal - discount + iva) * 100) / 100;
  const saleId = generateId('sale_');
  const createdAt = daysAgo(day, hour);
  items.forEach((it) => registerMovement(it.productId, 'salida', 'venta', it.quantity, createdAt, saleId));
  sales.push({
    id: saleId,
    folio: generateFolio('V', i + 1),
    clientId: client?.id,
    clientName: client?.name ?? 'Público General',
    items,
    subtotal: Math.round(subtotal * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    iva,
    total,
    paymentMethod: pick(paymentMethods),
    createdAt,
  });
}
sales.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
movements.sort((a, b) => a.createdAt.localeCompare(b.createdAt));

// finalize stock levels on the product objects after simulation
products.forEach((p) => {
  p.stock = stockTracker.get(p.id) ?? p.stock;
});

export const inventoryMovements = movements;

// ---- Orders ----
const statusFlow: OrderStatus[] = ['pendiente', 'preparando', 'enviado', 'entregado'];
export const orders: Order[] = Array.from({ length: 16 }).map((_, i) => {
  const day = int(0, 20);
  const createdAt = daysAgo(day, int(9, 18));
  const client = pick(clients);
  const items = Array.from({ length: int(1, 3) }).map(() => {
    const product = pick(products);
    const quantity = int(1, 5);
    return {
      productId: product.id,
      productName: product.name,
      quantity,
      unitPrice: product.salePrice,
    };
  });
  const total = items.reduce((s, it) => s + it.unitPrice * it.quantity, 0);
  const roll = rnd();
  const finalStatus: OrderStatus = roll < 0.12 ? 'cancelado' : pick(statusFlow.slice(0, day < 2 ? 2 : 4));
  const history: Order['history'] = [{ status: 'pendiente', at: createdAt }];
  if (finalStatus !== 'pendiente') {
    const steps: OrderStatus[] = finalStatus === 'cancelado' ? ['cancelado'] : statusFlow.slice(1, statusFlow.indexOf(finalStatus) + 1);
    steps.forEach((s, idx) => {
      history.push({ status: s, at: daysAgo(Math.max(0, day - idx - 1), int(9, 18)) });
    });
  }
  return {
    id: generateId('ord_'),
    folio: generateFolio('PED', i + 1),
    clientId: client.id,
    clientName: client.name,
    items,
    total: Math.round(total * 100) / 100,
    status: finalStatus,
    history,
    deliveryAddress: client.address,
    createdAt,
  };
});
orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

export const business: Business = {
  id: generateId('biz_'),
  name: 'Comercializadora Nova',
  ownerName: 'Anastacio Stav',
  email: 'anastacio.stav@gmail.com',
  phone: '55 1122 3344',
  address: 'Calle Comercio 45, Ciudad de México',
  taxId: 'NOV850101AB1',
  currency: 'USD',
  ivaRate: 0.16,
};

export const demoUser: User = {
  id: generateId('user_'),
  name: 'Anastacio Stav',
  email: 'demo@pyme360.com',
  passwordHash: 'demo1234',
  role: 'admin',
  createdAt: daysAgo(90),
};
