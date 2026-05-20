# Frontend Public Directory

This directory contains static, uncompiled assets that are copied directly to the root of the frontend build output (`dist/`) during bundling.

## Table of Contents

- [About the Directory](#about-the-directory)
- [How Static Files are Served](#how-static-files-are-served)
- [Asset Catalog](#asset-catalog)
- [Usage Guidelines](#usage-guidelines)

## About the Directory

In Vite-based React projects, the `public` directory holds files that must bypass the asset compilation pipeline. These assets maintain their exact names and structure, are not hashed or minified, and are served at the root URL path of the application.

## How Static Files are Served

When running the project locally in development mode (`npm run dev`) or serving the production bundle (`npm run preview`), these files are served from the root path.

For example:
- `frontend/public/favicon.svg` is accessible at `/favicon.svg`.
- `frontend/public/icons.svg` is accessible at `/icons.svg`.

---

## Asset Catalog

The directory contains the following static assets:

| Asset | Type | Purpose | Description |
| :--- | :--- | :--- | :--- |
| `favicon.svg` | SVG | Browser Icon | Displayed on the browser tab or bookmark bar. Reference: `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />`. |
| `icons.svg` | SVG | SVG Icon Sprite | Contains defined vector icons compiled into symbols (such as arrows, close buttons, checkmarks). Used via vector instantiation references. |

---

## Usage Guidelines

- **SVG Sprites (`icons.svg`)**: To utilize icons from the sprite sheet inside a React component without importing them individually:
  ```jsx
  function CheckIcon() {
    return (
      <svg className="w-5 h-5 text-green-500">
        <use href="/icons.svg#check" />
      </svg>
    );
  }
  ```
- **Relative Path Caution**: Do not use relative imports in your JavaScript files to reference files in this directory (e.g., `import './public/favicon.svg'`). Always use root-relative paths like `/favicon.svg`.
