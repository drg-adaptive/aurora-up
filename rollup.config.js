import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import resolve from "rollup-plugin-node-resolve";
import json from "@rollup/plugin-json";
import externals from "rollup-plugin-node-externals";
import cleanup from "rollup-plugin-cleanup";
import size from "rollup-plugin-size";

export default {
  input: "./src/index.ts",
  output: {
    file: "dist/index.js",
    format: "cjs",
    exports: "named",
    banner: `#!/usr/bin/env node\n\n`,
    sourcemap: true
  },
  plugins: [
    externals({
      deps: true,
      devDeps: false,
      peerDeps: false
    }),
    json(),
    typescript({
      objectHashIgnoreUnknownHack: true,
      typescript: require("typescript")
    }),
    commonjs({
      extensions: [".js", ".ts"]
    }),
    resolve({
      preferBuiltins: true,
      extensions: [".js", ".ts"]
    }),
    cleanup(),
    size({})
  ]
};
