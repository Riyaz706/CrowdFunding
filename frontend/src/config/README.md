# Client Configuration Directory

This directory contains client-side configuration parameters, primarily defining backend communication endpoints.

## Table of Contents

- [About the Directory](#about-the-directory)
- [API Configuration (`api.js`)](#api-configuration-apijs)
- [Environment Specific Resolution](#environment-specific-resolution)

## About the Directory

Maintaining configuration variables in a single directory ensures consistency across components. It decouples hardcoded URLs from HTTP query pipelines, facilitating deployment across testing, staging, and production environments.

---

## API Configuration (`api.js`)

The configuration directory exposes **`api.js`**, which determines the core connection endpoint:
- **Variable**: Exports the resolved string `BASE_URL`.
- **Precedence**: Reads `import.meta.env.VITE_API_URL` as the primary source. If that environment variable is not defined, it defaults to `http://localhost:3000`.

---

## Environment Specific Resolution

Vite compiles environment variables using the `import.meta.env` syntax:

- **Local Development**:
  - Resolved from the local `.env` file (e.g. `VITE_API_URL=http://localhost:3000`).
- **Production Deployments**:
  - Read from environment settings configured on hosting platforms (like Vercel).
- **Client Imports**:
  ```javascript
  import BASE_URL from './config/api.js';

  // Example Axios call
  axios.get(`${BASE_URL}/api/user/campaigns`, { withCredentials: true });
  ```
