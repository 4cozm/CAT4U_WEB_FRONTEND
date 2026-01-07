"use client";

import { AIExtension, AIMenu, aiDocumentFormats, getDefaultAIMenuItems } from "@blocknote/xl-ai";
import { MdAutoFixHigh, MdSpellcheck } from "react-icons/md";

/**
 * 기본 AI 메뉴(계속 작성/요약/작업항목/무엇이든...)는 숨기고,
 * "정리", "맞춤법" 2개만 노출.
 */
export default function CatAIMenu() {
  return (
    <AIMenu
      items={(editor, aiResponseStatus) => {
        //  커맨드 리스트가 보이는 상태일 때: 우리가 만든 2개만 보여주기
        if (aiResponseStatus === "user-input") {
          const tidyWholeDoc = {
            key: "cat_tidy_doc",
            title: "전체 문서를 정리해달라냥",
            aliases: ["정리", "문서정리", "구조화"],
            icon: <MdAutoFixHigh size={18} />,
            size: "small",
            onItemClick: async () => {
              await editor.getExtension(AIExtension)?.invokeAI({
                useSelection: false,
                userPrompt: [
                  "아래 문서를 전체적으로 정리해줘.",
                  "- 제목/소제목(h2/h3)으로 구조화",
                  "- 중복/장황한 문장 간결화",
                  "- 나열은 ul/ol로 정리",
                  "- 의미는 유지하고 가독성만 개선",
                ].join("\n"),
                // 정리는 문단 추가가 필요할 수 있어 add 허용, delete는 안전하게 끄기
                streamToolsProvider: aiDocumentFormats.html.getStreamToolsProvider(true, {
                  add: true,
                  update: true,
                  delete: false,
                }),
              });
            },
          };

          const fixSpelling = {
            key: "cat_fix_spelling",
            title: "마춤뻡을 고쳐달라냥",
            aliases: ["맞춤법", "띄어쓰기", "교정", "오타"],
            icon: <MdSpellcheck size={18} />,
            size: "small",
            onItemClick: async () => {
              await editor.getExtension(AIExtension)?.invokeAI({
                useSelection: false,
                userPrompt: [
                  "아래 문서의 맞춤법/띄어쓰기/오타를 고쳐줘.",
                  "- 의미 변경 금지",
                  "- 문체는 크게 바꾸지 말고 자연스럽게만",
                ].join("\n"),
                // 맞춤법은 보통 update만
                streamToolsProvider: aiDocumentFormats.html.getStreamToolsProvider(true, {
                  add: false,
                  update: true,
                  delete: false,
                }),
              });
            },
          };

          return [tidyWholeDoc, fixSpelling];
        }

        //  thinking/ai-writing/user-reviewing(accept/reject) 등은 기본 UI 유지
        return getDefaultAIMenuItems(editor, aiResponseStatus);
      }}
    />
  );
}
