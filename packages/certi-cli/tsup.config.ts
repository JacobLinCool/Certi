import { defineConfig } from "tsup";

export default defineConfig((options) => ({
    entry: ["src/index.ts"],
    outDir: "dist",
    target: "node14",
    format: ["cjs"],
    clean: true,
    splitting: false,
}));
