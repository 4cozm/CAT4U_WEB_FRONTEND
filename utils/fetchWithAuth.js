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

  return res.json();
}
