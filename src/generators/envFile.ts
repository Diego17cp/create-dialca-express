import type { FeatureResult } from "../types";
import { createFile } from "./base";

export const generateEnvFile = (root: string, features: FeatureResult): void => {
    const baseVars: Record<string, string> = {
        NODE_ENV: '"development"',
        PORT: "3000",
    };

    const allVars = { ...baseVars, ...features.envVars };

    const content = Object.entries(allVars)
        .map(([key, value]) => `${key}=${value}`)
        .join("\n");
    
    createFile(root, ".env", content);
    createFile(root, ".env.example", content);
}