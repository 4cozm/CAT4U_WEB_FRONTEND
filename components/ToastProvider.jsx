"use client";
//토스트 에러를 클라이언트 사이드에서 랜더링해주는 코드
import AlertModal from "@/components/AlertModal.jsx";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback((input) => {
    // input: string | { message, type?, duration? }
    const obj = typeof input === "string" ? { message: input } : input ?? {};
    const toast = {
      id: Date.now() + Math.random(),
      type: obj.type ?? "error",
      message: obj.message ?? "",
      duration: obj.duration ?? 5000, // 항상 5초
    };
    setToasts((prev) => [...prev, toast]);
    return toast.id;
  }, []);

  const api = useMemo(() => ({ pushToast, removeToast }), [pushToast, removeToast]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      {mounted &&
        createPortal(
          toasts.length > 0 && (
            <div className="fixed top-4 right-4 z-[60] flex flex-col gap-2 w-[min(92vw,300px)]">
              {toasts.map((t) => (
                <AlertModal
                  key={t.id}
                  type={t.type}
                  message={t.message}
                  autoHide
                  duration={t.duration}
                  pauseOnHover={false} // 항상 끄기
                  dismissible // 항상 예
                  onClose={() => removeToast(t.id)}
                />
              ))}
            </div>
          ),
          document.body
        )}
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToastContext must be used within <ToastProvider>");
  return ctx;
}
