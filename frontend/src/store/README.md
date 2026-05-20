# Client Global Stores Directory

This directory contains global state management configurations, specifically implementing the application authentication and session store using Zustand.

## Table of Contents

- [About the Directory](#about-the-directory)
- [Auth Store Specification (`authStore.js`)](#auth-store-specification-authstorejs)
  - [State Variables](#state-variables)
  - [Action Methods](#action-methods)
- [Usage Pattern](#usage-pattern)

## About the Directory

The application avoids complex Redux boilerplate by utilizing **Zustand** as a lightweight, centralized state manager. It provides hooks that components can subscribe to, triggering re-renders only when target fields update.

---

## Auth Store Specification (`authStore.js`)

The auth store manages user profile credentials and coordinates API calls to the server authentication routes.

### State Variables

| Variable | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `currentUser` | `object` \| `null` | `null` | Holds active user profile data (ID, email, name, role). |
| `loading` | `boolean` | `true` | Tracks network requests, preventing UI rendering during initial checks. |
| `error` | `string` \| `null` | `null` | Holds request error messages. |
| `isAuthenticated`| `boolean` | `false` | Access toggle representing whether a valid token session is active. |

### Action Methods

- **`login(userCredWithRole)`**:
  - Sets `loading: true`.
  - Dispatches `POST` request to `${BASE_URL}/common-api/login`.
  - On success: Saves user profile details in `currentUser` and sets `isAuthenticated` to `true`.
  - On failure: Clears session state and writes the server error response to `error`.
- **`checkAuth()`**:
  - Initiates silently on application mount to check for an existing session cookie.
  - Dispatches `GET` request to `${BASE_URL}/common-api/verify-auth`.
  - On success: Restores user session in store.
  - On failure (e.g. cookie expired or absent): Silently sets `isAuthenticated` to `false` and clears the loading lock.
- **`logout()`**:
  - Contact the server endpoint `/common-api/logout` to clear cookie headers.
  - Resets all store variables to default values.

---

## Usage Pattern

To consume the store inside a React component, use the hook export:

```jsx
import { authStore } from '../store/authStore.js';

function ProfileWidget() {
  // Subscribe only to needed values for optimized re-renders
  const { currentUser, logout } = authStore();

  if (!currentUser) return <p>Please sign in</p>;

  return (
    <div>
      <p>Welcome, {currentUser.firstName} ({currentUser.role})</p>
      <button onClick={logout}>Sign Out</button>
    </div>
  );
}
```
