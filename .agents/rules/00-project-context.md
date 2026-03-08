---
trigger: always_on
---

# PROJECT CONTEXT
Disaster Logistics Management System

Project Name:
SIAP LOGISTIK BENCANA

This system is used by disaster management agencies (BPBD) to manage logistics during disaster response operations.

The system manages:

- disaster events
- logistics stock
- logistics requests
- logistics distribution
- warehouse management
- dashboard analytics

The system will be used by government staff and must be secure, reliable, and scalable.

--------------------------------------------------

# BACKEND TECHNOLOGY STACK

The backend must use:

NodeJS
ExpressJS
PostgreSQL
Prisma ORM

Additional libraries allowed:

jsonwebtoken
bcryptjs
cors
helmet
morgan
dotenv
express-rate-limit

Optional:

multer (for file uploads)
zod or joi (for validation)

--------------------------------------------------

# ARCHITECTURE PRINCIPLES

Follow clean architecture principles.

Code must be modular and organized.

Use separation of concerns:

Routes → handle HTTP endpoints

Controllers → handle request and response

Services → business logic

Database layer → Prisma ORM

Middlewares → authentication and security

--------------------------------------------------

# FOLDER STRUCTURE

The backend must follow this structure.

src/

config/
database/
middlewares/
routes/
controllers/
services/
utils/

modules/

auth/
users/
master-data/
stocks/
incoming-logistics/
disasters/
requests/
distributions/
receiving/
dashboard/

server.js

--------------------------------------------------

# CODING RULES

Follow these rules strictly:

1. Use async/await.
2. Use try/catch for all database operations.
3. Use centralized error handling.
4. Never expose raw database errors to users.
5. All responses must use JSON.

Example response format:

{
  success: true,
  message: "Data retrieved successfully",
  data: {}
}

Error example:

{
  success: false,
  message: "Unauthorized"
}

--------------------------------------------------

# API DESIGN RULES

Use REST API conventions.

Examples:

GET /api/users
POST /api/users
PUT /api/users/:id
DELETE /api/users/:id

Authentication routes:

POST /api/auth/login

Resource naming:

use plural naming.

Example:

/api/stocks
/api/distributions
/api/requests

--------------------------------------------------

# DATABASE RULES

Use PostgreSQL with Prisma ORM.

Tables must use:

snake_case

Example:

created_at
updated_at
barang_logistik

Primary keys must be:

id

Use timestamps for all tables:

created_at
updated_at

--------------------------------------------------

# SECURITY RULES

Security is very important.

All authentication must use:

JWT tokens.

Password must use:

bcrypt hashing.

Login route must include:

rate limiting.

Add security middleware:

helmet
cors

Protected routes must require JWT authentication.

--------------------------------------------------

# USER ROLES

System supports the following roles:

Super Admin
Admin Gudang
Admin Pusdalops
Petugas Posko
Pimpinan

Each role will have different permissions.

Use role-based middleware.

Example:

requireRole("super_admin")

--------------------------------------------------

# CORE SYSTEM MODULES

The backend must support these modules:

AUTHENTICATION
User login and token verification.

USER MANAGEMENT
Manage system users.

MASTER DATA
Jenis logistik
Barang logistik
Gudang
Instansi
Satuan
Kendaraan

WAREHOUSE STOCK
Manage logistics stock in warehouses.

INCOMING LOGISTICS
Record logistics entering warehouse.

DISASTER EVENTS
Record disaster incidents and locations.

LOGISTICS REQUESTS
Field officers request logistics.

REQUEST VERIFICATION
Admin verifies logistics requests.

DISTRIBUTION MANAGEMENT
Logistics distribution to disaster areas.

RECEIVING CONFIRMATION
Field officers confirm received logistics.

DASHBOARD ANALYTICS
Provide aggregated data for dashboard.

--------------------------------------------------

# BUSINESS LOGIC RULES

Important business rules must be enforced.

Incoming logistics increases stock.

Distribution reduces stock.

Requests must be approved before distribution.

Receiving confirmation marks distribution as completed.

--------------------------------------------------

# FILE UPLOAD RULES

Some modules require file uploads.

Example:

Receiving confirmation photo documentation.

Use:

multer

Store files in:

/uploads

Only allow:

jpg
png
jpeg

--------------------------------------------------

# API RESPONSE FORMAT

All API responses must follow this format.

Success:

{
 success: true,
 message: "Operation successful",
 data: {}
}

Error:

{
 success: false,
 message: "Error message"
}

--------------------------------------------------

# DEVELOPMENT WORKFLOW

Development will follow incremental AI prompts.

Each prompt file focuses on a specific feature.

Example:

01-create-project.md
02-database-setup.md
03-auth-login.md
04-auth-middleware.md

The AI must only implement the feature requested in the prompt.

Do not modify unrelated modules unless required.

--------------------------------------------------

# IMPORTANT

This file defines the system rules.

All backend code generated must follow these rules.

Do not break architecture structure.

Always follow the defined folder structure, API format, and security standards.

# FRONTEND INTEGRATION CONTRACT

This backend will serve a ReactJS frontend application.

The frontend was generated earlier and already defines API placeholders.

Therefore the backend must follow the expected API contracts defined in the frontend code.

Backend must not change endpoint naming unless necessary.

Frontend uses REST API with JSON responses.

Standard response format must be:

Success:

{
 success: true,
 message: "Success",
 data: {}
}

Error:

{
 success: false,
 message: "Error message"
}

--------------------------------------------------

# FRONTEND EXPECTED API ENDPOINTS

Dashboard

GET /api/dashboard/summary
GET /api/dashboard/stok-instansi
GET /api/dashboard/distribusi-wilayah

Authentication

POST /api/auth/login

Users

GET /api/users
POST /api/users
PUT /api/users/:id
DELETE /api/users/:id

Master Data

GET /api/master/jenis-logistik
GET /api/master/barang
GET /api/master/gudang
GET /api/master/instansi

Stock

GET /api/stocks
POST /api/stocks

Incoming Logistics

GET /api/barang-masuk
POST /api/barang-masuk

Disaster Events

GET /api/bencana
POST /api/bencana

Logistics Requests

GET /api/permintaan
POST /api/permintaan

Request Verification

PATCH /api/permintaan/:id/approve
PATCH /api/permintaan/:id/reject

Distribution

GET /api/distribusi
POST /api/distribusi

Receiving Confirmation

POST /api/penerimaan
