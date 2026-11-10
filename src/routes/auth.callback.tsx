import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import logoImg from "@/assets/pinkcare-logo.png";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const nav = useNavigate();
  const { refreshProfile } = useAuth();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [message, setMessage] = useState<string>("جارٍ معالجة المصادقة والتحقق من الجلسة...");

  useEffect(() => {
    let isCancelled = false;

    async function handleCallback() {
      try {
        const url = new URL(window.location.href);
        const searchParams = url.searchParams;
        const hash = window.location.hash.slice(1);
        const hashParams = new URLSearchParams(hash);

        // Check for error parameters from OAuth provider
        const error = searchParams.get("error") || hashParams.get("error");
        const errorDescription =
          searchParams.get("error_description") || hashParams.get("error_description");

        if (error) {
          if (!isCancelled) {
            setStatus("error");
            setMessage(
              error === "access_denied"
                ? "تم إلغاء عملية تسجيل الدخول من قبل المستخدم."
                : `حدث خطأ أثناء المصادقة: ${errorDescription || error}`,
            );
          }
          if (window.opener) {
            try {
              window.opener.postMessage(
                { type: "OAUTH_AUTH_ERROR", error, description: errorDescription },
                "*",
              );
            } catch (err) {
              console.warn("Could not post OAuth error to opener:", err);
            }
          }
          return;
        }

        // 1. PKCE Code flow: exchange authorization code for session
        const code = searchParams.get("code");
        if (code) {
          setMessage("جارٍ تبادل رمز التفويض (PKCE Code Exchange)...");
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            throw exchangeError;
          }
          if (data.session) {
            await refreshProfile();
          }
        } else {
          // 2. Hash token flow (Implicit): access_token / refresh_token
          const accessToken = hashParams.get("access_token");
          const refreshToken = hashParams.get("refresh_token");

          if (accessToken && refreshToken) {
            setMessage("جارٍ حفظ وتأكيد جلسة المستخدم...");
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            if (sessionError) {
              throw sessionError;
            }
            await refreshProfile();
          } else {
            // 3. Fallback: Check if session is already active via detectSessionInUrl
            const { data: sessionData } = await supabase.auth.getSession();
            if (sessionData.session) {
              await refreshProfile();
            }
          }
        }

        if (isCancelled) return;
        setStatus("success");
        setMessage("تم تأكيد الجلسة بنجاح! مرحباً بكِ في PinkCare 🌸");

        // If this page was opened inside a popup by AI Studio preview or desktop window:
        if (window.opener && !window.opener.closed) {
          try {
            window.opener.postMessage({ type: "OAUTH_AUTH_SUCCESS" }, "*");
            setTimeout(() => {
              window.close();
            }, 800);
            return;
          } catch (err) {
            console.warn("Could not post OAuth success to opener:", err);
          }
        }

        // Top-level direct navigation: redirect to home
        setTimeout(() => {
          nav({ to: "/home" });
        }, 1200);
      } catch (err) {
        if (isCancelled) return;
        console.error("[Auth Callback] Error handling callback:", err);
        setStatus("error");
        const errMsg = err instanceof Error ? err.message : String(err);
        setMessage(
          errMsg.includes("Invalid API key")
            ? "مفتاح Supabase غير صالح. يرجى ضبط المفتاح الصحيح لمشروعك."
            : `تعذر إكمال المصادقة: ${errMsg}`,
        );
      }
    }

    handleCallback();

    return () => {
      isCancelled = true;
    };
  }, [nav, refreshProfile]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-pink-50/70 via-background to-background dark:from-pink-950/20">
      <div className="glass rounded-3xl p-8 max-w-sm w-full text-center space-y-5 border border-primary/20 shadow-2xl animate-page-enter">
        <div className="w-20 h-20 mx-auto rounded-full gradient-neon p-0.5 neon-glow flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
            <img src={logoImg} alt="PinkCare" className="w-14 h-14 object-contain" />
          </div>
        </div>

        <div className="space-y-2">
          {status === "processing" && (
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <h2 className="text-base font-bold text-foreground">المصادقة جارية</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">{message}</p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center gap-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 animate-in zoom-in" />
              <h2 className="text-base font-bold text-emerald-600">تم تسجيل الدخول بنجاح!</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">{message}</p>
              <p className="text-[11px] text-primary font-medium mt-1">
                جارٍ التحويل إلى التطبيق...
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center gap-3">
              <AlertCircle className="w-10 h-10 text-destructive animate-in zoom-in" />
              <h2 className="text-base font-bold text-destructive">فشلت المصادقة</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">{message}</p>
              <button
                onClick={() => nav({ to: "/auth" })}
                className="mt-3 gradient-neon text-primary-foreground rounded-full px-6 py-2.5 text-xs font-bold neon-glow transition"
              >
                العودة إلى صفحة الدخول
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
