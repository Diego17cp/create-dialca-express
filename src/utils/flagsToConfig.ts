import type { ProjectConfig } from "../types";
import type { CliFlags } from "./parseArgs";

export const flagsToPartialConfig = (flags: CliFlags): Partial<ProjectConfig> => {
    return {
        ...(flags.projectName && { projectName: flags.projectName }),
        ...(flags.language && { language: flags.language }),
        ...(flags.architecture && { architecture: flags.architecture }),
        ...(flags.db && { db: flags.db }),
        ...(flags.orm && { orm: flags.orm }),
        ...(flags.auth && { auth: flags.auth }),
    }
}