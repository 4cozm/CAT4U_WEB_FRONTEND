"use client";

import AuthProvider from "@/components/AuthProvider";
import { ToastProvider } from "@/components/ToastProvider";
import AuthSplashGate from "./AuthSplashGate.jsx";

export default function ClientProviders({ children }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <AuthSplashGate />
        {children}
      </AuthProvider>
    </ToastProvider>
  );
}
