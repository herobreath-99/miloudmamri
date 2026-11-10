import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  buildPushPayload,
  type PushSubscription as WPSub,
  type VapidKeys,
} from "@block65/webcrypto-web-push";
import {
  saveSubscription,
  removeSubscription,
  getAllSubscriptions,
  updatePushDeliveryStats,
  getPushServerStats,
} from "./server-push-store";

// Standard production-grade uncompressed P-256 VAPID keypair
const FALLBACK_VAPID_PUB =
  "BK4F5FtWcsb_E-oIJoafwY-exlp4lyEBSvVO3v2vfzjUJs3T7eCVU3qxl-XTwZbbkBvO6dn_HUpfMgBsJlFVPJs";
const FALLBACK_VAPID_PRIV = "jLfyIY-9kl9tLPDjz7QA4plKoyqWuisS3zDwFU2JquQ";
const FALLBACK_VAPID_SUB = "mailto:support@pinkcare.app";

export function getVapidConfig(): VapidKeys {
  return {
    subject: process.env.VAPID_SUBJECT || FALLBACK_VAPID_SUB,
    publicKey: process.env.VAPID_PUBLIC_KEY || FALLBACK_VAPID_PUB,
    privateKey: process.env.VAPID_PRIVATE_KEY || FALLBACK_VAPID_PRIV,
  };
}

export const getVapidPublicKey = createServerFn({ method: "GET" }).handler(async () => {
  const cfg = getVapidConfig();
  return { key: cfg.publicKey };
});

const SubSchema = z.object({
  endpoint: z.string().url().max(1024),
  p256dh: z.string().min(1).max(512),
  auth: z.string().min(1).max(512),
  user_agent: z.string().max(512).optional(),
  user_id: z.string().max(128).optional(),
  timezone: z.string().max(64).optional(),
  sound_enabled: z.boolean().optional(),
  vibration_enabled: z.boolean().optional(),
});

export const savePushSubscription = createServerFn({ method: "POST" })
  .inputValidator((d) => SubSchema.parse(d))
  .handler(async ({ data }) => {
    // 1. Always persist in persistent server-side storage
    saveSubscription({
      endpoint: data.endpoint,
      p256dh: data.p256dh,
      auth: data.auth,
      userId: data.user_id,
      userAgent: data.user_agent,
      timezone: data.timezone || "Africa/Algiers",
      soundEnabled: data.sound_enabled ?? true,
      vibrationEnabled: data.vibration_enabled ?? true,
    });

    // 2. Also persist in Supabase if configured
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const admin = createClient(
          process.env.SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY,
          { auth: { persistSession: false } },
        );
        await admin.from("push_subscriptions").upsert(
          {
            user_id: data.user_id ?? "local-user",
            endpoint: data.endpoint,
            p256dh: data.p256dh,
            auth: data.auth,
            user_agent: data.user_agent ?? null,
            last_used_at: new Date().toISOString(),
          },
          { onConflict: "endpoint" },
        );
      } catch (e) {
        console.warn("Supabase push sub storage skipped:", e);
      }
    }
    return { ok: true };
  });

export const deletePushSubscription = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ endpoint: z.string().url() }).parse(d))
  .handler(async ({ data }) => {
    // 1. Remove from persistent server store
    removeSubscription(data.endpoint);

    // 2. Remove from Supabase if configured
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const admin = createClient(
          process.env.SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY,
          { auth: { persistSession: false } },
        );
        await admin.from("push_subscriptions").delete().eq("endpoint", data.endpoint);
      } catch (e) {
        console.warn("Supabase push sub delete skipped:", e);
      }
    }
    return { ok: true };
  });

const PushNotificationSchema = z.object({
  endpoint: z.string().url().max(1024),
  p256dh: z.string().min(1).max(512),
  auth: z.string().min(1).max(512),
  title: z.string().min(1).max(200),
  body: z.string().min(1).max(1000),
  category: z.string().min(1).max(60),
  route: z.string().max(200).optional(),
  sound_enabled: z.boolean().optional(),
  vibration_enabled: z.boolean().optional(),
});

// Secure push delivery with retry handling and automatic 410 cleanup
export const sendDirectPush = createServerFn({ method: "POST" })
  .inputValidator((d) => PushNotificationSchema.parse(d))
  .handler(async ({ data }) => {
    const v = getVapidConfig();
    const sub: WPSub = {
      endpoint: data.endpoint,
      expirationTime: null,
      keys: { p256dh: data.p256dh, auth: data.auth },
    };

    const pushContent = {
      title: data.title,
      body: data.body,
      category: data.category,
      route: data.route ?? "/care",
      sound_enabled: data.sound_enabled !== false,
      vibration_enabled: data.vibration_enabled !== false,
      timestamp: Date.now(),
    };

    let payload;
    try {
      payload = await buildPushPayload(
        {
          data: JSON.stringify(pushContent),
          options: { ttl: 300 }, // 5 minutes TTL
        },
        sub,
        v,
      );
    } catch (encryptErr) {
      const errMessage = encryptErr instanceof Error ? encryptErr.message : String(encryptErr);
      updatePushDeliveryStats({ failed: 1, lastError: `Encryption: ${errMessage}` });
      return { ok: false, expired: false, error: `Payload build failed: ${errMessage}` };
    }

    let sent = false;
    let expired = false;
    let lastError = "";

    // Retry once on transient network failure
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const res = await fetch(sub.endpoint, payload as unknown as RequestInit);
        if (res.ok || res.status === 201) {
          sent = true;
          updatePushDeliveryStats({ sent: 1 });
          break;
        } else if (res.status === 404 || res.status === 410) {
          expired = true;
          lastError = `Push subscription expired (HTTP ${res.status})`;
          // Automatic cleanup of expired endpoint
          removeSubscription(data.endpoint);
          updatePushDeliveryStats({ failed: 1, lastError });
          break;
        } else {
          lastError = `Push service responded with status ${res.status}`;
          if (attempt === 1) await new Promise((r) => setTimeout(r, 600));
        }
      } catch (err) {
        lastError = err instanceof Error ? err.message : String(err);
        if (attempt === 1) await new Promise((r) => setTimeout(r, 600));
      }
    }

    if (!sent && !expired) {
      updatePushDeliveryStats({ failed: 1, lastError });
    }

    return { ok: sent, expired, error: sent ? undefined : lastError };
  });

export const sendTestPush = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        endpoint: z.string().url().optional(),
        p256dh: z.string().optional(),
        auth: z.string().optional(),
        title: z.string().min(1).max(120),
        body: z.string().min(1).max(500),
        category: z.string().min(1).max(40),
        sound_enabled: z.boolean().optional(),
        vibration_enabled: z.boolean().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    if (!data.endpoint || !data.p256dh || !data.auth) {
      return { sent: 0, message: "No active push subscription provided" };
    }
    const result = await sendDirectPush({
      data: {
        endpoint: data.endpoint,
        p256dh: data.p256dh,
        auth: data.auth,
        title: data.title,
        body: data.body,
        category: data.category,
        sound_enabled: data.sound_enabled,
        vibration_enabled: data.vibration_enabled,
      },
    });
    return { sent: result.ok ? 1 : 0, error: result.error, expired: result.expired };
  });

export const getPushServerStatus = createServerFn({ method: "GET" }).handler(async () => {
  const stats = getPushServerStats();
  const allSubs = getAllSubscriptions();
  const vapid = getVapidConfig();
  return {
    activeDevices: allSubs.length,
    totalSent: stats.totalSent,
    totalFailed: stats.totalFailed,
    lastDispatchedAt: stats.lastDispatchedAt,
    lastError: stats.lastError,
    timezone: "Africa/Algiers",
    vapidKeyConfigured: Boolean(vapid.publicKey),
  };
});
