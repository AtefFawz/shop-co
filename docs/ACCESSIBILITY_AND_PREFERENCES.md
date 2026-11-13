# Accessibility and user preferences

SHOP.CO includes display and notification settings that can be adjusted from the account settings area. These preferences are stored in the current browser and are not synchronized to the backend account.

## Display preferences

The display preferences panel supports:

- **Text size:** small, standard, and large.
- **Line spacing:** standard or comfortable.
- **Reduced motion:** reduces Framer Motion and GSAP movement and shortens or disables selected CSS transitions and smooth scrolling.
- **Higher contrast:** strengthens text, border, and focus-indicator contrast.

Preferences are stored in `localStorage` under `shopco-display-preferences`. The provider normalizes stored values and applies the root document settings so that storefront and administration screens use the same preferences.

## Notification preferences

The notification settings panel supports:

- in-app notification banners;
- order update notifications;
- notification sound;
- quiet hours, including ranges that cross midnight.

Preferences are stored locally under `shopco-notification-preferences`. The notification inbox remains backed by the server; muting a local banner does not delete a notification from the backend.

The current backend integration does not synchronize these settings across devices and does not manage a list of active device sessions or Web Push subscriptions. Quiet hours and display preferences apply to the current browser only.

## Account security and privacy controls

The account settings area displays account/session information available from the existing API and allows the current browser session to be signed out. Local preference reset clears the supported preference keys only; it does not delete the account, orders, cart, wishlist, reviews, or server-side notifications.

## Localization

Arabic is the default language and uses right-to-left layout. English uses left-to-right layout. The main UI fonts are Geist for English and IBM Plex Sans Arabic for Arabic. Translation strings are maintained in `src/shared/i18n/messages.ts`.

## Implementation locations

- `src/shared/preferences/DisplayPreferencesProvider.tsx`
- `src/shared/preferences/NotificationPreferencesProvider.tsx`
- `src/features/preferences/components/DisplayPreferencesPanel.tsx`
- `src/features/preferences/components/NotificationPreferencesPanel.tsx`
- `src/shared/i18n/`
