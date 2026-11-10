// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
interface RollupWarnObject {
  code?: string;
  message?: string;
}

type RollupWarnHandler = (
  warning: RollupWarnObject,
  defaultHandler: (w: RollupWarnObject) => void,
) => void;

interface RollupOutputObject {
  manualChunks?: (id: string, meta: unknown) => string | void;
  [key: string]: unknown;
}

interface RollupConfigWithWarn {
  onwarn?: RollupWarnHandler;
  output?: RollupOutputObject | RollupOutputObject[];
}

function patchManualChunks(output?: RollupOutputObject | RollupOutputObject[]) {
  if (!output) return;
  const outputs = Array.isArray(output) ? output : [output];
  for (const out of outputs) {
    const origManualChunks = out.manualChunks;
    out.manualChunks = (id: string, meta: unknown) => {
      if (
        id.includes("serialize-error") ||
        id.includes("custom-error") ||
        id.includes("webcrypto-web-push")
      ) {
        return "push-crypto";
      }
      if (typeof origManualChunks === "function") {
        const chunk = origManualChunks(id, meta);
        if (typeof chunk === "string" && chunk.includes("error")) {
          return chunk.replace(/error/g, "err");
        }
        return chunk;
      }
    };
  }
}

interface NitroRendererInstance {
  hooks?: {
    hook: (
      event: string,
      callback: (_subNitro: unknown, rollupConfig: RollupConfigWithWarn) => void,
    ) => void;
  };
}

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
    hooks: {
      "rollup:before"(_nitro: unknown, rollupConfig: RollupConfigWithWarn) {
        if (rollupConfig) {
          patchManualChunks(rollupConfig.output);
          const origOnwarn = rollupConfig.onwarn;
          rollupConfig.onwarn = (
            warning: RollupWarnObject,
            warn: (w: RollupWarnObject) => void,
          ) => {
            if (
              warning?.code === "MODULE_LEVEL_DIRECTIVE" ||
              (typeof warning?.message === "string" &&
                (warning.message.includes("Module level directives cause errors when bundled") ||
                  warning.message.includes("use client")))
            ) {
              return;
            }
            if (origOnwarn) {
              origOnwarn(warning, warn);
            } else {
              warn(warning);
            }
          };
        }
      },
      "prerender:init"(prerenderer: NitroRendererInstance) {
        prerenderer?.hooks?.hook(
          "rollup:before",
          (_subNitro: unknown, rollupConfig: RollupConfigWithWarn) => {
            if (rollupConfig) {
              patchManualChunks(rollupConfig.output);
              const origOnwarn = rollupConfig.onwarn;
              rollupConfig.onwarn = (
                warning: RollupWarnObject,
                warn: (w: RollupWarnObject) => void,
              ) => {
                if (
                  warning?.code === "MODULE_LEVEL_DIRECTIVE" ||
                  (typeof warning?.message === "string" &&
                    (warning.message.includes(
                      "Module level directives cause errors when bundled",
                    ) ||
                      warning.message.includes("use client")))
                ) {
                  return;
                }
                if (origOnwarn) {
                  origOnwarn(warning, warn);
                } else {
                  warn(warning);
                }
              };
            }
          },
        );
      },
    },
  },
  vite: {
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
        onwarn(warning, defaultHandler) {
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
