"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        classNames: {
          toast: "bg-white text-zinc-900 border-zinc-200 shadow-lg font-sans",
          description: "text-zinc-500",
          actionButton: "bg-orange-600 text-white hover:bg-orange-700",
          cancelButton: "bg-zinc-100 text-zinc-600",
        },
      }}
      richColors
    />
  );
}
