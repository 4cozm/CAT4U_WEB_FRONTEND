// utils/eveFit/eftToFitUrl.js
// 브라우저: CompressionStream(gzip) 사용 (Chrome/Edge 최신 OK)
// 서버/노드(테스트용): node:zlib gzipSync fallback
export async function eftToFitUrl(eftText, viewerBase = "https://eveship.fit/") {
  const text = normalizeEft(eftText);

  // eveship.fit은 멀티라인 EFT가 안정적
  if (!looksLikeEftMultiline(text)) {
    throw new Error("EFT 멀티라인 텍스트가 아니야 (줄바꿈 포함된 EFT를 붙여넣어야 함)");
  }

  const gzBytes = await gzipUtf8(text);
  const b64 = bytesToBase64(gzBytes);

  const base = String(viewerBase || "https://eveship.fit/").replace(/\/+$/, "");
  // node 스크립트와 동일: ?fit=eft:${encodeURIComponent(base64(gzip(EFT)))}
  return `${base}/?fit=eft:${encodeURIComponent(b64)}`;
}

function normalizeEft(input) {
  // ✅ 줄바꿈을 "통일"만 하고 제거하지 않는다
  // trim()은 앞 공백까지 날릴 수 있어서, 여기선 trimEnd만 권장
  return String(input ?? "")
    .replace(/\r\n?/g, "\n")
    .replace(/\0/g, "")
    .trimEnd();
}

function looksLikeEftMultiline(text) {
  if (!text) return false;
  if (!text.includes("\n")) return false; // 멀티라인 체크
  // 헤더 라인: [Ship, FitName]
  if (!/^\s*\[[^\],]+,\s*[^\]]+\]\s*$/m.test(text)) return false;

  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  return lines.length >= 4;
}

async function gzipUtf8(text) {
  // 브라우저
  if (typeof window !== "undefined" && typeof CompressionStream !== "undefined") {
    const enc = new TextEncoder().encode(text);
    const cs = new CompressionStream("gzip");
    const stream = new Blob([enc]).stream().pipeThrough(cs);
    const ab = await new Response(stream).arrayBuffer();
    return new Uint8Array(ab);
  }

  // Node fallback (테스트/스크립트용)
  const { gzipSync } = await import("node:zlib");
  const buf = gzipSync(Buffer.from(text, "utf8"));
  return new Uint8Array(buf);
}

function bytesToBase64(bytes) {
  // Uint8Array -> base64 (btoa는 binary string 필요)
  let bin = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(bin);
}
