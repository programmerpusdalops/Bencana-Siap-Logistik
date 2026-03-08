---
description: Create authentication middleware.
---

# TASK

Create authentication middleware.

Middleware must verify JWT token.

# REQUIREMENTS

Create middleware:

authMiddleware

Function:

Check Authorization header.

Format:

Bearer TOKEN

Verify token using JWT secret.

If token invalid:

return 401 Unauthorized.

# ROLE CHECK

Create role middleware.

Example:

requireRole("admin")

Only users with specific role can access route.

# RESULT

Routes can now be protected.