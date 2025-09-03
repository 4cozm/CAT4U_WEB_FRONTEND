import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const EMOJI_DIR = path.join(ROOT, "public", "eve-emoji");
const THUMB_DIR = path.join(ROOT, "public", "eve-emoji-thumbs");
const MANIFEST_PATH = path.join(EMOJI_DIR, "manifest.json");

const PNG_ONLY = true;
const ALLOWED = PNG_ONLY ? /\.png$/i : /\.(png|jpg|jpeg|webp)$/i;

// "minmatar-ship.png" → "Minmatar Ship"
const TITLE = (filename) => {
  const base = filename.replace(/\.[^.]+$/, "");
  return base.replace(/[-_]+/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
};

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

/**
 * 유동 깊이 지원:
 * - category: 첫 폴더
 * - subpath: 나머지 폴더들(0..N)을 배열로
 * - filename: 파일명
 */
async function walk(dir, relBase = "") {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const ent of entries) {
    const abs = path.join(dir, ent.name);
    const rel = path.join(relBase, ent.name).replace(/\\/g, "/"); // Win 경로 보정

    if (ent.isDirectory()) {
      out.push(...(await walk(abs, rel)));
      continue;
    }

    if (!ALLOWED.test(ent.name)) continue;

    const segs = rel.split("/"); // ["함선","콩코드","배틀쉽","썬더차일드.png"]
    const filename = segs.pop();
    const category = segs[0] || "etc";
    const subpath = segs.slice(1); // ["콩코드","배틀쉽"] 또는 []

    out.push({
      rel, // 전체 경로 (파일 포함)
      category, // 첫 폴더
      subpath, // 나머지 폴더 배열
      subcategory: subpath[0] ?? null, // 하위 호환 필드
      filename, // 파일명
      name: TITLE(filename), // 보기용 이름
    });
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

      // 썸네일 경로(확장자 webp로)
      const thumbRel = it.rel.replace(/\.[^.]+$/, ".webp");
      const thumbAbs = path.join(THUMB_DIR, thumbRel);
      await ensureDir(path.dirname(thumbAbs));

      // 64px webp 썸네일 생성
      const inputAbs = path.join(EMOJI_DIR, it.rel);
      await sharp(inputAbs).resize(64, 64, { fit: "inside" }).webp({ quality: 85 }).toFile(thumbAbs);

      out.push({
        name: it.name,
        category: it.category,
        subcategory: it.subcategory,
        subpath: it.subpath,
        src,
        thumb: `/eve-emoji-thumbs/${thumbRel}`,
      });
    }

    await fs.writeFile(MANIFEST_PATH, JSON.stringify(out, null, 2), "utf8");
    console.log(`매니패스트 작업 완료: ${MANIFEST_PATH} (${out.length} 개)`);
  } catch (err) {
    console.error("매니페스트 작업중 오류 발생:", err);
    process.exit(1);
  }
})();
