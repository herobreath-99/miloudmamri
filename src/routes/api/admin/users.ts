import { createFileRoute } from "@tanstack/react-router";
import type { UserRole } from "@/types/roles";

export const Route = createFileRoute("/api/admin/users")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const role = (request.headers.get("x-user-role") ||
          url.searchParams.get("role")) as UserRole;

        if (role !== "platform_admin") {
          return Response.json(
            {
              error: "Forbidden",
              message: "Access denied. Only Platform Administrators may manage user accounts.",
            },
            { status: 403 },
          );
        }

        return Response.json({
          status: "authorized",
          message: "User management endpoint accessed successfully.",
        });
      },
      PATCH: async ({ request }) => {
        const role = request.headers.get("x-user-role") as UserRole;
        if (role !== "platform_admin") {
          return Response.json(
            {
              error: "Forbidden",
              message: "Access denied. Only Platform Administrators may update user roles.",
            },
            { status: 403 },
          );
        }

        return Response.json({ success: true, message: "User updated." });
      },
    },
  },
});
