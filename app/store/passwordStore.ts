import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Password } from "../types";

type PasswordStore = {
  passwords: Password[];
  addPassword: (data: Omit<Password, "id" | "createdAt">) => void;
  removePassword: (id: string) => void;
  updatePassword: (id: string, data: Partial<Password>) => void;
  deleteAllPassword: () => void;
  toggleFavorite: (id: string) => void;   // ⬅️ فقط id میگیره
};

export const usePasswordStore = create<PasswordStore>()(
  persist(
    (set) => ({
      passwords: [],

      addPassword: (data) =>
        set((state) => ({
          passwords: [
            ...state.passwords,
            {
              ...data,
              id: Date.now().toString(),
              createdAt: new Date().toISOString(),
              isFavorite: false,  
            },
          ],
        })),

      removePassword: (id) =>
        set((state) => ({
          passwords: state.passwords.filter((p) => p.id !== id),
        })),

      updatePassword: (id, data) =>
        set((state) => ({
          passwords: state.passwords.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        })),

      deleteAllPassword: () => set({ passwords: [] }),

      toggleFavorite: (id) =>
        set((state) => ({
          passwords: state.passwords.map((p) =>
            p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
          ),
        })),
    }),
    {
      name: "password-storage",
    }
  )
);