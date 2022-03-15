import { defineConfig } from "tsup";

export default defineConfig((options) => ({
    entry: ["src/index.ts"],
    outDir: "_server",
    target: "node14",
    format: ["cjs"],
    clean: true,
    splitting: false,
    minify: !options.watch,
    // dts: options.watch ? false : { resolve: true },
}));
