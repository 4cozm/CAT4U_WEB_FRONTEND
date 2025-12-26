// components/AlertModal.jsx
import { useEffect, useRef, useState } from "react";

export default function AlertModal({
  type = "error", // "success" | "info" | "warning" | "error"
  message,
  className = "",
  polite = true,
  icon = true,
  autoHide = true,
  duration = 3000, // ms
  pauseOnHover = true, // 호버 시 타이머 일시정지 (Header에서 false로 넘기기로 함)
  dismissible = true,
  onClose,
  showProgress = true, // 하단 바형 타이머 표시
}) {
  const variants = {
    success: {
      container:
        "bg-green-100 dark:bg-green-900 border-l-4 border-green-500 dark:border-green-700 text-green-900 dark:text-green-100",
      icon: "text-green-600",
    },
    info: {
      container:
        "bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-500 dark:border-blue-700 text-blue-900 dark:text-blue-100",
      icon: "text-blue-600",
    },
    warning: {
      container:
        "bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 dark:border-yellow-700 text-yellow-900 dark:text-yellow-100",
      icon: "text-yellow-600",
    },
    error: {
      container:
        "bg-red-100 dark:bg-red-900 border-l-4 border-red-500 dark:border-red-700 text-red-900 dark:text-red-100",
      icon: "text-red-600",
    },
  };
  const v = variants[type] ?? variants.info;

  // 상태
  const [open, setOpen] = useState(true);
  const [exiting, setExiting] = useState(false);
  const [progressStart, setProgressStart] = useState(false); // progress 애니메이션 트리거

  // 타이머
  const startTimeRef = useRef(null);
  const remainingRef = useRef(duration);
  const timerRef = useRef(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = (ms) => {
    if (!autoHide) return;
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      setExiting(true);
      setTimeout(() => {
        setOpen(false);
        onClose?.();
      }, 180);
    }, ms);
  };

  useEffect(() => {
    if (autoHide) {
      remainingRef.current = duration;
      startTimer(remainingRef.current);
    }
    // progress bar 애니메이션 시작 (다음 프레임에서 width 0%로 전환)
    const raf = requestAnimationFrame(() => setProgressStart(true));
    return () => {
      clearTimer();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoHide, duration]);

  const onMouseEnter = () => {
    if (!pauseOnHover || !autoHide) return;
    if (!timerRef.current) return;
    const elapsed = Date.now() - startTimeRef.current;
    remainingRef.current = Math.max(0, remainingRef.current - elapsed);
    clearTimer();
  };

  const onMouseLeave = () => {
    if (!pauseOnHover || !autoHide) return;
    if (remainingRef.current > 0) startTimer(remainingRef.current);
  };

  const handleDismiss = () => {
    clearTimer();
    setExiting(true);
    setTimeout(() => {
      setOpen(false);
      onClose?.();
    }, 180);
  };

  if (!open) return null;

  return (
    <div
      role="alert"
      aria-live={polite ? "polite" : "assertive"}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={[
        "rounded-lg flex flex-col", // 세로 레이아웃(본문 + progress)
        "transition duration-180 ease-out",
        v.container,
        "px-3 py-2", // md 고정 패딩
        exiting ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0",
        className,
      ].join(" ")}
    >
      {/* 본문 영역: 좌 아이콘 / 중앙 텍스트 / 우 닫기 */}
      <div className="flex items-center gap-2">
        {icon && (
          <svg
            stroke="currentColor"
            viewBox="0 0 24 24"
            fill="none"
            className={`h-5 w-5 flex-shrink-0 ${v.icon}`}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        )}

        <p className="flex-1 text-center text-sm font-medium leading-tight">{message}</p>

        {dismissible && (
          <button
            type="button"
            aria-label="Close"
            onClick={handleDismiss}
            className="ml-1 inline-flex items-center justify-center h-6 w-6 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-black/20 dark:focus:ring-white/30 hover:opacity-80"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor">
              <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      {/* 하단 바형 타이머 */}
      {showProgress && autoHide && (
        <div className="mt-1.5 h-0.5 w-full rounded bg-black/10 dark:bg-white/15 overflow-hidden">
          <div
            className="h-full bg-black/50 dark:bg-white/70"
            style={{
              width: progressStart ? "0%" : "100%",
              transitionProperty: "width",
              transitionTimingFunction: "linear",
              transitionDuration: `${duration}ms`,
            }}
          />
        </div>
      )}
    </div>
  );
}
