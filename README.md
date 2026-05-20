# CrowdFunding Platform

A professional full-stack web application that enables users to launch, manage, and contribute to fundraising campaigns in real-time. Built using the MERN stack (MongoDB, Express, React, Node.js), it integrates secure payment processing with Stripe, scheduling engines, automated transactional emails, and a structured admin approval workflow.

## Table of Contents

- [About the Project](#about-the-project)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Repository Structure](#repository-structure)
- [Installation and Environment Setup](#installation-and-environment-setup)
- [Security Architecture](#security-architecture)
- [Contact](#contact)

## About the Project

This platform is designed to connect campaign creators with prospective backers securely and transparently. Creators can set targets, deadlines, and upload campaign imagery. Backers can browse active campaigns, review contribution histories, and make secure donations. The application includes a verification layer where administrators must approve newly created campaigns before they go live to the public.

## Key Features

- **User Authentication**: Secure register and login flows powered by JSON Web Tokens stored in HttpOnly cookies, supporting User and Admin roles.
- **Campaign CRUD**: Creating, reading, updating, and tracking campaigns with goal amounts, raised amounts, and deadlines.
- **Stripe Payments**: Real-time card charge generation using Stripe Payment Intents and secure server-to-server confirmation via Stripe Webhooks.
- **Admin Approval Queue**: Multi-tier access allowing administrators to review, approve/reject pending campaigns, and block/unblock users.
- **Transactional Notifications**: Automated email receipts and status updates powered by Nodemailer.
- **Background Scheduler**: Automated background tasks driven by node-cron to manage expired campaigns and send campaign reminders.

## Technology Stack

### Backend
- **Node.js** & **Express.js**: Fast, minimalist web framework for building RESTful APIs.
- **MongoDB** & **Mongoose**: Document-oriented database with object data modeling schemas.
- **Security & Utilities**: Helmet headers, CORS policies, Morgan logging, and Bcrypt encryption.

### Frontend
- **React 19**: Modern component lifecycle, hooks, and virtual DOM renderer.
- **Vite 7**: Lightning-fast build tool and local dev environment server.
- **Tailwind CSS v4**: Utility-first CSS framework for custom professional interfaces.
- **State & Routing**: Zustand for lightweight global authentication stores, React Router 7 for browser routing.
- **Forms**: React Hook Form for client-side form validation.

## Repository Structure

```
CrowdFunding/
├── backend/                # Express backend application
│   ├── controllers/        # Business logic controllers (e.g., Stripe payments)
│   ├── middleware/         # Custom authentication and verification filters
│   ├── models/             # Mongoose MongoDB collections definitions
│   ├── routes/             # API routing endpoints (Admin, User, and Public)
│   └── services/           # Background chron jobs, auth logic, and email clients
└── frontend/               # Vite React frontend application
    ├── public/             # Static browser assets
    └── src/                # Frontend source code
        ├── assets/         # CSS style variables and graphic assets
        ├── components/     # UI pages and routing guard components
        ├── config/         # System base URL endpoints configurations
        └── store/          # Zustand global stores declarations
```

## Installation and Environment Setup

### Prerequisites

You must have Node.js (version 20+ recommended) and MongoDB installed or have access to a MongoDB Atlas cluster.

### Step-by-Step Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Riyaz706/CrowdFunding.git
   cd CrowdFunding
   ```

2. Set up the backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Set up the backend environment variables:
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_jwt_secret_token
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_signing_secret
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_email_app_password
   FRONTEND_URL=http://localhost:5173
   ```

4. Set up the frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

5. Set up the frontend environment variables:
   Create a `.env` file in the `frontend/` directory:
   ```env
   VITE_API_URL=http://localhost:3000
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

6. Run the application:
   - Start the backend server (from `backend/`): `npm run dev`
   - Start the frontend server (from `frontend/`): `npm run dev`

## Security Architecture

- **Password Encryption**: All passwords are dynamically salted and encrypted using Bcrypt prior to persistence in MongoDB.
- **Session Protection**: JSON Web Tokens are stored in HttpOnly, secure, SameSite cookies, shielding the application from Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF) vulnerabilities.
- **Secure Middleware**: Role-based access validation prevents unauthorized users from accessing admin operations or creating unauthorized campaigns.
- **API Defense**: Integrated Helmet middleware blocks malicious HTTP headers and specifies tight content security policies.

## Contact

**Mohammad Riyaz**
- Email: riyazmohammad70608@gmail.com
- LinkedIn: https://www.linkedin.com/in/md-riyaz-1a746b272/
