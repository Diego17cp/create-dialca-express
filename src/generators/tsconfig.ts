import type { ProjectConfig } from "../types";
import { createFile } from "./base";

export const generateTsConfig = (root: string, config: ProjectConfig): void => {
    if (config.language !== "typescript") return;
    const tsconfig = {
        compilerOptions: {
            target: "ES2022",
            module: "ESNext",
            moduleResolution: "bundler",
            outDir: "./dist",
            rootDir: "./src",
            strict: true,
            esModuleInterop: true,
            skipLibCheck: true,
            resolveJsonModule: true,
        },
        include: ["src/**/*"],
        exclude: ["node_modules", "dist"],
    };
    createFile(root, "tsconfig.json", JSON.stringify(tsconfig, null, 2));
}