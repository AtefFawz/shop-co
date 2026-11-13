# SHOP.CO

A bilingual fashion e-commerce storefront built with Next.js, React, and TypeScript. The application includes product discovery, customer accounts, cart and checkout flows, order management, and an administration area. It is designed for Arabic and English, with responsive layouts and installable PWA support.

## Overview

SHOP.CO is the frontend for an API-backed online store. The Next.js application provides the storefront and account experiences, while product, inventory, authentication, and order data are supplied by a separate backend service.

### Main features

- **Storefront and catalog** — browse products, categories, brands, best sellers, and product details; search, filter, sort, and paginate catalog results.
- **Shopping tools** — variant-aware cart, saved items, wishlist, recently viewed products, product comparison, and price alerts.
- **Customer accounts** — sign-up, email verification, sign-in, password recovery, Google OAuth, profile settings, and order history.
- **Checkout and orders** — shipping details, cash-on-delivery checkout, order confirmation, order details, and invoices. The backend validates stock and calculates authoritative prices and totals.
- **Administration** — dashboard, product management, order management, and customer administration.
- **Arabic and English** — Arabic is the default locale; layout direction switches between RTL and LTR with the selected language.
- **Appearance and accessibility** — light and dark themes, adjustable text size and line spacing, higher contrast, and reduced-motion preferences.
- **Notifications** — an in-app notification inbox, configurable local notification preferences, and live updates through Socket.IO when configured.
- **Installable PWA** — app manifest, home-screen icons, standalone display mode, launch screen, and a basic offline fallback.

## Technology

| Area | Tools |
| --- | --- |
| Framework | Next.js App Router 16, React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4, shared semantic design tokens |
| UI and motion | MUI, Base UI, Framer Motion, GSAP, Lucide |
| Client state | Zustand and React context |
| Data and networking | Axios, Next.js rewrites, Socket.IO Client |
| Charts | Recharts |
| Testing | Vitest |

## Requirements

- Node.js **22.13.0 or newer**
- npm
- A running SHOP.CO-compatible backend API for catalog, authentication, customer, order, and administration data

The frontend repository does not include the backend service or its database.

## Run locally

```bash
git clone <repository-url>
cd shop-co
npm ci
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Update `.env.local` to point to your backend before testing API-dependent features. The default local API rewrite targets `http://localhost:4000/api`.

### Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Public origin of the frontend. Used for canonical and social metadata. |
| `NEXT_PUBLIC_API_URL` | Yes for API features | Backend API base URL, including the `/api` path. |
| `NEXT_PUBLIC_SOCKET_URL` | Optional | Socket.IO server origin, without the `/api` suffix. Without it, live socket updates are disabled. |
| `NEXT_PUBLIC_CARD_PAYMENTS_ENABLED` | Optional | Keep `false` unless a real card-payment gateway is enabled and configured on the backend. |
| `ALLOW_INSECURE_TLS` | Local development only | Set to `true` only when a local HTTPS backend uses a self-signed certificate. It is ignored in production. Keep it unset or `false` otherwise. |

`NEXT_PUBLIC_*` values are included in the browser bundle. Do not put passwords, API secrets, private keys, or other credentials in them.

### Backend connection

The browser uses same-origin paths and Next.js rewrites rather than calling the backend host directly:

- `/api/backend/*` is forwarded to the configured API base URL.
- `/api/auth/*` is forwarded to the backend authentication routes used for session refresh and logout.

For local development, configure the backend to accept the frontend origin and credentials. The backend should set the expected HttpOnly session cookies and support the API contract used by this frontend. See [Backend integration](docs/BACKEND_INTEGRATION.md) for endpoint and payload details.

## Useful commands

```bash
npm run dev        # Start the development server
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript without emitting files
npm test           # Run the Vitest test suite
npm run test:watch # Run Vitest in watch mode
npm run build      # Create a production build
npm start          # Serve the production build
```

## Application routes

| Area | Routes |
| --- | --- |
| Storefront | `/`, `/shop`, `/brand`, `/category`, `/selling`, `/shop/details/[id]` |
| Shopping | `/shop/details/cart`, `/shop/details/cart/checkout`, `/compare`, `/wishlist`, `/saved-for-later`, `/recently-viewed`, `/price-alerts` |
| Customer | `/auth/signin`, `/auth/signup`, `/auth/verify-email`, `/auth/forgot-password`, `/auth/success`, `/my-space`, `/user/profile`, `/my-orders`, `/shop/orders/[id]`, `/shop/orders/[id]/invoice`, `/order-success` |
| Style and selling | `/stylist`, `/post` |
| Administration | `/dashboard`, `/dashboard/products`, `/dashboard/products/add`, `/dashboard/products/edit/[id]`, `/dashboard/admin/orders`, `/dashboard/admin/users`, `/dashboard/admin/users/about/[id]` |

## Project structure

```text
src/
├── app/             # App Router routes, layouts, metadata, and route handlers
├── features/        # Domain-specific pages and components
├── shared/          # Shared UI, navigation, localization, theme, and preferences
├── hooks/           # Reusable React hooks
├── lib/             # API clients, authentication helpers, sockets, and utilities
├── store/           # Client-side state stores
├── types/           # Shared TypeScript types
└── utils/           # General-purpose helpers

public/
├── icons/           # PWA and application icons
├── images/          # Static visual assets
├── svg/             # Brand and payment-provider assets
├── offline.html     # Offline navigation fallback
└── sw.js            # Service worker

docs/                # Architecture and integration guides
```

Feature code is grouped by domain rather than by file type. Route files under `src/app/` stay small and delegate the page UI to the corresponding feature module. See [Architecture](docs/ARCHITECTURE.md) for the module boundaries and route ownership.

## PWA and offline behavior

The app includes a web manifest, install icons, standalone display settings, and a service worker. On supported browsers, users can install SHOP.CO from the browser's install option or add it to their home screen.

The service worker provides a basic offline fallback for navigation and caches selected static assets. It does **not** make checkout, account pages, API requests, or order data available offline. Full push delivery while the app is closed requires a server-side Web Push implementation; see [PWA notes](docs/PWA.md).

PWA installation and service-worker features require a secure context in normal deployments (HTTPS, or localhost during local browser development). The service worker is registered by the application in production mode.

## Localization and preferences

- Arabic is the default locale and uses RTL layout; English uses LTR layout.
- Translation messages are maintained in `src/shared/i18n/messages.ts`.
- Theme selection is persisted locally and follows the operating-system preference until the user chooses a theme.
- Reading, accessibility, and notification preferences are stored in the current browser. They are not synchronized to the backend account.

See [Accessibility and preferences](docs/ACCESSIBILITY_AND_PREFERENCES.md) and [Theme system](docs/THEME_SYSTEM.md).

## Security and payment notes

- Browser API requests use credentials and the application's HttpOnly cookie session flow. Do not move access or refresh tokens into `localStorage` or JavaScript-readable cookies.
- The backend remains responsible for authorization, product availability, pricing, discounts, shipping calculations, and order validation.
- Card payments are disabled by default. Enabling the frontend flag alone does not provide a payment gateway.
- Camera, microphone, geolocation, and payment browser features are currently disabled by the configured `Permissions-Policy` response header. Change this only when a user-facing feature requires one of these capabilities and the security implications have been reviewed.

## Documentation

- [Architecture and route ownership](docs/ARCHITECTURE.md)
- [Backend integration and API expectations](docs/BACKEND_INTEGRATION.md)
- [PWA installation, caching, and notifications](docs/PWA.md)
- [Accessibility and user preferences](docs/ACCESSIBILITY_AND_PREFERENCES.md)
- [Theme system](docs/THEME_SYSTEM.md)

