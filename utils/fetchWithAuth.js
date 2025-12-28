/**
 * 모든 API 요청은 해당 함수로 해야 로그인 페이지로 리디렉션이 가능함
 * @param {*} url
 * @param {*} options
 * @returns
 */
export async function fetchWithAuth(url, options = {}) {
  const { redirectOn401 = true, on401 } = options;

  const res = await fetch(url, { credentials: "include", ...options });

  if (res.status === 401) {
    if (on401) await on401(); // UI 메시지, 스플래시 상태 변경 등

    if (redirectOn401) {
      const loginRes = await fetch("/api/esi/login", { credentials: "include" });
      const { url: loginUrl } = await loginRes.json();
      window.location.replace(loginUrl); // replace 권장
    }

    const e = new Error("Unauthorized");
    e.code = 401;
    throw e;
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "서버 통신 중 오류가 발생했습니다.");
  }

  return res.json();
}
