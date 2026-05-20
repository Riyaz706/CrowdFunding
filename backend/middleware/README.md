# Backend Middleware

This directory contains Express middleware functions used to intercept, validate, and secure incoming HTTP requests before they reach the main controllers.

## Table of Contents

- [About the Directory](#about-the-directory)
- [Verification Middleware](#verification-middleware)
- [JWT Error Handling](#jwt-error-handling)
- [Integration Pattern](#integration-pattern)

## About the Directory

Middleware components act as gates in the routing pipeline. They handle cross-cutting concerns such as request logging, header security, body parsing, session extraction, and user authentication.

## Verification Middleware

The directory features the authentication guard **`verifyToken.js`**. It implements a higher-order function that generates middleware dynamically based on authorized user roles.

### Functional Behavior

1. **Token Extraction**: Reads the session cookie named `token` from the request jar (`req.cookies.token`). If the cookie is absent, it immediately rejects the request with a `401 Unauthorized` status.
2. **Signature Verification**: Verifies token validity using the `jsonwebtoken` library and the system's `JWT_SECRET`.
3. **Role-Based Access Control (RBAC)**: Checks if the user role decoded from the token matches any of the `allowedRoles` passed to the middleware generator. If the role is not matched, it blocks access with a `401 Forbidden` status (typically logged as forbidden).
4. **Context Propagation**: Attaches the decoded token payload (usually containing `userId`, `role`, and other details) to the `req.user` namespace, making it accessible to downstream controllers.
5. **Next Trigger**: Calls `next()` to hand off execution to the next middleware or controller in the route chain.

## JWT Error Handling

The middleware explicitly handles token verification exceptions to return clean, actionable responses to client applications:

| Exception Name | HTTP Status | Client Response Message | Action Required |
| :--- | :--- | :--- | :--- |
| Missing Token Cookie | `401` | `"Unauthorized request, please login"` | Redirect user to login page, clear local store. |
| `TokenExpiredError` | `401` | `"session expired. Please login again"` | Re-authenticate, refresh user token. |
| `JsonWebTokenError` | `401` | `"invalid token. Please login again"` | Clear corrupt cookie and force user re-login. |
| Unhandled Exceptions | `500` | `"Internal server authentication error"` | System logger alert (investigate server logs). |

## Integration Pattern

To secure an Express endpoint, import and invoke `verifyToken` directly within the route configuration, specifying which roles are authorized to access the resource:

```javascript
import { verifyToken } from '../middleware/verifyToken.js';

// Route accessible only by registered Users
router.post('/create-campaign', verifyToken('USER'), campaignController.create);

// Route accessible only by Administrators
router.get('/pending-campaigns', verifyToken('ADMIN'), campaignController.listPending);

// Route accessible by both Users and Administrators
router.get('/verify-auth', verifyToken('USER', 'ADMIN'), campaignController.verify);
```
