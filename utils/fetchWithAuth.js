/**
 * 모든 API 요청은 이 함수로.
 * 401이면 여기서 로그인 시작하지 말고, 이벤트만 emit.
 */
import { authEvents } from "./authEvent.js";

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchWithAuth(url, options = {}) {
  const { emit401 = true, ...fetchOptions } = options;

  const res = await fetch(url, {
    credentials: "include",
    cache: "no-store",
    ...fetchOptions,
  });

  if (res.status === 401) {
    if (emit401) authEvents.emitUnauthorized({ url });

    const e = new Error("Unauthorized");
    e.status = 401; // AuthProvider가 err.status를 보고 있으니 status로 맞춤
    throw e;
  }

  if (!res.ok) {
    const data = await safeJson(res);
    const e = new Error(data?.message || data?.error || "서버 통신 중 오류가 발생했습니다.");
    e.status = res.status;
    e.data = data;
    throw e;
  }

  return (await safeJson(res)) ?? {};
}
