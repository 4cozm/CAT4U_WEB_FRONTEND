"use client";

import { useToast } from "@/hooks/useToast";
import { detectXssPatterns } from "@/utils/defenseXSS.js";
import { fetchWithAuth } from "@/utils/fetchWithAuth.js";
import dynamic from "next/dynamic";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import * as yup from "yup";
import BlockNoteRestore from "../../../components/BlockNoteRestore.jsx";
import BlockNoteTempSave from "../../../components/BlockNoteTempSave.jsx";

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
  const router = useRouter();
  const params = useParams();
  const category = params.category;

  const sp = useSearchParams();
  const edit = sp.get("edit");
  const id = sp.get("id");
  const isEdit = edit === "1" && !!id;

  const { pushToast } = useToast();

  const titleRef = useRef(null);
  const editorRef = useRef(null);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [editorApi, setEditorApi] = useState(null);
  const editorRefCallback = useCallback((api) => {
    editorRef.current = api || null;
    setEditorApi(api || null);
  }, []);

  const [initialBlocks, setInitialBlocks] = useState(null);
  const [loadingOriginal, setLoadingOriginal] = useState(false);
  const [loadError, setLoadError] = useState("");

  // ===== Unsaved changes guard =====
  const [dirty, setDirty] = useState(false);
  const [trackEnabled, setTrackEnabled] = useState(false);
  const hasGuardRef = useRef(false);

  const confirmLeave = useCallback(() => {
    return window.confirm("저장 안했는데 그냥 나가나옹?");
  }, []);

  const markDirty = useCallback(() => {
    if (!trackEnabled) return;
    setDirty(true);
  }, [trackEnabled]);

  const markDirtyKey = useCallback(
    (e) => {
      if (!trackEnabled) return;
      const k = e.key;
      if (k === "Enter" || k === "Backspace" || k === "Delete") setDirty(true);
    },
    [trackEnabled]
  );

  const onTitleChange = useCallback(() => markDirty(), [markDirty]);

  // (A) 탭 닫기/새로고침/주소창 이동
  useEffect(() => {
    if (!dirty) return;

    const onBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  // (B) 뒤로가기(popstate)
  useEffect(() => {
    if (!dirty) {
      hasGuardRef.current = false;
      return;
    }

    const current = window.location.href;

    if (!hasGuardRef.current) {
      history.pushState({ __guard: true }, "", current);
      hasGuardRef.current = true;
    }

    const onPopState = () => {
      const ok = confirmLeave();
      if (ok) {
        window.removeEventListener("popstate", onPopState);
        history.back();
      } else {
        history.pushState({ __guard: true }, "", current);
      }
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [dirty, confirmLeave]);

  // (C) 내부 링크 클릭 가드(Next <Link> 포함)
  useEffect(() => {
    if (!dirty) return;

    const onDocClick = (e) => {
      // 새 탭 열기 같은 경우는 무시
      if (e.defaultPrevented) return;
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const a = e.target?.closest?.("a");
      if (!a) return;

      if (a.target && a.target !== "_self") return;
      if (a.hasAttribute("download")) return;

      const href = a.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      let url;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }

      // 외부 링크는 브라우저 기본 동작
      if (url.origin !== window.location.origin) return;

      const ok = confirmLeave();
      if (!ok) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener("click", onDocClick, true);
    return () => document.removeEventListener("click", onDocClick, true);
  }, [dirty, confirmLeave]);

  // ===== edit 모드: 원본 로드 =====
  useEffect(() => {
    if (!mounted) return;
    if (!isEdit) return;

    const url = `/api/board/detail?category=${encodeURIComponent(category)}&id=${encodeURIComponent(id)}`;

    let alive = true;
    setLoadingOriginal(true);
    setLoadError("");
    setTrackEnabled(false);
    setDirty(false);

    fetchWithAuth(url, { method: "GET" })
      .then((resp) => {
        if (!alive) return;

        const payload = resp?.data ?? resp;
        const board = payload?.data ?? payload;

        if (titleRef.current) titleRef.current.value = board?.board_title ?? "";

        let blocks = board?.board_content ?? [];
        if (typeof blocks === "string") {
          try {
            blocks = JSON.parse(blocks);
          } catch {
            blocks = [];
          }
        }
        if (!Array.isArray(blocks)) blocks = [];

        setInitialBlocks(blocks);
      })
      .catch((err) => {
        if (!alive) return;

        const msg = err?.data?.message || err?.message || "원본 글 불러오기에 실패했습니다.";
        setLoadError(msg);
        pushToast({ type: "error", message: msg });

        setInitialBlocks([]);
      })
      .finally(() => {
        if (!alive) return;
        setLoadingOriginal(false);
      });

    return () => {
      alive = false;
    };
  }, [mounted, isEdit, category, id, pushToast]);

  // ===== edit 모드: 주입 후부터 변경 감시 시작 =====
  useEffect(() => {
    if (!mounted) return;

    // 새 글 작성: 에디터 준비되면 바로 감시 시작
    if (!isEdit) {
      if (editorApi?.getJSON || editorApi?.setJSON) setTrackEnabled(true);
      return;
    }

    // 수정: 원본 + editorApi 준비 후 주입, 그 다음 감시 시작
    if (initialBlocks === null) return;
    if (!editorApi?.setJSON) return;

    editorApi.setJSON(initialBlocks);

    // 주입으로 dirty 켜지는 거 방지: 주입 뒤에 감시 ON
    setDirty(false);
    setTrackEnabled(true);
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

      const result = await fetchWithAuth(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      pushToast({
        type: "success",
        message: isEdit
          ? "수정에 성공했습니다."
          : `게시글 : ${result?.data?.board_title ?? board_title} 생성에 성공하였습니다`,
      });

      // 저장 성공 -> 이탈 가드 해제
      setDirty(false);
      setTrackEnabled(false);

      router.push(`/${category}`);
    } catch (err) {
      const msg = err?.data?.message || err?.message || "서버 통신에 문제가 발생하였습니다.";
      pushToast({ type: "error", message: msg });
    }
  };

  const showEditor = mounted && (!isEdit || initialBlocks !== null);

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col pt-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{isEdit ? "글 수정" : "새 글 작성"}</h1>
        <div className="flex gap-2">
          <BlockNoteTempSave content={() => editorRef.current?.getJSON?.()} />
          <BlockNoteRestore
            onRestore={(doc) => {
              const api = editorRef.current;
              if (!api?.setJSON) return;
              api.setJSON(doc);
              markDirty();
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
        onChange={onTitleChange}
        type="text"
        placeholder="글 제목을 입력하세요"
        className="mb-4 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-white/20"
      />

      <div
        className="h-[60vh] overflow-visible rounded-2xl bg-black/40 shadow-[0_8px_30px_rgb(0,0,0,0.25)] ring-1 ring-white/10 backdrop-blur"
        onInput={markDirty}
        onPaste={markDirty}
        onCut={markDirty}
        onDrop={markDirty}
        onKeyDown={markDirtyKey}
      >
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
