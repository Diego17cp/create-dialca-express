import pc from "picocolors";

export const showHelp = (): void => {
	console.log(`
        ${pc.bgCyan(pc.black(" create-dialca-express "))} ${pc.dim("v0.1.0")}

        ${pc.bold("Usage:")}
            npm create dialca-express ${pc.dim("[project-name] [flags]")}

        ${pc.bold("Flags:")}
            ${pc.cyan("--ts, --typescript")}       Use TypeScript ${pc.dim("(default)")}
            ${pc.cyan("--js, --javascript")}     Use JavaScript
            ${pc.cyan("--arch")} ${pc.dim("<architecture>")}  Choose project architecture
                ${pc.dim("basic")} Simple structure for small projects
                ${pc.dim("screaming")} Organize by feature/domain for better scalability
                ${pc.dim("hexagonal")} Emphasize separation of concerns and testability
                ${pc.dim("hexagonal-modules")} Hexagonal architecture with module-based organization
                ${pc.dim("clean")} Clean architecture with strict separation of layers
            ${pc.cyan("--db")} ${pc.dim("<db-engine>")} Choose a database
                ${pc.dim("postgresql")} PostgreSQL
                ${pc.dim("mysql")} MySQL
                ${pc.dim("sqlite")} SQLite
                ${pc.dim("mongodb")} MongoDB
                ${pc.dim("none")} No database
            ${pc.cyan("--orm")} ${pc.dim("<orm-choice>")} Choose an ORM/ODM
                ${pc.dim("prisma")} Prisma ${pc.dim("(supports SQL databases)")}
                ${pc.dim("mongoose")} Mongoose ${pc.dim("(for MongoDB)")}
                ${pc.dim("none")} No ORM/ODM
            ${pc.cyan("--auth")} ${pc.dim("<auth-choice>")} Choose an authentication method
                ${pc.dim("jwt")} JSON Web Tokens (JWT) based authentication
                ${pc.dim("none")} No authentication setup

        ${pc.bold("Examples:")}
            ${pc.dim("$")} npm create dialca-express my-api
            ${pc.dim("$")} npm create dialca-express my-api --ts --arch screaming
            ${pc.dim("$")} npm create dialca-express my-api --ts --arch hexagonal --db postgres --orm prisma --auth jwt
        `);
};
