# Architecture update notes

## Project organization

- Reorganized UI into domain-oriented modules under `src/features/` (account, admin, auth, cart, catalog, checkout, home, notifications, orders, reviews, and seller).
- Kept Next.js route adapters under `src/app/`; public route URLs are unchanged. UI implementations live in descriptively named feature page components.
- Moved cross-feature layout, navigation, motion, feedback, reusable UI, and theme controls into `src/shared/`.
- Moved feature-owned static content into each feature's `data/` folder and global navigation/payment data into `src/shared/config/` and `src/shared/data/`.
- Renamed generic/misleading non-API component identifiers and files to match their actual roles, then updated internal imports.
- Split the storefront hero’s magnetic interaction, animated stat value, 3D headline line, editorial stamp, and brand ticker into dedicated components; moved lookbook copy/configuration into a feature-owned data module.
- Added `ARCHITECTURE.md` documenting route ownership, naming rules, folder boundaries, and the API boundary.

## API preservation

The following files were kept byte-for-byte identical to the uploaded source: all files under `src/lib/`, all files under `src/hooks/`, `src/proxy.ts`, and `next.config.ts`. The refactor did not rename endpoints or modify request/authentication behavior.

## Local verification

Static checks performed: TypeScript/TSX/JS syntax parsing, local import path resolution, named export/import consistency, and default-export identifier consistency. A complete `next build`/lint could not be verified in the isolated environment because npm package installation was unavailable. Run these commands locally after installing dependencies:

```bash
npm ci
npm run lint
npm run build
npm run dev
```
