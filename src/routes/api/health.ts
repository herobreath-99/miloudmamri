import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async () => {
        const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
        const supabaseKey =
          process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
        const geminiKey = process.env.GEMINI_API_KEY || "";

        return Response.json(
          {
            ok: true,
            status: "healthy",
            service: "pinkcare",
            timestamp: new Date().toISOString(),
            config: {
              supabaseClientConfigured:
                Boolean(supabaseUrl) &&
                !supabaseUrl.includes("placeholder.supabase.co") &&
                Boolean(supabaseKey) &&
                supabaseKey.length > 30,
              supabaseServerAdminConfigured:
                Boolean(supabaseUrl) && Boolean(serviceKey) && serviceKey.length > 30,
              geminiConfigured: Boolean(geminiKey.trim()) && !geminiKey.includes("YOUR_"),
              vapidConfigured: Boolean(
                process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY,
              ),
            },
          },
          { status: 200 },
        );
      },
    },
  },
});
