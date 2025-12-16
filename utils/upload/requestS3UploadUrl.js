//백엔드에 URL 요청만 보내는 역할

import { fetchWithTimeout } from "./fetchWithTimeout.js";

export async function requestS3UploadUrl(meta) {
  try {
    const res = await fetchWithTimeout(
      "/api/blockNote/getS3UploadUrl",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(meta),
      },
      8000
    );

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(json?.error || `presign 실패: ${res.status}`);
    }

    return json;
  } catch (e) {
    if (e?.name === "AbortError") {
      throw new Error("요청 시간이 초과되었습니다.");
    }
    throw e;
  }
}
