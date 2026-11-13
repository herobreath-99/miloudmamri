import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/config")({
  server: {
    handlers: {
      GET: async () => {
        const supabaseUrl = (
          process.env.VITE_SUPABASE_URL ||
          process.env.SUPABASE_URL ||
          ""
        ).trim();
        const supabasePublishableKey = (
          process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
          process.env.SUPABASE_PUBLISHABLE_KEY ||
          ""
        ).trim();
        const supabaseProjectId = (
          process.env.VITE_SUPABASE_PROJECT_ID ||
          process.env.SUPABASE_PROJECT_ID ||
          ""
        ).trim();

        return Response.json(
          {
            supabaseUrl:
              supabaseUrl && !supabaseUrl.includes("placeholder.supabase.co") ? supabaseUrl : null,
            supabasePublishableKey:
              supabasePublishableKey && supabasePublishableKey.length > 30
                ? supabasePublishableKey
                : null,
            supabaseProjectId: supabaseProjectId || null,
          },
          {
            status: 200,
            headers: {
              "cache-control": "no-store",
            },
          },
        );
      },
    },
  },
});
