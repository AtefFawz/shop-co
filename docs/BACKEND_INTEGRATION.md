# Backend integration

The SHOP.CO frontend depends on a separate backend API for catalog, authentication, customer, order, notification, and administration data. This document describes the integration expected by the current frontend.

## Local environment

Create `.env.local` from `.env.example` and configure:

```dotenv
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
NEXT_PUBLIC_CARD_PAYMENTS_ENABLED=false
```

`NEXT_PUBLIC_API_URL` is the backend API root and includes `/api`. `NEXT_PUBLIC_SOCKET_URL` is the Socket.IO origin and does not include `/api`.

Configure the backend's client origin to match the frontend origin exactly, allow credentialed CORS requests, and use HTTPS for production origins. Do not put backend secrets in `NEXT_PUBLIC_*` variables.

## Request routing

The frontend uses Next.js rewrites to keep browser requests same-origin:

| Frontend path | Backend destination |
| --- | --- |
| `/api/backend/*` | `${NEXT_PUBLIC_API_URL}/*` |
| `/api/auth/*` | `${NEXT_PUBLIC_API_URL}/auth/*` |

The dedicated `/api/auth/*` rewrite is used for session refresh and logout because the backend scopes the refresh cookie to that path.

## Session and authentication model

- Browser API requests use the shared Axios client with `withCredentials: true` and an `X-Locale` header.
- The browser does not read access or refresh tokens and does not create a Bearer header from JavaScript.
- Session cookies must be HttpOnly and configured for the frontend/backend deployment arrangement.
- Server-side requests that require a session use the server API client, which reads the access cookie through Next.js server APIs.
- Sign-in, sign-up, email verification, password recovery, refresh, logout, and Google OAuth depend on matching backend endpoints and cookie behavior.
- Admin authorization must be enforced by the backend on every protected endpoint. Hiding or redirecting an admin page in the frontend is not an authorization boundary.

## API surface used by the frontend

The paths below are relative to the configured API root unless shown as frontend rewrite paths.

| Capability | Method and path | Notes |
| --- | --- | --- |
| Sign in | `POST /auth/signin` | Creates the session cookies. |
| Sign up | `POST /auth/signup` | Uses `multipart/form-data`; the avatar field is named `avatar`. |
| Verify email | `POST /auth/verify-email` | Accepts `{ email, otp }`. |
| Resend verification | `POST /auth/resend-verification` | Accepts `{ email }`. |
| Refresh session | `POST /auth/refresh-token` | Uses the refresh cookie scoped to `/api/auth`. |
| Sign out | `POST /auth/logout` | Clears the server session cookies. |
| Google OAuth start | `GET /auth/google` | Backend initiates the OAuth flow. |
| Google OAuth exchange | `POST /auth/google/exchange` | Exchanges the authorization code and state. |
| Current profile | `GET /profile/me` | Requires an authenticated session. |
| Product catalog | `GET /product` | Supports catalog search, filtering, sorting, and pagination. |
| Create product | `POST /product` | Supports multiple image uploads; current UI accepts up to four images. |
| Update product | `PATCH /product/:id` | Uses `existingImages` for retained images and `images` for new uploads. |
| Create order | `POST /order` | Receives product variants, shipping details, payment method, and an idempotency key. |
| Admin orders | `GET /order/all` | The current admin list uses pagination and status filters. |
| Admin users | `GET /admin/users` | Supports keyword search and pagination. |
| Reviews | `GET /review`, `POST /review/add` | Review eligibility is validated by the backend. |
| Notifications | `GET /notifications` | Uses the authenticated session. |

The frontend calls these endpoints through `/api/backend/*` or `/api/auth/*` as appropriate. Confirm the exact request and response schemas against the backend version deployed with the frontend.

## Catalog queries

The catalog UI can send the following filters when applicable: `keyword`, `gender`, `section`, `style`, `category`, `color`, `size`, `minPrice`, `maxPrice`, `isSale`, `inStock`, `sort`, `page`, and `limit`.

Sort values currently used by the UI include `newest`, `oldest`, `price_asc`, `price_desc`, `rating`, `popular`, `name_asc`, and `name_desc`. Filtering and pagination should be applied by the backend before calculating pagination totals.

## Orders and pricing

The frontend submits product identifiers, selected variants, quantities, shipping information, and the selected payment method. The backend must recalculate and validate:

- current product price and discounts;
- product availability and inventory;
- whether selected size/color variants belong to the product;
- shipping and final order totals;
- user authorization and order ownership.

Do not accept prices or totals calculated by the browser as authoritative. The frontend sends an idempotency key for order creation so retries of the same checkout attempt can be recognized.

Cash on delivery is available in the current UI. Card payments are disabled by default. Setting `NEXT_PUBLIC_CARD_PAYMENTS_ENABLED=true` only exposes the frontend option; it does not integrate a payment gateway. Enable it only after the backend has a working gateway and the complete payment flow has been tested.

## Socket.IO

Set `NEXT_PUBLIC_SOCKET_URL` to the Socket.IO server origin to enable live notification updates. If the variable is missing, socket-based updates are disabled. The backend must authenticate connections and authorize notification delivery to the correct user.

The current frontend can display a system notification while the page is hidden if the Socket.IO connection is still alive and the user has granted notification permission. Delivery while the app is fully closed requires a separate Web Push subscription and server-side delivery implementation; see [PWA](PWA.md).

## Integration checks

Before deploying a frontend/backend pair, verify:

1. Sign-up, email verification, sign-in, refresh, and sign-out.
2. Google OAuth callback and state validation.
3. Catalog search, filters, sort, and pagination together.
4. Product creation and editing, including image uploads and retained images.
5. Variant-aware cart and checkout, with backend price and stock validation.
6. Idempotent order retry behavior and order ownership checks.
7. Admin authorization for product, order, and user endpoints.
8. Notification retrieval and user-specific Socket.IO delivery.

Run the frontend checks from the repository root:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```
