import type { FeatureResult, ProjectConfig } from "../types";
import { createFile } from "./base";

export const generatePackageJson = (
	root: string,
	config: ProjectConfig,
	features: FeatureResult,
): void => {
	const isTs = config.language === "typescript";
	// Latest deps as of June 2026
	const baseDeps: Record<string, string> = {
		express: "5.2.1",
		dotenv: "17.4.2",
	};
	const baseDevDeps: Record<string, string> = isTs
		? {
				typescript: "6.0.3",
				tsx: "4.22.4",
				"@types/node": "25.9.2",
				"@types/express": "5.0.6",
			}
		: {
				nodemon: "3.1.14",
			};

	const featureDeps = Object.fromEntries(
		features.deps.map((dep) => [dep, "latest"]),
	);
	const featureDevDeps = Object.fromEntries(
		features.devDeps.map((dep) => [dep, "latest"]),
	);
	const pkg = {
		name: config.projectName,
		version: "0.1.0",
		type: "module",
		scripts: isTs
			? {
					dev: "tsx watch src/server.ts",
					build: "tsc",
					start: "node dist/server.js",
				}
			: {
					dev: "nodemon src/server.js",
					start: "node src/server.js",
				},
		dependencies: {
			...baseDeps,
			...featureDeps,
		},
		devDependencies: {
			...baseDevDeps,
			...featureDevDeps,
		},
	};
    createFile(root, "package.json", JSON.stringify(pkg, null, 2));
};
