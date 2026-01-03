// utils/blocknoteEmoji/schema.js
import EveFitBlock from "@/components/EveFitBlock.jsx";
import { BlockNoteSchema, defaultBlockSpecs, defaultInlineContentSpecs, defaultStyleSpecs } from "@blocknote/core";
import { createReactBlockSpec } from "@blocknote/react";
import { inlineEmojiSpec } from "./InlineEmojiSpec";

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

export const blockNoteSchema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    eveFit: eveFitSpec,
  },
  styleSpecs: defaultStyleSpecs,
  inlineContentSpecs: {
    ...defaultInlineContentSpecs,
    emoji: inlineEmojiSpec,
  },
});
