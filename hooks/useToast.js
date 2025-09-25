"use client";
import { useToastContext } from "@/components/ToastProvider";

export function useToast() {
  const { pushToast, removeToast } = useToastContext();
  return { pushToast, removeToast };
}
