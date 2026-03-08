---
description: Create secure authentication system.
---

# TASK

Create secure authentication system.

Features:

User Login
Password Hashing
JWT Authentication

# SECURITY

Use bcrypt for password hashing.

Use JWT tokens.

Access token expiration:

1 hour

# LOGIN API

POST /api/auth/login

Request body:

email
password

Response:

token
user info

Example:

{
 token:"jwt-token",
 user:{
  id:1,
  name:"Admin",
  role:"admin"
 }
}

# VALIDATION

Validate:

email format
password required

# SECURITY RULES

Prevent:

SQL injection
brute force login

Add rate limiter to login route.

# RESULT

User must be able to login securely.