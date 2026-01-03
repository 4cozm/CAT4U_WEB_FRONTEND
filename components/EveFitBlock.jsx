"use client";

import { eftToFitUrl } from "@/utils/eveFit/eftToFitUrl.js";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function useResizeObserverWidth(ref) {
  const [w, setW] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (!cr) return;
      setW(Math.round(cr.width));
    });

    ro.observe(el);
    setW(Math.round(el.getBoundingClientRect().width));
    return () => ro.disconnect();
  }, [ref]);

  return w;
}

// EFT 멀티라인인지 대충 검증 (eveship에서 깨지는 입력 방지)
function looksLikeEftMultiline(text) {
  if (!text) return false;
  if (!/[\r\n]/.test(text)) return false;

  // 헤더 라인: [Ship, Fit Name]
  const header = text.match(/^\s*\[[^\],]+,\s*[^\]]+\]\s*$/m);
  if (!header) return false;

  const lines = text
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  return lines.length >= 4;
}

async function readClipboardTextSafe() {
  // 표준 클립보드 API (HTTPS, 권한 필요)
  if (typeof navigator !== "undefined" && navigator.clipboard?.readText) {
    try {
      const t = await navigator.clipboard.readText();
      return String(t ?? "");
    } catch {
      // fallthrough
    }
  }

  // 권한 막히는 환경 폴백: prompt로 붙여넣기 받기
  const manual = window.prompt("왜 차단 눌렀냐옹... 피팅 텍스트를 여기에 넣으라옹. 참나");
  return String(manual ?? "");
}

function FitFrame({ src }) {
  // eveship 데스크탑 UI 기준 폭
  const BASE_W = 1600; // 1400~1920 취향
  const MIN_SCALE = 0.35;
  const MAX_SCALE = 1.0;

  const stageRef = useRef(null);
  const stageW = useResizeObserverWidth(stageRef);

  const scale = useMemo(() => {
    if (!stageW) return 1;
    return clamp(stageW / BASE_W, MIN_SCALE, MAX_SCALE);
  }, [stageW]);

  const visibleH = useMemo(() => {
    if (!stageW) return 560;
    return clamp(Math.round(stageW * 0.62), 420, 720);
  }, [stageW]);

  const innerH = Math.max(600, Math.round(visibleH / scale));

  return (
    <div
      ref={stageRef}
      className="mt-2 w-full min-w-0 overflow-hidden rounded-xl border border-white/15 bg-black/20"
      style={{ height: `${visibleH}px`, position: "relative" }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          width: `${BASE_W}px`,
          height: `${innerH}px`,
          transform: `translateX(-50%) scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        <iframe title="EVE Fit" src={src} className="w-full h-full" loading="lazy" allowFullScreen />
      </div>
    </div>
  );
}

export default function EveFitBlock({ block, editor }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [lastEft, setLastEft] = useState(block?.props?.eft || "");

  useEffect(() => {
    setLastEft(block?.props?.eft || "");
  }, [block?.props?.eft]);

  const fitUrl = useMemo(() => block?.props?.fitUrl || "", [block?.props?.fitUrl]);

  async function applyFromText(raw) {
    const text = String(raw ?? "")
      .replace(/\r\n?/g, "\n")
      .trimEnd();

    if (!looksLikeEftMultiline(text)) {
      throw new Error("피팅 멀티라인 전체를 복사했는지 확인하라옹 (첫 줄 [Ship, Fit] 포함)");
    }

    setErr("");
    setBusy(true);
    try {
      const url = await eftToFitUrl(text);

      editor.updateBlock(block, {
        props: {
          ...block.props,
          eft: text,
          fitUrl: url,
        },
      });

      setLastEft(text);
    } catch (e) {
      setErr(e?.message || "fit 생성 실패");
    } finally {
      setBusy(false);
    }
  }

  async function loadFromClipboard() {
    setErr("");
    setBusy(true);
    try {
      const clip = await readClipboardTextSafe();
      await applyFromText(clip);
    } catch (e) {
      setErr(e?.message || "클립보드 로드 실패");
      setBusy(false); // applyFromText에서 busy를 다시 잡을 수도 있어서 여기서 한번 더 보정
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="glass w-full max-w-none rounded-2xl border border-white/20 bg-white/10 p-3 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm text-white/80 font-semibold">이브 피팅</div>

        <div className="flex items-center gap-2">
          {fitUrl ? (
            <>
              <a
                className="hidden md:inline text-xs text-white/70 hover:text-white underline underline-offset-4"
                href={fitUrl}
                target="_blank"
                rel="noreferrer"
              >
                새창 열기
              </a>

              {/* 모바일: 바로가기만 */}
              <a
                className="md:hidden text-xs rounded-lg px-2 py-1 bg-white/10 hover:bg-white/20 text-white/80"
                href={fitUrl}
                target="_blank"
                rel="noreferrer"
              >
                피팅 열기
              </a>
            </>
          ) : null}
        </div>
      </div>

      {/* ✅ 입력창 제거: 버튼만 */}
      {!fitUrl ? (
        <div className="mt-3 flex flex-col gap-2">
          <div className="text-xs text-white/65 leading-relaxed">
            피팅 텍스트를 아래처럼 <span className="!text-red-300 font-semibold">복사</span>한 뒤 아래 버튼을 눌러라냥.
          </div>
          <div className="text-xs text-white/65 leading-relaxed">
            [Vagabond, 랑조 뱃살 타격기]
            <br />
            Assault Damage Control II
            <br />
            Gyrostabilizer II
            <br />
            나머지 피팅 문자열
            <br />
            ...
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="
                inline-flex items-center justify-center gap-2
                rounded-xl
                !px-2 !py-1.5
                !bg-emerald-400/15
                hover:!bg-emerald-400/22
                !border !border-emerald-200/30
                hover:!border-emerald-200/45
                text-sm text-white/90
                shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]
                active:translate-y-[1px]
                transition
                disabled:opacity-50
              "
              onClick={loadFromClipboard}
              disabled={busy}
            >
              {busy ? "불러오는 중..." : "클립보드에서 불러오기"}
            </button>

            {err ? <div className="text-xs text-red-200">{err}</div> : null}
          </div>
        </div>
      ) : (
        <>
          {/* ✅ 데스크탑: 임베드 + (선택) 다시 불러오기 */}
          <div className="hidden md:block">
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                className="rounded-xl px-3 py-2 bg-white/10 hover:bg-white/20 text-xs text-white/85 disabled:opacity-50"
                onClick={loadFromClipboard}
                disabled={busy}
                title="다른 피팅을 복사한 뒤 눌러서 교체"
              >
                {busy ? "교체 중..." : "다시 불러오기"}
              </button>

              {err ? <div className="text-xs text-red-200">{err}</div> : null}
            </div>

            <FitFrame src={fitUrl} />
          </div>

          {/* ✅ 모바일: 안내 */}
          <div className="md:hidden mt-2 text-xs text-white/60">
            핸드폰은 코딱지 만하다옹.. 대신 <span className="text-white/80">“피팅 열기”</span>로 새 탭에서 확인해라냥.
          </div>
        </>
      )}
    </div>
  );
}
