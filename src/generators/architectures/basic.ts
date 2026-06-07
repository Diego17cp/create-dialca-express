import type { ProjectConfig } from "../../types";
import { appTemplate, createFile, createGitkeep } from "../base";

export const generateBasic = (root: string, config: ProjectConfig): void => {
    const ext = config.language === "typescript" ? "ts" : "js";
    const src = "src";
    const dirs = [
        "controllers",
        "services",
        "routes",
        "middlewares",
        "config",
        "utils",
    ];
    for (const dir of dirs) {
        createGitkeep(root, src, dir);
    }
    createFile(root, `${src}/app.${ext}`, appTemplate(config));
};