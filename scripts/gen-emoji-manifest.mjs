// gen-emoji-manifest.mjs
import crypto from "node:crypto";
import { createReadStream, promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import unzipper from "unzipper";

const ROOT = process.cwd();
const ZIP_PATH = path.join(ROOT, "public", "eve-emoji.zip"); // ZIP 위치
const EMOJI_DIR = path.join(ROOT, "public", "eve-emoji"); // 원본 (gitignore)
const THUMB_DIR = path.join(ROOT, "public", "eve-emoji-thumbs"); // 썸네일 (gitignore)
const MANIFEST_PATH = path.join(ROOT, "public", "manifest.json"); // 추적 유지

//  스킵 판정용 스탬프
const STAMP_PATH = path.join(ROOT, ".cache", "emoji-stamp.json");

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
async function isDir(p) {
  try {
    return (await fs.stat(p)).isDirectory();
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

async function sha256File(abs) {
  const buf = await fs.readFile(abs);
  return crypto.createHash("sha256").update(buf).digest("hex");
}

async function readStamp() {
  try {
    const s = await fs.readFile(STAMP_PATH, "utf8");
    return JSON.parse(s);
  } catch {
    return null;
  }
}
async function writeStamp(obj) {
  await ensureDir(path.dirname(STAMP_PATH));
  await fs.writeFile(STAMP_PATH, JSON.stringify(obj), "utf8");
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

//  (중복 push 버그 수정) 디렉터리 재귀 탐색
async function walk(dir, relBase = "") {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const ent of entries) {
    const abs = path.join(dir, ent.name);
    const rel = path.join(relBase, ent.name).replace(/\\/g, "/");

    if (ent.isDirectory()) {
      out.push(...(await walk(abs, rel)));
      continue;
    }

    if (!ALLOWED.test(ent.name)) continue;

    const segs = rel.split("/");
    const filename = segs.pop();
    const folders = segs;

    out.push({
      rel, // 전체 경로 (파일 포함)
      filename,
      name: TITLE(filename),
      folders,
      depth: folders.length,
    });
  }

  return out;
}

// ───────────────────────── main ─────────────────────────
(async () => {
  try {
    // 0) 입력 체크
    if (!(await exists(ZIP_PATH))) {
      console.error(`ZIP 파일이 없습니다: ${ZIP_PATH}`);
      process.exit(1);
    }

    //  스킵 판정(입력 해시 + 생성물 존재)
    const selfPath = path.join(ROOT, "scripts", "gen-emoji-manifest.mjs");
    const inputs = {
      zip: await sha256File(ZIP_PATH),
      script: (await exists(selfPath)) ? await sha256File(selfPath) : null,
      // PNG_ONLY/ALLOWED 같은 설정이 바뀌면 결과가 달라질 수 있으니 포함
      pngOnly: PNG_ONLY,
    };

    const prev = await readStamp();

    const outputsExist = (await isDir(EMOJI_DIR)) && (await isDir(THUMB_DIR)) && (await exists(MANIFEST_PATH));

    if (
      prev &&
      outputsExist &&
      prev.zip === inputs.zip &&
      prev.script === inputs.script &&
      prev.pngOnly === inputs.pngOnly
    ) {
      console.log("⏭️  [gen:emoji] unchanged. skip");
      process.exit(0);
    }

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
    console.log(` 완료: ${MANIFEST_PATH} (${out.length} 개)`);

    //  성공 시 스탬프 저장
    await writeStamp(inputs);
  } catch (err) {
    console.error("❌ 작업 중 오류:", err);
    process.exit(1);
  }
})();
