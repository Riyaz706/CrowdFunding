# React Components Directory

This directory contains the page views, layout wraps, input forms, and security filters that drive the CrowdFunding frontend client interface.

## Table of Contents

- [About the Directory](#about-the-directory)
- [Master Layout Frame](#master-layout-frame)
- [Security Gates (Protected Routes)](#security-gates-protected-routes)
- [Component Specifications](#component-specifications)
- [Stripe Elements Payment Checkout](#stripe-elements-payment-checkout)

## About the Directory

The client uses a modular, component-driven design. Views are decoupled from state-management stores, utilizing Axios interfaces to hook into the backend API and Zustand schemas to synchronize authentication sessions.

---

## Master Layout Frame

- **`RootLayout.jsx`**: The root layout template that encapsulates all child views. It renders the primary application navigation header (NavBar), updates navigation links dynamically based on user session state (Guest, Authenticated User, Admin), and embeds the client-side Toast container for global floating status popups.

---

## Security Gates (Protected Routes)

- **`ProtectedRoute.jsx`**: A client-side routing guard. It extracts the global login credentials using the auth store.
  - **Redirect Mechanics**: If the user is unauthenticated, it redirects to `/login`. If the authenticated user's role is not within the authorized `allowedRoles` array, it redirects them to the Home view.
  - **Wrapper**: Wraps child paths dynamically, protecting restricted areas like `/create-campaign` or `/admin-approval` from direct URL browser access.

---

## Component Specifications

| File | Purpose | Key Hooks & Libraries | Mapped Path |
| :--- | :--- | :--- | :--- |
| `Home.jsx` | Landing page displaying global metrics and campaign cards. | Axios (stats load) | `/home` |
| `Login.jsx` | Form collecting credentials for session sign-in. | `react-hook-form`, `authStore` | `/login` |
| `Register.jsx` | Form capturing registration details. | `react-hook-form` | `/register` |
| `Campaigns.jsx` | Grid dashboard rendering approved, active campaigns. | Axios | `/campaigns` |
| `CampaignDetails.jsx`| Comprehensive campaign description page with backer log tables. | Axios, `ProgressBar` | `/campaign/:id` |
| `CreateCampaign.jsx` | Campaign creation form (validation: title min length 5). | `react-hook-form` | `/create-campaign` |
| `DonationPage.jsx` | Donation checkout processing screen. | Stripe SDK (`Elements`) | `/donate/:campaignId` |
| `DonorTracking.jsx` | Dashboard showing campaigns created, funds raised, and payments sent. | Axios | `/donor-tracking` |
| `AdminApproval.jsx` | Administrative list queue showing user blocks & approvals. | Axios | `/admin-approval` |
| `ProgressBar.jsx` | Dynamic indicator representing funding margins. | None (presentational) | Reusable UI |
| `ErrorPage.jsx` | Fullscreen fallback error boundary screen. | `useRouteError` | Fallback |
| `ErrorAlert.jsx` | Inline alert message warning container. | None (presentational) | Reusable UI |

---

## Stripe Elements Payment Checkout

The **`DonationPage.jsx`** component handles card donations:
1. **Context Initialization**: Mounts the Stripe **`Elements`** provider initialized with `VITE_STRIPE_PUBLISHABLE_KEY`.
2. **Dynamic UI Mount**: Mounts the Stripe **`CardElement`** input frame, shielding client code from directly capturing credit card credentials.
3. **Intent Handshake**: Contacts the backend API to generate a Stripe payment intent client secret.
4. **Charge Confirmation**: Calls Stripe SDK's `confirmCardPayment()` to execute the charge directly against Stripe servers, and redirects users to tracking screens upon completion.
