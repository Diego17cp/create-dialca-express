import pc from "picocolors";
import type { CliFlags } from "./parseArgs";

interface ValidationError {
	flag: string;
	message: string;
}

export const validateFlags = (flags: CliFlags): ValidationError[] => {
	const errors: ValidationError[] = [];
	if (flags.db === "mongodb" && flags.orm === "prisma") {
		errors.push({
			flag: "--orm prisma",
			message:
				"Prisma is not compatible with MongoDB. Use --orm mongoose instead.",
		});
	}
	const sqlEngines = ["sqlite", "postgresql", "mysql"] as const;
	if (
		flags.db &&
		sqlEngines.includes(flags.db as (typeof sqlEngines)[number]) &&
		flags.orm === "mongoose"
	) {
		errors.push({
			flag: "--orm mongoose",
			message: `Mongoose is not compatible with ${flags.db}. Use --orm prisma instead.`,
		});
	}
	if (
		flags.orm &&
		flags.orm !== "none" &&
		(!flags.db || flags.db === "none")
	) {
		errors.push({
			flag: `--orm ${flags.orm}`,
			message: "Cannot use an ORM without specifying a database (--db).",
		});
	}
	return errors;
};

export const printValidationErrors = (errors: ValidationError[]): void => {
	console.log();
	console.log(pc.red("  ✖ Invalid flag combination:"));
	console.log();
	for (const error of errors) {
		console.log(`  ${pc.dim(error.flag)}`);
		console.log(`  ${pc.red("→")} ${error.message}`);
		console.log();
	}
	console.log(pc.dim("  Run with --help to see valid options.\n"));
};
