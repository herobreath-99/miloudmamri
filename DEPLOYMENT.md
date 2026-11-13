# دليل تشغيل ونشر تطبيق PinkCare عبر Google AI Studio (Starter Tier)

يوثق هذا الدليل خطوات تجهيز ونشر تطبيق **PinkCare – Digital Compass** بالكامل داخل **Google AI Studio** عبر باقة **Starter Tier** المؤهلة، مع الحفاظ الكامل على قاعدة بيانات **Supabase** الحالية وجميع بيانات المستخدمات، وتشغيل الخادم الخلفي بـ **Node.js** ومفاتيح **Gemini AI** بأمان تام.

---

## البنية التشغيلية المعتمدة

1. **الواجهة الأمامية (Frontend):** React + Vite + TanStack Start + Three.js + PWA.
2. **الخادم الخلفي (Full-Stack Server):** Nitro (`preset: "node-server"`) يعمل على `0.0.0.0` والمنفذ المحدد في `PORT` (افتراضياً `3000`) عبر الأمر `npm run start`.
3. **قاعدة البيانات والمصادقة (Database & Auth):** مشروع Supabase الحالي (`vuvmptsfrywehibxeern`) محفوظ دون أي تعديل أو ترحيل.
4. **الذكاء الاصطناعي (Server-Side AI):** مسار `/api/ai/chat` يستدعي Gemini API حصرياً من جهة الخادم باستخدام `GEMINI_API_KEY`.

---

## الخطوة 1: إعداد المتغيرات السرية (AI Studio Secrets Panel)

من داخل **Settings > Secrets** في Google AI Studio، أضف المتغيرات التالية:

| اسم المتغير                     | مطلوب؟                         | الوصف / المصدر                                                                |
| ------------------------------- | ------------------------------ | ----------------------------------------------------------------------------- |
| `GEMINI_API_KEY`                | مطلوب للمساعد الذكي            | مفتاح Gemini API (يعمل على جهة الخادم فقط ولا يظهر في الواجهة)                |
| `SUPABASE_URL`                  | مطلوب                          | `https://vuvmptsfrywehibxeern.supabase.co`                                    |
| `SUPABASE_PUBLISHABLE_KEY`      | مطلوب                          | المفتاح العام (Anon / Publishable Key) من لوحة Supabase                       |
| `SUPABASE_PROJECT_ID`           | مستحسن                         | `vuvmptsfrywehibxeern`                                                        |
| `VITE_SUPABASE_URL`             | اختياري (لوقت البناء)          | نفس قيمة `SUPABASE_URL`                                                       |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | اختياري (لوقت البناء)          | نفس قيمة `SUPABASE_PUBLISHABLE_KEY`                                           |
| `VITE_SUPABASE_PROJECT_ID`      | اختياري (لوقت البناء)          | `vuvmptsfrywehibxeern`                                                        |
| `SUPABASE_SERVICE_ROLE_KEY`     | اختياري (للمزامنة الإدارية)    | Service Role Key — **يُحفظ كمتغير سري في الخادم فقط ولا يُمرر للمتصفح أبداً** |
| `CRON_REMINDER_SECRET`          | مطلوب في الإنتاج               | مفتاح عشوائي قوي لحماية مسار `/api/public/cron/dispatch-notifications`        |
| `VAPID_PRIVATE_KEY`             | مطلوب في الإنتاج لإشعارات Push | المفتاح الخاص لتشفير Web Push                                                 |
| `VAPID_PUBLIC_KEY`              | اختياري                        | المفتاح العام المطابق لـ `VAPID_PRIVATE_KEY`                                  |
| `VAPID_SUBJECT`                 | اختياري                        | مثلاً `mailto:support@pinkcare.app`                                           |

> ملاحظة: إذا لم تتوفر متغيرات `VITE_*` أثناء خطوة البناء (`npm run build`)، يقوم المتصفح تلقائياً بجلب القيم العامة فقط عبر `/api/public/config` بمجرد توفر `SUPABASE_URL` و `SUPABASE_PUBLISHABLE_KEY` في الأسرار السحابية.

---

## الخطوة 2: إعداد روابط التحويل في Supabase Auth

بعد النشر من زر **Publish** في Google AI Studio والحصول على الرابط النهائي للتطبيق:

1. افتح [Supabase Dashboard](https://supabase.com/dashboard) واختر المشروع `vuvmptsfrywehibxeern`.
2. انتقل إلى **Authentication > URL Configuration**.
3. أضف رابط التطبيق المنشور في **Site URL**، وأضف جميع روابط العودة في **Redirect URLs**:
   - `<published-app-url>/auth/callback`
   - `https://ais-dev-akpgeq24tdpwuy4swk5kqc-637827932906.europe-west2.run.app/auth/callback`
   - `https://ais-pre-akpgeq24tdpwuy4swk5kqc-637827932906.europe-west2.run.app/auth/callback`
4. احفظ الإعدادات لضمان عمل تسجيل الدخول عبر Google والبريد الإلكتروني بسلاسة.

---

## الخطوة 3: مسارات الفحص والتحقق

- `GET /api/health` ➔ التحقق من جاهزية الخادم وحالة الإعدادات (بدون كشف أي مفاتيح سرية).
- `GET /api/public/config` ➔ إرجاع إعدادات Supabase العامة الآمنة للمتصفح عند التشغيل.
- `POST /api/ai/chat` ➔ محادثة المساعدة الذكية PinkCare عبر Gemini من الخادم.
- `GET /api/public/cron/dispatch-notifications?secret=...` ➔ إرسال التذكيرات السحابية المجدولة.
