"use client";
import { createReactInlineContentSpec } from "@blocknote/react";

const FALLBACK_QUESTION_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
      <rect width="100%" height="100%" fill="transparent"/>
      <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-size="18" fill="currentColor">?</text>
    </svg>`
  );


const inlineEmoji = createReactInlineContentSpec(
  {
    type: "emoji",
    propSchema: {
      src: { default: "" },
      alt: { default: "" },
      width: { default: undefined, type: "number" },
      height: { default: undefined, type: "number" },
      size: { default: undefined, type: "number" },
      scale: { default: 1 },
    },
    content: "none",
    draggable: false,
  },
  {
    render: ({ inlineContent }) => {
      const { src, alt, width, height, size, scale } = inlineContent.props || {};
      const toNum = (v) => (Number.isFinite(Number(v)) ? Number(v) : undefined);
      const s = toNum(size);
      const w = toNum(width);
      const h = toNum(height);
      const scaleVal = Number(scale) || 1;

      // 명시 px가 있으면 기존처럼 고정(px)
      if (w != null || h != null || s != null) {
        const pxW = s ?? w ?? h;
        const pxH = s ?? h ?? w;
        return (
          <img
            src={src || FALLBACK_QUESTION_SVG}
            alt={alt || ""}
            width={pxW}
            height={pxH}
            style={{
              display: "inline-block",
              verticalAlign: "-0.2em",
              lineHeight: 0,
              transform: scaleVal !== 1 ? `scale(${scaleVal})` : undefined,
              transformOrigin: "baseline",
            }}
            data-inline-emoji="1"
            draggable={false}
            onError={(e) => {
              const el = e.currentTarget;
              el.onerror = null;
              el.src = FALLBACK_QUESTION_SVG;
            }}
          />
        );
      }

      // ✅ 기본: 폰트 크기(1em) * scale + 3px
      return (
        <img
          src={src || FALLBACK_QUESTION_SVG}
          alt={alt || ""}
          style={{
            display: "inline-block",
            width: "auto",
            height: `calc(1em * ${scaleVal} + 5px)`,
            verticalAlign: "-0.2em",
            lineHeight: 0,
          }}
          data-inline-emoji="1"
          draggable={false}
          onError={(e) => {
            const el = e.currentTarget;
            el.onerror = null;
            el.src = FALLBACK_QUESTION_SVG;
          }}
        />
      );
    },

    fromHTML: (el) => {
      if (!el || el.tagName !== "IMG") return null;
      const toNum = (v) => (Number.isFinite(Number(v)) ? Number(v) : undefined);
      return {
        src: el.getAttribute("src") || "",
        alt: el.getAttribute("alt") || "",
        width: toNum(el.getAttribute("width")),
        height: toNum(el.getAttribute("height")),
      };
    },
  }
);

export default inlineEmoji;
