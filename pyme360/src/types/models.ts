export type ID = string;

export interface Business {
  id: ID;
  name: string;
  ownerName: string;
  email: string;
  phone?: string;
  address?: string;
  taxId?: string;
  currency: string;
  ivaRate: number;
  logoUri?: string;
}

export interface User {
  id: ID;
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'vendedor';
  avatarUri?: string;
  createdAt: string;
}

export interface Category {
  id: ID;
  name: string;
}

export interface Product {
  id: ID;
  name: string;
  photoUri?: string;
  barcode: string;
  sku: string;
  categoryId: string;
  brand: string;
  purchasePrice: number;
  salePrice: number;
  stock: number;
  minStock: number;
  unit: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type MovementType = 'entrada' | 'salida' | 'ajuste';
export type MovementReason =
  | 'compra'
  | 'venta'
  | 'ajuste_manual'
  | 'devolucion'
  | 'merma'
  | 'inicial';

export interface InventoryMovement {
  id: ID;
  productId: string;
  type: MovementType;
  reason: MovementReason;
  quantity: number;
  stockAfter: number;
  note?: string;
  refId?: string;
  createdAt: string;
}

export interface Client {
  id: ID;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  taxId?: string;
  notes?: string;
  creditLimit: number;
  createdAt: string;
}

export interface Supplier {
  id: ID;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  createdAt: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  unitCost: number;
  discount: number;
}

export type PaymentMethod = 'efectivo' | 'tarjeta' | 'transferencia' | 'credito';

export interface Sale {
  id: ID;
  folio: string;
  clientId?: string;
  clientName: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  iva: number;
  total: number;
  paymentMethod: PaymentMethod;
  createdAt: string;
}

export interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  unitCost: number;
}

export interface Purchase {
  id: ID;
  folio: string;
  supplierId: string;
  supplierName: string;
  items: PurchaseItem[];
  total: number;
  createdAt: string;
}

export type OrderStatus =
  | 'pendiente'
  | 'preparando'
  | 'enviado'
  | 'entregado'
  | 'cancelado';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderStatusEvent {
  status: OrderStatus;
  at: string;
}

export interface Order {
  id: ID;
  folio: string;
  clientId?: string;
  clientName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  history: OrderStatusEvent[];
  deliveryAddress?: string;
  notes?: string;
  createdAt: string;
}
