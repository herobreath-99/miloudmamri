import { createFileRoute } from "@tanstack/react-router";
import { scanMessageSafety } from "@/lib/communityChatStorage";

export const Route = createFileRoute("/api/community/messages")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as {
            content?: string;
            senderId?: string;
            groupId?: string;
            conversationId?: string;
          };

          if (!body.content || !body.senderId) {
            return Response.json({ error: "Content and senderId are required" }, { status: 400 });
          }

          // Backend Safety & Privacy enforcement
          const safetyCheck = scanMessageSafety(body.content);
          if (!safetyCheck.isSafe && safetyCheck.detectedType === "phone_exposure") {
            return Response.json(
              {
                error: "Privacy Violation",
                message: safetyCheck.warning,
                blocked: true,
              },
              { status: 422 },
            );
          }

          return Response.json({
            success: true,
            isSafe: safetyCheck.isSafe,
            warning: safetyCheck.warning,
            status: "delivered",
            timestamp: new Date().toISOString(),
          });
        } catch {
          return Response.json({ error: "Invalid JSON payload" }, { status: 400 });
        }
      },
    },
  },
});
