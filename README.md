# SHOP.CO — Fashion Storefront

A responsive fashion e-commerce frontend built with **Next.js App Router**, **React**, **TypeScript**, and **Tailwind CSS v4**. The UI uses Framer Motion for restrained, accessible interaction animation.

## Highlights

- Responsive storefront, product browsing, shopping cart, authentication, orders, profile and admin dashboard routes.
- Light and dark appearance modes with animated icon transitions, saved preference, and system-preference support.
- Shared, coordinated light/dark design tokens with accessible focus and semantic color states.
- Arabic-first interface with a persistent Arabic/English language switch and automatic RTL/LTR direction.
- Persistent cart with variant-aware line items, stock-aware quantity limits, and a shared cart summary helper.
- Select individual cart lines for checkout, select/deselect the whole bag, or remove selected lines in one action.
- A skippable, session-only cinematic intro on the storefront; it respects reduced-motion preferences.
- Saved wishlist accessible from the storefront navigation.
- Standardized Egyptian pound (EGP) formatting across the main shopping, checkout, account, and order flows.
- Mobile navigation and search rendered through portals so they are not trapped by parent stacking contexts.
- Responsive motion and support for `prefers-reduced-motion`.
- The browser API client uses the same-origin `/api/backend` and `/api/auth` rewrites, sends the active locale, and relies on HttpOnly session cookies (no JavaScript-readable access token or manual Bearer header).
- Catalog search, filtering, and pagination follow Backend V5. Checkout submits product variants and an idempotency key; the backend remains authoritative for price, discount, stock, and shipping.
- Existing image loading configuration is retained in `next.config.ts`.

## Requirements

- Node.js 22.13 or newer (the repository `.nvmrc` pins 22.16.0).
- npm.
- A running backend API for authenticated/product data features.

## Getting started

```bash
cp .env.example .env.local
npm install # resolves the current dependencies and creates package-lock.json
# Commit the generated package-lock.json; use npm ci on subsequent clean installs
npm run dev
```

Open `http://localhost:3000`.

Set these environment variables in `.env.local` or your deployment environment:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public storefront URL used for canonical and social metadata. |
| `NEXT_PUBLIC_API_URL` | Backend API base URL used by the rewrite and server-side data client. |
| `NEXT_PUBLIC_SOCKET_URL` | Socket.IO server origin used for authenticated live updates. |
| `NEXT_PUBLIC_CARD_PAYMENTS_ENABLED` | Keep `false` until a real backend card-payment gateway is enabled; cash on delivery remains available. |

For local development, the backend URL defaults to `http://localhost:4000/api/` in the Next.js rewrite. Update `.env.local` when your API runs elsewhere. Point `NEXT_PUBLIC_SOCKET_URL` at the Socket.IO server origin (usually the same host without the `/api/` suffix).

## Useful commands

```bash
npm run dev      # Start local development
npm run lint     # Run ESLint
npm run build    # Create a production build
npm start        # Serve a production build
```

## Language and currency behavior

Arabic is the default language and uses right-to-left layout. The storefront language toggle switches between Arabic and English and saves the choice in the `shopco-language` local-storage key. Translations live in `src/shared/i18n/messages.ts` and are accessed through `useLocale()`.

Customer-facing price formatting uses `Intl.NumberFormat` through `src/lib/formatCurrency.ts` and displays EGP. Confirm that product prices returned by the configured API are stored in Egyptian pounds before deploying; change the central formatter if your catalog uses another currency. The wishlist saves to the browser under `shopco-wishlist`; cart data continues to use the `product` storage key and migrates older entries on read.

## Theme behavior

The appearance toggle is available in the desktop storefront header, mobile navigation drawer, and admin navigation. The selected theme is saved under the `shopco-theme` local-storage key. When there is no saved selection, the app follows the operating-system appearance preference. The initial theme class is applied before hydration to reduce flash on page load.

The shared theme implementation lives in `src/shared/theme/` and the design tokens plus legacy utility mappings are in `src/app/globals.css`. The refreshed palette pairs warm ivory/ink surfaces in light mode with deep green-charcoal surfaces in dark mode and a sage accent. Shared page containers are capped at 1600px for more controlled widescreen layouts; section spacing is owned by each page instead of an implicit global `section` rule.

## Project structure

```text
src/
  app/                    Next.js route adapters, layouts, metadata and boundaries
  features/               Domain-first feature modules and named page implementations
    account/              Profile and account views
    admin/                Dashboard, catalog, orders and user administration
    auth/                 Sign-in, sign-up and password recovery
    cart/                 Cart state presentation and cart page
    catalog/              Product discovery, details, filters and categories
    checkout/             Checkout and shipping UI
    home/                 Storefront landing page and hero
    notifications/        Notification presentation
    orders/               Customer order history, confirmation and details
    reviews/              Review and testimonial presentation
    seller/               Product submission UI
  shared/
    components/           Reusable navigation, feedback, motion, layout and UI primitives
    styles/               Shared component overrides
    theme/                Appearance provider and light/dark toggle
  assets/                 Imported visual assets
  features/*/data/        Feature-owned content/configuration
  shared/config/           Cross-feature navigation configuration
  shared/data/             Cross-feature static data
  hooks/                  Existing hooks (including API-related hooks, unchanged)
  lib/                    API clients, authentication infrastructure and sockets (unchanged)
  store/                  Client state stores
  types/                  Shared TypeScript types
  utils/                  General-purpose helpers
```

See [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) for the naming conventions and route-to-page ownership map. App Router files keep Next.js's required `page.tsx` name; their UI implementations use descriptive names under `src/features/**/pages/`.

## Notes

- Keep real secrets out of `NEXT_PUBLIC_*` variables: Next.js exposes them to the browser.
- API configuration remains environment-driven; see [`docs/BACKEND_V5_FRONTEND_INTEGRATION_AR.md`](./docs/BACKEND_V5_FRONTEND_INTEGRATION_AR.md) for the exact Backend V5 contract, cookie flow, OAuth flow, and deployment checklist.
- This frontend repository intentionally does not include a package lock because the supplied lockfile did not match `package.json`. Run `npm install` once, review and commit the newly generated lockfile, then use `npm ci` in CI and production builds.
- Product, auth, cart, order, and notification workflows still depend on the configured backend.

## Display preferences

The account Settings tab includes app-wide reading preferences: small/standard/large text scale, comfortable line spacing, reduced motion, and higher contrast. Preferences are stored locally in the browser and apply to both storefront and admin screens. English uses Geist and Arabic uses IBM Plex Sans Arabic. No backend endpoint or schema change is required.

## Account settings (V7)

See [`docs/ACCOUNT_SETTINGS_V7_AR.md`](docs/ACCOUNT_SETTINGS_V7_AR.md) for the Arabic implementation notes, supported backend capabilities, and the exact scope of local preference reset.
