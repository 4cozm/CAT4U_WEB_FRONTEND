export const emojiSpecDefinition = {
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
};
