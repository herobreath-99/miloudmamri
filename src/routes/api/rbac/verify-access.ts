import { createFileRoute } from "@tanstack/react-router";
import { ROLE_PERMISSIONS, type UserRole, type PermissionKey } from "@/types/roles";

export const Route = createFileRoute("/api/rbac/verify-access")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as {
            role?: UserRole;
            permission?: PermissionKey;
            userId?: string;
          };

          if (!body.role || !body.permission) {
            return Response.json(
              { error: "Missing role or permission parameter" },
              { status: 400 },
            );
          }

          const allowedPermissions = ROLE_PERMISSIONS[body.role] || [];
          const hasAccess = allowedPermissions.includes(body.permission);

          if (!hasAccess) {
            return Response.json(
              {
                authorized: false,
                role: body.role,
                permission: body.permission,
                message: `Security Enforcement: Role '${body.role}' is not authorized for permission '${body.permission}'.`,
              },
              { status: 403 },
            );
          }

          return Response.json({
            authorized: true,
            role: body.role,
            permission: body.permission,
            message: "Access granted.",
          });
        } catch {
          return Response.json({ error: "Invalid JSON payload" }, { status: 400 });
        }
      },
    },
  },
});
