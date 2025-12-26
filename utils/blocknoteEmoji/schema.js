// utils/blocknoteEmoji/schema.js
import {
  BlockNoteSchema,
  defaultBlockSpecs,
  defaultInlineContentSpecs,
  defaultStyleSpecs,
} from "@blocknote/core";
import { inlineEmojiSpec } from "./InlineEmojiSpec";

export const blockNoteSchema = BlockNoteSchema.create({
  blockSpecs: defaultBlockSpecs,
  styleSpecs: defaultStyleSpecs,
  inlineContentSpecs: {
    ...defaultInlineContentSpecs,
    emoji: inlineEmojiSpec,
  },
});
