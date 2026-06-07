export type Language = "typescript" | "javascript";

export type Architecture = 
    | "basic"
    | "screaming"
    | "hexagonal"
    | "hexagonal-modules"
    | "clean";

export type DbEngine =
    | "none"
    | "sqlite"
    | "postgresql"
    | "mysql"
    | "mongodb";

export type OrmChoice = "prisma" | "mongoose" | "none";

export type AuthChoice = "jwt" | "none";

export interface ProjectConfig {
    projectName: string;
    language: Language;
    architecture: Architecture;
    db: DbEngine;
    orm: OrmChoice;
    auth: AuthChoice;
}

export interface FeatureResult {
	deps: string[];
	devDeps: string[];
	envVars: Record<string, string>;
}