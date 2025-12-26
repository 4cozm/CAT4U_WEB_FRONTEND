import React from "react";
import { createReactInlineContentSpec } from "@blocknote/react";
import { emojiSpecDefinition } from "./emojiSpec.core";

export const inlineEmojiSpec = createReactInlineContentSpec(emojiSpecDefinition, {
  render: ({ inlineContent }) => {
    const { src = "", alt = "", width, height, size, scale = 1 } =
      inlineContent.props || {};

    const scaleVal = Number(scale) || 1;

    const style = { verticalAlign: "-0.2em" };
    if (size) style.height = `${Number(size)}px`;
    else if (height) style.height = `${Number(height)}px`;
    else style.height = `calc(1em * ${scaleVal} + 5px)`;

    const attrs = {
      src,
      alt,
      style,
      draggable: false,
      "data-inline-emoji": "1",
    };

    if (width) attrs.width = Number(width);
    if (height) attrs.height = Number(height);

    return React.createElement("img", attrs);
  },
});
