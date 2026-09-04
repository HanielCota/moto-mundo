"use client";

import { useSyncExternalStore } from "react";
import { useAuthStore } from "@/stores/auth-store";

const emptySubscribe = () => () => {};

export function useAuth() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const logout = useAuthStore((state) => state.logout);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const addAddress = useAuthStore((state) => state.addAddress);
  const removeAddress = useAuthStore((state) => state.removeAddress);
  const saveOrder = useAuthStore((state) => state.saveOrder);

  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  return {
    currentUser: isHydrated ? currentUser : null,
    isAuthenticated: isHydrated && Boolean(currentUser),
    isHydrated,
    login,
    register,
    logout,
    updateProfile,
    addAddress,
    removeAddress,
    saveOrder,
  };
}
