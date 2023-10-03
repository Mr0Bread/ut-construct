import { defineConfig } from "tsup";
import { execSync } from 'child_process'

export default defineConfig((opts) => ({
  sourcemap: true,
  dts: true,
  format: ["esm", "cjs"],
  async onSuccess() {
    // emit dts and sourcemaps to enable jump to definition
    execSync("pnpm tsc --project tsconfig.sourcemap.json");
  },
  entry: ["./src/index.tsx"],
  clean: !opts.watch,
  esbuildOptions: (option) => {
    option.banner = {
      js: `"use client";`,
    };
  },
}));
