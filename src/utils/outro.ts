import * as p from "@clack/prompts";
import pc from "picocolors";
import type { ProjectConfig } from "../types";
import { detectPkgManager } from "./pkgManager";

export const showOutro = (config: ProjectConfig): void => {
	const pm = detectPkgManager();
	const runCmd = pm === "npm" ? "npm run dev" : `${pm} dev`;
	const prismaCmd =
		pm === "npm" ? "npx prisma migrate dev" : `${pm} prisma migrate dev`;

	const lines: string[] = [
		`${pc.bold("cd")} ${config.projectName}`,
		`${pc.bold(`${pm} install`)}`,
		`${pc.bold(runCmd)}`,
	];
	if (config.orm === "prisma") {
		lines.push("");
		lines.push(
			`${pc.dim("# After setting up your DATABASE_URL in .env, configure the database connection and schema, then run:")}`,
		);
		lines.push(
			`${pc.bold(prismaCmd)}`,
		);
	}
	if (config.orm === "mongoose") {
		lines.push("");
		lines.push(
			`${pc.dim("# Set up your MONGODB_URI in .env, before start the server")}`,
		);
	}
	p.note(lines.join("\n"), "Next steps");
	p.outro(
		`${pc.green("Project ready. Happy coding!")} ${pc.dim("If you have any issues or feedback, please check https://github.com/dialca/create-dialca-express.")}`,
	);
};
