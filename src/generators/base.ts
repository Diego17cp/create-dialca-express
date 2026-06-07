import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { ProjectConfig } from "../types";

export const createDir = (base: string, ...parts: string[]): void => {
    const fullPath = path.join(base, ...parts);
    mkdirSync(fullPath, { recursive: true });   
}
export const createFile = (base: string, filePath: string, content: string): void => {
    const fullPath = path.join(base, filePath);
    mkdirSync(path.dirname(fullPath), { recursive: true });
    writeFileSync(fullPath, content, "utf-8");
}
export const createGitkeep = (base: string, ...parts: string[]): void => {
    createFile(base, path.join(...parts, ".gitkeep"), "");
}
export const appTemplate = (config: ProjectConfig): string => {
	const isTs = config.language === "typescript";
	const useAuth = config.auth !== "none";
	return `import express${isTs ? ", { Application }" : ""} from "express";
import 'dotenv/config';
    
const app${isTs ? ": Application" : ""} = express();
    
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
    
app.use(helmet());
    
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
${useAuth ? "app.use(cookieParser());" : ""}

app.get("/health", (_, res) => {
    res.json({ status: "ok" });
});

export default app;
    `;
};