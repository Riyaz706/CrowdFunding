# Client Source Directory

This directory houses the React source code for the CrowdFunding platform frontend client, including styles, routes, configurations, state managers, and view components.

## Table of Contents

- [About the Directory](#about-the-directory)
- [Application Entry Sequence](#application-entry-sequence)
- [Module Architecture](#module-architecture)
- [Styles and Compilation](#styles-and-compilation)

## About the Directory

The `src/` directory represents the client working directory. It is managed by Vite using ES Modules to compile React code, run style processors, resolve module imports, and optimize assets.

---

## Application Entry Sequence

The bootstrapping sequence of the React application proceeds as follows:

1. **`index.html`**: Entry page referencing `src/main.jsx`.
2. **`src/main.jsx`**: The React client entry script. Imports `index.css` and mounts the `App` component into the DOM tree at `div#root` under `React.StrictMode`.
3. **`src/App.jsx`**: Bootstraps client routing using React Router 7.
   - Defines path mappings for public pages (Home, Login, Register, Campaigns, Details).
   - Sets up role-based security barriers using the `ProtectedRoute` wrapper component (categorized under USER or ADMIN).
   - Serves the layout frame `RootLayout` which renders headers, footer nodes, and the react-hot-toast notifications channel.

---

## Module Architecture

The codebase is organized into four main sub-packages:

- **`components/`**: Exposes reusable React layout containers, layout grids, forms, and pages. See the [Components README](file:///Users/mdriyaz/.gemini/antigravity/scratch/CrowdFunding/frontend/src/components/README.md).
- **`store/`**: Hosts global Zustand state machines managing user profile sessions and authorization logic. See the [Store README](file:///Users/mdriyaz/.gemini/antigravity/scratch/CrowdFunding/frontend/src/store/README.md).
- **`config/`**: Sets environment parameters, like backend server URLs. See the [Config README](file:///Users/mdriyaz/.gemini/antigravity/scratch/CrowdFunding/frontend/src/config/README.md).
- **`assets/`**: Hosts style directives and graphical vector layouts compiled directly into bundles. See the [Assets README](file:///Users/mdriyaz/.gemini/antigravity/scratch/CrowdFunding/frontend/src/assets/README.md).

---

## Styles and Compilation

The styling system is configured using Tailwind CSS v4:
- **`index.css`**: Mounts the global styling processor directives (`@import "tailwindcss";`) and custom global variables.
- **`App.css`**: Encapsulates specific style settings applied to the parent application container wrapper.
- **Vite Compilation**: Vite compiles JSX and CSS stylesheets, minifies payloads, manages cache busting, and generates the bundle files inside the `dist/` directory.
