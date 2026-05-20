# Backend Services

This directory contains utility modules and backend workers that handle authentication operations, cron schedulers, and automated email dispatches.

## Table of Contents

- [About the Directory](#about-the-directory)
- [Service Specifications](#service-specifications)
  - [Authentication Service](#authentication-service)
  - [Email Service](#email-service)
  - [Cron Scheduler Service](#cron-scheduler-service)

## About the Directory

Services house helper procedures that handle cross-cutting workflows, run background routines, or interface with external resources (like email servers). They are decoupled from the routing controllers to facilitate reuse and ease testing.

---

## Service Specifications

### Authentication Service

Located in **`authService.js`**. It encapsulates registration and user login validations:

- **User Registration (`register`)**:
  - Checks if a user already exists with the given email address. Throws a `409 Conflict` error if registered.
  - Generates a new Mongoose user document and triggers validation.
  - Hashes the plain-text password using **BcryptJS** with `12` salt rounds.
  - Dispatches an asynchronous welcome email using the `emailService` without blocking the main database registration process.
  - Returns the newly created user record with the `password` field deleted.
- **Session Authentication (`authentication`)**:
  - Resolves user records by email. Returns `401 Unauthorized` if not found.
  - Verifies that the user account is active (`isActive: true`). If blocked, rejects access with a `403 Forbidden` error.
  - Validates credentials using `bcrypt.compare()`.
  - Signs a JSON Web Token containing `userId`, `email`, `role`, and `firstName` payload claims, set to expire in **1 hour**.
  - Returns the signed JWT along with the user profile information.

### Email Service

Located in **`emailService.js`**. Handles SMTP configurations and email styling using **Nodemailer**:

- **Platform IPv4 Workaround**: Forces IPv4 resolution hierarchy (`dns.setDefaultResultOrder('ipv4first')`) to prevent network timeout errors on modern hosting platforms (like Render) when initializing SMTP connections.
- **Mailer Configuration**: Creates a Nodemailer SMTP transporter using configuration variables (`EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`).
- **Templates**:
  - `sendWelcomeEmail(userEmail, name)`: Sends a styled HTML introduction card containing a call-to-action button linking back to the platform.
  - `sendDonationReceipt(donorEmail, amount, campaignTitle)`: Issues a detailed donation receipt email confirming receipt of the contribution amount.
  - `sendCreatorNotification(creatorEmail, donorName, amount, campaignTitle)`: Notifies campaign creators when a donor contributes to their projects, detailing the amount raised.

### Cron Scheduler Service

Located in **`scheduler.js`**. Manages background intervals using **Node-Cron**:

- **Deactivation Runner (`initCampaignScheduler`)**:
  - Spawns a background task running every 15 minutes (`*/15 * * * *`).
  - Performs an atomic query to find active campaigns (`status: true`) whose `deadline` has elapsed (`deadline < now`).
  - Automatically updates their status flags to `false`, preserving system hygiene by removing expired campaigns from the active pool.
