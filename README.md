Collecting workspace informationHere's a detailed README.md for your Books API project:

# Books API

A RESTful API for managing books built with Bun, Hono, TypeScript, Drizzle ORM and SQLite.

## Features

- 📚 Full CRUD operations for books
- 🚀 Built with [Bun](https://bun.sh/) for high performance
- 🔍 OpenAPI/Swagger documentation
- 🎯 Type-safe API routes with [Hono](https://hono.dev/) and [Zod](https://zod.dev/)
- 💾 SQLite database with [Drizzle ORM](https://orm.drizzle.team/)
- 📝 Detailed logging with [Pino](https://getpino.io/)
- ✨ Interactive API reference with [Scalar](https://github.com/scalar/scalar)
- 🧪 Tests with [Vitest](https://vitest.dev/)

## Prerequisites

- [Bun](https://bun.sh/) installed
- [Node.js](https://nodejs.org/) 18+ installed

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd books-api
```

2. Install dependencies:

```bash
npm install
```

3. Create a .env file:

```env
NODE_ENV=development
PORT=3000
LOG_LEVEL=info
DATABASE_URL=file:dev.db
```

4. Set up the database:

```bash
npm run db:push
```

## Development

Start the development server:

```bash
npm run dev
```

The server will start on http://localhost:3000

## API Documentation

- OpenAPI documentation: http://localhost:3000/doc
- Interactive API reference: http://localhost:3000/reference

## API Endpoints

| Method | Path         | Description       |
| ------ | ------------ | ----------------- |
| GET    | `/books`     | List all books    |
| POST   | `/books`     | Create a new book |
| GET    | `/books/:id` | Get a book by ID  |
| PATCH  | `/books/:id` | Update a book     |
| DELETE | `/books/:id` | Delete a book     |

## Testing

Run the test suite:

```bash
npm test
```

## Project Structure

```
src/
  ├── app.ts           # Main application setup
  ├── index.ts         # Server entry point
  ├── env.ts           # Environment configuration
  ├── db/              # Database setup and schemas
  ├── lib/             # Shared utilities
  ├── middlewares/     # HTTP middlewares
  ├── openapi/         # OpenAPI/Swagger configuration
  └── routes/          # API routes and handlers
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio

## Environment Variables

| Variable            | Description                           | Default       |
| ------------------- | ------------------------------------- | ------------- |
| NODE_ENV            | Environment mode                      | "development" |
| PORT                | HTTP port                             | 3000          |
| LOG_LEVEL           | Logging level                         | "info"        |
| DATABASE_URL        | SQLite database URL                   | -             |
| DATABASE_AUTH_TOKEN | Database auth token (production only) | -             |

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License.
