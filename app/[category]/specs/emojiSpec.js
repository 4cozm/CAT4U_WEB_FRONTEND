// emojiSpec.core.js

//BlockNote의 RAW JSON -> HTML로 변환하는 과정에서 커스텀으로 구현한 이모지의 공통 정의
//해당 값은 서버 레포지토리와 항상 같아야함
//v1.0 edit by bonsai 2025/12/23
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
