# Client Assets Directory

This directory contains visual media assets, icons, and illustrations used inside React components. These assets are compiled and optimized as part of the client build process.

## Table of Contents

- [About the Directory](#about-the-directory)
- [Vite Asset Pipeline](#vite-asset-pipeline)
- [Asset Index](#asset-index)
- [Import Syntax Examples](#import-syntax-examples)

## About the Directory

Unlike the static `/public` folder, assets stored in `src/assets/` are included in the bundler's dependency graph. This enables asset optimizations like image compression, dynamic URL generation, cache-busting hashes, and inlining.

## Vite Asset Pipeline

During a production compilation (`npm run build`):
- **Cache-Busting Hashes**: Filenames receive unique content hashes (e.g. `hero-new-A9x2d8e.png`) to invalidate browser cache when images change.
- **Inlining Limits**: Small vector graphics (typically under 4 KiB) are automatically inlined directly into JS bundles as base64-encoded strings to reduce network latency.

---

## Asset Index

The directory contains the following compiled assets:

| Asset | Type | Purpose | Dimensions / Specs |
| :--- | :--- | :--- | :--- |
| `hero-new.png` | PNG | Dashboard Banner | Main hero illustration displayed on the welcome page dashboard. High-res image. |
| `hero.png` | PNG | Fallback Banner | Secondary or alternative hero graphic. |
| `react.svg` | SVG | UI Graphic | Vector SVG logo representing React framework. |
| `vite.svg` | SVG | UI Graphic | Vector SVG logo representing Vite toolchain. |

---

## Import Syntax Examples

Always import these assets into your JS/JSX files using ESM imports to let Vite handle resolving their URLs.

### React Integration
```jsx
import heroBanner from '../assets/hero-new.png';

function HeroSection() {
  return (
    <div className="hero-container">
      <img src={heroBanner} alt="Fundraising Campaign Banner" className="w-full h-auto" />
    </div>
  );
}
```

### CSS Background Integration
```css
.hero-bg {
  background-image: url('../assets/hero-new.png');
}
```
