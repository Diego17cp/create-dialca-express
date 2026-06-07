import type { FeatureResult, ProjectConfig } from "../types"
import { applyAuth } from "./auth"
import { applyDatabase } from "./database"

export const applyFeatures = (root: string, config: ProjectConfig): FeatureResult => {
    const results: FeatureResult[] = [
        applyDatabase(root, config),
        applyAuth(root, config),
    ];
    return results.reduce<FeatureResult>(
        (acc, curr) => ({
            deps: [...acc.deps, ...curr.deps],
            devDeps: [...acc.devDeps, ...curr.devDeps],
            envVars: { ...acc.envVars, ...curr.envVars },
        }),
        { deps: [], devDeps: [], envVars: {} },
    );
}