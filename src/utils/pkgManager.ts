export type PkgManager = "npm" | "yarn" | "pnpm" | "bun";

export const detectPkgManager = (): PkgManager => {
    const agent = process.env.npm_config_user_agent ?? "";
    if (agent.includes("yarn")) return "yarn";
    if (agent.includes("pnpm")) return "pnpm";
    if (agent.includes("bun")) return "bun";
    return "npm";
}