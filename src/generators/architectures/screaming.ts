import type { ProjectConfig } from "../../types";
import { appTemplate, createFile, createGitkeep } from "../base";

export const generateScreaming = (
	root: string,
	config: ProjectConfig,
): void => {
	const ext = config.language === "typescript" ? "ts" : "js";
	const useAuth = config.auth !== "none";
	const useDb = config.db !== "none";
	const useTs = config.language === "typescript";
	const src = "src";
	createGitkeep(root, src, "core");
	createGitkeep(root, src, "shared", "middlewares");
	createGitkeep(root, src, "shared", "utils");
	createGitkeep(root, src, "shared", "config");

	const modules = [...(useAuth ? ["auth"] : []), "users"];
	const moduleDirs = [
		...(useDb ? ["repositories"] : []),
		...(useTs ? ["types"] : []),
		"controllers",
		"services",
		"routes",
	];

    for (const mod of modules) {
        for (const dir of moduleDirs) {
            createGitkeep(root, src, "modules", mod, dir);
        }
    }

    createFile(root, `${src}/app/app.${ext}`, appTemplate(config));
};
