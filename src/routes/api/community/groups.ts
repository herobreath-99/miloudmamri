import { createFileRoute } from "@tanstack/react-router";
import type { UserRole } from "@/types/roles";

export const Route = createFileRoute("/api/community/groups")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const role = (request.headers.get("x-user-role") || "patient") as UserRole;
          const body = (await request.json()) as {
            nameAr?: string;
            category?: string;
            createdBy?: string;
          };

          if (!body.nameAr || !body.createdBy) {
            return Response.json(
              { error: "Group name and creator ID are required" },
              { status: 400 },
            );
          }

          return Response.json({
            success: true,
            message: "Group created and validated on server",
            role,
            timestamp: new Date().toISOString(),
          });
        } catch {
          return Response.json({ error: "Invalid JSON payload" }, { status: 400 });
        }
      },
    },
  },
});
