// eslint.config.js (Flat)
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  // 1) 기본 JS 권장
  js.configs.recommended,

  // 2) Next 권장(네가 쓰던 것 유지)
  ...compat.extends("next/core-web-vitals"),

  // 3) 플러그인들
  {
    plugins: {
      import: importPlugin,
      react: reactPlugin,
      "react-hooks": reactHooks,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { window: "readonly", document: "readonly" },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: {
      react: { version: "detect" },
      "import/resolver": {
        // @/* 별칭 쓰는 경우
        node: { extensions: [".js", ".jsx"] },
      },
    },
    rules: {
      // 자주 필요한 것들
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "no-undef": "error",
      "import/no-unresolved": "error", // 경로 오타 탐지
      "import/named": "error",

      // React/Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react/jsx-no-undef": "error",
      "react/prop-types": "off", // JS 프로젝트면 보통 끔

      // Next 권장과 충돌 나면 낮추기
      "@next/next/no-img-element": "off",
    },
  },

  // 4) 무시할 경로
  {
    ignores: [".next/**", "out/**", "node_modules/**", "public/**", "dist/**"],
  },
];
