import { createFile } from "../generators/base";
import type { FeatureResult, ProjectConfig } from "../types";

type SqlEngine = "postgresql" | "mysql" | "sqlite";

export const applyDatabase = (
	root: string,
	config: ProjectConfig,
): FeatureResult => {
	const result: FeatureResult = {
		deps: [],
		devDeps: [],
		envVars: {},
	};

	if (config.db === "none") return result;

	const ext = config.language === "typescript" ? "ts" : "js";

	if (config.orm === "prisma") {
		result.deps.push("@prisma/client");
		result.devDeps.push("prisma");

		const providerMap: Record<SqlEngine, string> = {
			postgresql: "postgresql",
			mysql: "mysql",
			sqlite: "sqlite",
		};
		const driverMap: Record<SqlEngine, string> = {
			postgresql: "@prisma/adapter-pg",
			mysql: "@prisma/adapter-mariadb",
			sqlite: "@prisma/adapter-better-sqlite3",
		};

        const provider = providerMap[config.db as SqlEngine];
        const driver = driverMap[config.db as SqlEngine];

		createFile(
			root,
			"prisma/schema.prisma",
			prismaSchema(provider),
		);
		createFile(root, "prisma.config.ts", prismaConfig());
		result.envVars["DATABASE_URL"] = '""';
		result.deps.push(driver);
	}
	if (config.orm === "mongoose") {
		result.deps.push("mongoose");
		if (config.language === "typescript")
			result.devDeps.push("@types/mongoose");
		createFile(
			root,
			`src/config/database.${ext}`,
			mongooseConfig(config.language === "typescript"),
		);
		result.envVars["MONGODB_URI"] = '""';
	}
	return result;
};
// Aligned with prisma 7 syntax
const prismaSchema = (provider: string): string => {
	return `generator client {
    provider = "prisma-client"
    output = "../generated/prisma"
}
datasource db {
    provider = "${provider}"
}`;
};
const prismaConfig = (): string => {
	return `import { defineConfig, env } from "prisma/config";
    
export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
    },
    datasource: {
        url: env("DATABASE_URL"),
    }
})
    `;
};
const mongooseConfig = (isTs: boolean): string => {
	return isTs
		? `import mongoose from "mongoose";
export const connectDB = async (): Promise<void> => {
    const uri = process.env.MONGODB_URI || "";
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
};
    `
	: `import mongoose from "mongoose";
export const connectDB = async () => {
    const uri = process.env.MONGODB_URI || "";
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
}
`;
};
