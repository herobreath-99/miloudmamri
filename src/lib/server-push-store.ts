import fs from "node:fs";
import path from "node:path";

export type ServerPushSubscription = {
  endpoint: string;
  p256dh: string;
  auth: string;
  userId: string;
  userAgent?: string;
  createdAt: string;
  lastUsedAt: string;
  timezone: string;
  categories: Record<string, { enabled: boolean; time: string; frequency: number }>;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  quietStart: string;
  quietEnd: string;
};

export type PushDeliveryStats = {
  totalActive: number;
  totalSent: number;
  totalFailed: number;
  lastDispatchedAt: string | null;
  lastError: string | null;
};

const DATA_DIR = path.resolve(process.cwd(), ".data");
const STORE_FILE = path.join(DATA_DIR, "push_subscriptions.json");
const STATS_FILE = path.join(DATA_DIR, "push_stats.json");

// In-memory cache for ultra-fast access
let memorySubscriptions: Map<string, ServerPushSubscription> | null = null;
let memoryStats: PushDeliveryStats = {
  totalActive: 0,
  totalSent: 0,
  totalFailed: 0,
  lastDispatchedAt: null,
  lastError: null,
};

function ensureDataDir(): void {
  try {
    if (typeof fs.existsSync === "function" && !fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch {
    // Filesystem is read-only in serverless edge environments (e.g. Cloudflare Workers)
  }
}

function loadFromDisk(): Map<string, ServerPushSubscription> {
  const map = new Map<string, ServerPushSubscription>();
  ensureDataDir();
  try {
    if (typeof fs.existsSync === "function" && fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, "utf-8");
      const list = JSON.parse(raw) as ServerPushSubscription[];
      if (Array.isArray(list)) {
        for (const item of list) {
          if (item?.endpoint && item.p256dh && item.auth) {
            map.set(item.endpoint, item);
          }
        }
      }
    }
  } catch {
    // Edge environments operate in-memory
  }

  try {
    if (typeof fs.existsSync === "function" && fs.existsSync(STATS_FILE)) {
      const raw = fs.readFileSync(STATS_FILE, "utf-8");
      const stats = JSON.parse(raw) as PushDeliveryStats;
      memoryStats = { ...memoryStats, ...stats };
    }
  } catch {
    // Edge environments operate in-memory
  }

  return map;
}

function saveToDisk(map: Map<string, ServerPushSubscription>): void {
  ensureDataDir();
  try {
    if (typeof fs.writeFileSync === "function") {
      const list = Array.from(map.values());
      fs.writeFileSync(STORE_FILE, JSON.stringify(list, null, 2), "utf-8");
      memoryStats.totalActive = list.length;
      fs.writeFileSync(STATS_FILE, JSON.stringify(memoryStats, null, 2), "utf-8");
    }
  } catch {
    // Edge environments operate in-memory
  }
}

function getStore(): Map<string, ServerPushSubscription> {
  if (!memorySubscriptions) {
    memorySubscriptions = loadFromDisk();
    memoryStats.totalActive = memorySubscriptions.size;
  }
  return memorySubscriptions;
}

export function saveSubscription(data: {
  endpoint: string;
  p256dh: string;
  auth: string;
  userId?: string;
  userAgent?: string;
  timezone?: string;
  categories?: Record<string, { enabled: boolean; time: string; frequency: number }>;
  soundEnabled?: boolean;
  vibrationEnabled?: boolean;
  quietStart?: string;
  quietEnd?: string;
}): ServerPushSubscription {
  const store = getStore();
  const now = new Date().toISOString();
  const existing = store.get(data.endpoint);

  const sub: ServerPushSubscription = {
    endpoint: data.endpoint,
    p256dh: data.p256dh,
    auth: data.auth,
    userId: data.userId || existing?.userId || "user_patient_default",
    userAgent: data.userAgent || existing?.userAgent,
    createdAt: existing?.createdAt || now,
    lastUsedAt: now,
    timezone: data.timezone || existing?.timezone || "Africa/Algiers",
    categories: data.categories ||
      existing?.categories || {
        medication: { enabled: true, time: "09:00", frequency: 1 },
        appointment: { enabled: true, time: "08:30", frequency: 1 },
        examination: { enabled: true, time: "08:30", frequency: 1 },
        hydration: { enabled: true, time: "10:00", frequency: 1 },
        skincare: { enabled: true, time: "21:00", frequency: 1 },
        arm_exercise: { enabled: true, time: "17:00", frequency: 1 },
        walking: { enabled: true, time: "18:00", frequency: 1 },
        sleep: { enabled: true, time: "22:30", frequency: 1 },
        mood_checkin: { enabled: true, time: "20:00", frequency: 1 },
        motivation: { enabled: true, time: "08:30", frequency: 1 },
        educational: { enabled: true, time: "12:00", frequency: 1 },
      },
    soundEnabled:
      data.soundEnabled !== undefined ? data.soundEnabled : (existing?.soundEnabled ?? true),
    vibrationEnabled:
      data.vibrationEnabled !== undefined
        ? data.vibrationEnabled
        : (existing?.vibrationEnabled ?? true),
    quietStart: data.quietStart || existing?.quietStart || "22:00",
    quietEnd: data.quietEnd || existing?.quietEnd || "07:00",
  };

  store.set(data.endpoint, sub);
  saveToDisk(store);
  return sub;
}

export function removeSubscription(endpoint: string): boolean {
  const store = getStore();
  const deleted = store.delete(endpoint);
  if (deleted) {
    saveToDisk(store);
  }
  return deleted;
}

export function getAllSubscriptions(): ServerPushSubscription[] {
  const store = getStore();
  return Array.from(store.values());
}

export function getSubscriptionByEndpoint(endpoint: string): ServerPushSubscription | undefined {
  const store = getStore();
  return store.get(endpoint);
}

export function updatePushDeliveryStats(delta: {
  sent?: number;
  failed?: number;
  lastError?: string;
}): void {
  if (delta.sent) memoryStats.totalSent += delta.sent;
  if (delta.failed) memoryStats.totalFailed += delta.failed;
  if (delta.lastError !== undefined) memoryStats.lastError = delta.lastError;
  memoryStats.lastDispatchedAt = new Date().toISOString();
  ensureDataDir();
  try {
    fs.writeFileSync(STATS_FILE, JSON.stringify(memoryStats, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not write push_stats.json:", err);
  }
}

export function getPushServerStats(): PushDeliveryStats {
  const store = getStore();
  return {
    ...memoryStats,
    totalActive: store.size,
  };
}
