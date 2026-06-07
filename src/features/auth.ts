import type { FeatureResult, ProjectConfig } from "../types";

export const applyAuth = (root: string, config: ProjectConfig): FeatureResult => {
    const result: FeatureResult = {
        deps: [],
        devDeps: [],
        envVars: {},
    }

    if (config.auth === "none") return result;

    const ext = config.language === "typescript" ? "ts" : "js";
    const isTs = config.language === "typescript";

    result.deps.push("jsonwebtoken", "cookie-parser");
    if (isTs) result.devDeps.push("@types/jsonwebtoken", "@types/cookie-parser");

    result.envVars["JWT_SECRET"] = '"your-secret-key"';
    result.envVars["JWT_EXPIRES_IN"] = '"7d"';

    return result;
}