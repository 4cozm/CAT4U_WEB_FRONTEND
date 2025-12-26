"use client";

import { useToast } from "@/hooks/useToast";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

export default function AuthProvider({ children }) {
  const { pushToast } = useToast();

  const [me, setMe] = useState(null);
  const [loadingMe, setLoadingMe] = useState(true);
  const [meError, setMeError] = useState(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoadingMe(true);
      setMeError(null);

      try {
        const data = await fetchWithAuth("/api/esi/me");
        if (!alive) return;

        // ok:false가 200으로 내려오는 케이스 방어
        if (!data?.ok) {
          setMe(null);
          setMeError(data);
          pushToast({ type: "error", message: data?.error || "프로필 조회 실패" });
          return;
        }

        setMe(data);
      } catch (err) {
        if (!alive) return;

        setMe(null);
        setMeError(err);

        if (err?.status === 401) {
          pushToast({ type: "error", message: "인증 만료! 로그인 하러가라냥" });
        } else if (err?.status && [502, 503, 504].includes(err.status)) {
          pushToast({ type: "error", message: "EVE서버가 대답하지 않는다냥." });
        } else {
          pushToast({ type: "error", message: "백엔드 서버와 통신 할 수 없습니다." });
        }
      } finally {
        if (alive) setLoadingMe(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [pushToast]);

  const value = useMemo(() => {
    return {
      me,
      loadingMe,
      meError,
      isAdmin: !!me?.admin, // 편의 필드
    };
  }, [me, loadingMe, meError]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
