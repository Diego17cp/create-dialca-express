import type { ProjectConfig } from "../../types";
import { appTemplate, createFile, createGitkeep } from "../base";

export const generateHexagonalModules = (
	root: string,
	config: ProjectConfig,
): void => {
	const ext = config.language === "typescript" ? "ts" : "js";
	const useAuth = config.auth !== "none";
	const src = "src";

	const modules = [...(useAuth ? ["auth"] : []), "users"];
	const layers = ["domain", "application", "infrastructure", "interfaces"];
	for (const mod of modules) {
		for (const layer of layers) {
			createGitkeep(root, src, "modules", mod, layer);
		}
	}
	createGitkeep(root, src, "core");
	createGitkeep(root, src, "shared");

	createFile(root, `${src}/app/app.${ext}`, appTemplate(config));
};
