import { BlockNoteSchema } from "@blocknote/core";
import { inlineEmojiSpec } from "./InlineEmojiSpec";

export const blockNoteSchema = BlockNoteSchema.create().extend({
  inlineContentSpecs: {
    emoji: inlineEmojiSpec,
  },
});
