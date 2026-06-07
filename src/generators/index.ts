import path from "node:path";
import type { Architecture, FeatureResult, ProjectConfig } from "../types";
import { existsSync, mkdirSync } from "node:fs";
import { generateBasic } from "./architectures/basic";
import { generateScreaming } from "./architectures/screaming";
import { generateHexagonal } from "./architectures/hexagonal";
import { generateHexagonalModules } from "./architectures/hexagonal-modules";
import { generateClean } from "./architectures/clean";
import { generatePackageJson } from "./packageJson";
import { generateEnvFile } from "./envFile";
import { generateServer } from "./server";
import { generateTsConfig } from "./tsconfig";

type ArchitectureGenerator = (root: string, config: ProjectConfig) => void;

const map: Record<Architecture, ArchitectureGenerator> = {
    basic: generateBasic,
    screaming: generateScreaming,
    hexagonal: generateHexagonal,
    "hexagonal-modules": generateHexagonalModules,
    clean: generateClean,
};

export const generateArchitecture = (config: ProjectConfig): void => {
    const root = path.resolve(process.cwd(), config.projectName);
    if (existsSync(root)) throw new Error(`Directory ${config.projectName} already exists.`);
    mkdirSync(root, { recursive: true });
    map[config.architecture](root, config);
}
export const generateProjectFiles = (
    config: ProjectConfig,
    features: FeatureResult,
) => {
    const root = path.resolve(process.cwd(), config.projectName);
    generatePackageJson(root, config, features);
    generateEnvFile(root, features);
    generateServer(root, config);
    generateTsConfig(root, config);   
}