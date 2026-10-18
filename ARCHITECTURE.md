# SHOP.CO Frontend Architecture

## Directory boundaries

- `src/app/` contains Next.js App Router route files, layouts, error/loading boundaries, and route-level metadata/configuration. A route file remains named `page.tsx` because that is a Next.js convention; its implementation lives in a semantically named feature page.
- `src/features/` owns business-facing UI by domain: `admin`, `auth`, `account`, `cart`, `catalog`, `checkout`, `home`, `notifications`, `orders`, `reviews`, and `seller`. Each feature owns its pages, components, and data. Complex UI areas use nested component folders instead of keeping every helper inside a single page file.
- `src/shared/` contains cross-feature UI primitives, navigation, layout shell/footer, motion primitives, feedback UI, and theme state.
- `src/features/*/data/` contains feature-owned content, while `src/shared/data/` and `src/shared/config/` hold cross-feature assets and navigation configuration.
- `src/assets/` contains imported visual assets.
- `src/hooks/`, `src/lib/`, `src/store/`, `src/types/`, and `src/utils/` retain the existing data/API integration boundary and utilities. API clients and API-specific hooks were intentionally not rewritten or renamed.

## Naming rules

- React component files use PascalCase and describe what they render or do (`ProductCard.tsx`, `AccountProfilePanel.tsx`, `AdminDesktopOrdersTable.tsx`).
- Page implementations are named by user intent (`ProductDetailsPage.tsx`, `OrderConfirmationPage.tsx`, `AdminProductCreatePage.tsx`). Route adapters import these explicit names while the required App Router filename remains `page.tsx`.
- Shared controls are named by their behavior or role (`ClientPagination.tsx`, `ThemeToggle.tsx`, `RouteTransition.tsx`). Components exported by named export should match the component file name where practical.
- New imports should use the `@/` alias instead of deep relative paths. Component file names and exported component identifiers should describe the same concept; API and hook files are kept in their original integration boundary.
- Public URLs remain unchanged; route groups such as `(shop)` and `(admin)` are organizational and do not appear in the URL.

## Current route ownership

| URL | Page implementation |
| --- | --- |
| `/` | `features/home/pages/StorefrontPage.tsx` |
| `/brand` | `features/catalog/pages/BrandDirectoryPage.tsx` |
| `/category` | `features/catalog/pages/CategoryLandingPage.tsx` |
| `/selling` | `features/catalog/pages/BestSellingProductsPage.tsx` |
| `/shop` | `features/catalog/pages/ShopCatalogPage.tsx` |
| `/shop/details/[id]` | `features/catalog/pages/ProductDetailsPage.tsx` |
| `/shop/details/cart` | `features/cart/pages/ShoppingCartPage.tsx` |
| `/shop/details/cart/checkout` | `features/checkout/pages/CheckoutPage.tsx` |
| `/shop/orders/[id]` | `features/orders/pages/OrderDetailsPage.tsx` |
| `/my-orders` | `features/orders/pages/CustomerOrderHistoryPage.tsx` |
| `/order-success` | `features/orders/pages/OrderConfirmationPage.tsx` |
| `/user/profile` | `features/account/pages/AccountProfilePage.tsx` |
| `/auth/forgot-password` | `features/auth/pages/PasswordRecoveryPage.tsx` |
| `/auth/success` | `features/auth/pages/GoogleOAuthCallbackPage.tsx` |
| `/post` | `features/seller/pages/ProductSubmissionPage.tsx` |
| `/dashboard` | `features/admin/dashboard/pages/AdminDashboardPage.tsx` |
| `/dashboard/products` | `features/admin/products/pages/AdminProductCatalogPage.tsx` |
| `/dashboard/products/add` | `features/admin/products/pages/AdminProductCreatePage.tsx` |
| `/dashboard/products/edit/[id]` | `features/admin/products/pages/AdminProductEditPage.tsx` |
| `/dashboard/admin/orders` | `features/admin/orders/pages/AdminOrdersPage.tsx` |
| `/dashboard/admin/users` | `features/admin/users/pages/AdminUsersPage.tsx` |
| `/dashboard/admin/users/about/[id]` | `features/admin/users/pages/AdminUserDetailsPage.tsx` (route wrapper retains dynamic metadata) |

## API boundary

Existing `src/lib/**`, `src/hooks/**`, `src/proxy.ts`, and `next.config.ts` were kept byte-for-byte identical to the uploaded project. This preserves request behavior, endpoint names, token refresh logic, authentication semantics, backend rewrite configuration, and server-client transport. Feature pages may import these modules, but should not duplicate or bypass their behavior.
