# CrowdFunding Backend API

This directory contains the Node.js and Express backend API for the CrowdFunding platform. It handles user authentication, campaign creation, donation logs, Stripe payment verification, transactional email triggers, and cron schedulers.

## Table of Contents

- [About the Backend](#about-the-backend)
- [Server Entry Flow](#server-entry-flow)
- [Environment Configurations](#environment-configurations)
- [Installation and Execution](#installation-and-execution)
- [API Routes and Controllers Map](#api-routes-and-controllers-map)
- [Utility Scripts](#utility-scripts)

## About the Backend

The backend is built as a RESTful JSON API using **Express 5** and **Mongoose 9**. It establishes a secure connection to MongoDB and exposes endpoints for public data views, client interactions (campaign creation and donations), and administrative controls (campaign approvals and user state management).

## Server Entry Flow

The main entry point of the server is `server.js`. The initialization flow operates as follows:

1. **Configurations Loading**: Load system variables from the `.env` file using the `dotenv` parser.
2. **Middleware Pipeline**:
   - `helmet`: Enhances API security headers.
   - `cors`: Grants cross-origin request permissions to the specified client URL, allowing credentials to pass through.
   - `express.json()`: Parses incoming JSON payloads (with raw JSON body parsing active specifically for the `/api/user/webhook` Stripe endpoint).
   - `cookieParser()`: Reads request headers to extract secure JWT session keys.
   - `morgan`: Outputs HTTP request logs in development mode.
3. **Database Connection**: Invokes Mongoose to open a connection pool to MongoDB.
4. **Routes Mounting**: Maps endpoints to the respective routing routers:
   - `/api/common` -> `commonApp.js`
   - `/api/user` -> `userApi.js`
   - `/api/admin` -> `AdminApi.js`
5. **Scheduler Engine**: Activates `scheduler.js` to begin background processing cron tasks.
6. **Error handling**: Intercepts unhandled routing calls or system errors inside a global Express error-handler middleware.

## Environment Configurations

You must create a `.env` file in the root of this directory with the following variables:

| Variable | Description | Example / Required Value |
| :--- | :--- | :--- |
| `PORT` | The port the Express server will listen on. | `3000` |
| `DB_URL` | Connection URI string to the MongoDB instance. | `mongodb://localhost:27017/crowdfunding` |
| `JWT_SECRET` | Secret token used to sign and verify JSON Web Tokens. | `super_secure_random_string` |
| `STRIPE_SECRET_KEY` | Private API key obtained from the Stripe developer dashboard. | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET`| Signing secret used to verify Stripe webhook signatures. | `whsec_...` |
| `EMAIL_HOST` | Outbound mail transfer agent host. | `smtp.gmail.com` |
| `EMAIL_PORT` | Port used to connect to the mail server. | `587` |
| `EMAIL_USER` | Email username used to send transactional updates. | `user@example.com` |
| `EMAIL_PASS` | Password or App password for email client verification. | `app_password` |
| `EMAIL_FROM` | Sender address to display in outbound emails. | `noreply@crowdfunding.com` |
| `CLIENT_URL` | The client-side origin URL to whitelist for CORS access. | `http://localhost:5173` |

## Installation and Execution

1. Change directory to backend:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch development server with live reload (uses `nodemon`):
   ```bash
   npm run dev
   ```

4. Launch production server:
   ```bash
   npm start
   ```

## API Routes and Controllers Map

Detailed documentations for sub-packages can be accessed below:

- **[Models](file:///Users/mdriyaz/.gemini/antigravity/scratch/CrowdFunding/backend/models/README.md)**: Mongoose collection schemas.
- **[Routes](file:///Users/mdriyaz/.gemini/antigravity/scratch/CrowdFunding/backend/routes/README.md)**: Express routing paths and roles constraints.
- **[Controllers](file:///Users/mdriyaz/.gemini/antigravity/scratch/CrowdFunding/backend/controllers/README.md)**: Controllers handling Stripe integrations and transactional operations.
- **[Middleware](file:///Users/mdriyaz/.gemini/antigravity/scratch/CrowdFunding/backend/middleware/README.md)**: Custom JWT verification systems.
- **[Services](file:///Users/mdriyaz/.gemini/antigravity/scratch/CrowdFunding/backend/services/README.md)**: Email pipelines, auth services, and scheduling engines.

## Utility Scripts

The backend folder features helper utility scripts:

- **`inspectDB.js`**: Connects to the database and prints collection counts and data statistics. Run using: `node inspectDB.js`.
- **`seedAdmin.js`**: Seeds a default administrator user account if it doesn't already exist. Run using: `node seedAdmin.js`.
- **`updateCampaignImages.js`**: Quick script to update placeholder image URLs on existing campaigns. Run using: `node updateCampaignImages.js`.
- **`test.http`**: A collection of HTTP request templates for testing API endpoints using REST client tools.
