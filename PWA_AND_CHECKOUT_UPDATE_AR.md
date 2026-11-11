# تحديث تسجيل الدخول قبل الطلب وتجربة PWA — SHOP.CO

## 1) حماية إتمام الطلب

- عند الضغط على **Confirm and place order** يتم التحقق من الجلسة من خلال `profile/me` قبل إرسال طلب إنشاء الطلب.
- الزائر يُحوّل إلى `/auth/signin` مع `reason=checkout` ووجهة رجوع آمنة إلى صفحة إتمام الشراء.
- عند انتهاء الجلسة، يحاول عميل Axios تجديدها وفق آلية المشروع الحالية؛ وإذا فشل التجديد يعود العميل لتسجيل الدخول.
- بعد تسجيل الدخول بالبريد وكلمة المرور أو Google، يعود العميل إلى Checkout. الروابط الخارجية ومسارات `/auth` و`/api` مرفوضة في وجهة الرجوع.
- تم احترام `shopco-session` hint حتى لا يستهلك الزائر طلبات تجديد الجلسة دون داعٍ.

## 2) تثبيت الموقع كتطبيق PWA

- `src/app/manifest.ts`: اسم التطبيق، نطاقه، وضع العرض المستقل والأيقونات.
- `public/sw.js`: service worker محافظ؛ لا يخزّن API أو Checkout أو الطلبات أو بيانات الحساب. يخزّن ملفات Next الثابتة والأيقونات، ويعرض صفحة Offline عند فشل تحميل صفحة أثناء انقطاع الإنترنت.
- `public/offline.html`: واجهة Offline بسيطة باللغة العربية.
- `src/shared/components/pwa/PWAInstallPrompt.tsx`: يطلب التثبيت في المتصفحات المدعومة، ويعرض خطوات Add to Home Screen على iOS.
- تمت إضافة أيقونات 192 و512 وMaskable، وأيقونة Apple Touch بحجم 180.

## 3) الملفات المعدلة

- `src/features/checkout/pages/CheckoutPage.tsx`
- `src/hooks/signIn.ts`
- `src/features/auth/components/SignInPageContent.tsx`
- `src/features/auth/pages/GoogleOAuthCallbackPage.tsx`
- `src/shared/i18n/messages.ts`
- `src/app/layout.tsx`

## 4) الملفات الجديدة

- `src/lib/safeRedirect.ts`
- `src/lib/__tests__/safeRedirect.test.ts`
- `src/app/manifest.ts`
- `src/app/apple-icon.png`
- `src/shared/components/pwa/PWAInstallPrompt.tsx`
- `public/sw.js`
- `public/offline.html`
- `public/icons/shopco-192.png`
- `public/icons/shopco-512.png`
- `public/icons/shopco-maskable-512.png`

## 5) النشر والتثبيت

يجب نشر الموقع على HTTPS (وهو متاح افتراضيًا على Vercel). على Android افتح الموقع في Chrome ثم اختر Install app أو Add to Home screen. على iPhone افتحه في Safari، ثم Share → Add to Home Screen.

الـ PWA هنا تضيف التثبيت وفتح الموقع بواجهة مستقلة وOffline fallback؛ لا تحول المشروع إلى تطبيق Native، ولا تجعل عمليات الشراء أو بيانات الحساب تعمل دون اتصال.

## 6) التحقق

تم اختبار منطق وجهة الرجوع الآمنة بشكل مستقل، وفُحصت أبعاد الأيقونات. تعذر تشغيل `npm run typecheck` أو `npm run build` في بيئة العمل لأن تثبيت dependencies عبر `npm ci` لم يكتمل قبل انتهاء المهلة؛ لذلك يلزم تشغيلهما بعد `npm ci` في بيئتك قبل الدمج النهائي.
