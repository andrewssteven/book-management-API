# book-management-API

A simple RESTful API for managing a books collection. Built with Node.js, Express, and MongoDB (Mongoose). This project provides CRUD endpoints, request validation, rate limiting, logging middleware, CORS configuration, and tests using Jest + Supertest.

## Key features

- Create, read, update and delete books
- Search by author, year, or genre
- Request validation (express-validator)
- Rate limiting (express-rate-limit)
- Centralized error handling and request logging
- Test coverage for core endpoints (Jest + Supertest)

## Tech stack

- Node.js (ES modules)
- Express 5
- MongoDB with Mongoose
- Jest + Supertest for tests
- dotenv for environment configuration

## Quick start

Prerequisites

- Node.js 18+ (or compatible)
- A running MongoDB instance or MongoDB URI (Atlas or local)

Installation

1. Clone the repo

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the project root with the following values:

```
MONGO_URL=<your-mongo-connection-string>
PORT=3030
```

4. Start the server in development

```bash
npm start
```

The server runs by default on http://localhost:3030 (or the port you set in `PORT`).

## Available scripts

- `npm start` - start the server with `nodemon server.js`
- `npm test` - run the test suite (Jest + Supertest)

You can find the scripts in `package.json`.

## Environment variables

- `MONGO_URL` (required) — MongoDB connection string
- `PORT` (optional) — port to run the server (default 3030)

Keep credentials and production secrets out of the repo and use a secrets manager or CI/CD environment variables.

## API Endpoints

Base path: `/api/v1/books`

All endpoints return JSON and use standard HTTP status codes.

- POST /api/v1/books

  - Create a new book
  - Required body fields: `title`, `author`, `genre`, `year`
  - Returns 201 and the updated list of books on success

- GET /api/v1/books

  - Return all books. 200 with `status: "success"` and `data` array.

- GET /api/v1/books/:id

  - Return a single book by its id. 200 on success, 400 if not found.

- GET /api/v1/books/author/:author

  - Return books by author

- GET /api/v1/books/year/:year

  - Return books by year

- GET /api/v1/books/genre/:genre

  - Return books by genre

- PUT /api/v1/books/:id

  - Update a book by id (body may contain any fields).
  - Returns 200 with updated list of books.

- DELETE /api/v1/books/:id
  - Delete a book by id.
  - Returns 200 with updated list of books.

Example request body for POST/PUT

```json
{
  "title": "The Example Book",
  "author": "Jane Doe",
  "genre": "Fiction",
  "year": 2020
}
```

Validation

- The API uses `express-validator` and requires non-empty `title`, `author`, `genre`, and `year` fields for create requests. Validation errors are returned with status 404 in the current implementation (consider aligning with 400 in future revisions).

Rate limiting

- Rate limiting is applied to all routes and configured for 60 requests per minute by default. Excess requests receive HTTP 429.

CORS

- CORS is enabled and restricted to configured origins in `app.js` (update the `allowedOrigins` array for production).

Logging and errors

- Requests go through `logger` middleware. Errors are handled by centralized `notFound` and `errorHandler` middleware.


Security

- Do NOT commit `.env` or secrets. Use environment variables or a secrets manager.
- If exposing to the public, consider stricter rate limiting, authentication (e.g., JWT), and payload size limits.

Contributing

- Open an issue or PR for changes. Follow repository conventions and add tests for new behavior.

License

ISC (see `package.json`).

Contact

Project author: stephen oisewemen
