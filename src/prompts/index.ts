import * as p from "@clack/prompts";
import pc from "picocolors";

import type {
	ProjectConfig,
	Language,
	Architecture,
	DbEngine,
	OrmChoice,
	AuthChoice,
} from "../types";

export const collectConfig = async (initial: Partial<ProjectConfig>): Promise<ProjectConfig> => {
	const projectName = await p.text({
		message: "Project name:",
		placeholder: "my-express-app",
        ...(initial.projectName && { initialValue: initial.projectName }),
		validate: (value) => {
			if (!value?.trim()) return "Project name cannot be empty";
			if (!/^[a-z0-9-_]+$/.test(value))
				return "Project name can only contain lowercase letters, numbers, hyphens and underscores";
		},
	});
	if (p.isCancel(projectName)) cancel();

	const language = await p.select<Language>({
		message: "Choose a language:",
        ...(initial.language && { initialValue: initial.language }),
		options: [
			{
				value: "typescript",
				label: "TypeScript",
				hint: "Recommended for better developer experience and maintainability",
			},
			{ value: "javascript", label: "JavaScript" },
		],
	});
	if (p.isCancel(language)) cancel();

	const architecture = await p.select<Architecture>({
		message: "Choose an architecture:",
        ...(initial.architecture && { initialValue: initial.architecture }),
		options: [
			{
				value: "basic",
				label: "Basic",
				hint: "Simple and straightforward structure, good for small projects or beginners",
			},
			{
				value: "screaming",
				label: "Screaming",
				hint: "Organizes code by feature/domain, making it easier to scale and maintain",
			},
			{
				value: "hexagonal",
				label: "Hexagonal",
				hint: "Emphasizes separation of concerns and testability, ideal for complex applications",
			},
			{
				value: "hexagonal-modules",
				label: "Hexagonal with Modules",
				hint: "Combines hexagonal architecture with modularization for better organization in large projects",
			},
			{ value: "clean", label: "Clean" },
		],
	});
	if (p.isCancel(architecture)) cancel();

	const useDb = await p.confirm({
		message: "Do you want to use a database?",
        initialValue: initial.db ? initial.db !== "none" : true,
	});
	if (p.isCancel(useDb)) cancel();

	let db: DbEngine = "none";
	let orm: OrmChoice = "none";

	if (useDb) {
		const dbEngine = await p.select<DbEngine>({
			message: "Choose a database:",
            ...(initial.db && initial.db !== "none" && { initialValue: initial.db }),
			options: [
				{ value: "sqlite", label: "SQLite", hint: "SQL" },
				{ value: "postgresql", label: "PostgreSQL", hint: "SQL" },
				{ value: "mysql", label: "MySQL", hint: "SQL" },
				{ value: "mongodb", label: "MongoDB", hint: "NoSQL" },
			],
		});
		if (p.isCancel(dbEngine)) cancel();
		db = dbEngine as DbEngine;

		const isMongo = db === "mongodb";
		const ormChoice = await p.select<OrmChoice>({
			message: "Choose an ORM/ODM:",
            ...(initial.orm && initial.orm !== "none" && { initialValue: initial.orm }),
			options: isMongo
				? [
						{ value: "mongoose", label: "Mongoose" },
						{ value: "none", label: "None" },
					]
				: [
						{
							value: "prisma",
							label: "Prisma",
							hint: "Recommended for its type safety and developer experience",
						},
						{ value: "none", label: "None" },
					],
		});
		if (p.isCancel(ormChoice)) cancel();
		orm = ormChoice as OrmChoice;
	}

	const authChoice = await p.select<AuthChoice>({
		message: "Choose an authentication method:",
        ...(initial.auth && initial.auth !== "none" && { initialValue: initial.auth }),
		options: [
			{ value: "none", label: "None" },
			{
				value: "jwt",
				label: "JWT (JSON Web Tokens)",
				hint: "jsonwebtoken + cookie-parser",
			},
		],
	});
	if (p.isCancel(authChoice)) cancel();

	p.note(
		[
			`Proyecto:      ${pc.cyan(projectName as string)}`,
			`Lenguaje:      ${pc.cyan(language as string)}`,
			`Arquitectura:  ${pc.cyan(architecture as string)}`,
			`Base de datos: ${pc.cyan(db)}`,
			`ORM/ODM:       ${pc.cyan(orm)}`,
			`Auth:          ${pc.cyan(authChoice as string)}`,
		].join("\n"),
        "Summary of your choices"
	);

    const confirmed = await p.confirm({
        message: "Do you want to proceed with these settings?",
        initialValue: true,
    });
    if (p.isCancel(confirmed) || !confirmed) cancel();

    return {
        projectName: projectName as string,
        language: language as Language,
        architecture: architecture as Architecture,
        db,
        orm,
        auth: authChoice as AuthChoice
    }
};

const cancel = () => {
	p.cancel(pc.red("Operation cancelled."));
	process.exit(0);
};
