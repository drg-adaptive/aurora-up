const commonjs = require("rollup-plugin-commonjs");
const typescript = require("rollup-plugin-typescript2");
const resolve = require("rollup-plugin-node-resolve");
import json from "@rollup/plugin-json";

module.exports = {
  input: "./src/index.ts",
  output: {
    file: "dist/index.js",
    format: "cjs",
    exports: "named",
    banner: `#!/usr/bin/env node\n\n`
  },
  plugins: [
    json(),
    // @ts-ignore
    typescript({
      lib: ["es5", "es6"],
      target: "es6",
      typescript: require("typescript"),
      module: "CommonJS"
    }),
    // @ts-ignore
    commonjs({
      extensions: [".js", ".ts"]
    }),
    // @ts-ignore
    resolve({
      preferBuiltins: true,
      extensions: [".js", ".ts"]
    })
  ],
  external: ["aws-sdk", "listr"]
};
