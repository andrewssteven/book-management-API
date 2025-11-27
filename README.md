## book-management-API

A small RESTful service for managing a books collection built with Node.js, Express and MongoDB (Mongoose).

This README documents the available API endpoints, required environment variables, how to run the project locally, and example requests for common flows (register, login, refresh token, create/list books).

## Contents

- Overview
- Environment variables
- Run & develop
- Authentication overview
- API reference (auth, users, books)
- Example requests
- Operational guidance
- Troubleshooting

## Overview

The app exposes CRUD operations for books under `/api/v1/books`, user management under `/api/v1/users`, and authentication under `/api/v1/auth`.

Key middleware/features:

- JWT authentication for protected routes
- Access and refresh token flow (refresh tokens persisted in DB)
- Request validation using `express-validator`
- Rate limiting via `express-rate-limit`
- Simple console logger middleware and centralized error handling
- CORS configured with a small allowlist in `app.js`
- Database connection is skipped when `NODE_ENV=test` to allow test control

## Environment variables

Create a `.env` file (or set environment variables in your deployment platform):

- `MONGO_URL` (required) — MongoDB connection string (URI)
- `PORT` (optional) — HTTP port (default: `3030`)
- `NODE_ENV` (optional) — set to `production` in production
- `ACCESS_TOKEN_SECRET` (required) — secret for signing access tokens
- `REFRESH_TOKEN_SECRET` (required) — secret for signing refresh tokens

Keep credentials out of source control. Use your cloud provider/CI secrets manager.

## Run & develop

Install and run locally:

```bash
npm install
# starts the server with nodemon
npm start
```
````

Scripts (see `package.json`):

- `npm start` — runs `nodemon server.js`
- `npm test` — runs Jest tests

The server entry is `server.js` and the app exports in `app.js` (ES module project: `type: module`).

## Authentication overview

- Register: `POST /api/v1/auth/register` — create a new user (name, email, password).
- Login: `POST /api/v1/auth/login` — authenticate and receive `{ accessToken, refreshToken }`.
- Refresh: `POST /api/v1/auth/token` — exchange a refresh token for a new access token. (Response uses the key `accesstoken`.)
- Logout: `POST /api/v1/auth/logout` — removes a stored refresh token from the DB.

Access tokens are short-lived (15 minutes in the code). Refresh tokens are persisted to the `RefreshToken` collection and must be supplied to the `/token` and `/logout` endpoints.

Protected routes require the `Authorization` header with the access token: `Authorization: Bearer <accessToken>`.

## API reference (auth)

Base path: `/api/v1/auth`

- `POST /register`

  - Description: Register a new user
  - Body: `{ name, email, password }`
  - Success: `201` with the current users list (controller returns all users after creating one)

- `POST /login`

  - Description: Login and receive tokens
  - Body: `{ email, password }`
  - Success: `200` with `{ status, message, accessToken, refreshToken }`

- `POST /token`

  - Description: Exchange a refresh token for a new access token
  - Body: `{ token: <refreshToken> }`
  - Success: `200` with `{ status, accesstoken }` (note: key is `accesstoken` in the current implementation)

- `POST /logout`
  - Description: Invalidate a refresh token (remove from DB)
  - Body: `{ token: <refreshToken> }`
  - Success: `200` on removal

## API reference (users)

Base path: `/api/v1/users`

- `GET /api/v1/users/`

  - Description: Retrieve all users
  - Auth: `authenticate` + role `admin`

- `GET /api/v1/users/:id`

  - Description: Retrieve a single user by id
  - Auth: `authenticate` + roles `user` or `admin`

- `PUT /api/v1/users/:id`

  - Description: Update user information
  - Auth: `authenticate` + roles `user` or `admin`

- `DELETE /api/v1/users/:id`
  - Description: Delete a user
  - Auth: `authenticate` + roles `user` or `admin`

## API reference (books)

Base path: `/api/v1/books`

All book routes use the `authenticate` middleware. Role-based access is enforced by `roleAuth` middleware:

- `POST /api/v1/books` — Create a book

  - Auth: `admin` only
  - Body: `{ title, author, genre, year }` (validated)

- `GET /api/v1/books` — List books

  - Auth: `user` or `admin`
  - Query params:
    - `p` — page number (default 1)
    - `limit` — items per page (default 2)
    - `search` — text search on title/author/genre (case-insensitive)
    - `year` — exact year filter

- `GET /api/v1/books/:id` — Get book by id

  - Auth: `user` or `admin`

- `PUT /api/v1/books/:id` — Update book by id

  - Auth: `admin` only

- `DELETE /api/v1/books/:id` — Delete book by id
  - Auth: `admin` only

## Example requests

Register

```bash
curl -X POST http://localhost:3030/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane","email":"jane@example.com","password":"password123"}'
```

Login (get access + refresh tokens)

```bash
curl -X POST http://localhost:3030/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"password123"}'
```

Refresh access token

```bash
curl -X POST http://localhost:3030/api/v1/auth/token \
  -H "Content-Type: application/json" \
  -d '{"token":"<refreshToken>"}'
```

Logout (invalidate refresh token)

```bash
curl -X POST http://localhost:3030/api/v1/auth/logout \
  -H "Content-Type: application/json" \
  -d '{"token":"<refreshToken>"}'
```

Create a book (admin only)

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

## Troubleshooting

- If login fails: verify the user exists and password is correct (bcrypt used for comparison).
- If token exchange fails: ensure you supply a stored refresh token and that `REFRESH_TOKEN_SECRET` is set.
- If protected routes return 401/403: inspect the `Authorization` header, token expiry, and user role.

## Contact & licensing

Author: stephen oisewemen

License: ISC (see `package.json`)

```

```
