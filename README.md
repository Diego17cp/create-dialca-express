# create-dialca-express

CLI to scaffold production-ready Express backend projects in seconds.

Inspired by `create-vite` and `screaming-dialca-react` — generates structure and
configuration, not business logic. You get a solid base; you build the rest.

## Usage

```bash
npm create dialca-express
pnpm create dialca-express
yarn create dialca-express
bun create dialca-express
```

Or with a project name directly:

```bash
npm create dialca-express my-api
```

## Flags

Skip prompts by passing flags directly:

| Flag | Options | Description |
|---|---|---|
| `--ts` / `--typescript` | — | Use TypeScript *(default)* |
| `--js` / `--javascript` | — | Use JavaScript |
| `--arch` | `basic` `screaming` `hexagonal` `hexagonal-modules` `clean` | Project architecture |
| `--db` | `postgresql` `mysql` `sqlite` `mongodb` | Database engine |
| `--orm` | `prisma` `mongoose` | ORM / ODM |
| `--auth` | `jwt` `none` | Authentication method |
| `--help` / `--h` | — | Show help |

### Examples

```bash
# Interactive
create-dialca-express

# TypeScript + Screaming architecture
create-dialca-express my-api --ts --arch screaming

# Full stack: TypeScript + Hexagonal + PostgreSQL + Prisma + JWT
create-dialca-express my-api --ts --arch hexagonal --db postgresql --orm prisma --auth jwt
```

## Architectures

### Basic
Simple flat structure. Good for prototypes and small projects.

```
src/
├── controllers/
├── services/
├── routes/
├── middlewares/
├── config/
└── utils/
```

### Screaming Modular
Organized by domain. Each module owns its own controllers, services and routes.

```
src/
├── modules/
│   ├── auth/
│   ├── users/
│   └── products/
├── shared/
└── core/
```

### Hexagonal
Strict layer separation. Domain is completely isolated from infrastructure.

```
src/
├── domain/
├── application/
├── infrastructure/
└── interfaces/
```

### Hexagonal with Modules
Combines hexagonal layering with modular organization.

```
src/
└── modules/
├── auth/
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   └── interfaces/
└── users/
├── domain/
├── application/
├── infrastructure/
└── interfaces/
```

### Clean Architecture
Similar to hexagonal but with more layers and stricter rules.

```
src/
├── domain/
├── use-cases/
├── repositories/
├── infrastructure/
└── presentation/
```

## What gets generated

Depending on your selections, the CLI generates:

- **Project structure** — folders and `.gitkeep` files
- **`package.json`** — with all selected dependencies
- **`tsconfig.json`** — if TypeScript is selected
- **`.env` + `.env.example`** — with the right variables for your stack
- **`src/app.ts`** — Express app with selected middlewares wired up
- **`src/server.ts`** — entry point that starts the server
- **`prisma/schema.prisma`** + **`prisma.config.ts`** — if Prisma is selected
- **`src/config/database.ts`** — if Mongoose is selected

## Philosophy

> Generate structure. Generate configuration. Let the developer build the rest.

This CLI does **not** generate:
- CRUDs or business logic
- Functional login/register flows
- Domain-specific repositories or models

Its responsibility ends when `pnpm install && pnpm dev` works.

<!-- ## Roadmap v2

- Drizzle ORM
- Zod validation
- Winston / Pino logging
- Docker support
- ESLint + Prettier
- Testing setup
- Husky + lint-staged -->

## License

MIT