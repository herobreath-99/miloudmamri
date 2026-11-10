import { createFileRoute } from "@tanstack/react-router";
import { updatePushDeliveryStats } from "@/lib/server-push-store";

export const Route = createFileRoute("/api/notifications/action")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { action, category, title } = body;
          updatePushDeliveryStats({});
          return Response.json({
            ok: true,
            received: { action, category, title },
            timestamp: new Date().toISOString(),
          });
        } catch {
          return Response.json({ ok: false, error: "Invalid payload" }, { status: 400 });
        }
      },
    },
  },
});
