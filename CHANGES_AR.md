# التعديلات اللي اتنفذت

1. **الصور:** ضغط 8 صور PNG لـ WebP (حوالي 23MB → أقل من 300KB)، وCloudinary بيرجّع `f_auto,q_auto`، وشيل `priority` من كل كروت المنتجات (بيتفعّل بـ prop).
2. **الطلب:** الـ payload بقى يبعت `size` و`color` و`discount`، والشحن اتوحّد في `logicPricing.ts`، وحذف الـ toast المزدوج، وتصحيح `key` في OrderSummary.
3. **الكتالوج:** الفلاتر والترتيب بتتبعت للسيرفر (`gender, section, style, maxPrice, sort`) وبتتخزن في الـ URL، والصفحة 12 منتج. **لازم الباك إند يدعم الـ params دي**، ولو متدعمتش الفلترة بتفضل client-side زي الأول.
4. **CSS والخط:** قاعدة `section` اتنقلت لـ `@layer base`، وخط IBM Plex Sans Arabic بـ next/font، وأصغر نص بقى 12px (648 استبدال).
5. **proxy.ts:** مسار فيه نقطة مبقاش بيتخطى الحماية، و`/` الناقصة اتصلحت، ودخول `/dashboard` بيتحقق من الدور من `profile/me` مش من الكوكي.
6. **serverApi:** التحقق من TLS شغال افتراضيًا (`ALLOW_INSECURE_TLS=true` لو محتاج تقفله محليًا).
7. **metadata:** شيل أرقام وحسابات وهمية من الـ JSON-LD والـ twitter.

# الجولة التانية: فلاتر اللون والمقاس والسعر

- **`store/filterStore.ts`:** اتعاد كتابته. ضفت `currentColor` و`currentSize` مع `filterByColor` و`filterBySize`، وكل الأكشنز بتقبل `null` للمسح، والحساب في دالة `update` واحدة. فلتر السعر بقى بيقارن بالسعر بعد الخصم.
- **`lib/variantMatch.ts` (جديد):** بيوحّد القيم اللي الأدمن بيكتبها بإيده: `Medium` = `M` = `m`، و`XXL` = `2XL`، و`#f00` = `#ff0000`، وبيقبل array أو نص مفصول بفاصلة.
- **`ProductColorFilter` و`ProductSizeFilter`:** كانوا بيغيّروا state محلي بس ومبيفلترش حاجة. دلوقتي مربوطين بالـ store.
- **`PriceRangeFilter`:** السلايدر كان بيبدأ على 1000 من غير ما يفلتر فعليًا، وزرار Reset مكانش بيرجّعه. دلوقتي بيقرا من الـ store، و5000 معناها "كل الأسعار" (`null`).
- **الفئة والستايل:** الضغط على الاختيار الفعّال بيلغيه (قبل كده مكانش ينفع غير بـ Reset).
- **العدّاد:** badge الفلاتر في الديسكتوب والموبايل بيحسب اللون والمقاس والسعر كمان.
- **الـ URL:** `color` و`size` بيتحفظوا في الرابط وبيتبعتوا للـ API مع باقي الفلاتر.

# الجولة التالتة

## ألوان ومقاسات
- **`lib/colorPalette.ts`:** بالتة واحدة (21 لون) بتستخدمها فلاتر الكتالوج وpicker الأدمن ومنطق المطابقة. وبتحوّل أي كتابة (`black` و`أسود` و`#111` و`rgb(...)`) لـ hex.
- **المطابقة بـ"عائلة اللون":** كل لون بيتقارن بأقرب لون في البالتة (Lab)، فـ`black` و`#111111` و`#000000` كلهم نفس فلتر Onyx.
- **الأدمن:** `SizePicker` و`ColorPicker` (اختيار من قايمة بدل الكتابة) في صفحتي الإضافة والتعديل. الـ wire format لسه نفسه (نص مفصول بفاصلة) فمفيش تغيير مطلوب في الباك إند. القيم القديمة بتتحوّل لقيم موحدة أول ما تتعدّل.
- **المقاسات:** حروف XXS لـ 4XL + أرقام (28 لـ 46) + مقاس واحد، في الفلتر وفي الأدمن.

## SEO وصفحة المنتج
- صفحة المنتج بقت Server Component: `generateMetadata` (title, description, OG, Twitter, canonical) + JSON-LD من نوع Product، والمنتج بيتبعت جاهز للـ client.
- `sitemap.ts` و`robots.ts`.
- `lib/stock.ts`: قاعدة واحدة للمخزون (كانت 10 و10 و0 و20 في أربع أماكن).
- زرار "نبهني لما يتوفر" مبقاش بيعرض نجاح وهمي، بيبعت `POST product/:id/notify` ويأكد بعد ما السيرفر يقبل.

## التناسق والمسافات والخطوط
- container واحد (`.Responsive`: gutter من 16px لـ 48px وmax-width 1600px) للهيدر والمحتوى والفوتر، كانوا بيستخدموا 3 paddings مختلفة.
- `--page-pad-y` / `.page-section`: مسافة رأسية موحدة لكل صفحة (كان فيه py-6 وpy-8 وpy-10 وpy-12 وpy-16 وpy-20).
- Radius على مقياس واحد (`xl` / `2xl` / `3xl` / `4xl` / `full`) بدل القيم الاعتباطية، وظلال `shadow-card` / `shadow-panel` (163 ظل متفرق).
- خطوط متجاوبة: حجم الـ root بيكبر على الشاشات الكبيرة (18px من 1920 و20px من 2560) ويصغر على الموبايلات الضيقة جدًا (أقل من 360px)، و`text-wrap: balance` للعناوين، وline-height مناسب للعربي (الـ `leading-none` كانت بتقص الحروف).

## جودة
- `.env.example`، وCI صح (`lint` + `tsc` + `test` + `build` على Node 22)، وVitest مع 3 ملفات tests.
- ملفات الملاحظات الداخلية اتنقلت لـ `docs/`، وشلت `console.log`.
- labels الـ checkout مربوطة بالـ inputs مع `autoComplete`، وكل `<img>` بقى `loading="lazy"`.

# التكامل مع Backend V2 / V3 (سجل تاريخي)

- الكتالوج والبحث أصبحا Server-driven بالكامل: `keyword`, `gender`, `section`, `style`, `maxPrice`, `color`, `size`, `sort`, `page`, `limit` تُرسل للـ API، ونتيجة `pagination.total` هي مصدر العدد والصفحات.
- قيم الواجهة `price-asc` و`price-desc` و`rating-desc` تتحول إلى `price_asc` و`price_desc` و`rating` المتوافقة مع الباك إند. و`featured` يستخدم `newest`.
- `useData` يلغي الطلب السابق عند تغيير البحث أو الفلاتر، ويعيد الصفحة إلى 1 من أول طلب جديد، ويمنع خطأ الـ request الملغى من إظهار Toast أو إيقاف Loading لطلب أحدث.
- `ProductSearchBar` يستخدم Axios المشترك والـ same-origin rewrite مع debounce وإلغاء الطلب السابق، ويدعم حرفًا واحدًا وجزء الكلمة عبر بحث الباك إند العربي والإنجليزي.
- `api.ts` يوجه المسارات القديمة ذات `/` إلى `/api/backend` بدل تجاوز الـ rewrite، ويرسل `X-Locale` ويستخدم credentials عند تدوير جلسة الدخول.
- تسجيل Google يقرأ الـ one-time `code` ويمسحه من العنوان، ثم يستبدله من خلال `/api/backend/auth/google/exchange`. عالجت إعادة تشغيل React Strict Mode حتى لا يُستهلك الكود مرتين.
- Checkout يرسل `productId`, `quantity`, `size`, `color`, `shippingAddress`, و`paymentMethod` فقط؛ لا يرسل سعرًا أو إجماليًا موثوقًا من المتصفح. الباك إند يحسب السعر والخصم والشحن.
- تم توحيد حساب الخصم في واجهة المنتج والسلة والـ checkout مع قاعدة الباك إند: الخصم يُطبق فقط عندما `isSale === true`، وبالتقريب إلى القروش.
- صفحة المنتج Server Component تمرر `X-Locale` بناءً على cookie اللغة. والـ sitemap يقرأ `data.Products` ويطلب صفحات متعددة بحد أقصى 60 منتجًا لكل طلب.
- بقي هيكل Next.js App Router و`features / shared / hooks / lib / store / types` كما هو؛ هو تقسيم سليم ومناسب للمشروع، ولم أعدّله لمجرد تغيير أسماء المجلدات.

## تشغيل النسختين

1. حدّث الباك إند من مجلد `shop.co-main`، ثم شغّل `npm install`.
2. اضبط `.env` وخصوصًا `CLIENT_URL`, `NEXT_PUBLIC` المقابل في الفرونت، وبيانات الخدمات ومفاتيح JWT.
3. شغّل `npm run db:backfill-products` مرة أخرى بعد هذا التحديث؛ أصبح يضيف فهارس اللون والمقاس إلى جانب البحث والسعر.
4. حدّث الفرونت، انسخ `.env.example` إلى `.env.local` واضبط `NEXT_PUBLIC_API_URL` على عنوان الـ API مع `/api`، و`NEXT_PUBLIC_SOCKET_URL` على أصل Socket.IO.
5. شغّل المشروعين واختبر تسجيل الدخول، البحث، الفلاتر، الدفع، وتسجيل Google على بيئة متصلة بقاعدة البيانات والخدمات.

**ملاحظة تحقق:** اختبارات Node الخاصة بالباك إند نجحت. لم أتمكن من تنفيذ `npm run build` أو TypeScript type-check للفرونت داخل بيئة العمل لأن تثبيت dependencies توقف بمهلة وتعذر الوصول إلى npm registry. كمان اكتشفت أن `vitest` موجود في `package.json` لكنه غير موجود في `package-lock.json` المرفق؛ لذلك نفّذ `npm install` مرة واحدة لتحديث ملف القفل، ثم احفظ `package-lock.json` المحدّث في Git. بعد ذلك استخدم `npm ci` بشكل طبيعي، ثم `npm run lint` و`npx tsc --noEmit` و`npm test` و`npm run build` قبل النشر.


# التكامل النهائي مع Backend V5 (الواجهة فقط)

- المصادقة تعتمد على `accessToken` و`refreshToken` كـ HttpOnly Cookies؛ لا يقرأ المتصفح التوكن ولا يرسله في `Authorization` يدويًا. مسار التجديد وتسجيل الخروج يمران عبر `/api/auth/*` حتى يصل Refresh Cookie ذي المسار `/api/auth`.
- التسجيل ينتهي بطلب تأكيد البريد، ثم `POST auth/verify-email`؛ لا يُفترض وجود جلسة قبل نجاح التأكيد. يدعم حقل OTP الأرقام العربية والفارسية ويحوّلها إلى أرقام ASCII قبل الإرسال.
- Google OAuth ينشئ `shopcoOAuthState` في نفس أصل المتجر عبر Route Handler، ثم يرسل المستخدم إلى Backend V5 ويستبدل `code + state` عبر same-origin API.
- صفحة الكتالوج والبحث والمنتجات الجديدة والمميزة تستخدم فلاتر البحث والسعر والتصنيف واللون والمقاس والترتيب قبل الـ pagination على السيرفر.
- لوحة الطلبات تستخدم `status` المدعوم من Backend V5 على السيرفر، وتعرض 100 طلب كحد أقصى لكل صفحة. البحث الحر والترتيب حسب الإجمالي/عدد العناصر يظلان محليين داخل الصفحة المحمّلة؛ لم أضف query parameters غير موجودة في عقد الباك إند.
- Checkout يرسل `productId`, `quantity`, والـ `size`/`color` المختارين، والعنوان وطريقة الدفع، مع `Idempotency-Key`. لا يُرسل أي سعر موثوق من المتصفح؛ Backend V5 يحسب سعر المنتج والخصم والمخزون والشحن.
- إنشاء وتعديل المنتجات يستخدمان `images` و`existingImages` وحد 4 صور و5MB للصورة، ويعرضان حقول الاسم والوصف والتصنيف والقسم بالعربية والإنجليزية.
- أزيلت التقييمات والأرقام الافتراضية التي لا تستند إلى بيانات API، وأصبحت مراجعات العملاء تظهر فقط عند وجود مراجعات فعلية.
- أزرار تغيير الدور وحذف المستخدم تظهر للـ Admin فقط؛ يظل التحقق النهائي من الصلاحيات مسؤولية الباك إند.
- لم يتم تعديل أي ملف من Backend V5.

## تحديث تجربة القراءة وإمكانية الوصول

- إضافة لوحة تفضيلات العرض داخل تبويب إعدادات الحساب.
- إضافة ثلاثة مستويات لحجم النص: صغير، قياسي، وكبير.
- تطبيق مقياس الخط على مستوى جذر التطبيق بحيث تتناسق أحجام الخطوط والمسافات المبنية بوحدة `rem` في المتجر ولوحة الإدارة.
- توحيد عائلة الخطوط: Geist للإنجليزية وIBM Plex Sans Arabic للعربية، مع جعل عناصر النماذج ومكونات MUI ترث خط الواجهة.
- إضافة تباعد أسطر مريح للقراءة، وخيار تقليل الحركة عبر `MotionConfig` وربطه بـ Framer Motion وGSAP في الشعار، وخيار زيادة التباين.
- حفظ التفضيلات محليًا ومزامنتها بين علامات التبويب دون أي تغيير في الباك إند.
- تطبيق إعدادات العرض قبل أول رسم للصفحة لتقليل وميض تغيير حجم الخط عند فتح الموقع.
- إضافة نصوص عربية وإنجليزية لكل عناصر لوحة التفضيلات ومعاينة مباشرة.

> التفضيلات محلية لهذا المتصفح والجهاز، ولا تُرفع إلى الحساب أو قاعدة البيانات.

## V7 — Account settings & experience controls

- Added local notification preferences for live banners, order-status banners, sound and vibration.
- Added quiet hours with same-day and overnight window support.
- Wired notification preferences into Socket.IO notification banners and global toast sound/haptics.
- Kept persisted notifications available in the inbox when local banners are muted.
- Added an account security panel with real email verification state and current-device sign-out.
- Added a privacy panel to reset only local reading/accessibility/notification preferences without deleting shopping or account data.
- Removed misleading local-only profile privacy and collection-alert toggles and removed the static TLS 1.3 claim.
- Added Arabic and English copy for all new settings.
- Added unit tests for preference normalization and quiet-hours boundaries.
- No backend files or API contracts were changed.

## ميزات Full-Stack الإضافية
- مقارنة حتى 4 منتجات مع حفظ الاختيارات محليًا.
- حفظ المنتجات لوقت لاحق ومزامنتها مع حساب العميل.
- سجل آخر المنتجات التي شاهدها العميل (آخر 30 منتجًا على الخادم).
- تنبيهات سعر مستهدف مع إشعارات داخل التطبيق عند وصول السعر للحد المطلوب.
- اقتراحات منتجات عامة، وتصبح مخصصة حسب سجل المشاهدة والحفظ والطلبات عند تسجيل الدخول.
- دليل مقاسات يعرض الخيارات الفعلية المضافة للمنتج دون اختلاق قياسات بالسنتيمتر.
- سجل زمني لتغييرات حالة الطلب، وبيانات فاتورة موثوقة قابلة للطباعة أو الحفظ PDF.
- لوحة الإدارة تعرض مؤشرات الحفظ والتنبيهات والمشاهدات وأعلى المنتجات حفظًا.

---

## مراجعة v8 -> v9 (مطابقة الباك إند v7 + تقوية أمنية)

- **حذف الأوردر:** الباك إند بقى يرفض حذف أوردرات Shipped/Delivered (409). الواجهة دلوقتي مبتعرضش زر الحذف إلا للحالات المسموحة (`src/lib/orderRules.ts`): العميل يحذف Pending بس، والأدمن يحذف Pending أو Cancelled. رسالة السيرفر بتظهر للعميل لو الحذف اترفض.
- **الضيوف والـ refresh:** كل زيارة ضيف كانت بتعمل `profile/me` -> 401 -> `refresh-token` -> 401، وده بيستهلك حد الـ refresh (60 كل 15 دقيقة لكل IP) ويقدر يطلّع مستخدمين حقيقيين على نفس الشبكة. دلوقتي فيه marker كوكي بدون صلاحيات (`shopco-session`) بيتحدث تلقائيًا من `userStore`، والـ AuthWatcher مبيعملش refresh للضيف.
- **الأدمن بعد 15 دقيقة:** كوكي الـ access بيخلص بعد 15 دقيقة والـ proxy مبيشوفش كوكي الـ refresh (path=/api/auth)، فكان الأدمن بيترمي على صفحة الدخول. صفحة الدخول بقت تحاول silent refresh مرة واحدة لو جاية من `?next=/dashboard...` وترجّعه.
- **Headers أمنية:** `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `COOP`, HSTS في production، وCSP للـ directives الآمنة فقط (`frame-ancestors`, `base-uri`, `object-src`, `form-action`).
- **JSON-LD:** الـ layout كان بيكتب JSON-LD من غير escape لـ `<` (زي صفحة المنتج). اتصلح.
- تيست جديد: `src/lib/__tests__/orderRules.test.ts`.

**ملاحظة ترحيل:** أول زيارة بعد الـ deploy لمستخدم لسه عنده access cookie صالح هتعمل marker تلقائيًا. المستخدم اللي الـ access cookie بتاعه انتهى ومعندوش marker هيحتاج يسجل دخول مرة واحدة.
