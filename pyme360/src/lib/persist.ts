import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

export const asyncJSONStorage = createJSONStorage(() => AsyncStorage);

export const STORAGE_KEYS = {
  auth: 'pyme360:auth',
  business: 'pyme360:business',
  products: 'pyme360:products',
  categories: 'pyme360:categories',
  inventory: 'pyme360:inventory',
  clients: 'pyme360:clients',
  suppliers: 'pyme360:suppliers',
  sales: 'pyme360:sales',
  purchases: 'pyme360:purchases',
  orders: 'pyme360:orders',
  meta: 'pyme360:meta',
} as const;
