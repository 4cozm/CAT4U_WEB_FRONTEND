"use client";

import { ToastProvider } from "@/components/ToastProvider";
import AuthProvider from "@/components/AuthProvider";

export default function ClientProviders({ children }) {
  return (
    <ToastProvider>
      <AuthProvider>{children}</AuthProvider>
    </ToastProvider>
  );
}
