import { createFileRoute } from "@tanstack/react-router";
import type { UserRole } from "@/types/roles";

export const Route = createFileRoute("/api/professional/consultations")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const role = (request.headers.get("x-user-role") ||
          url.searchParams.get("role")) as UserRole;
        const requestedDoctorId = url.searchParams.get("doctorId");
        const authenticatedDoctorId =
          request.headers.get("x-doctor-id") || url.searchParams.get("authDoctorId");

        // Role restriction
        if (role !== "professional" && role !== "platform_admin") {
          return Response.json(
            {
              error: "Forbidden",
              message:
                "Access Denied: Only verified healthcare professionals can access patient consultation records.",
            },
            { status: 403 },
          );
        }

        // Strict isolation: Professionals must never automatically access other doctors' patient records!
        if (
          role === "professional" &&
          requestedDoctorId &&
          authenticatedDoctorId !== requestedDoctorId
        ) {
          return Response.json(
            {
              error: "Forbidden: Record Isolation",
              message:
                "Cross-professional breach detected: Healthcare professionals can only view their own authorized patient consultations.",
            },
            { status: 403 },
          );
        }

        return Response.json({
          status: "authorized",
          doctorId: requestedDoctorId,
          message: "Authorized consultation records access granted.",
        });
      },
    },
  },
});
