"use client";
import { useToastContext } from "../components/ToastProvider.jsx";

export function useToast() {
  const { pushToast, removeToast } = useToastContext();
  return { pushToast, removeToast };
}
