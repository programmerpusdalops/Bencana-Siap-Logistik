---
trigger: always_on
---

# CODING STANDARDS
Backend Development Guidelines

All backend code generated must follow these coding standards.

--------------------------------------------------

# PROGRAMMING STYLE

Use JavaScript with NodeJS.

Follow modern ES6+ syntax.

Use:

async / await

Avoid:

callbacks
nested promises

--------------------------------------------------

# CODE STRUCTURE

Separate responsibilities clearly.

Routes
Controllers
Services
Database access
Middlewares

Example flow:

Route → Controller → Service → Database

--------------------------------------------------

# ROUTE RULES

Routes only handle:

HTTP endpoints
middleware usage

Routes must not contain business logic.

Example:

GET /api/stocks

routes/stocks.routes.js

--------------------------------------------------

# CONTROLLER RULES

Controllers handle:

request parsing
response formatting

Controllers call service functions.

Example:

controller calls:

stockService.getStocks()

--------------------------------------------------

# SERVICE RULES

Services contain business logic.

Examples:

stock calculation
distribution logic
request verification

Services communicate with database using Prisma.

--------------------------------------------------

# DATABASE ACCESS

All database operations must use Prisma ORM.

Example:

prisma.user.findMany()

Avoid raw SQL unless absolutely necessary.

--------------------------------------------------

# ERROR HANDLING

Use centralized error handler.

Controller example:

try {
  const data = await service.getData()
  res.json(successResponse(data))
}
catch(error) {
  next(error)
}

--------------------------------------------------

# RESPONSE HELPERS

Create helper functions for API responses.

Example:

successResponse(data)

errorResponse(message)

Example output:

{
 success:true,
 message:"Success",
 data:{}
}

--------------------------------------------------

# NAMING CONVENTIONS

Use camelCase for variables.

Example:

userService
stockController
createDistribution

Use snake_case only in database fields.

--------------------------------------------------

# FILE NAMING

Use consistent naming:

users.controller.js
users.service.js
users.routes.js

--------------------------------------------------

# MODULE STRUCTURE

Each module must have:

controller
service
route

Example module:

stocks/

stocks.controller.js
stocks.service.js
stocks.routes.js

--------------------------------------------------

# ASYNC CODE

Always use async/await.

Example:

async function getStocks() {
 return await prisma.stock.findMany()
}

--------------------------------------------------

# CLEAN CODE PRINCIPLES

Functions must be:

small
focused
readable

Avoid long functions.

Break large logic into smaller functions.

--------------------------------------------------

# COMMENTS

Use comments to explain complex logic.

Example:

// Reduce stock after distribution

--------------------------------------------------

# API DOCUMENTATION

Each route should include short comment explaining purpose.

Example:

// GET /api/stocks
// Returns all warehouse stocks

--------------------------------------------------

# FINAL RULE

All backend code generated must follow these coding standards.

Consistency is important for maintainability.