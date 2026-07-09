import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { generateId } from '@/lib/id';
import { hashPassword, verifyPassword } from '@/lib/auth';
import { asyncJSONStorage, STORAGE_KEYS } from '@/lib/persist';
import type { User } from '@/types/models';

interface AuthState {
  users: User[];
  currentUserId: string | null;
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  seedUsers: (users: User[]) => void;
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  currentUser: () => User | null;
  updateCurrentUser: (patch: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      users: [],
      currentUserId: null,
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),
      seedUsers: (users) => set({ users }),
      register: async (name, email, password) => {
        const normalized = email.trim().toLowerCase();
        if (get().users.some((u) => u.email.toLowerCase() === normalized)) {
          return { ok: false, error: 'Ya existe una cuenta con este correo.' };
        }
        const passwordHash = await hashPassword(password);
        const user: User = {
          id: generateId('user_'),
          name,
          email: normalized,
          passwordHash,
          role: get().users.length === 0 ? 'admin' : 'vendedor',
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ users: [...s.users, user], currentUserId: user.id }));
        return { ok: true };
      },
      login: async (email, password) => {
        const normalized = email.trim().toLowerCase();
        const user = get().users.find((u) => u.email.toLowerCase() === normalized);
        if (!user) return { ok: false, error: 'No encontramos una cuenta con ese correo.' };
        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) return { ok: false, error: 'Contraseña incorrecta.' };
        set({ currentUserId: user.id });
        return { ok: true };
      },
      logout: () => set({ currentUserId: null }),
      currentUser: () => get().users.find((u) => u.id === get().currentUserId) ?? null,
      updateCurrentUser: (patch) => {
        const id = get().currentUserId;
        if (!id) return;
        set((s) => ({ users: s.users.map((u) => (u.id === id ? { ...u, ...patch } : u)) }));
      },
    }),
    {
      name: STORAGE_KEYS.auth,
      storage: asyncJSONStorage,
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    },
  ),
);
