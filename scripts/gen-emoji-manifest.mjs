// gen-emoji-manifest.mjs
import { createReadStream, promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import unzipper from "unzipper";

const ROOT = process.cwd();
const ZIP_PATH = path.join(ROOT, "public", "eve-emoji.zip"); // ZIP 위치
const EMOJI_DIR = path.join(ROOT, "public", "eve-emoji"); // 원본 (gitignore)
const THUMB_DIR = path.join(ROOT, "public", "eve-emoji-thumbs"); // 썸네일 (gitignore)
const MANIFEST_PATH = path.join(ROOT, "public", "manifest.json"); // 추적 유지

const PNG_ONLY = true;
const ALLOWED = PNG_ONLY ? /\.png$/i : /\.(png|jpg|jpeg|webp)$/i;

const TITLE = (filename) => {
  const base = filename.replace(/\.[^.]+$/, "");
  return base.replace(/[-_]+/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
};

// ───────────────────────── util ─────────────────────────
async function exists(p) {
  try {
    await fs.stat(p);
    return true;
  } catch {
    return false;
  }
}
async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}
async function rmrf(p) {
  await fs.rm(p, { recursive: true, force: true });
}

async function extractZip(zipAbs, destDir) {
  await ensureDir(destDir);
  await new Promise((resolve, reject) => {
    createReadStream(zipAbs)
      .pipe(unzipper.Extract({ path: destDir }))
      .on("close", resolve)
      .on("error", reject);
  });
}

// ZIP 최상위에 폴더 하나만 있을 때 내용물을 상위로 승격
async function stripSingleTopLevelWrapper(dir) {
  const items = await fs.readdir(dir, { withFileTypes: true });
  const topFiles = items.filter((i) => i.isFile());
  const topDirs = items.filter((i) => i.isDirectory());
  if (topFiles.length === 0 && topDirs.length === 1) {
    const inner = path.join(dir, topDirs[0].name);
    await fs.cp(inner, dir, { recursive: true, force: false, errorOnExist: false });
    await rmrf(inner);
  }
}

// 디렉터리 재귀 탐색
async function walk(dir, relBase = "") {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const ent of entries) {
    const abs = path.join(dir, ent.name);
    const rel = path.join(relBase, ent.name).replace(/\\/g, "/"); // 윈도우 보정
    if (ent.isDirectory()) {
      out.push(...(await walk(abs, rel)));
    } else if (ALLOWED.test(ent.name)) {
      const segs = rel.split("/");
      const filename = segs.pop();
      const folders = segs;
      out.push({
        rel,
        filename,
        name: TITLE(filename),
        folders,
        depth: folders.length,
      });
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

// ───────────────────────── main ─────────────────────────
(async () => {
  try {
    // 1) thumbs 삭제
    console.log("🧹 1/5 remove thumbs:", THUMB_DIR);
    await rmrf(THUMB_DIR);

    // 2) 원본 삭제
    console.log("🧹 2/5 remove originals:", EMOJI_DIR);
    await rmrf(EMOJI_DIR);

    // 3) 매니페스트 삭제
    console.log("🗑️ 3/5 remove manifest:", MANIFEST_PATH);
    await fs.rm(MANIFEST_PATH, { force: true });

    // 4) ZIP 압축 해제 → eve-emoji
    if (!(await exists(ZIP_PATH))) {
      console.error(`ZIP 파일이 없습니다: ${ZIP_PATH}`);
      process.exit(1);
    }
    console.log("📦 4/5 unzip:", ZIP_PATH, "→", EMOJI_DIR);
    await extractZip(ZIP_PATH, EMOJI_DIR);
    await stripSingleTopLevelWrapper(EMOJI_DIR);

    // 5) 썸네일/매니페스트 생성
    console.log("🧭 5/5 generate thumbnails & manifest…");
    await ensureDir(THUMB_DIR);
    const list = await walk(EMOJI_DIR);

    const out = [];
    for (const it of list) {
      const thumbRel = it.rel.replace(/\.[^.]+$/, ".webp");
      const thumbAbs = path.join(THUMB_DIR, thumbRel);
      await ensureDir(path.dirname(thumbAbs));

      const inputAbs = path.join(EMOJI_DIR, it.rel);
      await sharp(inputAbs).resize(64, 64, { fit: "inside" }).webp({ quality: 85 }).toFile(thumbAbs);

      out.push({
        name: it.name,
        filename: it.filename,
        folders: it.folders,
        depth: it.depth,
        id: it.rel,
        url: `/eve-emoji-thumbs/${thumbRel}`,
      });
    }

    await ensureDir(path.dirname(MANIFEST_PATH));
    await fs.writeFile(MANIFEST_PATH, JSON.stringify(out, null, 2), "utf8");
    console.log(`✅ 완료: ${MANIFEST_PATH} (${out.length} 개)`);
  } catch (err) {
    console.error("❌ 작업 중 오류:", err);
    process.exit(1);
  }
})();
