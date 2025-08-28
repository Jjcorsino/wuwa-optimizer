import antfu from "@antfu/eslint-config";
import baseConfig from "./base.js";

/**
 * A custom ESLint configuration for Nuxt.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export default antfu({
  // Disable jsonc and yaml support
  formatters: true,
  jsonc: false,
  stylistic: {
    indent: 2,
    quotes: "double",
  },
  vue: {
    overrides: {
      "vue/max-attributes-per-line": [
        "error",
        {
          singleline: {
            max: 1,
          },
          multiline: {
            max: 1,
          },
        },
      ],
    },
  },
}).append(baseConfig);
