// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import type {} from "nitro/vite";
import type { NitroHooks } from "nitro/types";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const onRollupBefore: NitroHooks["rollup:before"] = (_nitro, rollupConfig) => {
  const out = rollupConfig.output;
  if (!out || Array.isArray(out)) return;
  const prevManualChunks = typeof out.manualChunks === "function" ? out.manualChunks : undefined;
  out.manualChunks = (id, meta) => {
    if (
      id.includes("serialize-error") ||
      id.includes("custom-error") ||
      id.includes("webcrypto-web-push")
    ) {
      return "_libs/block65__webcrypto-web-push";
    }
    if (id.includes("node-domexception") || id.includes("fetch-blob")) {
      return "_libs/fetch-blob";
    }
    return prevManualChunks ? prevManualChunks(id, meta) : undefined;
  };
};

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
export default defineConfig({
  plugins: [
    {
      name: "silence-use-client-directive",
      enforce: "pre",
      transform(code, id) {
        if (
          code &&
          (id.includes("node_modules") || id.includes("@tanstack") || id.includes("sonner")) &&
          (code.includes('"use client"') || code.includes("'use client'"))
        ) {
          return {
            code: code.replace(/^\s*["']use client["'];?/m, "/* use client */"),
            map: null,
          };
        }
      },
    },
  ],
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: {
    preset: "node-server",
  },
  vite: {
    nitro: {
      hooks: {
        "rollup:before": onRollupBefore,
      },
    },
    optimizeDeps: {
      include: [
        "@supabase/supabase-js",
        "@tanstack/react-query",
        "@radix-ui/react-dialog",
        "@radix-ui/react-tabs",
        "@radix-ui/react-tooltip",
        "class-variance-authority",
        "clsx",
        "lucide-react",
        "recharts",
        "sonner",
        "tailwind-merge",
        "three",
        "zod",
      ],
    },
    server: {
      host: "0.0.0.0",
      port: 3000,
      allowedHosts: true,
      cors: true,
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (
              id.includes("serialize-error") ||
              id.includes("custom-error") ||
              id.includes("webcrypto-web-push")
            ) {
              return "push-crypto";
            }
          },
        },
        onwarn(
          warning: { code?: string; message: string },
          defaultHandler: (w: { code?: string; message: string }) => void,
        ) {
          if (
            warning.code === "MODULE_LEVEL_DIRECTIVE" ||
            (typeof warning.message === "string" &&
              (warning.message.includes("Module level directives cause errors when bundled") ||
                warning.message.includes("use client")))
          ) {
            return;
          }
          defaultHandler(warning);
        },
      },
    },
  },
});
