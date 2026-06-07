import type { ProjectConfig } from "../../types";
import { appTemplate, createFile, createGitkeep } from "../base";

export const generateHexagonal = (root: string, config: ProjectConfig): void => {
    const ext = config.language === "typescript" ? "ts" : "js";
    const src = "src";

    const layers = ["domain", "application", "infrastructure", "interfaces"];
    for (const layer of layers) {
        createGitkeep(root, src, layer);
    }
    createFile(root, `${src}/app/app.${ext}`, appTemplate(config));
}