# Backend API Routes

This directory contains the Express routers that map HTTP request endpoints to specific business logic handlers and controllers.

## Table of Contents

- [About the Directory](#about-the-directory)
- [Router Modules](#router-modules)
- [Route Mappings](#route-mappings)
  - [Common Routes (Public / Shared Auth)](#common-routes-public--shared-auth)
  - [User Routes (Public Views & Authenticated Actions)](#user-routes-public-views--authenticated-actions)
  - [Admin Routes (Privileged Actions)](#admin-routes-privileged-actions)

## About the Directory

Routes define the API contract between the server and the frontend clients. They handle HTTP methods, map URL parameters, invoke authentication middlewares, and forward requests to controllers or direct handlers.

---

## Router Modules

The routing engine is split into three main modules mounted under `/api` in `server.js`:

1. **`commonApp.js`**: Mounted at `/api/common`. Handles registration, session control, verification checks, and public statistics.
2. **`userApp.js`**: Mounted at `/api/user`. Manages public campaign browsing, project creation, payment processing intents, Stripe hooks, and user account dashboards.
3. **`AdminApi.js`**: Mounted at `/api/admin`. Controls administrative dashboards, queue checks, campaign updates, and user blocks.

---

## Route Mappings

### Common Routes (Public / Shared Auth)

Mounted at `/api/common`.

| Method | Endpoint | Auth Level | Description | Input / Payload |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/register` | Public | Registers a new user. | JSON: `firstName`, `lastName`, `email`, `password` |
| `POST` | `/login` | Public | Authenticates credentials and sets secure cookie. | JSON: `email`, `password` |
| `GET` | `/verify-auth` | `USER`, `ADMIN` | Verifies active session token validity. | Header (Cookie) |
| `GET` | `/stats` | Public | Aggregates global system statistics. | None |
| `ALL` | `/logout` | Public | Clears the session cookie. | None |

### User Routes (Public Views & Authenticated Actions)

Mounted at `/api/user`.

| Method | Endpoint | Auth Level | Description | Input / Payload |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/campaigns` | Public | Lists all active, approved campaigns. | None |
| `GET` | `/campaign/:id` | Public | Retrieves specific campaign details. | URL Param: `id` |
| `POST` | `/create-campaign`| `USER` | Launches a new campaign (starts as inactive). | JSON: `title`, `description`, `goalAmount`, `deadline`, `imageUrl` |
| `POST` | `/create-payment-intent` | `USER` | Requests a Stripe Client Secret. | JSON: `amount`, `campaignId`, `description` |
| `GET` | `/verify-payment/:paymentIntentId` | `USER` | Manually checks Stripe transaction status. | URL Param: `paymentIntentId` |
| `POST` | `/webhook` | Public | Receives Stripe webhook events. | Raw JSON payload, signature header |
| `GET` | `/campaign-history/:campaignId` | `USER` | Lists donations made to a campaign. | URL Param: `campaignId` |
| `GET` | `/my-campaigns` | `USER` | Retrieves campaigns created by active user. | None |
| `GET` | `/my-donations` | `USER` | Retrieves donations made by active user. | None |
| `GET` | `/received-donations` | `USER` | Retrieves donations received by user's campaigns. | None |

### Admin Routes (Privileged Actions)

Mounted at `/api/admin`.

| Method | Endpoint | Auth Level | Description | Input / Payload |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/all-donations` | `ADMIN` | Retrieves global transactions log. | None |
| `GET` | `/pending-campaigns`| `ADMIN` | Retrieves queue of unapproved campaigns. | None |
| `GET` | `/all-campaigns` | `ADMIN` | Retrieves all campaigns in database. | None |
| `PUT` | `/campaign/:campaignId` | `ADMIN` | Edits details or toggles approval status. | URL Param: `campaignId`, JSON body adjustments |
| `PUT` | `/user/:userId` | `ADMIN` | Blocks or unblocks a user account. | URL Param: `userId`, JSON: `status` (Boolean) |
