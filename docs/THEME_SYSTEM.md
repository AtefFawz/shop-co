# Theme system

The storefront and administration interface share one semantic color system defined in `src/app/globals.css`.

## How it works

- The light palette is defined on `:root`.
- The dark palette overrides the same semantic variables on `html.dark`.
- `ThemeProvider` applies the selected theme and follows the operating-system preference when the customer has not made an explicit choice.
- The selected theme is persisted locally under `shopco-theme`.
- Theme variables are exposed to Tailwind through the `@theme inline` block.

## Semantic utility classes

| Purpose | Tailwind class | CSS variable |
| --- | --- | --- |
| Page background | `bg-app` | `--app-bg` |
| Standard surface | `bg-surface` | `--surface` |
| Raised panel | `bg-surface-raised` | `--surface-raised` |
| Quiet section | `bg-surface-subtle` | `--surface-subtle` |
| Muted surface | `bg-surface-muted` | `--surface-muted` |
| Hover surface | `hover:bg-surface-hover` | `--surface-hover` |
| Primary text | `text-primary` | `--text-primary` |
| Secondary text | `text-secondary` | `--text-secondary` |
| Muted text | `text-muted` | `--text-muted` |
| Subtle text | `text-subtle` | `--text-subtle` |
| Standard border | `border-border` | `--border` |
| Subtle divider | `divide-border-subtle` | `--border-subtle` |
| Primary action | `bg-action text-on-action` | `--action`, `--text-on-action` |
| Success status | `bg-success text-on-success` | `--success`, `--text-on-success` |
| Error status | `bg-danger text-on-danger` | `--danger`, `--text-on-danger` |
| Warning status | `bg-warning text-on-warning` | `--warning`, `--text-on-warning` |
| Information status | `bg-info text-on-info` | `--info`, `--text-on-info` |

## Guidelines for new components

1. Prefer semantic tokens over hard-coded surface and text colors.
2. Pair solid status backgrounds with the matching `text-on-*` foreground token.
3. Keep product swatches, third-party brand colors, and illustration colors local to the element that owns them.
4. Use `useThemePalette()` for Canvas/WebGL code that cannot consume CSS variables directly.
5. Avoid adding `dark:` variants when a shared semantic token already adapts to the active theme.
6. Respect reduced-motion preferences when adding animations or transitions.

## Updating the palette

Update the corresponding variables in both `:root` and `html.dark` in `src/app/globals.css`. Keep the token names aligned so shared components do not need theme-specific logic.
