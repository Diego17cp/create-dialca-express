import { run } from "./commands/create";

run().catch((err) => {
    console.error("An error occurred:", err);
    process.exit(1);
})