## book-management-API (Production README)

A small RESTful service for managing a books collection built with Node.js, Express and MongoDB (Mongoose).

This README focuses on production deployment and operational guidance: environment variables, running under a process manager or container, security and logging recommendations, and a concise API reference.

## Contents

- Overview
- Production prerequisites
- Environment variables
- Run & deploy (PM2 / Docker / systemd)
- Operational guidance (logging, monitoring, backups)
- API reference (endpoints, query params, examples)
- Recommended improvements for production

## Overview

The app exposes CRUD operations under the base path `/api/v1/books`. The collection GET endpoint supports pagination and search filtering. Middleware included in the codebase:

- Request validation using `express-validator`
- Rate limiting via `express-rate-limit` (default: 60 requests/min)
- Simple console logger middleware
- Centralized error handling
- CORS configured with a small allowlist in `app.js`

## Production prerequisites

- Node.js 18+ installed (or run in a container)
- A production MongoDB instance (Atlas, managed MongoDB, or self-hosted)
- Recommended: a process manager (PM2), container runtime (Docker), or orchestration (Kubernetes)

## Environment variables

Create a `.env` (or set environment variables in your deployment platform):

- MONGO_URL (required) — MongoDB connection string (URI)
- PORT (optional) — HTTP port (default: 3030)
- NODE_ENV (optional) — set to `production` in production

Keep credentials out of source control. Use your cloud provider/CI secrets manager.

## Run & deploy

Run locally for testing

```bash
npm install
# use nodemon in development
npm start
```

## Operational guidance

- Logging: the project uses a simple console logger (`middleware/logger.js`). In production, replace with a structured logging library (winston, pino) and ship logs to a central store (ELK, Datadog, Seq).
- Rate limiting: default is 60 requests/minute (`middleware/rateLimit.js`). Lower this for public APIs, or apply per-IP + authenticated user rules.
- Security: enable HTTPS (TLS termination at load balancer), validate origin lists in `app.js`, add authentication/authorization (JWT/OAuth), sanitize inputs.
- Backups: schedule automated backups for MongoDB. Test restores regularly.
- Monitoring: add metrics (Prometheus, CloudWatch) and error tracking (Sentry).

## API reference (concise)

Base path: `/api/v1/books`

Common headers

- Content-Type: application/json

Endpoints

- POST /api/v1/books

  - Description: Create a new book
  - Body fields (validated): `title`, `author`, `genre`, `year`
  - Success: 201 with the current collection (controller returns full list)

- GET /api/v1/books

  - Description: List books with pagination and optional search/filter
  - Query params:
    - `p` — page number (default 1)
    - `limit` — items per page (default 2)
    - `search` — text search on title, author, genre (case-insensitive)
    - `year` — exact year filter
  - Success: 200 with JSON including `page`, `totalPages`, `totalBooks`, `count`, `data`

- GET /api/v1/books/:id

  - Description: Get a single book by MongoDB ObjectId
  - Success: 200 with `data` (book). If not found, controller returns 400.

- PUT /api/v1/books/:id

  - Description: Update an existing book. Any provided fields in the body will be applied.
  - Success: 200 with the updated book

- DELETE /api/v1/books/:id
  - Description: Delete a book by id
  - Success: 200 with the remaining collection (controller returns list)

Example curl requests

Create a book

```bash
curl -X POST http://localhost:3030/api/v1/books \
	-H "Content-Type: application/json" \
	-d '{"title":"The Example Book","author":"Jane Doe","genre":"Fiction","year":2020}'
```

List books (search + pagination)

```bash
curl "http://localhost:3030/api/v1/books?search=tolkien&p=1&limit=10&year=1954"
```

Get book by id

```bash
curl http://localhost:3030/api/v1/books/<objectId>
```

## Troubleshooting

- Mongoose connection failures: ensure `MONGO_URL` is correct and reachable from the host/container. Check network rules and auth credentials.
- Unexpected validation response: inspect controller `postBook` to see how `validationResult` is returned. Consider updating the controller to return a structured error object.

## Contact & licensing

Author: stephen oisewemen

License: ISC (see `package.json`)

---

This README was created to provide production-focused deployment and operational guidance for the code present in the repository (routes, controller, model, and middleware).
