# عقد API التحليلات المالية — SHOP.CO

هذا العقد هو الـ Backend contract الذي تعتمد عليه واجهة `RevenueAnalyticsPanel`.
الواجهة لا تحسب الأرباح من إجمالي الطلبات ولا تفترض أن المبيعات كلها ربح؛ الخادم هو مصدر الحقيقة المالي.

## 0) مكتبة الرسم المطلوبة

الواجهة تستخدم Recharts 3.10.1، وهي مكتبة React برسوم SVG ومكوّنات قابلة للتركيب، ولديها TypeScript declarations مدمجة. إصدار `react-is` يجب أن يطابق إصدار React الموجود بالمشروع.

المشروع يستخدم React 19.2.0، لذلك نفّذ من جذر المشروع:

```bash
npm install recharts@3.10.1 react-is@19.2.0
```

هذا الأمر يحدّث `package.json` و`package-lock.json` معًا. لا تستخدم `npm ci` قبل تنفيذ التثبيت وحفظ ملف القفل الجديد.

## 1) Endpoint

```http
GET /admin/dashboard/revenue-analytics
Authorization: Bearer <admin-access-token>
```

من الواجهة الحالية سيُطلب عبر Axios instance الموجود في المشروع، وبالتالي المسار النهائي يمر من:

```text
/api/backend/admin/dashboard/revenue-analytics
```

يجب قصر الوصول على ADMIN/MANAGER حسب صلاحيات لوحة الإدارة.

## 2) Query parameters

| Parameter | Required | Values / meaning |
|---|---:|---|
| `period` | yes | `today`, `yesterday`, `last_7_days`, `last_30_days`, `this_month`, `last_month`, `this_quarter`, `this_year`, `custom` |
| `from` | custom only | تاريخ `YYYY-MM-DD` شاملًا يوم البداية |
| `to` | custom only | تاريخ `YYYY-MM-DD` شاملًا يوم النهاية |
| `comparePrevious` | no | `true` لمقارنة المدة السابقة المساوية في عدد الأيام، الافتراضي `true` |
| `locale` | no | `ar` أو `en` لتنسيق التسميات إن كان الخادم يرجع labels محلية |

### قواعد التاريخ والتجميع

- المنطقة الزمنية الافتراضية للمتجر: `Africa/Cairo`، ويُفضّل أن تكون إعدادًا في قاعدة البيانات وليس قيمة مبعثرة في الكود.
- كل الـ presets تُحسب في المنطقة الزمنية التجارية للمتجر، وليس UTC الخاص بالسيرفر.
- `today` يبدأ من منتصف الليل المحلي حتى وقت إنشاء التقرير، و`yesterday` هو اليوم المحلي المكتمل السابق.
- `last_7_days` و`last_30_days` يشملان اليوم الحالي بالإضافة إلى الأيام السابقة حتى يكتمل العدد.
- `last_month` هو الشهر الميلادي المكتمل السابق، بينما `this_month` و`this_quarter` و`this_year` تبدأ من أول يوم في الفترة حتى اليوم الحالي.
- `from` و`to` في custom range تاريخان شاملان. حوّلهما داخليًا إلى interval نصف مفتوح: `from 00:00:00` شامل، و`day after to 00:00:00` غير شامل.
- اختيار bucket تلقائي: `hour` للفترات القصيرة جدًا (حتى يومين)، `day` حتى 90 يومًا، و`month` للفترات الأطول.
- أرجع bucket فارغًا بقيم صفرية عند عدم وجود مبيعات في ذلك الوقت، للحفاظ على استمرارية الرسم.
- عند المقارنة، تكون الفترة السابقة مساوية للفترة المختارة في المدة، وتنتهي مباشرة قبل `from` الحالية.

## 3) Response shape

أرجع JSON بهذا الشكل. القيم التالية مثال توضيحي فقط وليست بيانات حقيقية:

```json
{
  "data": {
    "currency": "EGP",
    "timezone": "Africa/Cairo",
    "period": {
      "preset": "last_30_days",
      "from": "2026-10-01",
      "to": "2026-10-31",
      "bucket": "day"
    },
    "summary": {
      "grossSales": 300000,
      "discounts": 12000,
      "refunds": 3500,
      "netSales": 284500,
      "shippingRevenue": 8000,
      "costOfGoodsSold": 165000,
      "grossProfit": 119500,
      "paymentFees": 6200,
      "shippingCosts": 11000,
      "operatingExpenses": 25800,
      "netProfit": 76500,
      "ordersCount": 214,
      "averageOrderValue": 1329.44,
      "profitMarginPercent": 26.9,
      "profitAvailable": true
    },
    "previousPeriodSummary": {
      "grossSales": 268000,
      "discounts": 11000,
      "refunds": 2800,
      "netSales": 254200,
      "shippingRevenue": 7600,
      "costOfGoodsSold": 151000,
      "grossProfit": 103200,
      "paymentFees": 5700,
      "shippingCosts": 10500,
      "operatingExpenses": 24000,
      "netProfit": 63000,
      "ordersCount": 198,
      "averageOrderValue": 1283.84,
      "profitMarginPercent": 24.8,
      "profitAvailable": true
    },
    "series": [
      {
        "bucketStart": "2026-10-01T00:00:00+02:00",
        "netSales": 9200,
        "netProfit": 2400,
        "ordersCount": 7,
        "averageOrderValue": 1314.28,
        "profitMarginPercent": 26.1,
        "previousNetSales": 8100,
        "previousNetProfit": 1900
      }
    ],
    "generatedAt": "2026-10-31T09:55:00+02:00"
  }
}
```

`series` contains one object per bucket in the selected range. The example shows only one point to keep the contract readable; return all buckets.

### Null handling is important

If the historical product cost or required expense data is incomplete, do **not** return `0` for profit. Return:

```json
{
  "costOfGoodsSold": null,
  "grossProfit": null,
  "paymentFees": null,
  "shippingCosts": null,
  "operatingExpenses": null,
  "netProfit": null,
  "profitMarginPercent": null,
  "profitAvailable": false
}
```

In the series, `netProfit` and `previousNetProfit` should also be `null` while profit is unavailable. This avoids displaying fabricated profit figures.

## 4) Financial definitions

اعتمد تعريفًا واحدًا وثابتًا في كل التقارير:

```text
Gross Sales       = sum(item unit selling price × sold quantity), before discounts
Net Sales         = Gross Sales - Discounts - Merchandise Refunds
Gross Profit      = Net Sales - Cost of Goods Sold
Net Profit        = Gross Profit + Shipping Revenue
                    - Payment Fees - Shipping Costs - Operating Expenses
Average Order Value = (Gross Sales - Discounts) / count(distinct recognized paid orders)
Profit Margin %   = (Net Profit / Net Sales) × 100
```

- ضريبة القيمة المضافة/الضرائب المحصلة لحساب جهة أخرى ليست إيرادًا للمتجر، ويجب فصلها عن المبيعات.
- `Shipping Revenue` هو مبلغ الشحن الذي تم تحصيله من العميل، و`Shipping Costs` هو ما دفعه المتجر لشركة الشحن. لا تدمجهما في رقم واحد.
- `Refunds` في هذا العقد تعني المبلغ المسترد من قيمة المنتجات، ويُسجل بتاريخ تنفيذ الاسترداد. لو تم رد رسوم الشحن، اخصمها من `Shipping Revenue` أو أضف حقلًا منفصلًا وحدث العقد قبل التنفيذ.
- `Average Order Value` يستثني الشحن والضرائب، ويُحسب بعد الخصومات وقبل الاستردادات؛ لذلك لا يتشوّه عند تنفيذ استرداد لطلب أقدم في الفترة الحالية.
- لا تطرح رسوم الدفع أو الشحن مرتين. كل مصروف يجب أن يكون له تصنيف واحد فقط.
- احتسب الطلب مرة واحدة عند تحقق حدث الاعتراف المالي: عملية دفع ناجحة، أو طلب COD تم تسليمه وتسجيل تحصيله. لا تحتسب الطلبات المعلقة أو الفاشلة أو الملغاة غير المحصلة.
- حدّد سياسة زمنية واحدة: المبيعات عند تاريخ تحصيل الدفع، والاستردادات عند تاريخ تنفيذ الاسترداد. إذا اخترت سياسة أخرى فيجب أن تكون موثقة ومطبقة على كل الفترات.

## 5) متطلبات البيانات التاريخية

حتى يكون Net Profit صحيحًا، خزّن Snapshot لتكلفة المنتج وقت الشراء داخل كل `orderItem`، مثل:

```ts
{
  product: "...",
  quantity: 2,
  priceAtPurchase: 850,
  unitCostAtPurchase: 510
}
```

لا تستخدم تكلفة المنتج الحالية من Collection المنتجات لإعادة حساب ربح طلب قديم؛ سعر التكلفة قد يتغير بعد البيع.

عند إرجاع منتج للمخزون بحالة قابلة لإعادة البيع، سجّل قيدًا عكسيًا لتكلفة البضاعة لذلك الجزء المرتجع. أما رد الأموال دون استرجاع منتج صالح للمخزون فلا يلغي تكلفة البضاعة الأصلية. يجب أن يعكس `costOfGoodsSold` صافي تكلفة البضاعة بعد قيود المرتجعات الفعلية، وليس مجرد طرح قيمة كل Refund من التكلفة.

لا تجمع معاملات بعملات مختلفة مباشرة. حوّلها إلى عملة التقرير بسعر صرف موثّق وقت المعاملة، أو ارفض نطاقًا يضم عملات متعددة إذا لم تتوفر سياسة تحويل محاسبية.

ويُفضّل تسجيل القيود المالية في Ledger مستقل أو جدول transactions غير قابل للتعديل يحتوي على الأقل على:

- `type`: `payment_captured`, `refund`, `payment_fee`, `shipping_revenue`, `shipping_cost`, `operating_expense`.
- `amount`, `currency`, `occurredAt`, `orderId` عند ارتباط القيد بطلب، و`metadata` عند الحاجة.
- `occurredAt` و`orderId` عليهما indexes مناسبة للتقارير.
- سجّل المصاريف التشغيلية بتاريخ تكبدها وتصنيفها، ولا تخلطها مع تكلفة البضائع أو الشحن أو رسوم الدفع.

إذا كانت تكلفة بعض الطلبات القديمة غير معروفة، أعد `profitAvailable: false` للفترة المتأثرة، أو اعرض فترة تغطية الربح بوضوح. لا تفترض أن التكلفة صفر.

## 6) Frontend behavior

- الـ panel يطلب endpoint عند تغيير الفترة أو المقارنة.
- يعيد جلب البيانات كل 60 ثانية طالما التبويب ظاهر، ويوقف طلبات التحديث عندما لا تكون هناك نتيجة ناجحة بعد أو عندما تكون الصفحة مخفية.
- الرسم يعرض `netSales` و`netProfit`، ويمكنه إظهار `previousNetSales` بخط متقطع.
- لو `profitAvailable=false` يظهر Net Profit كشرطة `—` مع تنبيه يوضح أن بيانات التكلفة غير مكتملة.
- كل القيم يجب أن تكون أرقامًا فعلية من Backend؛ ممنوع ملء الرسم ببيانات تجريبية في الإنتاج.
