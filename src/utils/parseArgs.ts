import type {
	Architecture,
	AuthChoice,
	DbEngine,
	Language,
	OrmChoice,
} from "../types";

export interface CliFlags {
	projectName?: string;
	language?: Language;
	architecture?: Architecture;
	db?: DbEngine;
	orm?: OrmChoice;
	auth?: AuthChoice;
	help: boolean;
	unknownFlags: string[];
}
const ARCHITECTURES: Architecture[] = [
	"basic",
	"screaming",
	"hexagonal",
	"hexagonal-modules",
	"clean",
];
const DB_ENGINES: DbEngine[] = [
	"none",
	"sqlite",
	"postgresql",
	"mysql",
	"mongodb",
];
const ORM_CHOICES: OrmChoice[] = ["none", "prisma", "mongoose"];

export const parseArgs = (argv: string[]): CliFlags => {
	const args = argv.slice(2);
	const flags: CliFlags = {
		help: false,
		unknownFlags: [],
	};

	for (let i = 0; i < args.length; i++) {
		const arg = args[i]!;
		const next = args[i + 1];

		if (!arg.startsWith("-") && !flags.projectName) {
			flags.projectName = arg;
			continue;
		}
		switch (arg) {
			case "--help":
			case "--h":
				flags.help = true;
				break;
			case "--ts":
			case "--typescript":
				flags.language = "typescript";
				break;
			case "--js":
			case "--javascript":
				flags.language = "javascript";
				break;

			case "--arch":
				if (next && ARCHITECTURES.includes(next as Architecture)) {
					flags.architecture = next as Architecture;
					i++;
				} else {
					flags.unknownFlags.push(
						`--arch ${next ?? ""} (valid: ${ARCHITECTURES.join(", ")})`,
					);
					if (next && next.startsWith("--")) continue;
					i++;
				}
				break;
			case "--db":
				if (next && DB_ENGINES.includes(next as DbEngine)) {
					flags.db = next as DbEngine;
					i++;
				} else {
					flags.unknownFlags.push(
						`--db ${next ?? ""} (valid: ${DB_ENGINES.join(", ")})`,
					);
					if (next && next.startsWith("--")) continue;
					i++;
				}
				break;
			case "--orm":
				if (next && ORM_CHOICES.includes(next as OrmChoice)) {
					flags.orm = next as OrmChoice;
					i++;
				} else {
					flags.unknownFlags.push(
						`--orm ${next ?? ""} (valid: ${ORM_CHOICES.join(", ")})`,
					);
					if (next && next.startsWith("--")) continue;
					i++;
				}
				break;
			case "--auth":
				if (next && (next === "jwt" || next === "none")) {
					flags.auth = next as AuthChoice;
					i++;
				} else {
					flags.unknownFlags.push(
						`--auth ${next ?? ""} (valid: jwt, none)`,
					);
					if (next && next.startsWith("--")) continue;
					i++;
				}
				break;
			default:
				if (arg.startsWith("--")) {
					flags.unknownFlags.push(arg);
				}
				break;
		}
	}
	return flags;
};
