## book-management-API

A small RESTful service for managing a books collection built with Node.js, Express and MongoDB (Mongoose).

This README documents the available API endpoints (users + books), environment variables, how to run the project locally, and example requests for common flows (register, login, refresh token, create/list books).

## Contents

- Overview
- Environment variables
- Run & develop
- Authentication overview
- API reference (users)
- API reference (books)
- Example requests
- Operational guidance
- Troubleshooting

## Overview

The app exposes CRUD operations under the base path `/api/v1/books` and user/auth endpoints under `/api/v1/users`.

Key middleware/features:

- JWT authentication for protected book routes
- Access and refresh token flow (refresh tokens persisted)
- Request validation using `express-validator`
- Rate limiting via `express-rate-limit`
- Simple console logger middleware and centralized error handling
- CORS configured with a small allowlist in `app.js`

## Environment variables

Create a `.env` (or set environment variables in your deployment platform):

- MONGO_URL (required) — MongoDB connection string (URI)
- PORT (optional) — HTTP port (default: 3030)
- NODE_ENV (optional) — set to `production` in production
- ACCESS_TOKEN_SECRET (required) — secret for signing access tokens
- REFRESH_TOKEN_SECRET (required) — secret for signing refresh tokens

Keep credentials out of source control. Use your cloud provider/CI secrets manager.

## Run & develop

Run locally for development

```bash
npm install
# starts the server with nodemon
npm start
```

Note: the `start` script runs `nodemon server.js` (see `package.json`).

## Authentication overview

- Register: `POST /api/v1/users/` creates a new user (name, email, password).
- Login: `POST /api/v1/users/login` authenticates a user and returns an access token and a refresh token.
- Refresh: `POST /api/v1/users/token` exchanges a valid refresh token for a new access token.
- Access tokens are short-lived (access token expiry is set to 10 minute in code). Refresh tokens are stored in the database and can be used to obtain new access tokens.

Protected book routes require the Authorization header with the access token: `Authorization: Bearer <accessToken>`.

## API reference (users)

Base path: `/api/v1/users`

- POST /api/v1/users/

  - Description: Register a new user
  - Body: `{ name, email, password }`
  - Success: 201 with users list

- POST /api/v1/users/login

  - Description: Login and receive `{ accesToken, refreshToken }`
  - Body: `{ email, password }`
  - Success: 200 with tokens

- POST /api/v1/users/token

  - Description: Exchange a refresh token for a new access token
  - Body: `{ token: <refreshToken> }`
  - Success: 200 with `{ accesstoken }`

- GET /api/v1/users/
  - Description: Get list of users (note: route currently does not require auth in code)

## API reference (books)

Base path: `/api/v1/books`

All book routes are protected with the `authenticate` middleware, so you must pass `Authorization: Bearer <accessToken>` header.

- POST /api/v1/books

  - Description: Create a new book (protected + validation)
  - Body: `{ title, author, genre, year }`
  - Success: 201 with all books

- GET /api/v1/books

  - Description: List books with pagination and optional search/filter
  - Query params:
    - `p` — page number (default 1)
    - `limit` — items per page (default 2)
    - `search` — text search on title, author, genre (case-insensitive)
    - `year` — exact year filter
  - Success: 200 with pagination meta and `data`

- GET /api/v1/books/:id

  - Description: Get a single book by id

- PUT /api/v1/books/:id

  - Description: Update book by id

- DELETE /api/v1/books/:id
  - Description: Delete book by id

## Example requests

Register

```bash
curl -X POST http://localhost:3030/api/v1/users/ \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane","email":"jane@example.com","password":"password123"}'
```

Login (get access + refresh tokens)

```bash
curl -X POST http://localhost:3030/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"password123"}'
```

Refresh access token

```bash
curl -X POST http://localhost:3030/api/v1/users/token \
  -H "Content-Type: application/json" \
  -d '{"token":"<refreshToken>"}'
```

Create a book (use access token)

```bash
curl -X POST http://localhost:3030/api/v1/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <accessToken>" \
  -d '{"title":"The Example Book","author":"Jane Doe","genre":"Fiction","year":2020}'
```

List books (example)

```bash
curl "http://localhost:3030/api/v1/books?search=tolkien&p=1&limit=10&year=1954" \
  -H "Authorization: Bearer <accessToken>"
```

## Operational guidance

- Logging: consider structured logging (winston/pino) for production
- Rate limiting: default limit middleware is applied; tune for your deployment
- Security: run behind HTTPS, rotate secrets, and tighten CORS/origins in `app.js`

## Troubleshooting

- If login fails: verify user record exists and password is correct. The code uses bcrypt to compare passwords.
- If token exchange fails: ensure you supply the stored refresh token and the `REFRESH_TOKEN_SECRET` is set.
- If protected routes return 401/403: inspect `Authorization` header and token expiry.

## Contact & licensing

Author: stephen oisewemen

License: ISC (see `package.json`)