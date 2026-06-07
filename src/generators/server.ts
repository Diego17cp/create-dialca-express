import type { ProjectConfig } from "../types";
import { createFile } from "./base";

export const generateServer = (root: string, config: ProjectConfig): void => {
	const ext = config.language === "typescript" ? "ts" : "js";
	const isTs = config.language === "typescript";
	const isModular =
		config.architecture === "hexagonal-modules" ||
		config.architecture === "screaming";

	createFile(
		root,
		`src/server.${ext}`,
		serverTemplate(config, isTs, isModular),
	);
};
const serverTemplate = (
	config: ProjectConfig,
	isTs: boolean,
	isModular: boolean,
): string => {
	const lines: string[] = [];

	lines.push(
		`import app from ${isModular ? `"./app/app` : `"./app`}.${isTs ? 'ts"' : 'js"'};`,
	);
	lines.push(`import 'dotenv/config';`);
	lines.push("");
	if (isTs)
		lines.push(`const PORT: number = Number(process.env.PORT) || 3000;`);
	else lines.push(`const PORT = Number(process.env.PORT) || 3000;`);
	lines.push("");
	lines.push("app.listen(PORT, () => {");
	lines.push("    console.log(`Server is running on port ${PORT}`);");
	lines.push("});");
	return lines.join("\n");
};
