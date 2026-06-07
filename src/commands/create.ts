import * as p from "@clack/prompts";
import pc from "picocolors";
import { collectConfig } from "../prompts";
import { generateArchitecture, generateProjectFiles } from "../generators";
import { applyFeatures } from "../features";
import { parseArgs } from "../utils/parseArgs";
import { flagsToPartialConfig } from "../utils/flagsToConfig";
import path from "node:path";
import { showOutro } from "../utils/outro";
import { showHelp } from "../utils/help";
import { printValidationErrors, validateFlags } from "../utils/validateFlags";

export const run = async (): Promise<void> => {
    const flags = parseArgs(process.argv);
	if (flags.help) {
        showHelp();
		process.exit(0);
	}
	if (flags.unknownFlags.length > 0) {
        console.log();
		console.log(pc.red("  ✖ Unknown or invalid flags:"));
		console.log();
		for (const f of flags.unknownFlags) {
            console.log(`  ${pc.red("→")} ${pc.dim(f)}`);
		}
		console.log();
		console.log(pc.dim("  Run with --help to see valid options.\n"));
		process.exit(1);
	}
    const validationErrors = validateFlags(flags);
    if (validationErrors.length > 0) {
        printValidationErrors(validationErrors);
        process.exit(1);
    }
    p.intro(pc.bgCyan(pc.black(" create-dialca-express ")));
	const initial = flagsToPartialConfig(flags);
	const config = await collectConfig(initial);
	const spinner = p.spinner();
	spinner.start("Generating project structure...");
	try {
		const root = path.resolve(process.cwd(), config.projectName);
		generateArchitecture(config);
		const features = applyFeatures(root, config);
		generateProjectFiles(config, features);
		spinner.stop(pc.green("Project structure generated successfully!"));
	} catch (err) {
		spinner.stop(pc.red("Failed to generate project structure."));
		throw err;
	}
	showOutro(config);
};
