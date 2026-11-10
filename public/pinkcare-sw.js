/* PinkCare Service Worker — Native OS Push Notifications & Actions */
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Per-category vibration patterns (ms) designed for clinical comfort
const VIB = {
  medication: [300, 100, 300],
  appointment: [300, 150, 300, 150, 300],
  examination: [300, 150, 300],
  arm_exercise: [100, 50, 100, 50, 100],
  walking: [100, 50, 100, 50, 100],
  hydration: [80],
  skincare: [60, 60, 60],
  sleep: [40],
  mood_checkin: [60, 60, 60],
  motivation: [40, 40, 80, 40, 120],
  educational: [50, 60, 50],
  custom: [80],
};

function routeFor(cat) {
  switch (cat) {
    case "medication":
      return "/care?tab=medications";
    case "appointment":
    case "examination":
      return "/care?tab=appointments";
    case "arm_exercise":
      return "/exercise";
    case "hydration":
    case "skincare":
    case "walking":
    case "sleep":
      return "/care?tab=checklist";
    case "mood_checkin":
    case "motivation":
      return "/home";
    case "educational":
      return "/learn";
    default:
      return "/notifications";
  }
}

// Real Web Push from the server: reaches the lock screen even when app is closed.
self.addEventListener("push", (event) => {
  let payload = {
    title: "🌸 PinkCare",
    body: "تذكير لطيف لكِ",
    category: "motivation",
    sound_enabled: true,
    vibration_enabled: true,
  };

  try {
    if (event.data) {
      payload = { ...payload, ...event.data.json() };
    }
  } catch (_) {}

  const { title, body, category } = payload;
  const soundEnabled = payload.sound_enabled !== false;
  const vibrationEnabled = payload.vibration_enabled !== false;
  const vibratePattern = vibrationEnabled ? VIB[category] || VIB.custom : [];
  const route = payload.route || routeFor(category);

  // Group by category to prevent duplicate notification spamming on lock screen
  const tag = payload.tag || `pinkcare-${category}`;

  const options = {
    body,
    icon: "/pinkcare-notif-icon.png",
    badge: "/pinkcare-notif-icon.png",
    image: "/pinkcare-notif-cover.jpg",
    tag,
    renotify: true,
    vibrate: vibratePattern,
    requireInteraction:
      category === "medication" || category === "appointment" || category === "examination",
    // When silent is false, the OS plays its native notification tone in sync with display
    silent: !soundEnabled,
    actions: [
      { action: "done", title: "✓ تم الإنجاز" },
      { action: "snooze", title: "⏰ ذكريني لاحقًا" },
      { action: "open", title: "▶ عرض التفاصيل" },
    ],
    data: {
      category,
      title,
      body,
      route,
      timestamp: payload.timestamp || Date.now(),
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Messages from the web app requesting a notification
self.addEventListener("message", (event) => {
  const msg = event.data || {};
  if (msg.type !== "pinkcare:show") return;
  const { title, options } = msg.payload || {};
  event.waitUntil(self.registration.showNotification(title, options));
});

// User tapped the notification body OR an action button
self.addEventListener("notificationclick", (event) => {
  const notif = event.notification;
  const action = event.action || "open";
  const data = notif.data || {};
  notif.close();

  event.waitUntil(
    (async () => {
      const allClients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      let client = allClients.find((c) => "focus" in c);
      const route = data.route || "/notifications";

      if (action === "open") {
        if (client) {
          await client.focus();
          client.postMessage({ type: "pinkcare:navigate", route });
        } else {
          await self.clients.openWindow(route);
        }
        return;
      }

      // Handle "done" or "snooze" actions
      if (client) {
        client.postMessage({
          type: "pinkcare:action",
          action,
          category: data.category,
          title: data.title,
          body: data.body,
          route,
        });
      } else {
        // App is closed: record action silently via backend
        try {
          await fetch("/api/notifications/action", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action,
              category: data.category,
              title: data.title,
              timestamp: Date.now(),
            }),
          });
        } catch (_) {}
      }
    })(),
  );
});

// User swiped or dismissed notification
self.addEventListener("notificationclose", (event) => {
  const data = event.notification.data || {};
  event.waitUntil(
    (async () => {
      const allClients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      for (const c of allClients) {
        try {
          c.postMessage({
            type: "pinkcare:action",
            action: "dismissed",
            category: data.category,
            title: data.title,
            body: data.body,
            route: data.route,
          });
        } catch {}
      }
    })(),
  );
});

// Automatic renewal when browser pushes new subscription credentials
self.addEventListener("pushsubscriptionchange", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const options = event.oldSubscription ? event.oldSubscription.options : null;
        if (!options) return;
        const newSub = await self.registration.pushManager.subscribe(options);
        const allClients = await self.clients.matchAll({
          type: "window",
          includeUncontrolled: true,
        });
        for (const c of allClients) {
          c.postMessage({
            type: "pinkcare:subscription-renewed",
            subscription: newSub.toJSON(),
          });
        }
      } catch (err) {
        console.error("pushsubscriptionchange renewal failed:", err);
      }
    })(),
  );
});
