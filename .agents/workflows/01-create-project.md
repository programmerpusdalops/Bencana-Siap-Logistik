---
description: Create a backend project for a Disaster Logistics Management System.
---

Project name:
siap-logistik-bencana-backend

Use the following stack:

NodeJS
ExpressJS
PostgreSQL
Prisma ORM

The system must be structured cleanly and scalable.

# REQUIREMENTS

Create a production-ready backend structure.

Folder structure must be:

src
controllers
routes
services
middlewares
utils
config
modules
auth
database

Add:

.env support
error handler
request logger
security middleware

Use the following libraries:

express
cors
helmet
dotenv
jsonwebtoken
bcryptjs
morgan
prisma
pg

# SECURITY

Add security best practices:

helmet
cors
rate limit
password hashing with bcrypt

# SERVER

Create Express server with:

global error handler
request logging
JSON body parsing

Server must run on:

PORT from .env

Example:

PORT=5000

# DATABASE

Prepare Prisma configuration but do not create tables yet.

Use PostgreSQL.

Create:

DATABASE_URL inside .env

# RESULT

When finished:

Project must run using:

npm install
npm run dev

Server must start successfully.