# دليل توافق Frontend مع Backend V5

هذه النسخة من الواجهة مبنية لتعمل مع Backend V5 المرفق دون تعديل الباك إند.

## إعداد البيئة

في `.env.local` للواجهة:

```dotenv
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
NEXT_PUBLIC_CARD_PAYMENTS_ENABLED=false
```

في `.env` للباك إند، اضبط `CLIENT_URL` على أصل الواجهة بالضبط، وأضف أصل الواجهة إلى `CORS_ORIGINS`. لا تضع `/api` في `CLIENT_URL`. فعّل credentials في إعدادات CORS على الباك إند كما يطلب التطبيق. في الإنتاج استخدم HTTPS للنطاقين.

`NEXT_PUBLIC_API_URL` يجب أن يشير إلى جذر API وينتهي بـ `/api`، أما `NEXT_PUBLIC_SOCKET_URL` فيشير إلى أصل Socket.IO دون `/api`. لا تضع أسرارًا في متغيرات `NEXT_PUBLIC_*`.

## خريطة الـ API المستخدمة

| الوظيفة | الطلب | ملاحظات التوافق |
|---|---|---|
| تسجيل الدخول | `POST /api/auth/signin` | الجلسة تعود في HttpOnly Cookies؛ جسم الاستجابة يحتوي المستخدم فقط. |
| التسجيل | `POST /api/backend/auth/signup` | `multipart/form-data` وحقل الصورة `avatar`؛ لا توجد جلسة قبل تأكيد البريد. |
| تأكيد البريد | `POST /api/backend/auth/verify-email` | `{ email, otp }` ثم تصدر Cookies. |
| إعادة إرسال OTP | `POST /api/backend/auth/resend-verification` | `{ email }`. |
| تحديث الجلسة | `POST /api/auth/refresh-token` | يستعمل Refresh Cookie ذات Path `/api/auth`. |
| تسجيل الخروج | `POST /api/auth/logout` | يمسح كوكيز الجلسة من المتصفح. إذا تعذر الوصول للباك إند، تستخدم الواجهة Route Handler محليًا لمسح الكوكيز من المتصفح دون الادعاء بإلغاء الجلسة من قاعدة البيانات. |
| Google OAuth | `GET /api/auth/google` ثم `POST /api/backend/auth/google/exchange` | يستخدم `client_state` و`code + state` وCookie مؤقتة من أصل المتجر. |
| بيانات المستخدم | `GET /api/backend/profile/me` | يتطلب جلسة صالحة. |
| كتالوج المنتجات | `GET /api/backend/product` | يستخدم البحث والفلاتر والترتيب والصفحات. |
| إنشاء المنتج | `POST /api/backend/product` | الحقل متعدد الصور `images`، حتى 4 صور، 5MB لكل صورة. |
| تحديث المنتج | `PATCH /api/backend/product/:id` | `existingImages` للصور المحتفظ بها و`images` للصور الجديدة. |
| إنشاء الطلب | `POST /api/backend/order` | يرسل `productId`, `quantity`, `size`, `color`, العنوان، `paymentMethod`، و`Idempotency-Key`. |
| الطلبات الإدارية | `GET /api/backend/order/all` | الفلاتر المدعومة في القائمة هي pagination و`status`. |
| المستخدمون الإداريون | `GET /api/backend/admin/users` | البحث `keyword` مع page/limit. |
| المراجعات | `GET /api/backend/review`, `POST /api/backend/review/add` | الإضافة تتطلب طلبًا مسلّمًا حسب تحقق الباك إند. |
| الإشعارات | `GET /api/backend/notifications` | تستخدم نفس جلسة HttpOnly. |

## تدفق المصادقة والكوكيز

- جميع طلبات المتصفح تستخدم Axios client واحدًا مع `withCredentials: true` و`X-Locale`.
- لا يُقرأ `accessToken` أو `refreshToken` من JavaScript ولا يُنشأ `Authorization: Bearer` من المتصفح.
- مسارات API المعتادة تمر عبر rewrite `/api/backend/*`. مسارا refresh/logout يمران عبر `/api/auth/*` تحديدًا حتى يطابق مسار Refresh Cookie.
- بيانات SSR التي تحتاج صلاحية تستخدم `serverApi` وتقرأ `accessToken` من `next/headers` على السيرفر فقط.
- عند نشر الواجهة والباك إند على أصلين مختلفين، يجب الحفاظ على الـ same-origin rewrite في المتصفح؛ لا تستبدل Axios بعنوان Backend مباشر.

## الكتالوج والبحث

تُرسل الواجهة `keyword`, `gender`, `section`, `style`, `category`, `color`, `size`, `minPrice`, `maxPrice`, `isSale`, `inStock`, `sort`, `page`, و`limit` حسب الشاشة. يطبق Backend V5 الفلاتر قبل حساب `pagination.total` وإرجاع الصفحة.

قيم sort المدعومة تشمل `newest`, `oldest`, `price_asc`, `price_desc`, `rating`, `popular`, `name_asc`, و`name_desc`. البحث يستخدم فهرس الكلمات والـ prefixes والـ n-grams المجهز في الباك إند، لذلك لا تنفذ الواجهة فلترة على الصفحة الحالية بدل الاستعلام.

## الطلبات والـ variants

كل سطر سلة يمثل المنتج مع اختياراته المحددة. يُرسل المقاس واللون المختاران فقط إن وُجدا. الباك إند يتحقق من انتماء الاختيار إلى خيارات المنتج ويحسب سعر الوحدة والخصم والشحن والمخزون بنفسه. لا تضف سعرًا من المتصفح إلى payload. يتم إعادة استخدام `Idempotency-Key` عند إعادة المحاولة لنفس محاولة الإرسال.

Card payments معطلة افتراضيًا. لا تجعل `NEXT_PUBLIC_CARD_PAYMENTS_ENABLED=true` إلا بعد تفعيل `CARD_PAYMENTS_ENABLED=true` في الباك إند ووجود بوابة دفع فعلية متكاملة.

## حدود لا يوفرها عقد Backend V5 الحالي

- لا يوجد بحث إداري حر أو sort مخصص على جميع الطلبات؛ لذلك بحث الطلبات والترتيب الإضافي محليان داخل الصفحة المحملة (100 سجل كحد أقصى). فلتر الحالة فقط server-side.
- إحصائيات أدوار المستخدمين في شاشة المستخدمين محسوبة على الصفحة المحملة؛ إجمالي الحسابات وحده مأخوذ من `pagination.total`.
- المخزون محفوظ على مستوى المنتج، وليس مخزونًا مستقلاً لكل مقاس/لون.
- الباك إند لا يوفّر بوابة دفع بطاقة فعالة بمجرد إرسال `paymentMethod: card`.

## فحوصات قبل الإنتاج

```bash
npm install
npm run lint
npm run typecheck
npm test
npm run build
npm audit
```

اختبر عمليًا: إنشاء حساب ثم تأكيد OTP، تسجيل الدخول وتجديد الجلسة بعد انتهاء Access Token، تسجيل الخروج، Google OAuth، فتح لوحة المدير، البحث الجزئي بالعربية والإنجليزية، الجمع بين الفلاتر والصفحات، إنشاء/تعديل منتج باللغتين، رفع الصور، إضافة منتج بمقاس/لون، إنشاء طلب وإعادة نفس الطلب بنفس Idempotency-Key، ثم مراجعة طلب Delivered.
