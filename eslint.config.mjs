import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  { ignores: [".next/**", "out/**", "node_modules/**", "public/**", "dist/**"] },
  { ...js.configs.recommended, files: ["**/*.{js,jsx}"] },
  ...compat.extends("next/core-web-vitals"),
  {
    files: ["**/*.{js,jsx}"],
    plugins: { import: importPlugin },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { window: "readonly", document: "readonly" },
    },
    settings: {
      "import/resolver": {
        node: { extensions: [".js", ".jsx"] },
<<<<<<< HEAD
        alias: { map: [["@", "./"]], extensions: [".js", ".jsx"] },
=======
        alias: { map: [["@", "./src"]], extensions: [".js", ".jsx"] },
>>>>>>> Dev
      },
    },
    rules: {
      "import/no-unresolved": "error",
      "import/named": "error",
      "@next/next/no-img-element": "off",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "no-undef": "error",
    },
  },
];

export default eslintConfig;
