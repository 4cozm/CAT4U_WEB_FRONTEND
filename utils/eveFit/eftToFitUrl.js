import { gzipSync, strToU8 } from "fflate";

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
  //  줄바꿈을 "통일"만 하고 제거하지 않는다
  // trim()은 앞 공백까지 날릴 수 있어서, 여기선 trimEnd만 권장
  return String(input ?? "")
    .replace(/\r\n?/g, "\n")
    .replace(/\0/g, "")
    .trimEnd();
}

export function looksLikeEftMultiline(text) {
  const lines = String(text ?? "")
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  // 첫 줄이든 어디든, [ ... ] 와 콤마가 있는 라인을 헤더로 찾음
  const headerLine = lines.find((line) => {
    const s = line.indexOf("[");
    const e = line.lastIndexOf("]");
    if (s < 0 || e <= s) return false;
    const inside = line.slice(s + 1, e);
    return inside.includes(",");
  });

  if (!headerLine) return null;

  const s = headerLine.indexOf("[");
  const e = headerLine.lastIndexOf("]");
  const inside = headerLine.slice(s + 1, e);

  const commaIdx = inside.indexOf(",");
  if (commaIdx <= 0) return null;

  const ship = inside.slice(0, commaIdx).trim();
  const fitName = inside.slice(commaIdx + 1).trim();
  if (!ship || !fitName) return null;

  return { ship, fitName };
}

async function gzipUtf8(text) {
  return gzipSync(strToU8(text));
}

function bytesToBase64(bytes) {
  // 브라우저
  if (typeof btoa !== "undefined") {
    let bin = "";
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    return btoa(bin);
  }
  // Node(테스트 등)
  return Buffer.from(bytes).toString("base64");
}
