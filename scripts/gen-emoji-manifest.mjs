import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const EMOJI_DIR = path.join(ROOT, "public", "eve-emoji");
const THUMB_DIR = path.join(ROOT, "public", "eve-emoji-thumbs");
const MANIFEST_PATH = path.join(EMOJI_DIR, "manifest.json");

const PNG_ONLY = true; // png만 사용할 거면 true 유지
const ALLOWED = PNG_ONLY ? /\.png$/i : /\.(png|jpg|jpeg|webp)$/i;

// "minmatar-ship.png" → "Minmatar Ship"
const TITLE = (filename) => {
  const base = filename.replace(/\.[^.]+$/, "");
  return base.replace(/[-_]+/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
};

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

// 디렉터리 재귀 탐색: 카테고리/2차카테고리/파일.png
async function walk(dir, relBase = "") {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const ent of entries) {
    const abs = path.join(dir, ent.name);
    const rel = path.join(relBase, ent.name).replace(/\\/g, "/"); // Win 경로 보정
    if (ent.isDirectory()) {
      out.push(...(await walk(abs, rel)));
    } else if (ALLOWED.test(ent.name)) {
      const segs = rel.split("/"); // [cat, subcat, filename]
      const category = segs[0] || "etc";
      const subcategory = segs.length > 2 ? segs[1] : segs.length > 1 ? segs[1] : null;
      out.push({
        rel, // "cat/sub/file.png"
        category, // 1차
        subcategory: subcategory || null, // 2차(없으면 null)
        name: TITLE(ent.name), // 보기용 이름
      });
    }
  }
  return out;
}

(async () => {
  try {
    await ensureDir(THUMB_DIR);
    const list = await walk(EMOJI_DIR, "");

    const out = [];
    for (const it of list) {
      const src = `/eve-emoji/${it.rel}`;

      // 썸네일 경로(폴더 구조 유지, 확장자 webp로)
      const thumbRel = it.rel.replace(/\.[^.]+$/, ".webp");
      const thumbAbs = path.join(THUMB_DIR, thumbRel);
      await ensureDir(path.dirname(thumbAbs));

      // 64px webp 썸네일 생성
      const inputAbs = path.join(EMOJI_DIR, it.rel);
      await sharp(inputAbs).resize(64, 64, { fit: "inside" }).webp({ quality: 85 }).toFile(thumbAbs);

      out.push({
        name: it.name,
        category: it.category,
        subcategory: it.subcategory, // 두 번째 계층
        src, // 원본
        thumb: `/eve-emoji-thumbs/${thumbRel}`, // 썸네일
      });
    }

    await fs.writeFile(MANIFEST_PATH, JSON.stringify(out, null, 2), "utf8");
    console.log(`✅ manifest written: ${MANIFEST_PATH} (${out.length} items)`);
  } catch (err) {
    console.error("❌ Failed to generate manifest:", err);
    process.exit(1);
  }
})();
