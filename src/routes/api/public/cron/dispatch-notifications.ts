import { createFileRoute } from "@tanstack/react-router";
import { buildPushPayload, type PushSubscription as WPSub } from "@block65/webcrypto-web-push";
import { getVapidConfig } from "@/lib/push.functions";
import {
  getAllSubscriptions,
  removeSubscription,
  updatePushDeliveryStats,
  type ServerPushSubscription,
} from "@/lib/server-push-store";

const VARIANTS: Record<string, { ar: string[]; en: string[]; emoji: string }> = {
  hydration: {
    emoji: "💧",
    ar: [
      "💧 تذكير بشرب الماء — خطوة صغيرة الآن تساعدك على الحفاظ على نشاطك.",
      "💧 كوب ماء الآن قد يكون أفضل ما تقدمينه لجسمك.",
      "💧 ربما الآن وقت مناسب لرشفة ماء لطيفة 🌸",
    ],
    en: [
      "💧 A small sip now helps you stay energized.",
      "💧 A glass of water might be the kindest thing you do.",
      "💧 Maybe now is a gentle moment for some water 🌸",
    ],
  },
  skincare: {
    emoji: "✨",
    ar: [
      "✨ حان وقت العناية ببشرتك — لحظات الاهتمام بنفسك جزء مهم من يومك.",
      "✨ لحظة لطيفة لترطيب بشرتك بحب.",
      "✨ خطوات بسيطة من العناية تصنع فرقًا 💗",
    ],
    en: [
      "✨ Caring for your skin is part of caring for yourself.",
      "✨ A gentle moment to moisturize with love.",
      "✨ Small steps of care make a real difference 💗",
    ],
  },
  arm_exercise: {
    emoji: "🌸",
    ar: [
      "🌸 حان وقت تمارين الذراع — بضع دقائق من الحركة قد تساعدك على الشعور بالنشاط.",
      "🌸 حركة لطيفة للذراع الآن تعني مرونة أكبر غدًا.",
      "🌸 ربما الآن وقت مناسب للاهتمام بنفسك قليلاً 💗",
    ],
    en: [
      "🌸 A few gentle minutes helps your mobility.",
      "🌸 A soft arm stretch now goes a long way.",
      "🌸 Maybe now is a good time to care for yourself 💗",
    ],
  },
  walking: {
    emoji: "🚶‍♀️",
    ar: [
      "🚶‍♀️ حان وقت الحركة — كل خطوة اليوم هي استثمار في صحتك.",
      "🚶‍♀️ نزهة قصيرة قد ترفع مزاجك بشكل لطيف.",
      "🚶‍♀️ خطوات بسيطة ومتكررة تصنع فرقًا كبيرًا 🌸",
    ],
    en: [
      "🚶‍♀️ Every step today is an investment in your health.",
      "🚶‍♀️ A short walk can gently lift your mood.",
      "🚶‍♀️ Small, repeated steps make a big difference 🌸",
    ],
  },
  medication: {
    emoji: "💊",
    ar: [
      "💊 تذكير بموعد الدواء — الالتزام بالجرعة الموصوفة يدعم تعافيكِ.",
      "💊 لحظة مهمة، لا تنسي جرعتكِ الموصوفة 💗",
      "💊 خطوة صغيرة الآن تدعم رحلتكِ العلاجية وصحتكِ.",
    ],
    en: [
      "💊 Staying on schedule supports your treatment plan.",
      "💊 An important moment — don't forget your prescribed dose 💗",
      "💊 A small step now supports your healing journey.",
    ],
  },
  appointment: {
    emoji: "🏥",
    ar: [
      "🏥 تذكير بموعدكِ الطبي — فريقكِ المعالج بانتظاركِ للاطمئنان على صحتكِ.",
      "🏥 موعدكِ الطبي القادم مقترب. الاستعداد المسبق يمنحكِ راحة البال 🌸",
    ],
    en: [
      "🏥 Upcoming medical appointment — your healthcare team is ready.",
      "🏥 Preparation brings peace of mind for your medical visit 🌸",
    ],
  },
  examination: {
    emoji: "🔬",
    ar: [
      "🔬 تذكير بالفحص الطبي التشخيصي — الاطمئنان خطوة مهمة في مسار تعافيكِ.",
      "🔬 موعد فحصكِ الطبي يقترب. الاطمئنان على صحتكِ أولوية 💗",
    ],
    en: [
      "🔬 Diagnostic examination reminder — taking care of your health is key.",
      "🔬 Your test appointment is approaching. Health check brings clarity 💗",
    ],
  },
  sleep: {
    emoji: "🌙",
    ar: [
      "🌙 جسمك يستحق راحة هادئة الليلة.",
      "🌙 لحظة هدوء — حان وقت الاسترخاء والنوم الصحي.",
      "🌙 نوم لطيف يجدد طاقتك للغد 💗",
    ],
    en: [
      "🌙 Your body deserves a calm rest tonight.",
      "🌙 A quiet moment — time to unwind.",
      "🌙 Gentle sleep renews your energy 💗",
    ],
  },
  mood_checkin: {
    emoji: "💗",
    ar: [
      "💗 كيف تشعرين اليوم؟ خصصي لحظة لتسجيل حالتك.",
      "💗 لحظة صغيرة لتسمعي نفسك — كيف حالك الآن؟",
      "💗 مشاعرك مهمة، شاركينا كيف يسير يومك 🌸",
    ],
    en: [
      "💗 How are you feeling today? Take a moment to log it.",
      "💗 A small moment to listen to yourself — how are you?",
      "💗 Your feelings matter — share how your day is going 🌸",
    ],
  },
  motivation: {
    emoji: "🌸",
    ar: [
      "🌸 أنتِ تقومين بعمل رائع اليوم 💗",
      "🌸 خطوات صغيرة تصنع فرقًا كبيرًا.",
      "🌸 خصصي دقيقة واحدة لنفسك الآن.",
      "🌸 أنتِ أقوى مما تعتقدين 💗",
    ],
    en: [
      "🌸 You're doing wonderfully today 💗",
      "🌸 Small steps make a big difference.",
      "🌸 Take one minute for yourself now.",
      "🌸 You are stronger than you think 💗",
    ],
  },
  educational: {
    emoji: "📖",
    ar: [
      "📖 محتوى جديد بانتظارك — نصيحة صحية لطيفة.",
      "📖 معلومة صغيرة قد تثري يومك 🌸",
      "📖 خصصي دقيقة لقراءة نصيحة جديدة في مكتبة التوعية.",
    ],
    en: [
      "📖 New content is waiting — a gentle tip for today.",
      "📖 A small insight that might enrich your day 🌸",
      "📖 Take a minute for a new wellness tip.",
    ],
  },
};

const TITLES: Record<string, { ar: string; en: string }> = {
  hydration: { ar: "💧 وقت ترطيب الجسم", en: "💧 Hydration time" },
  skincare: { ar: "✨ وقت العناية بالبشرة", en: "✨ Skincare moment" },
  arm_exercise: { ar: "🌸 حان وقت تمارين الذراع", en: "🌸 Arm exercise" },
  walking: { ar: "🚶‍♀️ حان وقت الحركة", en: "🚶‍♀️ Time to move" },
  medication: { ar: "💊 تذكير بالدواء", en: "💊 Medication reminder" },
  appointment: { ar: "🏥 موعد طبي قادم", en: "🏥 Medical appointment" },
  examination: { ar: "🔬 فحص طبي تشخيصي", en: "🔬 Diagnostic exam" },
  sleep: { ar: "🌙 وقت الراحة", en: "🌙 Rest time" },
  mood_checkin: { ar: "💗 كيف تشعرين؟", en: "💗 How do you feel?" },
  motivation: { ar: "🌸 رسالة لكِ", en: "🌸 A note for you" },
  educational: { ar: "📖 نصيحة صحية جديدة", en: "📖 New health tip" },
};

function localParts(d: Date, tz: string) {
  try {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: tz,
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).formatToParts(d);
    const get = (t: string) => fmt.find((p) => p.type === t)?.value ?? "00";
    return {
      hh: Number(get("hour")),
      mm: Number(get("minute")),
      date: `${get("year")}-${get("month")}-${get("day")}`,
    };
  } catch {
    // Fallback to UTC if timezone format error
    return {
      hh: d.getUTCHours(),
      mm: d.getUTCMinutes(),
      date: d.toISOString().slice(0, 10),
    };
  }
}

function inQuiet(qsStr: string, qeStr: string, curMin: number): boolean {
  const [qsH = 22, qsM = 0] = qsStr.split(":").map(Number);
  const [qeH = 7, qeM = 0] = qeStr.split(":").map(Number);
  const s = qsH * 60 + qsM;
  const e = qeH * 60 + qeM;
  return s < e ? curMin >= s && curMin < e : curMin >= s || curMin < e;
}

// Memory tracking of dispatched notifications per day to prevent duplicate cron pushes
const dispatchedToday = new Set<string>();

async function executeDispatch(request: Request) {
  const url = new URL(request.url);
  const querySecret = url.searchParams.get("secret") || url.searchParams.get("token");
  const authHeader =
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    request.headers.get("apikey");

  const expectedSecret =
    process.env.CRON_REMINDER_SECRET ||
    process.env.LOVABLE_CRON_SECRET ||
    process.env.CRON_SECRET ||
    process.env.SUPABASE_PUBLISHABLE_KEY;

  const isProd = process.env.NODE_ENV === "production";
  const isAuthorized = expectedSecret
    ? querySecret === expectedSecret ||
      authHeader === expectedSecret ||
      (!isProd && url.searchParams.get("test") === "1")
    : !isProd;

  if (!isAuthorized) {
    return new Response(JSON.stringify({ error: "Unauthorized: cron secret missing or invalid" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  const vapid = getVapidConfig();
  if (!vapid.privateKey) {
    return Response.json(
      {
        ok: false,
        error: "VAPID_PRIVATE_KEY is missing in production environment secrets.",
      },
      { status: 500 },
    );
  }
  const now = new Date();

  // Load all registered subscriptions from persistent store
  const localSubs = getAllSubscriptions();
  const subsToProcess: ServerPushSubscription[] = [...localSubs];

  // Also query Supabase if configured and merge
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const admin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false },
      });
      const { data: supaSubs } = await admin.from("push_subscriptions").select("*");
      if (supaSubs && Array.isArray(supaSubs)) {
        for (const s of supaSubs) {
          if (!subsToProcess.some((p) => p.endpoint === s.endpoint)) {
            subsToProcess.push({
              endpoint: s.endpoint,
              p256dh: s.p256dh,
              auth: s.auth,
              userId: s.user_id || "supabase_user",
              userAgent: s.user_agent,
              createdAt: s.created_at || now.toISOString(),
              lastUsedAt: s.last_used_at || now.toISOString(),
              timezone: "Africa/Algiers",
              categories: {},
              soundEnabled: true,
              vibrationEnabled: true,
              quietStart: "22:00",
              quietEnd: "07:00",
            });
          }
        }
      }
    } catch (e) {
      console.warn("Supabase sub sync warning:", e);
    }
  }

  if (subsToProcess.length === 0) {
    return Response.json({
      ok: true,
      dispatched: 0,
      activeSubscriptions: 0,
      message: "No active push subscriptions registered on server yet.",
      timestamp: now.toISOString(),
    });
  }

  let totalSent = 0;
  let totalErrors = 0;
  const dispatchLogs: Array<{ category: string; target: string; status: string }> = [];

  const isForceTest = url.searchParams.get("force") === "true";

  for (const subItem of subsToProcess) {
    const tz = subItem.timezone || "Africa/Algiers";
    const { hh, mm, date: todayDate } = localParts(now, tz);
    const nowMin = hh * 60 + mm;

    // Respect quiet hours
    if (
      !isForceTest &&
      inQuiet(subItem.quietStart || "22:00", subItem.quietEnd || "07:00", nowMin)
    ) {
      continue;
    }

    const categories = subItem.categories || {};
    const dueCategories: string[] = [];

    if (isForceTest) {
      dueCategories.push("medication");
    } else {
      for (const [catKey, cfg] of Object.entries(categories)) {
        if (!cfg.enabled || !cfg.time) continue;
        const [ch = 9, cm = 0] = cfg.time.split(":").map(Number);
        const catMin = ch * 60 + cm;
        // 6-minute window for 5-minute cron frequency
        if (catMin > nowMin || catMin < nowMin - 6) continue;

        const dedupeId = `${subItem.endpoint}-${catKey}-${todayDate}-${cfg.time}`;
        if (dispatchedToday.has(dedupeId)) continue;
        dueCategories.push(catKey);
      }
    }

    if (dueCategories.length === 0) continue;

    for (const catKey of dueCategories) {
      const variant = VARIANTS[catKey] || VARIANTS.motivation;
      const titles = TITLES[catKey] || TITLES.motivation;
      const title = titles.ar;
      const body = variant.ar[Math.floor(Math.random() * variant.ar.length)];

      const sub: WPSub = {
        endpoint: subItem.endpoint,
        expirationTime: null,
        keys: { p256dh: subItem.p256dh, auth: subItem.auth },
      };

      try {
        const payload = await buildPushPayload(
          {
            data: JSON.stringify({
              title,
              body,
              category: catKey,
              sound_enabled: subItem.soundEnabled !== false,
              vibration_enabled: subItem.vibrationEnabled !== false,
              route:
                catKey === "medication"
                  ? "/care?tab=medications"
                  : catKey === "appointment" || catKey === "examination"
                    ? "/care?tab=appointments"
                    : catKey === "arm_exercise"
                      ? "/exercise"
                      : "/notifications",
              timestamp: Date.now(),
            }),
            options: { ttl: 300 },
          },
          sub,
          vapid,
        );

        const res = await fetch(sub.endpoint, payload as unknown as RequestInit);
        if (res.ok || res.status === 201) {
          totalSent++;
          const dedupeId = `${subItem.endpoint}-${catKey}-${todayDate}`;
          dispatchedToday.add(dedupeId);
          dispatchLogs.push({
            category: catKey,
            target: subItem.endpoint.slice(0, 30),
            status: "delivered",
          });
        } else if (res.status === 404 || res.status === 410) {
          removeSubscription(subItem.endpoint);
          dispatchLogs.push({
            category: catKey,
            target: subItem.endpoint.slice(0, 30),
            status: "expired_cleaned",
          });
        } else {
          totalErrors++;
          dispatchLogs.push({
            category: catKey,
            target: subItem.endpoint.slice(0, 30),
            status: `http_${res.status}`,
          });
        }
      } catch (err) {
        totalErrors++;
        console.error("Cron push dispatch exception:", err);
      }
    }
  }

  updatePushDeliveryStats({ sent: totalSent, failed: totalErrors });

  return Response.json({
    ok: true,
    dispatched: totalSent,
    errors: totalErrors,
    activeSubscriptions: subsToProcess.length,
    timezone: "Africa/Algiers",
    logs: dispatchLogs,
    timestamp: now.toISOString(),
  });
}

export const Route = createFileRoute("/api/public/cron/dispatch-notifications")({
  server: {
    handlers: {
      GET: async ({ request }) => executeDispatch(request),
      POST: async ({ request }) => executeDispatch(request),
    },
  },
});
