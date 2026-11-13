# Architecture

SHOP.CO uses the Next.js App Router for routing and application composition. Route files under `src/app/` define URLs and metadata, while feature modules contain the page-specific interface and behavior.

## Source boundaries

| Directory | Responsibility |
| --- | --- |
| `src/app/` | App Router route adapters, root and route-group layouts, metadata, error/loading boundaries, and small route handlers. |
| `src/features/` | Storefront and business domains. Each feature owns its pages, components, and feature-specific data. |
| `src/shared/` | Components and providers shared across features, including navigation, layout, localization, theme, motion, and preferences. |
| `src/lib/` | API clients, authentication/session helpers, Socket.IO setup, formatting, and domain utilities. |
| `src/hooks/` | Reusable React hooks. |
| `src/store/` | Client-side state stores, including the cart store. |
| `src/types/` | Shared TypeScript domain and API types. |
| `src/utils/` | General-purpose helpers. |
| `public/` | Static assets, PWA icons, the service worker, and the offline page. |

Route groups `(shop)` and `(admin)` organize layouts and code. Their names do not appear in public URLs.

## Route ownership

| URL | Feature area |
| --- | --- |
| `/` | Home / storefront |
| `/shop` | Product catalog |
| `/shop/details/[id]` | Product details |
| `/brand` | Brand directory |
| `/category` | Category landing page |
| `/selling` | Best-selling products |
| `/shop/details/cart` | Shopping cart |
| `/shop/details/cart/checkout` | Checkout |
| `/compare` | Product comparison |
| `/wishlist` | Wishlist |
| `/saved-for-later` | Saved items |
| `/recently-viewed` | Recently viewed products |
| `/price-alerts` | Price alerts |
| `/auth/signin` | Sign-in |
| `/auth/signup` | Account registration |
| `/auth/verify-email` | Email verification |
| `/auth/forgot-password` | Password recovery |
| `/auth/success` | Google OAuth callback |
| `/my-space` | Customer space |
| `/user/profile` | Account profile and settings |
| `/my-orders` | Customer order history |
| `/shop/orders/[id]` | Order details |
| `/shop/orders/[id]/invoice` | Order invoice |
| `/order-success` | Order confirmation |
| `/stylist` | Personal stylist experience |
| `/post` | Product submission |
| `/dashboard` | Admin dashboard |
| `/dashboard/products` | Admin product catalog |
| `/dashboard/products/add` | Product creation |
| `/dashboard/products/edit/[id]` | Product editing |
| `/dashboard/admin/orders` | Admin order management |
| `/dashboard/admin/users` | Admin user management |
| `/dashboard/admin/users/about/[id]` | Admin user details |

## Application data flow

1. Feature pages call shared API functions from `src/lib/` rather than defining separate transport behavior.
2. Browser requests use the same-origin `/api/backend/*` and `/api/auth/*` paths configured in `next.config.ts`.
3. The browser client sends credentials and the selected locale. Session cookies are HttpOnly; browser code should not read or manually attach access tokens.
4. Server-rendered requests that require a session use the server API client and read session cookies on the server.
5. The backend is authoritative for authorization, inventory, prices, discounts, shipping, and order creation.
6. Zustand stores client-side shopping state such as the cart. Server-owned account, product, and order data must still be validated by the backend.

## Cart behavior

`src/store/cartStore.ts` is the shared cart store. Cart entries are variant-aware, and quantity changes respect known stock limits. Cart calculations are centralized in shared selectors/helpers so the cart and checkout use the same totals and selection rules. The browser's persisted cart is a convenience for the customer; it is not an authoritative source for price or stock.

## Theme, locale, and preferences

- `src/shared/theme/` owns the theme provider and theme utilities.
- `src/shared/i18n/` owns locale state and translation messages.
- `src/shared/preferences/` owns display and notification preference state.
- `src/app/globals.css` defines the semantic theme tokens consumed by shared and feature components.

## Conventions

- Keep App Router `page.tsx` files as route adapters; place substantial page UI in the owning feature.
- Prefer the `@/` import alias.
- Keep cross-feature components in `src/shared/`; keep domain-specific UI in its feature module.
- Use semantic theme classes rather than introducing one-off colors for common surfaces and text.
- Keep API transport and session behavior in `src/lib/`; do not duplicate it in components.
- Treat the backend as the source of truth for all business-critical values and permissions.
