#!/usr/bin/env node

// src/commands/create.ts
import * as p3 from "@clack/prompts";
import pc5 from "picocolors";

// src/prompts/index.ts
import * as p from "@clack/prompts";
import pc from "picocolors";
var collectConfig = async (initial) => {
  const projectName = await p.text({
    message: "Project name:",
    placeholder: "my-express-app",
    ...initial.projectName && { initialValue: initial.projectName },
    validate: (value) => {
      if (!value?.trim()) return "Project name cannot be empty";
      if (!/^[a-z0-9-_]+$/.test(value))
        return "Project name can only contain lowercase letters, numbers, hyphens and underscores";
    }
  });
  if (p.isCancel(projectName)) cancel2();
  const language = await p.select({
    message: "Choose a language:",
    ...initial.language && { initialValue: initial.language },
    options: [
      {
        value: "typescript",
        label: "TypeScript",
        hint: "Recommended for better developer experience and maintainability"
      },
      { value: "javascript", label: "JavaScript" }
    ]
  });
  if (p.isCancel(language)) cancel2();
  const architecture = await p.select({
    message: "Choose an architecture:",
    ...initial.architecture && { initialValue: initial.architecture },
    options: [
      {
        value: "basic",
        label: "Basic",
        hint: "Simple and straightforward structure, good for small projects or beginners"
      },
      {
        value: "screaming",
        label: "Screaming",
        hint: "Organizes code by feature/domain, making it easier to scale and maintain"
      },
      {
        value: "hexagonal",
        label: "Hexagonal",
        hint: "Emphasizes separation of concerns and testability, ideal for complex applications"
      },
      {
        value: "hexagonal-modules",
        label: "Hexagonal with Modules",
        hint: "Combines hexagonal architecture with modularization for better organization in large projects"
      },
      { value: "clean", label: "Clean" }
    ]
  });
  if (p.isCancel(architecture)) cancel2();
  const useDb = await p.confirm({
    message: "Do you want to use a database?",
    initialValue: initial.db ? initial.db !== "none" : true
  });
  if (p.isCancel(useDb)) cancel2();
  let db = "none";
  let orm = "none";
  if (useDb) {
    const dbEngine = await p.select({
      message: "Choose a database:",
      ...initial.db && initial.db !== "none" && { initialValue: initial.db },
      options: [
        { value: "sqlite", label: "SQLite", hint: "SQL" },
        { value: "postgresql", label: "PostgreSQL", hint: "SQL" },
        { value: "mysql", label: "MySQL", hint: "SQL" },
        { value: "mongodb", label: "MongoDB", hint: "NoSQL" }
      ]
    });
    if (p.isCancel(dbEngine)) cancel2();
    db = dbEngine;
    const isMongo = db === "mongodb";
    const ormChoice = await p.select({
      message: "Choose an ORM/ODM:",
      ...initial.orm && initial.orm !== "none" && { initialValue: initial.orm },
      options: isMongo ? [
        { value: "mongoose", label: "Mongoose" },
        { value: "none", label: "None" }
      ] : [
        {
          value: "prisma",
          label: "Prisma",
          hint: "Recommended for its type safety and developer experience"
        },
        { value: "none", label: "None" }
      ]
    });
    if (p.isCancel(ormChoice)) cancel2();
    orm = ormChoice;
  }
  const authChoice = await p.select({
    message: "Choose an authentication method:",
    ...initial.auth && initial.auth !== "none" && { initialValue: initial.auth },
    options: [
      { value: "none", label: "None" },
      {
        value: "jwt",
        label: "JWT (JSON Web Tokens)",
        hint: "jsonwebtoken + cookie-parser"
      }
    ]
  });
  if (p.isCancel(authChoice)) cancel2();
  p.note(
    [
      `Proyecto:      ${pc.cyan(projectName)}`,
      `Lenguaje:      ${pc.cyan(language)}`,
      `Arquitectura:  ${pc.cyan(architecture)}`,
      `Base de datos: ${pc.cyan(db)}`,
      `ORM/ODM:       ${pc.cyan(orm)}`,
      `Auth:          ${pc.cyan(authChoice)}`
    ].join("\n"),
    "Summary of your choices"
  );
  const confirmed = await p.confirm({
    message: "Do you want to proceed with these settings?",
    initialValue: true
  });
  if (p.isCancel(confirmed) || !confirmed) cancel2();
  return {
    projectName,
    language,
    architecture,
    db,
    orm,
    auth: authChoice
  };
};
var cancel2 = () => {
  p.cancel(pc.red("Operation cancelled."));
  process.exit(0);
};

// src/generators/index.ts
import path2 from "path";
import { existsSync, mkdirSync as mkdirSync2 } from "fs";

// src/generators/base.ts
import { mkdirSync, writeFileSync } from "fs";
import path from "path";
var createFile = (base, filePath, content) => {
  const fullPath = path.join(base, filePath);
  mkdirSync(path.dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, content, "utf-8");
};
var createGitkeep = (base, ...parts) => {
  createFile(base, path.join(...parts, ".gitkeep"), "");
};
var appTemplate = (config) => {
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

// src/generators/architectures/basic.ts
var generateBasic = (root, config) => {
  const ext = config.language === "typescript" ? "ts" : "js";
  const src = "src";
  const dirs = [
    "controllers",
    "services",
    "routes",
    "middlewares",
    "config",
    "utils"
  ];
  for (const dir of dirs) {
    createGitkeep(root, src, dir);
  }
  createFile(root, `${src}/app.${ext}`, appTemplate(config));
};

// src/generators/architectures/screaming.ts
var generateScreaming = (root, config) => {
  const ext = config.language === "typescript" ? "ts" : "js";
  const useAuth = config.auth !== "none";
  const useDb = config.db !== "none";
  const useTs = config.language === "typescript";
  const src = "src";
  createGitkeep(root, src, "core");
  createGitkeep(root, src, "shared", "middlewares");
  createGitkeep(root, src, "shared", "utils");
  createGitkeep(root, src, "shared", "config");
  const modules = [...useAuth ? ["auth"] : [], "users"];
  const moduleDirs = [
    ...useDb ? ["repositories"] : [],
    ...useTs ? ["types"] : [],
    "controllers",
    "services",
    "routes"
  ];
  for (const mod of modules) {
    for (const dir of moduleDirs) {
      createGitkeep(root, src, "modules", mod, dir);
    }
  }
  createFile(root, `${src}/app/app.${ext}`, appTemplate(config));
};

// src/generators/architectures/hexagonal.ts
var generateHexagonal = (root, config) => {
  const ext = config.language === "typescript" ? "ts" : "js";
  const src = "src";
  const layers = ["domain", "application", "infrastructure", "interfaces"];
  for (const layer of layers) {
    createGitkeep(root, src, layer);
  }
  createFile(root, `${src}/app/app.${ext}`, appTemplate(config));
};

// src/generators/architectures/hexagonal-modules.ts
var generateHexagonalModules = (root, config) => {
  const ext = config.language === "typescript" ? "ts" : "js";
  const useAuth = config.auth !== "none";
  const src = "src";
  const modules = [...useAuth ? ["auth"] : [], "users"];
  const layers = ["domain", "application", "infrastructure", "interfaces"];
  for (const mod of modules) {
    for (const layer of layers) {
      createGitkeep(root, src, "modules", mod, layer);
    }
  }
  createGitkeep(root, src, "core");
  createGitkeep(root, src, "shared");
  createFile(root, `${src}/app/app.${ext}`, appTemplate(config));
};

// src/generators/architectures/clean.ts
var generateClean = (root, config) => {
  const ext = config.language === "typescript" ? "ts" : "js";
  const src = "src";
  const layers = [
    "domain",
    "use-cases",
    "repositories",
    "infrastructure",
    "presentation"
  ];
  for (const layer of layers) {
    createGitkeep(root, src, layer);
  }
  createFile(root, `${src}/app.${ext}`, appTemplate(config));
};

// src/generators/packageJson.ts
var generatePackageJson = (root, config, features) => {
  const isTs = config.language === "typescript";
  const baseDeps = {
    express: "5.2.1",
    dotenv: "17.4.2"
  };
  const baseDevDeps = isTs ? {
    typescript: "6.0.3",
    tsx: "4.22.4",
    "@types/node": "25.9.2",
    "@types/express": "5.0.6"
  } : {
    nodemon: "3.1.14"
  };
  const featureDeps = Object.fromEntries(
    features.deps.map((dep) => [dep, "latest"])
  );
  const featureDevDeps = Object.fromEntries(
    features.devDeps.map((dep) => [dep, "latest"])
  );
  const pkg = {
    name: config.projectName,
    version: "0.1.0",
    type: "module",
    scripts: isTs ? {
      dev: "tsx watch src/server.ts",
      build: "tsc",
      start: "node dist/server.js"
    } : {
      dev: "nodemon src/server.js",
      start: "node src/server.js"
    },
    dependencies: {
      ...baseDeps,
      ...featureDeps
    },
    devDependencies: {
      ...baseDevDeps,
      ...featureDevDeps
    }
  };
  createFile(root, "package.json", JSON.stringify(pkg, null, 2));
};

// src/generators/envFile.ts
var generateEnvFile = (root, features) => {
  const baseVars = {
    NODE_ENV: '"development"',
    PORT: "3000"
  };
  const allVars = { ...baseVars, ...features.envVars };
  const content = Object.entries(allVars).map(([key, value]) => `${key}=${value}`).join("\n");
  createFile(root, ".env", content);
  createFile(root, ".env.example", content);
};

// src/generators/server.ts
var generateServer = (root, config) => {
  const ext = config.language === "typescript" ? "ts" : "js";
  const isTs = config.language === "typescript";
  const isModular = config.architecture === "hexagonal-modules" || config.architecture === "screaming";
  createFile(
    root,
    `src/server.${ext}`,
    serverTemplate(config, isTs, isModular)
  );
};
var serverTemplate = (config, isTs, isModular) => {
  const lines = [];
  lines.push(
    `import app from ${isModular ? `"./app/app` : `"./app`}.${isTs ? 'ts"' : 'js"'};`
  );
  lines.push(`import 'dotenv/config';`);
  lines.push("");
  if (isTs)
    lines.push(`const PORT: number = Number(process.env.PORT) || 3000;`);
  else lines.push(`const PORT = Number(process.env.PORT) || 3000;`);
  lines.push("");
  lines.push("app.listen(PORT, () => {");
  lines.push("    console.log(`Server is running on port ${PORT}`);");
  lines.push("});");
  return lines.join("\n");
};

// src/generators/tsconfig.ts
var generateTsConfig = (root, config) => {
  if (config.language !== "typescript") return;
  const tsconfig = {
    compilerOptions: {
      target: "ES2022",
      module: "ESNext",
      moduleResolution: "bundler",
      outDir: "./dist",
      rootDir: "./src",
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      resolveJsonModule: true
    },
    include: ["src/**/*"],
    exclude: ["node_modules", "dist"]
  };
  createFile(root, "tsconfig.json", JSON.stringify(tsconfig, null, 2));
};

// src/generators/index.ts
var map = {
  basic: generateBasic,
  screaming: generateScreaming,
  hexagonal: generateHexagonal,
  "hexagonal-modules": generateHexagonalModules,
  clean: generateClean
};
var generateArchitecture = (config) => {
  const root = path2.resolve(process.cwd(), config.projectName);
  if (existsSync(root)) throw new Error(`Directory ${config.projectName} already exists.`);
  mkdirSync2(root, { recursive: true });
  map[config.architecture](root, config);
};
var generateProjectFiles = (config, features) => {
  const root = path2.resolve(process.cwd(), config.projectName);
  generatePackageJson(root, config, features);
  generateEnvFile(root, features);
  generateServer(root, config);
  generateTsConfig(root, config);
};

// src/features/auth.ts
var applyAuth = (root, config) => {
  const result = {
    deps: [],
    devDeps: [],
    envVars: {}
  };
  if (config.auth === "none") return result;
  const ext = config.language === "typescript" ? "ts" : "js";
  const isTs = config.language === "typescript";
  result.deps.push("jsonwebtoken", "cookie-parser");
  if (isTs) result.devDeps.push("@types/jsonwebtoken", "@types/cookie-parser");
  result.envVars["JWT_SECRET"] = '"your-secret-key"';
  result.envVars["JWT_EXPIRES_IN"] = '"7d"';
  return result;
};

// src/features/database.ts
var applyDatabase = (root, config) => {
  const result = {
    deps: [],
    devDeps: [],
    envVars: {}
  };
  if (config.db === "none") return result;
  const ext = config.language === "typescript" ? "ts" : "js";
  if (config.orm === "prisma") {
    result.deps.push("@prisma/client");
    result.devDeps.push("prisma");
    const providerMap = {
      postgresql: "postgresql",
      mysql: "mysql",
      sqlite: "sqlite"
    };
    const driverMap = {
      postgresql: "@prisma/adapter-pg",
      mysql: "@prisma/adapter-mariadb",
      sqlite: "@prisma/adapter-better-sqlite3"
    };
    const provider = providerMap[config.db];
    const driver = driverMap[config.db];
    createFile(
      root,
      "prisma/schema.prisma",
      prismaSchema(provider)
    );
    createFile(root, "prisma.config.ts", prismaConfig());
    result.envVars["DATABASE_URL"] = '""';
    result.deps.push(driver);
  }
  if (config.orm === "mongoose") {
    result.deps.push("mongoose");
    if (config.language === "typescript")
      result.devDeps.push("@types/mongoose");
    createFile(
      root,
      `src/config/database.${ext}`,
      mongooseConfig(config.language === "typescript")
    );
    result.envVars["MONGODB_URI"] = '""';
  }
  return result;
};
var prismaSchema = (provider) => {
  return `generator client {
    provider = "prisma-client"
    output = "../generated/prisma"
}
datasource db {
    provider = "${provider}"
}`;
};
var prismaConfig = () => {
  return `import { defineConfig, env } from "prisma/config";
    
export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
    },
    datasource: {
        url: env("DATABASE_URL"),
    }
})
    `;
};
var mongooseConfig = (isTs) => {
  return isTs ? `import mongoose from "mongoose";
export const connectDB = async (): Promise<void> => {
    const uri = process.env.MONGODB_URI || "";
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
};
    ` : `import mongoose from "mongoose";
export const connectDB = async () => {
    const uri = process.env.MONGODB_URI || "";
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
}
`;
};

// src/features/index.ts
var applyFeatures = (root, config) => {
  const results = [
    applyDatabase(root, config),
    applyAuth(root, config)
  ];
  return results.reduce(
    (acc, curr) => ({
      deps: [...acc.deps, ...curr.deps],
      devDeps: [...acc.devDeps, ...curr.devDeps],
      envVars: { ...acc.envVars, ...curr.envVars }
    }),
    { deps: [], devDeps: [], envVars: {} }
  );
};

// src/utils/parseArgs.ts
var ARCHITECTURES = [
  "basic",
  "screaming",
  "hexagonal",
  "hexagonal-modules",
  "clean"
];
var DB_ENGINES = [
  "none",
  "sqlite",
  "postgresql",
  "mysql",
  "mongodb"
];
var ORM_CHOICES = ["none", "prisma", "mongoose"];
var parseArgs = (argv) => {
  const args = argv.slice(2);
  const flags = {
    help: false,
    unknownFlags: []
  };
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
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
        if (next && ARCHITECTURES.includes(next)) {
          flags.architecture = next;
          i++;
        } else {
          flags.unknownFlags.push(
            `--arch ${next ?? ""} (valid: ${ARCHITECTURES.join(", ")})`
          );
          if (next && next.startsWith("--")) continue;
          i++;
        }
        break;
      case "--db":
        if (next && DB_ENGINES.includes(next)) {
          flags.db = next;
          i++;
        } else {
          flags.unknownFlags.push(
            `--db ${next ?? ""} (valid: ${DB_ENGINES.join(", ")})`
          );
          if (next && next.startsWith("--")) continue;
          i++;
        }
        break;
      case "--orm":
        if (next && ORM_CHOICES.includes(next)) {
          flags.orm = next;
          i++;
        } else {
          flags.unknownFlags.push(
            `--orm ${next ?? ""} (valid: ${ORM_CHOICES.join(", ")})`
          );
          if (next && next.startsWith("--")) continue;
          i++;
        }
        break;
      case "--auth":
        if (next && (next === "jwt" || next === "none")) {
          flags.auth = next;
          i++;
        } else {
          flags.unknownFlags.push(
            `--auth ${next ?? ""} (valid: jwt, none)`
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

// src/utils/flagsToConfig.ts
var flagsToPartialConfig = (flags) => {
  return {
    ...flags.projectName && { projectName: flags.projectName },
    ...flags.language && { language: flags.language },
    ...flags.architecture && { architecture: flags.architecture },
    ...flags.db && { db: flags.db },
    ...flags.orm && { orm: flags.orm },
    ...flags.auth && { auth: flags.auth }
  };
};

// src/commands/create.ts
import path3 from "path";

// src/utils/outro.ts
import * as p2 from "@clack/prompts";
import pc2 from "picocolors";

// src/utils/pkgManager.ts
var detectPkgManager = () => {
  const agent = process.env.npm_config_user_agent ?? "";
  if (agent.includes("yarn")) return "yarn";
  if (agent.includes("pnpm")) return "pnpm";
  if (agent.includes("bun")) return "bun";
  return "npm";
};

// src/utils/outro.ts
var showOutro = (config) => {
  const pm = detectPkgManager();
  const runCmd = pm === "npm" ? "npm run dev" : `${pm} dev`;
  const prismaCmd = pm === "npm" ? "npx prisma migrate dev" : `${pm} prisma migrate dev`;
  const lines = [
    `${pc2.bold("cd")} ${config.projectName}`,
    `${pc2.bold(`${pm} install`)}`,
    `${pc2.bold(runCmd)}`
  ];
  if (config.orm === "prisma") {
    lines.push("");
    lines.push(
      `${pc2.dim("# After setting up your DATABASE_URL in .env, configure the database connection and schema, then run:")}`
    );
    lines.push(
      `${pc2.bold(prismaCmd)}`
    );
  }
  if (config.orm === "mongoose") {
    lines.push("");
    lines.push(
      `${pc2.dim("# Set up your MONGODB_URI in .env, before start the server")}`
    );
  }
  p2.note(lines.join("\n"), "Next steps");
  p2.outro(
    `${pc2.green("Project ready. Happy coding!")} ${pc2.dim("If you have any issues or feedback, please check https://github.com/dialca/create-dialca-express.")}`
  );
};

// src/utils/help.ts
import pc3 from "picocolors";
var showHelp = () => {
  console.log(`
        ${pc3.bgCyan(pc3.black(" create-dialca-express "))} ${pc3.dim("v0.1.0")}

        ${pc3.bold("Usage:")}
            npm create dialca-express ${pc3.dim("[project-name] [flags]")}

        ${pc3.bold("Flags:")}
            ${pc3.cyan("--ts, --typescript")}       Use TypeScript ${pc3.dim("(default)")}
            ${pc3.cyan("--js, --javascript")}     Use JavaScript
            ${pc3.cyan("--arch")} ${pc3.dim("<architecture>")}  Choose project architecture
                ${pc3.dim("basic")} Simple structure for small projects
                ${pc3.dim("screaming")} Organize by feature/domain for better scalability
                ${pc3.dim("hexagonal")} Emphasize separation of concerns and testability
                ${pc3.dim("hexagonal-modules")} Hexagonal architecture with module-based organization
                ${pc3.dim("clean")} Clean architecture with strict separation of layers
            ${pc3.cyan("--db")} ${pc3.dim("<db-engine>")} Choose a database
                ${pc3.dim("postgresql")} PostgreSQL
                ${pc3.dim("mysql")} MySQL
                ${pc3.dim("sqlite")} SQLite
                ${pc3.dim("mongodb")} MongoDB
                ${pc3.dim("none")} No database
            ${pc3.cyan("--orm")} ${pc3.dim("<orm-choice>")} Choose an ORM/ODM
                ${pc3.dim("prisma")} Prisma ${pc3.dim("(supports SQL databases)")}
                ${pc3.dim("mongoose")} Mongoose ${pc3.dim("(for MongoDB)")}
                ${pc3.dim("none")} No ORM/ODM
            ${pc3.cyan("--auth")} ${pc3.dim("<auth-choice>")} Choose an authentication method
                ${pc3.dim("jwt")} JSON Web Tokens (JWT) based authentication
                ${pc3.dim("none")} No authentication setup

        ${pc3.bold("Examples:")}
            ${pc3.dim("$")} npm create dialca-express my-api
            ${pc3.dim("$")} npm create dialca-express my-api --ts --arch screaming
            ${pc3.dim("$")} npm create dialca-express my-api --ts --arch hexagonal --db postgresql --orm prisma --auth jwt
        `);
};

// src/utils/validateFlags.ts
import pc4 from "picocolors";
var validateFlags = (flags) => {
  const errors = [];
  if (flags.db === "mongodb" && flags.orm === "prisma") {
    errors.push({
      flag: "--orm prisma",
      message: "Prisma is not compatible with MongoDB. Use --orm mongoose instead."
    });
  }
  const sqlEngines = ["sqlite", "postgresql", "mysql"];
  if (flags.db && sqlEngines.includes(flags.db) && flags.orm === "mongoose") {
    errors.push({
      flag: "--orm mongoose",
      message: `Mongoose is not compatible with ${flags.db}. Use --orm prisma instead.`
    });
  }
  if (flags.orm && flags.orm !== "none" && (!flags.db || flags.db === "none")) {
    errors.push({
      flag: `--orm ${flags.orm}`,
      message: "Cannot use an ORM without specifying a database (--db)."
    });
  }
  return errors;
};
var printValidationErrors = (errors) => {
  console.log();
  console.log(pc4.red("  \u2716 Invalid flag combination:"));
  console.log();
  for (const error of errors) {
    console.log(`  ${pc4.dim(error.flag)}`);
    console.log(`  ${pc4.red("\u2192")} ${error.message}`);
    console.log();
  }
  console.log(pc4.dim("  Run with --help to see valid options.\n"));
};

// src/commands/create.ts
var run = async () => {
  const flags = parseArgs(process.argv);
  if (flags.help) {
    showHelp();
    process.exit(0);
  }
  if (flags.unknownFlags.length > 0) {
    console.log();
    console.log(pc5.red("  \u2716 Unknown or invalid flags:"));
    console.log();
    for (const f of flags.unknownFlags) {
      console.log(`  ${pc5.red("\u2192")} ${pc5.dim(f)}`);
    }
    console.log();
    console.log(pc5.dim("  Run with --help to see valid options.\n"));
    process.exit(1);
  }
  const validationErrors = validateFlags(flags);
  if (validationErrors.length > 0) {
    printValidationErrors(validationErrors);
    process.exit(1);
  }
  p3.intro(pc5.bgCyan(pc5.black(" create-dialca-express ")));
  const initial = flagsToPartialConfig(flags);
  const config = await collectConfig(initial);
  const spinner2 = p3.spinner();
  spinner2.start("Generating project structure...");
  try {
    const root = path3.resolve(process.cwd(), config.projectName);
    generateArchitecture(config);
    const features = applyFeatures(root, config);
    generateProjectFiles(config, features);
    spinner2.stop(pc5.green("Project structure generated successfully!"));
  } catch (err) {
    spinner2.stop(pc5.red("Failed to generate project structure."));
    throw err;
  }
  showOutro(config);
};

// src/index.ts
run().catch((err) => {
  console.error("An error occurred:", err);
  process.exit(1);
});
//# sourceMappingURL=index.js.map