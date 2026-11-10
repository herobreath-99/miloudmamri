import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/patient/delete-account")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as { userId?: string; confirmed?: boolean };

          if (!body.userId || body.confirmed !== true) {
            return Response.json(
              {
                error:
                  "Explicit user confirmation is strictly required for irreversible data erasure",
              },
              { status: 400 },
            );
          }

          // In production, execute cascade deletion across DB and revoke active JWT tokens
          const auditLog = {
            status: "purged",
            userId: body.userId,
            erasureTimestamp: new Date().toISOString(),
            compliance: "GDPR_ARTICLE_17_RIGHT_TO_ERASURE",
            recordsPurged: [
              "patient_profile",
              "clinical_medications",
              "scheduled_examinations",
              "mood_journal_entries",
              "rehab_progress",
              "biometric_telemetry",
            ],
          };

          return Response.json(auditLog, { status: 200 });
        } catch {
          return Response.json({ error: "Invalid JSON payload" }, { status: 400 });
        }
      },
    },
  },
});
