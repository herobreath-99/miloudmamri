const RELOAD_TS_KEY = "pc_chunk_reload_at";
const RELOAD_COOLDOWN_MS = 12_000;

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message || "";
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message?: unknown }).message ?? "");
  }
  return "";
}

export function isDynamicImportError(error: unknown): boolean {
  const msg = getErrorMessage(error);
  if (!msg) return false;
  return (
    msg.includes("Failed to fetch dynamically imported module") ||
    msg.includes("error loading dynamically imported module") ||
    msg.includes("Importing a module script failed") ||
    msg.includes("Unable to preload CSS") ||
    msg.includes("Loading chunk") ||
    msg.includes("ChunkLoadError") ||
    msg.includes("Outdated Optimize Dep")
  );
}

export function clearRouterReloadMarkers(): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const k = sessionStorage.key(i);
      if (k && k.startsWith("tanstack_router_reload:")) {
        keysToRemove.push(k);
      }
    }
    for (const k of keysToRemove) {
      sessionStorage.removeItem(k);
    }
  } catch {
    // Ignore storage access errors in restricted frames
  }
}

export function attemptChunkRecovery(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const now = Date.now();
    const lastRaw =
      typeof sessionStorage !== "undefined" ? sessionStorage.getItem(RELOAD_TS_KEY) : null;
    const last = lastRaw ? Number(lastRaw) : 0;
    if (last && Number.isFinite(last) && now - last < RELOAD_COOLDOWN_MS) {
      return false;
    }
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem(RELOAD_TS_KEY, String(now));
    }
    clearRouterReloadMarkers();
    window.location.reload();
    return true;
  } catch {
    return false;
  }
}

export function forceChunkReload(): void {
  if (typeof window === "undefined") return;
  try {
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.removeItem(RELOAD_TS_KEY);
    }
    clearRouterReloadMarkers();
  } catch {
    // Ignore storage errors
  }
  window.location.reload();
}

export function installVitePreloadErrorRecovery(): () => void {
  if (typeof window === "undefined") return () => {};
  const onPreloadError = (event: Event) => {
    event.preventDefault?.();
    attemptChunkRecovery();
  };
  window.addEventListener("vite:preloadError", onPreloadError);
  return () => {
    window.removeEventListener("vite:preloadError", onPreloadError);
  };
}
