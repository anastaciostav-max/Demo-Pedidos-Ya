import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '@/lib/id';
import { asyncJSONStorage, STORAGE_KEYS } from '@/lib/persist';
import type { Category, Product } from '@/types/models';

interface ProductState {
  products: Product[];
  categories: Category[];
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  seed: (products: Product[], categories: Category[]) => void;
  addProduct: (input: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Product;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  addCategory: (name: string) => Category;
  adjustStock: (productId: string, delta: number) => number;
  setStock: (productId: string, newStock: number) => number;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: [],
      categories: [],
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),
      seed: (products, categories) => set({ products, categories }),
      addProduct: (input) => {
        const now = new Date().toISOString();
        const product: Product = { ...input, id: generateId('prod_'), createdAt: now, updatedAt: now };
        set((s) => ({ products: [product, ...s.products] }));
        return product;
      },
      updateProduct: (id, patch) => {
        set((s) => ({
          products: s.products.map((p) =>
            p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p,
          ),
        }));
      },
      removeProduct: (id) => {
        set((s) => ({ products: s.products.filter((p) => p.id !== id) }));
      },
      addCategory: (name) => {
        const category: Category = { id: generateId('cat_'), name };
        set((s) => ({ categories: [...s.categories, category] }));
        return category;
      },
      adjustStock: (productId, delta) => {
        let result = 0;
        set((s) => ({
          products: s.products.map((p) => {
            if (p.id !== productId) return p;
            result = Math.max(0, p.stock + delta);
            return { ...p, stock: result, updatedAt: new Date().toISOString() };
          }),
        }));
        return result;
      },
      setStock: (productId, newStock) => {
        const value = Math.max(0, newStock);
        set((s) => ({
          products: s.products.map((p) =>
            p.id === productId ? { ...p, stock: value, updatedAt: new Date().toISOString() } : p,
          ),
        }));
        return value;
      },
    }),
    {
      name: STORAGE_KEYS.products,
      storage: asyncJSONStorage,
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    },
  ),
);

export const selectProductById = (id: string) => (s: ProductState) =>
  s.products.find((p) => p.id === id);
