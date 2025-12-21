/**
 * 모든 API 요청은 해당 함수로 해야 로그인 페이지로 리디렉션이 가능함
 * @param {*} url
 * @param {*} options
 * @returns
 */
export async function fetchWithAuth(url, options = {}) {
  const res = await fetch(url, { credentials: "include", ...options });

  if (res.status === 401) {
    const loginRes = await fetch("/api/esi/login", { credentials: "include" });
    const { url: loginUrl } = await loginRes.json();

    // 최종 OAuth2 URL로 이동
    window.location.href = loginUrl;
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    // 서버에서 보내준 에러 메시지를 읽으려고 시도합니다.
    const errorData = await res.json().catch(() => ({}));
    const error = new Error(errorData.message || "서버 통신 중 오류가 발생했습니다.");
    throw error;
  }

  return res.json();
}
