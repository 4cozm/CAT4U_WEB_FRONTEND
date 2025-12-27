"use client";

import { useToast } from "@/hooks/useToast";
import { detectXssPatterns } from "@/utils/defenseXSS.js";
import { fetchWithAuth } from "@/utils/fetchWithAuth.js";
import dynamic from "next/dynamic";
import { useParams, useSearchParams } from "next/navigation.js";
import { useCallback, useEffect, useRef, useState } from "react";
import * as yup from "yup";
import BlockNoteRestore from "../../../components/BlockNoteRestore.jsx";
import BlockNoteTempSave from "../../../components/BlockNoteTempSave.jsx";

const DBG = true;

const EditorHost = dynamic(() => import("@/app/BlockNote/EditorHost.jsx"), { ssr: false });

const schema = yup.object({
  board_title: yup
    .string()
    .transform((v) => (v ?? "").trim())
    .required("제목을 입력해주세요.")
    .test("xss-title", "제목에 허용되지 않는 문자열이 포함되어 있습니다.", (value) => {
      const { ok } = detectXssPatterns(value || "");
      return ok;
    }),
  board_content: yup
    .mixed()
    .required("내용을 입력해주세요.")
    .test("content-array", "올바르지 않은 게시글 형식이라옹", (value) => Array.isArray(value))
    .test("xss-content", "내용에 허용되지 않는 문자열이 포함되어 있습니다.", (value) => {
      const { ok } = detectXssPatterns(value || {});
      return ok;
    }),
});

export default function PageClient() {
  const params = useParams();
  const category = params.category;

  const sp = useSearchParams();
  const edit = sp.get("edit");
  const id = sp.get("id");
  const isEdit = edit === "1" && !!id;

  const titleRef = useRef(null);
  const editorRef = useRef(null); // getJSON 등 기존 코드 유지용

  // ✅ ref 준비 이벤트를 state로 승격
  const [editorApi, setEditorApi] = useState(null);

  // ✅ 콜백 ref: EditorHost가 늦게 ref를 채우더라도, 채우는 순간 setEditorApi로 이벤트 발생
  const editorRefCallback = useCallback((api) => {
    editorRef.current = api || null;
    setEditorApi(api || null);

    if (DBG) {
      console.log("[WRITE] editor ref callback", {
        hasRef: !!api,
        hasSetJSON: !!api?.setJSON,
        hasGetJSON: !!api?.getJSON,
      });
    }
  }, []);

  const { pushToast } = useToast();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (DBG) console.log("[WRITE] mounted");
    setMounted(true);
  }, []);

  const [initialBlocks, setInitialBlocks] = useState(null); // null = 아직 안 받아옴
  const [loadingOriginal, setLoadingOriginal] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!mounted) return;
    if (!isEdit) return;

    const url = `/api/board/detail?category=${encodeURIComponent(category)}&id=${encodeURIComponent(id)}`;
    if (DBG) console.log("[WRITE] fetch start", url);

    let alive = true;
    setLoadingOriginal(true);
    setLoadError("");

    fetchWithAuth(url, { method: "GET" })
      .then((resp) => {
        if (!alive) return;

        const payload = resp?.data ?? resp;
        const board = payload?.data ?? payload;

        if (DBG) {
          console.log("[WRITE] fetch ok", {
            title: board?.board_title,
            contentType: typeof board?.board_content,
            contentLen:
              typeof board?.board_content === "string" ? board.board_content.length : board?.board_content?.length,
          });
        }

        if (titleRef.current) titleRef.current.value = board.board_title ?? "";

        // ✅ board_content가 문자열이면 파싱해서 배열로
        let blocks = board.board_content ?? [];
        if (typeof blocks === "string") {
          try {
            blocks = JSON.parse(blocks);
          } catch {
            blocks = [];
          }
        }
        if (!Array.isArray(blocks)) blocks = [];

        if (DBG) console.log("[WRITE] blocks parsed", blocks.length);

        setInitialBlocks(blocks);
      })
      .catch((err) => {
        if (!alive) return;

        const msg = err?.data?.message || err?.message || "원본 글 불러오기에 실패했습니다.";
        if (DBG) console.log("[WRITE] fetch fail", { msg, err });

        setLoadError(msg);
        pushToast({ type: "error", message: msg });

        // 로딩 화면에서 빠져나오게
        setInitialBlocks([]);
      })
      .finally(() => {
        if (!alive) return;
        if (DBG) console.log("[WRITE] fetch finally");
        setLoadingOriginal(false);
      });

    return () => {
      alive = false;
    };
  }, [mounted, isEdit, category, id, pushToast]);

  // ✅ 주입: (initialBlocks 준비됨) + (editorApi 준비됨) 순간에만 실행됨
  useEffect(() => {
    if (!mounted) return;
    if (!isEdit) return;
    if (initialBlocks === null) return;
    if (!editorApi?.setJSON) return;

    if (DBG) console.log("[WRITE] inject", { blocksLen: initialBlocks.length });

    editorApi.setJSON(initialBlocks);

    if (DBG) {
      try {
        console.log("[WRITE] inject done, current len", editorApi.getJSON?.()?.length);
      } catch {
        console.log("[WRITE] inject done (getJSON failed)");
      }
    }
  }, [mounted, isEdit, initialBlocks, editorApi]);

  const handleSave = async () => {
    const board_title = (titleRef.current?.value ?? "").trim();
    const blocks = editorRef.current?.getJSON?.() ?? [];

    const payload = isEdit
      ? { board_title, board_content: blocks }
      : { type: String(category || "").toUpperCase(), board_title, board_content: blocks };

    try {
      await schema.validate(payload, { abortEarly: false });
    } catch (validationErr) {
      const messages = validationErr?.inner?.length
        ? [...new Set(validationErr.inner.map((e) => e.message))]
        : [validationErr.message];

      messages.forEach((m) => pushToast({ type: "warning", message: m || "입력값을 확인해주세요." }));
      return;
    }

    try {
      const url = isEdit ? `/api/board/${encodeURIComponent(id)}` : "/api/board/";
      const method = isEdit ? "PATCH" : "POST";

      const data = await fetchWithAuth(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      pushToast({
        type: "success",
        message: isEdit ? "수정에 성공했습니다." : `글 ${data.board_title} 생성에 성공하였습니다`,
      });

      window.location.href = `/${category}`;
    } catch (err) {
      const msg = err?.data?.message || err?.message || "서버 통신에 문제가 발생하였습니다.";
      pushToast({ type: "error", message: msg });
    }
  };

  const showEditor = mounted && (!isEdit || initialBlocks !== null); // edit면 원본 blocks 준비 후 렌더

  return (
    <section className="mx-auto flex max-w-3xl flex-col pt-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{isEdit ? "글 수정" : "새 글 작성"}</h1>
        <div className="flex gap-2">
          <BlockNoteTempSave content={() => editorRef.current?.getJSON?.()} />
          <BlockNoteRestore
            onRestore={(doc) => {
              const api = editorRef.current;
              if (!api?.setJSON) return;
              api.setJSON(doc);
            }}
          />
          <button
            className="rounded-lg bg-blue-500/80 px-4 py-2 text-white transition hover:bg-blue-400"
            type="button"
            onClick={handleSave}
          >
            저장
          </button>
        </div>
      </div>

      <input
        ref={titleRef}
        type="text"
        placeholder="글 제목을 입력하세요"
        className="mb-4 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-white/20"
      />

      <div className="h-[60vh] overflow-visible rounded-2xl bg-black/40 shadow-[0_8px_30px_rgb(0,0,0,0.25)] ring-1 ring-white/10 backdrop-blur">
        {isEdit && (loadingOriginal || loadError || initialBlocks === null) ? (
          <div className="p-4 text-white/70">
            {loadingOriginal
              ? "원본 글 불러오는 중..."
              : loadError
              ? `불러오기 실패: ${loadError}`
              : "에디터 준비 중..."}
          </div>
        ) : showEditor ? (
          <EditorHost ref={editorRefCallback} />
        ) : null}
      </div>
    </section>
  );
}
