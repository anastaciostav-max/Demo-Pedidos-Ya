import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '@/lib/id';
import { asyncJSONStorage, STORAGE_KEYS } from '@/lib/persist';
import type { Client } from '@/types/models';

interface ClientState {
  clients: Client[];
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  seed: (clients: Client[]) => void;
  addClient: (input: Omit<Client, 'id' | 'createdAt'>) => Client;
  updateClient: (id: string, patch: Partial<Client>) => void;
  removeClient: (id: string) => void;
}

export const useClientStore = create<ClientState>()(
  persist(
    (set) => ({
      clients: [],
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),
      seed: (clients) => set({ clients }),
      addClient: (input) => {
        const client: Client = { ...input, id: generateId('cli_'), createdAt: new Date().toISOString() };
        set((s) => ({ clients: [client, ...s.clients] }));
        return client;
      },
      updateClient: (id, patch) => {
        set((s) => ({ clients: s.clients.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));
      },
      removeClient: (id) => {
        set((s) => ({ clients: s.clients.filter((c) => c.id !== id) }));
      },
    }),
    { name: STORAGE_KEYS.clients, storage: asyncJSONStorage, onRehydrateStorage: () => (state) => state?.setHasHydrated(true) },
  ),
);
