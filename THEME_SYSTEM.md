# SHOP.CO Theme System

The storefront and administration UI share a single semantic color system in `src/app/globals.css`.

## How it works

- Light mode is the default palette on `:root`.
- Dark mode overrides the same CSS variables on `html.dark`.
- `ThemeProvider` applies the class before/while the app hydrates, follows the OS preference when the user has no saved preference, and persists an explicit choice in `localStorage` under `shopco-theme`.
- `ThemeToggle` is the shared accessible switch used by both storefront navigation and the administration layout.
- The token aliases under `@theme inline` expose the variables to Tailwind utilities.

## Preferred semantic classes

| Purpose | Tailwind class | CSS variable |
| --- | --- | --- |
| Page background | `bg-app` | `--app-bg` |
| Standard surface/card | `bg-surface` | `--surface` |
| Raised panel | `bg-surface-raised` | `--surface-raised` |
| Quiet section | `bg-surface-subtle` | `--surface-subtle` |
| Secondary fill | `bg-surface-muted` | `--surface-muted` |
| Hover surface | `hover:bg-surface-hover` | `--surface-hover` |
| Primary text | `text-primary` | `--text-primary` |
| Secondary text | `text-secondary` | `--text-secondary` |
| Muted text | `text-muted` | `--text-muted` |
| Low-emphasis text | `text-subtle` | `--text-subtle` |
| Default border | `border-border` | `--border` |
| Subtle separators | `divide-border-subtle` | `--border-subtle` |
| Primary action | `bg-action text-on-action` | `--action`, `--text-on-action` |
| Muted text on dark action panels | `text-on-action-muted` | `--text-on-action-muted` |
| Success status | `bg-success text-on-success` | `--success`, `--text-on-success` |
| Error status | `bg-danger text-on-danger` | `--danger`, `--text-on-danger` |
| Warning status | `bg-warning text-on-warning` | `--warning`, `--text-on-warning` |
| Informational status | `bg-info text-on-info` | `--info`, `--text-on-info` |

## Rules for new UI

1. Prefer semantic classes over fixed classes such as `bg-white`, `text-gray-500`, or hex color values.
2. For status chips/buttons, always pair the status background with its `text-on-*` foreground when using a solid status background. For soft status surfaces, use the `*-soft` background and corresponding status text token.
3. Keep product color swatches, external brand identities (such as Google's logo colors), image overlays, and illustration-specific effects local to those elements; they are content/brand colors, not general interface surfaces.
4. Canvas/WebGL components cannot always use CSS variables directly. Use `useThemePalette()` from `src/shared/theme/useThemePalette.ts` to resolve the shared tokens rather than duplicating palettes in a component.
5. For colored indicators over dark action panels, use the `*-bright` accents; the regular status tokens are tuned for status chips and soft status surfaces.
6. Avoid adding `dark:` overrides when the same semantic token is already theme-aware. Add a theme-specific class only where the visual intent should genuinely differ between modes.
7. Transitions are short and color-focused; reduced-motion preferences are respected globally and in animated components.

## Change the palette

Edit the paired variables in `:root` and `html.dark` within `src/app/globals.css`. Keep the names aligned across both sets so components do not need theme-specific implementation logic.
