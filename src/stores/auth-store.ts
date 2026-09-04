import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  PublicUser,
  UserAccount,
  UserAddress,
  RegisterPayload,
  ProfileUpdatePayload,
  Order,
} from "@/types";
import { hashPassword, verifyPassword } from "@/lib/password";

const DEMO_PASSWORD_HASH =
  "fe768f289fd1a4f8465dec6fd7aa7800de49b49412e733572ed9f71827adad5d";

const DEMO_USER: UserAccount = {
  id: "user-demo",
  fullName: "Ana Piloto",
  email: "piloto@motomundo.com.br",
  phone: "(31) 99876-5432",
  cpf: "",
  passwordHash: DEMO_PASSWORD_HASH,
  createdAt: "2025-03-12T12:00:00.000Z",
  addresses: [
    {
      id: "addr-demo-1",
      label: "Casa",
      cep: "30130-010",
      street: "Avenida Afonso Pena",
      number: "1500",
      complement: "Apto 302",
      neighborhood: "Centro",
      city: "Belo Horizonte",
      state: "MG",
      isDefault: true,
    },
  ],
  orders: [],
};

export const DEMO_CREDENTIALS = {
  email: DEMO_USER.email,
  password: "piloto123",
};

function toPublicUser(user: UserAccount): PublicUser {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    cpf: user.cpf,
    createdAt: user.createdAt,
    addresses: user.addresses,
    orders: user.orders,
  };
}

function ensureDemoUser(users: UserAccount[]): UserAccount[] {
  if (users.some((user) => user.email === DEMO_USER.email)) {
    return users;
  }
  return [DEMO_USER, ...users];
}

interface AuthState {
  currentUser: PublicUser | null;
  users: UserAccount[];
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  register: (
    payload: RegisterPayload
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (
    payload: ProfileUpdatePayload
  ) => { success: boolean; message: string };
  addAddress: (
    address: Omit<UserAddress, "id">
  ) => { success: boolean; message: string };
  removeAddress: (addressId: string) => void;
  saveOrder: (order: Order) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [DEMO_USER],

      login: async (email, password) => {
        const normalizedEmail = email.trim().toLowerCase();
        const user = ensureDemoUser(get().users).find(
          (item) => item.email === normalizedEmail
        );

        if (!user) {
          return {
            success: false,
            message: "E-mail ou senha incorretos.",
          };
        }

        const matches = await verifyPassword(password, user.passwordHash);
        if (!matches) {
          return {
            success: false,
            message: "E-mail ou senha incorretos.",
          };
        }

        set({
          users: ensureDemoUser(get().users),
          currentUser: toPublicUser(user),
        });

        return { success: true, message: `Olá, ${user.fullName.split(" ")[0]}!` };
      },

      register: async (payload) => {
        const normalizedEmail = payload.email.trim().toLowerCase();
        const users = ensureDemoUser(get().users);

        if (users.some((user) => user.email === normalizedEmail)) {
          return {
            success: false,
            message: "Este e-mail já está cadastrado. Faça login.",
          };
        }

        const passwordHash = await hashPassword(payload.password);
        const newUser: UserAccount = {
          id: `user-${Date.now()}`,
          fullName: payload.fullName.trim(),
          email: normalizedEmail,
          phone: payload.phone.trim(),
          cpf: "",
          passwordHash,
          createdAt: new Date().toISOString(),
          addresses: [],
          orders: [],
        };

        set({
          users: [...users, newUser],
          currentUser: toPublicUser(newUser),
        });

        return { success: true, message: "Conta criada com sucesso." };
      },

      logout: () => {
        set({ currentUser: null });
      },

      updateProfile: (payload) => {
        const { currentUser, users } = get();
        if (!currentUser) {
          return { success: false, message: "Faça login para editar o perfil." };
        }

        const nextUsers = users.map((user) =>
          user.id === currentUser.id
            ? {
                ...user,
                fullName: payload.fullName.trim(),
                phone: payload.phone.trim(),
                cpf: payload.cpf.trim(),
              }
            : user
        );
        const updated = nextUsers.find((user) => user.id === currentUser.id);

        if (!updated) {
          return { success: false, message: "Não foi possível atualizar o perfil." };
        }

        set({
          users: nextUsers,
          currentUser: toPublicUser(updated),
        });

        return { success: true, message: "Dados atualizados." };
      },

      addAddress: (address) => {
        const { currentUser, users } = get();
        if (!currentUser) {
          return { success: false, message: "Faça login para salvar um endereço." };
        }

        const nextUsers = users.map((user) => {
          if (user.id !== currentUser.id) return user;
          const nextAddress: UserAddress = {
            ...address,
            id: `addr-${Date.now()}`,
          };
          const addresses = address.isDefault
            ? [
                ...user.addresses.map((item) => ({ ...item, isDefault: false })),
                nextAddress,
              ]
            : [...user.addresses, nextAddress];
          return { ...user, addresses };
        });

        const updated = nextUsers.find((user) => user.id === currentUser.id);
        if (!updated) {
          return { success: false, message: "Não foi possível salvar o endereço." };
        }

        set({
          users: nextUsers,
          currentUser: toPublicUser(updated),
        });

        return { success: true, message: "Endereço salvo." };
      },

      removeAddress: (addressId) => {
        const { currentUser, users } = get();
        if (!currentUser) return;

        const nextUsers = users.map((user) =>
          user.id === currentUser.id
            ? {
                ...user,
                addresses: user.addresses.filter((item) => item.id !== addressId),
              }
            : user
        );
        const updated = nextUsers.find((user) => user.id === currentUser.id);
        if (!updated) return;

        set({
          users: nextUsers,
          currentUser: toPublicUser(updated),
        });
      },

      saveOrder: (order) => {
        const { currentUser, users } = get();
        if (!currentUser) return;

        const nextUsers = users.map((user) =>
          user.id === currentUser.id
            ? { ...user, orders: [order, ...user.orders] }
            : user
        );
        const updated = nextUsers.find((user) => user.id === currentUser.id);
        if (!updated) return;

        set({
          users: nextUsers,
          currentUser: toPublicUser(updated),
        });
      },
    }),
    {
      name: "moto-mundo-auth-storage",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? window.localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
      partialize: (state) => ({
        currentUser: state.currentUser,
        users: state.users,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.users = ensureDemoUser(state.users);
      },
    }
  )
);
