# إعدادات الأمان المطلوبة بعد التحديث (Frontend)

1. استخدم Node.js 22.13 أو أحدث من الإصدارات المدعومة. ملف `.nvmrc` يحدد 22، و`.npmrc` يفعّل `engine-strict`.
2. نفّذ `npm install` مرة واحدة لإنشاء `package-lock.json` جديد يثبت Next.js 16.4.4 وReact/React DOM 19.2.9 وsharp 0.35.5 وAxios 1.21.0 أو أحدث ضمن النطاق وSocket.IO Client 4.8.4، مع تثبيت `follow-redirects` على 1.16.2 عبر `overrides`. احفظ ملف القفل في Git. أزلنا القفل القديم لأنه كان يثبت إصدارات متأثرة؛ لا تستخدم `npm ci` قبل إنشاء القفل الجديد.
3. شغّل `npm audit` و`npm run lint` و`npx tsc --noEmit` و`npm test` و`npm run build` قبل النشر.
4. اضبط `NEXT_PUBLIC_API_URL` على أصل الباك إند متضمنًا `/api` أو `/api/` حسب إعدادك الحالي، و`NEXT_PUBLIC_SITE_URL` على عنوان الواجهة النهائي، و`NEXT_PUBLIC_SOCKET_URL` على عنوان Socket.IO.
5. تأكد أن كل استدعاءات المتصفح للـ API تمر عبر `/api/backend/*` (same-origin rewrite). لا تستدعِ الباك إند من المتصفح مباشرة؛ لأن الجلسات الآن HttpOnly ومقصود ألا تكون مقروءة من JavaScript.
6. Cookie `role` مجرد تلميح للواجهة. لا تستخدمها لاتخاذ قرار صلاحيات؛ السيرفر يتحقق من الجلسة والدور الحاليين من قاعدة البيانات.
7. CSP nonce مفعّل في `src/proxy.ts`. عند إضافة سكربت أو style tag inline جديد، مرّر `nonce` من `x-nonce` ولا تستخدم `unsafe-eval` في الإنتاج. Emotion/MUI يستخدمان CacheProvider بالـ nonce نفسه. اختبر مزودي الدفع والتحليلات وأي سكربت خارجي بعد ضبط origins المسموحة.
8. Google Sign-in يبدأ من `/api/auth/google/start` ويستبدل authorization code مع state عبر `/api/backend/auth/google/exchange`؛ لا تعُد إلى تخزين token في localStorage أو cookie قابلة للقراءة.
9. لا تنشر من دون مراجعة `npm audit` على lockfile حديث، وراجع تحديثات Next.js الأمنية قبل النشر؛ إصدارات الأمان قد تصدر بشكل منفصل عن الإصدارات العادية.
