# Books API

A modern RESTful API built with Bun, Hono, Drizzle ORM, and Turso(LibSQL). Features type-safe schemas with Zod, interactive API documentation with Scalar, and structured logging with Pino.

## Features

- 📚 Full CRUD operations for books (Create, Read, Update, Delete)
- 🚀 Built with [Bun](https://bun.sh/) for high performance
- 🔍 OpenAPI 3.0 specification with interactive documentation
- 🎯 Type-safe API routes with [Hono](https://hono.dev/) and [Zod](https://zod.dev/)
- 💾 Turso/libSQL database with [Drizzle ORM](https://orm.drizzle.team/)
- 📝 Structured logging with [Pino](https://getpino.io/)
- ✨ Interactive API reference with [Scalar](https://github.com/scalar/scalar)
- 🧪 Unit testing with [Vitest](https://vitest.dev/)
- 🔧 Type-safe environment variables with Zod validation

## Tech Stack

**Runtime & Package Manager:**

- Bun (runtime and package manager)

**Web Framework & API:**

- `hono` - Ultra-fast web framework
- `@hono/node-server` - Node.js adapter for Hono
- `@hono/zod-openapi` - OpenAPI integration for Hono with Zod schemas

**Database & ORM:**

- `drizzle-orm` - TypeScript ORM
- `drizzle-zod` - Zod schema generator for Drizzle
- `drizzle-kit` - Drizzle migration toolkit
- `@libsql/client` - Turso/libSQL database client

**Validation & Type Safety:**

- `zod` - TypeScript-first schema validation

**Logging:**

- `pino` - High-performance JSON logger
- `pino-pretty` - Prettifier for Pino logs
- `hono-pino` - Pino integration for Hono

**Environment Management:**

- `dotenv` - Environment variable loader
- `dotenv-expand` - Variable expansion for dotenv

**Development Tools:**

- `tsx` - TypeScript executor with watch mode
- `vitest` - Fast unit test framework
- TypeScript with strict mode enabled

**Documentation:**

- `@scalar/hono-api-reference` - Beautiful API documentation UI

## Prerequisites

- [Bun](https://bun.sh/) v1.0 or higher installed

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd books-api
```

2. Install dependencies using Bun:

```bash
bun install
```

3. Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=3000
LOG_LEVEL=info
DATABASE_URL=file:local.db
DATABASE_AUTH_TOKEN=
```

**Environment Variables:**

| Variable              | Description                                              | Default       | Required    |
| --------------------- | -------------------------------------------------------- | ------------- | ----------- |
| `NODE_ENV`            | Environment mode (`development` or `production`)         | `development` | No          |
| `PORT`                | HTTP server port                                         | `3000`        | No          |
| `LOG_LEVEL`           | Logging level (fatal/error/warn/info/debug/trace/silent) | `info`        | No          |
| `DATABASE_URL`        | Turso database URL or local SQLite file                  | -             | Yes         |
| `DATABASE_AUTH_TOKEN` | Turso authentication token (required in production)      | -             | Conditional |

4. Set up the database:

```bash
bun run db:setup
```

This will create the database and apply the schema using Drizzle Kit.

## Development

Start the development server with auto-reload:

```bash
bun run dev
```

The server will start on `http://localhost:3000` (or your configured `PORT`).

## API Documentation

Once the server is running, you can access:

- **OpenAPI Specification**: `http://localhost:3000/doc`
- **Interactive API Reference** (Scalar UI): `http://localhost:3000/reference`

## API Endpoints

| Method   | Path         | Description               |
| -------- | ------------ | ------------------------- |
| `GET`    | `/books`     | List all books            |
| `POST`   | `/books`     | Create a new book         |
| `GET`    | `/books/:id` | Get a specific book by ID |
| `PATCH`  | `/books/:id` | Update a book by ID       |
| `DELETE` | `/books/:id` | Delete a book by ID       |

### Example Request

**Create a Book:**

```bash
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{
    "name": "The Pragmatic Programmer",
    "isbn": "978-0135957059"
  }'
```

**Get All Books:**

```bash
curl http://localhost:3000/books
```

## Testing

Run the test suite using Vitest:

```bash
bun test
```

Tests are located alongside their respective modules (e.g., `books.test.ts`).

## Available Scripts

| Script        | Command               | Description                                           |
| ------------- | --------------------- | ----------------------------------------------------- |
| `dev`         | `bun run dev`         | Start development server with hot-reload (uses `tsx`) |
| `test`        | `bun test`            | Run test suite with Vitest                            |
| `db:setup`    | `bun run db:setup`    | Initialize database and apply schema                  |
| `db:generate` | `bun run db:generate` | Generate SQL migrations from schema                   |
| `db:migrate`  | `bun run db:migrate`  | Apply pending migrations to database                  |
| `db:push`     | `bun run db:push`     | Push schema changes directly to database              |
| `db:studio`   | `bun run db:studio`   | Open Drizzle Studio (visual database browser)         |

## Project Structure

```
books-api/
├── src/
│   ├── app.ts                    # Main application setup and route registration
│   ├── index.ts                  # Server entry point
│   ├── env.ts                    # Environment variable validation with Zod
│   ├── db/
│   │   ├── index.ts              # Database client initialization
│   │   ├── schema.ts             # Drizzle ORM schemas and Zod validators
│   │   └── migrations/           # Generated SQL migrations
│   ├── lib/
│   │   ├── configure-open-api.ts # OpenAPI configuration
│   │   ├── constants.ts          # Shared constants
│   │   ├── create-app.ts         # Hono app factory with middlewares
│   │   ├── error-handler.ts      # Global error handler
│   │   └── types.ts              # Shared TypeScript types
│   ├── middlewares/
│   │   ├── custom-logger.ts      # Pino logging middleware
│   │   ├── not-found.ts          # 404 handler
│   │   └── server-emoji-favicon.ts # Favicon middleware
│   ├── openapi/
│   │   ├── default-hook.ts       # Default OpenAPI hooks
│   │   ├── http-status-codes.ts  # HTTP status code constants
│   │   ├── http-status-phrases.ts # HTTP status phrases
│   │   ├── helpers/              # OpenAPI schema helpers
│   │   └── schemas/              # Reusable OpenAPI schemas
│   └── routes/
│       ├── index.route.ts        # Root route
│       └── books/
│           ├── books.handlers.ts # Route handlers/controllers
│           ├── books.index.ts    # Books router export
│           ├── books.routes.ts   # OpenAPI route definitions
│           └── books.test.ts     # Unit tests for books routes
├── drizzle.config.ts             # Drizzle Kit configuration
├── tsconfig.json                 # TypeScript configuration
├── vitest.config.ts              # Vitest test configuration
├── package.json                  # Project dependencies and scripts
└── README.md                     # This file
```

## Database

This project uses **Drizzle ORM** with **Turso** (libSQL), which is a fork of SQLite optimized for edge deployments.

### Local Development

For local development, you can use a local SQLite file:

```env
DATABASE_URL=file:local.db
```

### Production with Turso

For production, use a Turso database:

1. [Sign up for Turso](https://turso.tech/)
2. Create a database
3. Get your database URL and auth token
4. Update your `.env`:

```env
DATABASE_URL=libsql://your-database.turso.io
DATABASE_AUTH_TOKEN=your-auth-token
```

### Database Commands

- **Initialize/Reset Database**: `bun run db:setup`
- **Generate Migration**: Modify `src/db/schema.ts`, then run `bun run db:generate`
- **Apply Migrations**: `bun run db:migrate`
- **Visual Database Browser**: `bun run db:studio`

## Architecture Highlights

- **Type Safety**: End-to-end type safety from database schema to API responses using Drizzle + Zod
- **OpenAPI First**: Routes are defined with OpenAPI specifications for automatic documentation
- **Middleware Pipeline**: Custom logging, error handling, and 404 handling
- **Modular Structure**: Feature-based organization (e.g., `routes/books/`)
- **Path Aliases**: Use `@/` to import from `src/` (configured in `tsconfig.json`)

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Make your changes and add tests
4. Run tests: `bun test`
5. Commit your changes: `git commit -am 'Add new feature'`
6. Push to the branch: `git push origin feature/my-new-feature`
7. Submit a pull request

## License

This project is licensed under the MIT License.
