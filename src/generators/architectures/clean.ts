import type { ProjectConfig } from "../../types";
import { appTemplate, createFile, createGitkeep } from "../base";

export const generateClean = (root: string, config: ProjectConfig): void => {
	const ext = config.language === "typescript" ? "ts" : "js";
	const src = "src";
	const layers = [
		"domain",
		"use-cases",
		"repositories",
		"infrastructure",
		"presentation",
	];
    for (const layer of layers) {
        createGitkeep(root, src, layer);
    }
    createFile(root, `${src}/app.${ext}`, appTemplate(config));
};
