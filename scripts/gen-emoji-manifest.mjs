import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const EMOJI_DIR = path.join(ROOT, "public", "eve-emoji");
const MANIFEST_PATH = path.join(EMOJI_DIR, "manifest.json");

const ALLOWED = /\.(png|jpg|jpeg|webp|gif|svg)$/i;

// 예: "minmatar-ship.png" → "Minmatar Ship"
const TITLE = (filename) => {
  const base = filename.replace(/\.[^.]+$/, "");
  return base.replace(/[-_]+/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
};

// 디렉터리 재귀 탐색
async function walk(dir, relBase = "") {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const ent of entries) {
    const abs = path.join(dir, ent.name);
    const rel = path.join(relBase, ent.name).replace(/\\/g, "/"); // 윈도우 경로 보정
    if (ent.isDirectory()) {
      out.push(...(await walk(abs, rel)));
    } else if (ALLOWED.test(ent.name)) {
      // /eve-emoji/<category>/file.png → category 추출 (첫 세그먼트)
      const segs = rel.split("/");
      const category = segs.length > 1 ? segs[0] : "기타";
      out.push({
        name: TITLE(ent.name),
        src: `/eve-emoji/${rel}`,
        category,
      });
    }
  }
  return out;
}

(async () => {
  try {
    const list = await walk(EMOJI_DIR, "");
    await fs.writeFile(MANIFEST_PATH, JSON.stringify(list, null, 2), "utf8");
    console.log(`✅ manifest written: ${MANIFEST_PATH} (${list.length} items)`);
  } catch (err) {
    console.error("❌ Failed to generate manifest:", err);
    process.exit(1);
  }
})();
