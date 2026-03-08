---
trigger: always_on
---

# SECURITY RULES
Disaster Logistics Management System

Security is critical because this system will manage government logistics data.

All backend code must follow the security rules defined in this document.

--------------------------------------------------

# AUTHENTICATION SECURITY

Authentication must use JWT (JSON Web Token).

Use access token for API authentication.

Token expiration:

1 hour

JWT secret must be stored in .env file.

Example:

JWT_SECRET=your_super_secure_secret

Never hardcode JWT secrets in source code.

--------------------------------------------------

# PASSWORD SECURITY

Passwords must never be stored in plain text.

Use bcrypt hashing.

Recommended configuration:

bcrypt salt rounds = 10 or higher.

Example process:

1. User submits password
2. Backend hashes password
3. Store hashed password in database

--------------------------------------------------

# LOGIN PROTECTION

Login endpoints must have rate limiting to prevent brute force attacks.

Example rule:

Maximum 5 login attempts per minute per IP address.

Use:

express-rate-limit

Example configuration:

limit: 5
window: 1 minute

--------------------------------------------------

# AUTHORIZATION

Protected routes must require JWT authentication.

Use authentication middleware.

Example:

Authorization: Bearer TOKEN

If token is invalid or missing:

Return HTTP 401 Unauthorized.

--------------------------------------------------

# ROLE BASED ACCESS CONTROL

Some endpoints must be restricted by role.

Example roles:

super_admin
admin_gudang
admin_pusdalops
petugas_posko
pimpinan

Example restrictions:

User management → super_admin only

Stock management → admin_gudang

Request verification → admin_pusdalops

Dashboard → pimpinan

Create middleware:

requireRole(role)

--------------------------------------------------

# INPUT VALIDATION

All incoming request data must be validated.

Never trust client input.

Use validation library:

Zod or Joi

Validate:

required fields
data types
email format
numbers
strings

Example:

email must be valid email format.

--------------------------------------------------

# SQL INJECTION PREVENTION

All database queries must use Prisma ORM.

Never execute raw SQL queries unless absolutely necessary.

Using ORM prevents SQL injection.

--------------------------------------------------

# FILE UPLOAD SECURITY

Some endpoints allow file upload (documentation photos).

Use:

multer

Restrictions:

Maximum file size: 5MB

Allowed file types:

jpg
jpeg
png

Reject all other file types.

Uploaded files must be stored in:

/uploads directory

--------------------------------------------------

# CORS SECURITY

Configure CORS to allow only trusted origins.

Example:

allowed origins:

http://localhost:5173
production frontend domain

--------------------------------------------------

# SECURITY HEADERS

Use security middleware:

helmet

Helmet helps protect against:

XSS attacks
clickjacking
other vulnerabilities

--------------------------------------------------

# ERROR HANDLING SECURITY

Never expose internal server errors.

Example:

Do NOT return:

database error messages
stack traces

Instead return:

{
 success:false,
 message:"Internal server error"
}

--------------------------------------------------

# LOGGING

Use request logging middleware.

Example:

morgan

Log:

method
endpoint
response time
status code

Logs help track suspicious activities.

--------------------------------------------------

# ENVIRONMENT VARIABLES

Sensitive configuration must be stored in .env file.

Example:

DATABASE_URL
JWT_SECRET
PORT

Never commit .env file to git.

Use:

.env.example

--------------------------------------------------

# FINAL SECURITY RULE

All backend features must follow these security rules.

Security rules must not be bypassed.