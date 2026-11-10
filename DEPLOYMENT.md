# دليل نشر PinkCare المستقل عبر GitHub و Cloudflare (بدون Google Cloud)

يوثق هذا الدليل الهندسي الطريقة الرسمية لنشر تطبيق **PinkCare** مجاناً 100% خارج منظومة Google Cloud تماماً، بالاعتماد على **GitHub** و **Cloudflare**، مع تشغيل كامل الواجهات والخادم والمسارات الخلفية (`/api/*`).

---

## تنبيه حاسم بخصوص زر "Publish" في Google AI Studio

> ⚠️ **لا تضغط على زر Publish أو Deploy داخل واجهة Google AI Studio:**
> - زر "Publish" المدمج في واجهة Google AI Studio مصمم لرفع التطبيقات حصرياً على **Google Cloud Run / Google Cloud Build**، وهو ما يفرض وجود حساب فوترة بنكي نشط (Active Google Cloud Billing Account).
> - دور **Google AI Studio** يقتصر فقط على كونه **بيئة تطوير وتعديل واختبار محلية (Development / Sandbox)**.
> - النشر الإنتاجي الحقيقي يتم حصرياً عبر **تصدير الكود إلى مستودعك في GitHub** ثم ربطه ونشره مباشرة من لوحة تحكم **Cloudflare**.

---

## لماذا Cloudflare Workers مع ميزة Static Assets هي الخيار الأنسب؟

تطبيق PinkCare ليس مجرد موقع ثابت (Static SPA)، بل تطبيق متكامل يجمع بين:
1. **واجهة أمامية غنية (Client SPA):** صفحات التطبيق، التمارين ثلاثية الأبعاد (Three.js)، قواميس الدارجة الجزائرية، وتطبيق الويب التقدمي (PWA & Service Worker).
2. **خادم خلفي متطور (Edge Server Functions & API Routes):**
   - مسار الذكاء الاصطناعي الطبي الآمن: `/api/ai/chat`
   - مسار جدولة إرسال تذكيرات Web Push السحابية: `/api/public/cron/dispatch-notifications`
   - دوال السيرفر المباشرة للمصادقة وتشفير إشعارات VAPID.

عند تنفيذ أمر البناء `npm run build`، يولد محرك **Nitro**:
- مجلد `.output/public`: يحتوي على جميع الأصول والملفات الثابتة.
- ملف ومجلد `.output/server/index.mjs` ومعه ملف الإعداد المخصص `.output/server/wrangler.json`: يحتوي على كود خادم Edge Worker.

عند النشر إلى Cloudflare عبر إعدادات `wrangler` الرسمية، تتولى Cloudflare تشغيل الخادم والمسارات الخلفية بأقصى سرعة (Edge V8 Isolates)، مع تقديم الملفات الثابتة والصور وأيقونات PWA مباشرة عبر شبكة CDN العالمية التابعة لـ Cloudflare مجاناً.

---

## خطوات النشر خطوة بخطوة

### الخطوة 1: رفع المشروع إلى مستودع GitHub الخاص بك
من سطر الأوامر في مجلد مشروعك:
```bash
git init
git add .
git commit -m "feat: ready for cloudflare independent deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pinkcare.git
git push -u origin main
```

---

### الخطوة 2: النشر على Cloudflare

يمكنك النشر بإحدى طريقتين رسميتين:

#### الطريقة الأولى (الأسهل عبر لوحة تحكم Cloudflare Dashboard):
1. افتح [Cloudflare Dashboard](https://dash.cloudflare.com/) وسجل الدخول مجاناً.
2. من القائمة الجانبية، اختر **Workers & Pages**.
3. اضغط **Create application** ثم اختر **Pages** أو **Workers** > **Connect to Git**.
4. اختر مستودع `pinkcare` من حساب GitHub الخاص بك.
5. في إعدادات البناء (Build configuration):
   - **Framework preset:** `None`
   - **Build command:** `npm run build`
   - **Deploy command / Output:** اعتمد مسار البناء القياسي.
6. في قسم **Environment variables** أضف المتغيرات المذكورة في الجدول أدناه.
7. اضغط **Save and Deploy**.

#### الطريقة الثانية (المباشرة والمضمونة عبر سطر الأوامر Wrangler CLI):
من جهازك المحلي بعد عمل `git clone`:
```bash
# 1. تثبيت الحزم
npm install

# 2. بناء نسخة الإنتاج الكاملة
npm run build

# 3. تسجيل الدخول إلى حسابك في Cloudflare (مرة واحدة فقط مجاناً)
npx wrangler login

# 4. النشر الفوري بضغطة زر واحدة
npm run deploy
```
*الأمر `npm run deploy` يستدعي تلقائياً `wrangler deploy --config .output/server/wrangler.json`، مما ينشر الـ Worker مع جميع ملفات الواجهة العامة في ثوانٍ معدودة.*

---

### الخطوة 3: إدارة الأسرار والمتغيرات البيئية (Security & Secrets)

> 🔒 **قواعد أمنية صارمة:**
> - **تنبيه حاسم:** لا تستخدم أي قيم تجريبية أو افتراضية قديمة (مثل `pinkcare_cron_2026` أو `my_secure_cron_token_123`).
> - قم بتوليد مفتاح سري عشوائي قوي مشفر ومكون من 64 رمزاً باستخدام الأمر التالي في جهازك:
>   ```bash
>   openssl rand -hex 32
>   ```
> - ضع المتغيرات في لوحة تحكم Cloudflare تحت **Settings > Variables and Secrets**:

| اسم المتغير (Variable Name) | النوع في Cloudflare | القيمة / المصدر |
|---|---|---|
| `VITE_SUPABASE_URL` | Plain text | `https://vuvmptsfrywehibxeern.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Plain text | المفتاح العام المجهول (Anon Key) من لوحة Supabase |
| `VITE_SUPABASE_PROJECT_ID` | Plain text | `vuvmptsfrywehibxeern` |
| `CRON_REMINDER_SECRET` | **Secret (مشفر)** | القيمة العشوائية القوية التي ولدتها بـ `openssl rand -hex 32` |
| `GEMINI_API_KEY` | **Secret (مشفر)** | مفتاحك المجاني المباشر من [Google AI Studio](https://aistudio.google.com/) (بدون فوترة) |
| `VAPID_SUBJECT` | Plain text | `mailto:support@pinkcare.app` (أو بريدك الإلكتروني) |

---

### الخطوة 4: تفعيل تسجيل الدخول بحساب Google (Supabase URL Configuration)

بمجرد إتمام النشر والحصول على رابطك من Cloudflare (مثلاً: `https://pinkcare.workers.dev` أو `https://pinkcare.pages.dev` أو نطاقك المخصص):

1. افتح لوحة تحكم [Supabase Dashboard](https://supabase.com/dashboard).
2. اختر مشروع PinkCare (`vuvmptsfrywehibxeern`).
3. توجه إلى **Authentication** > **URL Configuration**:
   - في خانة **Site URL**: ضع رابط موقعك الجديد، مثل:  
     `https://pinkcare.workers.dev`
   - في خانة **Redirect URLs**: اضغط **Add URL** وأضف:  
     `https://pinkcare.workers.dev/auth/callback`
4. اضغط **Save**.
5. سيعمل زر **المتابعة باستخدام Google** وتسجيل الدخول بالبريد الإلكتروني فورياً ودون أي تعارض.

---

### الخطوة 5: جدولة التذكيرات السحابية التلقائية في الخلفية (Automated Cron Reminders)

تطبيق PinkCare يحتوي على نقطة نهاية محمية بالسيرفر لفحص جدول الأدوية والأنشطة وإرسال إشعارات Web Push للمريضات حسب توقيت الجزائر (`Africa/Algiers`):
- الرابط: `https://pinkcare.workers.dev/api/public/cron/dispatch-notifications`

لتشغيل هذا الرابط تلقائياً كل ساعة دون أي تكلفة:
1. افتح موقع [cron-job.org](https://cron-job.org/) وأنشئ حساباً مجانياً.
2. أنشئ مهمة جديدة (Create Cronjob):
   - **URL:**  
     `https://pinkcare.workers.dev/api/public/cron/dispatch-notifications?secret=YOUR_GENERATED_STRONG_SECRET`
   - **Schedule:** كل ساعة (Every 1 hour).
3. اضغط **Save**. ستقوم الخدمة باستدعاء الخادم ليرسل التنبيهات إلى هواتف المريضات حتى عندما يكون التطبيق مغلقاً.

---

## التحقق النهائي من المسارات بعد النشر

بعد إتمام الخطوات، اختبر مساراتك للتأكد من جاهزيتها:
- `GET https://your-domain/` ➔ استجابة **`200 OK`** (الواجهة الرئيسية ومجسم 3D).
- `GET https://your-domain/auth` ➔ استجابة **`200 OK`** (صفحة المصادقة وتسجيل الدخول).
- `POST https://your-domain/api/ai/chat` ➔ استجابة **`200 OK`** (استجابة المساعد الذكي الآمنة).
- `GET https://your-domain/api/public/cron/dispatch-notifications?secret=...` ➔ استجابة **`200 OK`** مع إحصائيات التذكيرات.
