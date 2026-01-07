// utils/blocknoteEmoji/schema.js
"use client";

import EveFitBlock from "@/components/EveFitBlock.jsx";
import { BlockNoteSchema, defaultBlockSpecs, defaultInlineContentSpecs, defaultStyleSpecs } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import { inlineEmojiSpec } from "./InlineEmojiSpec.jsx";


function normalizeSpec(maybeFactory) {
  return typeof maybeFactory === "function" ? maybeFactory() : maybeFactory;
}

export const eveFitSpec = createReactBlockSpec(
  {
    type: "eveFit",
    propSchema: {
      eft: { default: "" },
      fitUrl: { default: "" },
    },
    content: "none",
  },
  {
    render: (props) => <EveFitBlock {...props} />,
  }
);

export function createBlockNoteSchema() {
  const eveFit = normalizeSpec(eveFitSpec);
  const emoji = normalizeSpec(inlineEmojiSpec);

  return BlockNoteSchema.create({
    blockSpecs: {
      ...defaultBlockSpecs,
      eveFit,
    },
    styleSpecs: defaultStyleSpecs,
    inlineContentSpecs: {
      ...defaultInlineContentSpecs,
      emoji,
    },
  });
}
