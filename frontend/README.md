# CrowdFunding Frontend Client

This directory contains the React single-page frontend application for the CrowdFunding platform. It features user authentication layouts, campaign directories, real-time donation progress bars, Stripe payment gateways, and admin dashboards.

## Table of Contents

- [About the Frontend](#about-the-frontend)
- [Client Routing Schema](#client-routing-schema)
- [Global State and API Client](#global-state-and-api-client)
- [Environment Configurations](#environment-configurations)
- [Available Commands](#available-commands)
- [Directory Specifications](#directory-specifications)

## About the Frontend

The client-side application is built using **React 19** and compiled with **Vite 7**. Styling is configured using utility-first classes in **Tailwind CSS v4**. It implements client-side form controls using **React Hook Form**, notification overlays with **React Hot Toast**, and global sessions using the **Zustand** store.

---

## Client Routing Schema

The application implements client-side routing using **React Router 7** defined in `App.jsx`.

### Router Structures

All views are wrapped under the `RootLayout` view:

```
RootLayout (Header + Navigation + Context Toast)
├── Public Views:
│   ├── /home -> Home (Dashboard aggregates, statistics cards)
│   ├── /login -> Login (Authentication forms)
│   ├── /register -> Register (Signup details)
│   ├── /campaigns -> Campaigns (Grid listing approved campaigns)
│   ├── /campaign/:id -> CampaignDetails (Individual description and backer logs)
│   └── /progress-bar -> ProgressBar (Loading assets)
├── Protected User Views (USER access required):
│   ├── /create-campaign -> CreateCampaign (Form with image links and targets)
│   ├── /donor-tracking -> DonorTracking (User dashboard details)
│   └── /donate/:campaignId -> DonationPage (Stripe Card form mounts)
└── Protected Admin Views (ADMIN access required):
    └── /admin-approval -> AdminApproval (Approvals manager, block panels)
```

---

## Global State and API Client

- **State Container (`authStore.js`)**: Managed using Zustand. It holds session records (`user` profile and `isAuthenticated` status) and coordinates async authentication calls (login, verification, logout).
- **HTTP Client**: Axios is used to communicate with the backend. It is configured to pass HTTP credentials (`withCredentials: true`) to ensure security cookie tokens are transmitted in request headers automatically.

---

## Environment Configurations

You must create a `.env` file in the root of this directory with the following variables:

| Variable | Description | Example / Required Value |
| :--- | :--- | :--- |
| `VITE_API_URL` | The endpoint origin URL of the backend API. | `http://localhost:3000` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Public key to initialize the Stripe Elements container. | `pk_test_...` |

---

## Available Commands

In the frontend directory, you can run:

- **`npm run dev`**: Starts the local development environment using Vite (typically at `http://localhost:5173`).
- **`npm run build`**: Compiles and minifies the source files into static assets in the `dist/` folder.
- **`npm run lint`**: Analyzes source code using ESLint for style consistency and syntax warnings.
- **`npm run preview`**: Runs a local server to test the generated production bundle from the `dist/` directory.

---

## Directory Specifications

Detailed documentation for subdirectory structures can be accessed below:

- **[Components](file:///Users/mdriyaz/.gemini/antigravity/scratch/CrowdFunding/frontend/src/components/README.md)**: Details on pages, form validations, layouts, and route guards.
- **[Store](file:///Users/mdriyaz/.gemini/antigravity/scratch/CrowdFunding/frontend/src/store/README.md)**: Zustand global stores declarations.
- **[Config](file:///Users/mdriyaz/.gemini/antigravity/scratch/CrowdFunding/frontend/src/config/README.md)**: Central API origin configs.
- **[Public](file:///Users/mdriyaz/.gemini/antigravity/scratch/CrowdFunding/frontend/public/README.md)**: Favicons and SVG asset templates.
- **[Assets](file:///Users/mdriyaz/.gemini/antigravity/scratch/CrowdFunding/frontend/src/assets/README.md)**: Compiled image and SVG assets.
