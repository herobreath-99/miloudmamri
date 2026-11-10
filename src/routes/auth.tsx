import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Mail,
  Lock,
  User as UserIcon,
  Calendar,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Database,
  ArrowRight,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { useI18n, getLocalizedText, type Lang } from "@/lib/i18n";
import {
  getActiveSupabaseUrl,
  getActiveSupabaseAnonKey,
  isSupabaseConfigured,
  setCustomSupabaseCredentials,
} from "@/integrations/supabase/client";
import logoImg from "@/assets/pinkcare-logo.png";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

type AuthMode = "signin" | "signup" | "forgot";

export function AuthPage() {
  const { lang, setLang } = useI18n();
  const nav = useNavigate();
  const {
    user,
    session,
    isConfigured,
    connectionStatus,
    signInWithPassword,
    signUp,
    signInWithGoogle,
    resetPasswordForEmail,
    testConnection,
  } = useAuth();

  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  // Supabase Connection Configuration Drawer/Modal
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [customKeyInput, setCustomKeyInput] = useState(() => getActiveSupabaseAnonKey());
  const [customUrlInput, setCustomUrlInput] = useState(() => getActiveSupabaseUrl());
  const [testingSupabase, setTestingSupabase] = useState(false);

  // If already authenticated, redirect to /home
  useEffect(() => {
    if (user || session) {
      nav({ to: "/home" });
    }
  }, [user, session, nav]);

  // Listen for OAuth success messages from popup
  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      if (event.data?.type === "OAUTH_AUTH_SUCCESS") {
        toast.success(
          lang === "fr" ? "Connexion Google réussie ! 🌸" : "تم تسجيل الدخول بنجاح عبر Google 🌸",
        );
        nav({ to: "/home" });
      } else if (event.data?.type === "OAUTH_AUTH_ERROR") {
        toast.error(
          lang === "fr"
            ? `Erreur Google: ${event.data.description || event.data.error}`
            : `خطأ في مصادقة Google: ${event.data.description || event.data.error}`,
        );
      }
    };

    window.addEventListener("message", handleOAuthMessage);
    return () => window.removeEventListener("message", handleOAuthMessage);
  }, [lang, nav]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!email.trim() || !password) {
      toast.error(
        getLocalizedText(lang, {
          ar: "يرجى إدخال البريد الإلكتروني وكلمة المرور",
          dz: "كتبي الإيميل وكلمة السر تعيشي",
          fr: "Veuillez remplir tous les champs",
          en: "Please enter your email and password",
        }),
      );
      return;
    }

    setLoading(true);
    try {
      const { error, user: authUser } = await signInWithPassword(email.trim(), password);
      if (error) {
        const msg = formatAuthError(error.message, lang);
        setStatusMessage({ type: "error", text: msg });
        toast.error(msg);
      } else if (authUser) {
        toast.success(
          getLocalizedText(lang, {
            ar: "مرحباً بكِ في PinkCare 🌸",
            dz: "مرحبا بيك في PinkCare 🌸",
            fr: "Bienvenue sur PinkCare 🌸",
            en: "Welcome to PinkCare 🌸",
          }),
        );
        nav({ to: "/home" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!email.trim() || !password || !firstName.trim() || !lastName.trim()) {
      toast.error(
        getLocalizedText(lang, {
          ar: "يرجى ملء جميع الحقول المطلوبة",
          dz: "عمّري قاع المعلومات المطلوبة تعيشي",
          fr: "Veuillez remplir tous les champs obligatoires",
          en: "Please fill in all required fields",
        }),
      );
      return;
    }

    if (password.length < 6) {
      const err = getLocalizedText(lang, {
        ar: "كلمة المرور يجب أن لا تقل عن 6 أحرف",
        dz: "كلمة السر لازم تكون فيها 6 حروف أو أرقام على الأقل",
        fr: "Le mot de passe doit comporter au moins 6 caractères",
        en: "Password must be at least 6 characters",
      });
      setStatusMessage({ type: "error", text: err });
      toast.error(err);
      return;
    }

    if (password !== confirmPassword) {
      const err = getLocalizedText(lang, {
        ar: "كلمتا المرور غير متطابقتين",
        dz: "كلمات السر ماشي كيف كيف، تأكدي منهم",
        fr: "Les mots de passe ne correspondent pas",
        en: "Passwords do not match",
      });
      setStatusMessage({ type: "error", text: err });
      toast.error(err);
      return;
    }

    setLoading(true);
    try {
      const { error, emailConfirmationRequired } = await signUp(email.trim(), password, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        age: age ? Number(age) : null,
      });

      if (error) {
        const msg = formatAuthError(error.message, lang);
        setStatusMessage({ type: "error", text: msg });
        toast.error(msg);
      } else if (emailConfirmationRequired) {
        const successNotice = getLocalizedText(lang, {
          ar: "تم إنشاء الحساب بنجاح! يرجى التحقق من صندوق بريدك الإلكتروني لتأكيد التسجيل وتفعيل الحساب.",
          dz: "الحساب تسجل خلاص! شوفي بريدك الإلكتروني باش تأكدي التسجيل تاعك.",
          fr: "Compte créé ! Veuillez vérifier votre boîte de réception pour confirmer votre adresse email.",
          en: "Account created! Please check your email to confirm registration.",
        });
        setStatusMessage({ type: "success", text: successNotice });
        toast.success(successNotice);
      } else {
        toast.success(
          getLocalizedText(lang, {
            ar: "تم إنشاء الحساب وتسجيل الدخول بنجاح! 🌸",
            dz: "تسجل حسابك بنجاح ومرحبا بيك! 🌸",
            fr: "Compte créé avec succès ! 🌸",
            en: "Account created successfully! 🌸",
          }),
        );
        nav({ to: "/home" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!email.trim()) {
      toast.error(
        getLocalizedText(lang, {
          ar: "يرجى كتابة البريد الإلكتروني",
          dz: "كتبي الإيميل تاعك تعيشي",
          fr: "Veuillez saisir votre email",
          en: "Please enter your email",
        }),
      );
      return;
    }

    setLoading(true);
    try {
      const { error } = await resetPasswordForEmail(email.trim());
      if (error) {
        const msg = formatAuthError(error.message, lang);
        setStatusMessage({ type: "error", text: msg });
        toast.error(msg);
      } else {
        const notice = getLocalizedText(lang, {
          ar: "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.",
          dz: "بعثنا رابط تبديل كلمة السر للإيميل تاعك.",
          fr: "Un lien de réinitialisation a été envoyé à votre adresse email.",
          en: "A password reset link has been sent to your email.",
        });
        setStatusMessage({ type: "success", text: notice });
        toast.success(notice);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setStatusMessage(null);
    setGoogleLoading(true);
    try {
      const { error, popup } = await signInWithGoogle();
      if (error) {
        const msg = formatAuthError(error.message, lang);
        setStatusMessage({ type: "error", text: msg });
        toast.error(msg);
      } else if (popup) {
        toast.info(
          getLocalizedText(lang, {
            ar: "تم فتح نافذة تسجيل الدخول بحساب Google...",
            dz: "تفتحت نافذة الدخول بحساب Google...",
            fr: "Fenêtre Google ouverte. Veuillez vous connecter...",
            en: "Google login window opened. Please sign in...",
          }),
        );
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSaveCredentials = async () => {
    setTestingSupabase(true);
    try {
      setCustomSupabaseCredentials(customUrlInput, customKeyInput);
      const res = await testConnection();
      if (res.ok) {
        toast.success(
          lang === "fr" ? "Supabase connecté avec succès !" : "تم الاتصال بـ Supabase بنجاح!",
        );
        setShowConfigModal(false);
      } else {
        toast.error(res.message);
      }
    } finally {
      setTestingSupabase(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-8 max-w-md mx-auto">
      {/* Top Language Bar */}
      <div className="w-full flex items-center justify-between mb-4">
        {/* Supabase Connection Status Pill */}
        <button
          onClick={() => setShowConfigModal(true)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold glass transition hover:scale-105 ${
            isConfigured
              ? "text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
              : "text-amber-700 dark:text-amber-300 border-amber-500/30"
          }`}
          title="معلومات اتصال Supabase"
        >
          <Database className="w-3.5 h-3.5" />
          <span>{isConfigured ? "Supabase متصل ✓" : "Supabase: إعداد المفاتيح"}</span>
        </button>

        {/* Language selector */}
        <div className="flex items-center gap-1 glass rounded-full p-1 text-[11px] font-bold">
          {(["ar", "dz", "fr"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-2 py-0.5 rounded-full transition ${
                lang === l
                  ? "gradient-neon text-primary-foreground font-bold"
                  : "text-muted-foreground"
              }`}
            >
              {l === "ar" ? "العربية" : l === "dz" ? "الدارجة" : "Français"}
            </button>
          ))}
        </div>
      </div>

      {/* Brand Header */}
      <div className="flex flex-col items-center gap-3 mb-6 animate-fade-up text-center">
        <div className="relative w-24 h-24">
          <div
            className="absolute inset-0 rounded-full blur-2xl opacity-75 animate-pulse-glow"
            style={{
              background: "radial-gradient(circle, oklch(0.75 0.22 340 / 0.7), transparent 75%)",
            }}
          />
          <div className="relative w-full h-full rounded-full glass flex items-center justify-center overflow-hidden border border-white/50 shadow-xl">
            <img src={logoImg} alt="PinkCare" className="w-[85%] h-[85%] object-contain" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 via-fuchsia-600 to-rose-500 bg-clip-text text-transparent">
            PinkCare
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {getLocalizedText(lang, {
              ar: "مساحتكِ الداعمة للعناية والتعافي 💗",
              dz: "فضاء العناية تاعك باش تكوني بخير وعافية 💗",
              fr: "Votre espace bienveillant de soins et de soutien 💗",
              en: "Your caring sanctuary for wellness & recovery 💗",
            })}
          </p>
        </div>
      </div>

      {/* Main Glass Card */}
      <div className="glass rounded-3xl p-6 w-full space-y-5 animate-fade-up shadow-2xl border border-primary/20">
        {/* Mode Selector Tabs */}
        <div className="glass rounded-full p-1 grid grid-cols-2 gap-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setStatusMessage(null);
            }}
            className={`py-2 rounded-full transition-all cursor-pointer ${
              mode === "signin"
                ? "gradient-neon text-primary-foreground neon-glow shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {getLocalizedText(lang, {
              ar: "تسجيل الدخول",
              dz: "دخلي لحسابك",
              fr: "Connexion",
              en: "Sign in",
            })}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setStatusMessage(null);
            }}
            className={`py-2 rounded-full transition-all cursor-pointer ${
              mode === "signup"
                ? "gradient-neon text-primary-foreground neon-glow shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {getLocalizedText(lang, {
              ar: "حساب جديد",
              dz: "فتحي حساب جديد",
              fr: "Nouveau compte",
              en: "Sign up",
            })}
          </button>
        </div>

        {/* Status Alerts */}
        {statusMessage && (
          <div
            className={`p-3 rounded-2xl text-xs flex items-start gap-2 animate-in fade-in ${
              statusMessage.type === "success"
                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                : statusMessage.type === "error"
                  ? "bg-destructive/15 text-destructive border border-destructive/30"
                  : "bg-primary/10 text-primary border border-primary/20"
            }`}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            ) : statusMessage.type === "error" ? (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-destructive" />
            ) : (
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
            )}
            <p className="leading-relaxed">{statusMessage.text}</p>
          </div>
        )}

        {/* Google OAuth Button (Prominent) */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="w-full bg-white dark:bg-card hover:bg-neutral-50 dark:hover:bg-neutral-900 border border-border/80 text-foreground rounded-2xl py-3 px-4 text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-3 disabled:opacity-60 cursor-pointer"
          >
            {googleLoading ? (
              <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>
              {getLocalizedText(lang, {
                ar: "المتابعة باستخدام Google",
                dz: "دخلي بحساب Google",
                fr: "Continuer avec Google",
                en: "Continue with Google",
              })}
            </span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-border w-full" />
            <span className="bg-background/80 px-2 text-[11px] text-muted-foreground absolute uppercase tracking-wider">
              {getLocalizedText(lang, {
                ar: "أو عبر البريد",
                dz: "ولا بالإيميل تاعك",
                fr: "ou par email",
                en: "or with email",
              })}
            </span>
          </div>
        </div>

        {/* MODE 1: SIGN IN */}
        {mode === "signin" && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 glass rounded-2xl px-3 py-2.5 border border-primary/20">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <input
                  type="email"
                  required
                  placeholder={getLocalizedText(lang, {
                    ar: "البريد الإلكتروني",
                    dz: "البريد الإلكتروني (الإيميل)",
                    fr: "Adresse email",
                    en: "Email address",
                  })}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent outline-none text-xs text-foreground placeholder:text-muted-foreground"
                  dir="ltr"
                />
              </div>

              <div className="flex items-center gap-3 glass rounded-2xl px-3 py-2.5 border border-primary/20">
                <Lock className="w-4 h-4 text-primary shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder={getLocalizedText(lang, {
                    ar: "كلمة المرور",
                    dz: "كلمة السر",
                    fr: "Mot de passe",
                    en: "Password",
                  })}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent outline-none text-xs text-foreground placeholder:text-muted-foreground"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => {
                  setMode("forgot");
                  setStatusMessage(null);
                }}
                className="text-[11px] text-primary hover:underline font-medium cursor-pointer"
              >
                {getLocalizedText(lang, {
                  ar: "نسيتِ كلمة المرور؟",
                  dz: "نسيتي كلمة السر؟",
                  fr: "Mot de passe oublié ?",
                  en: "Forgot password?",
                })}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="gradient-neon text-primary-foreground w-full rounded-2xl py-3 font-bold text-xs neon-glow shadow-sm flex items-center justify-center gap-2 hover:scale-[1.01] transition disabled:opacity-60 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {loading
                  ? "..."
                  : getLocalizedText(lang, {
                      ar: "تسجيل الدخول",
                      dz: "دخلي للتطبيق",
                      fr: "Se connecter",
                      en: "Sign In",
                    })}
              </span>
            </button>
          </form>
        )}

        {/* MODE 2: SIGN UP */}
        {mode === "signup" && (
          <form onSubmit={handleSignUp} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 glass rounded-2xl px-3 py-2.5 border border-primary/20">
                <UserIcon className="w-4 h-4 text-primary shrink-0" />
                <input
                  type="text"
                  required
                  placeholder={getLocalizedText(lang, {
                    ar: "الاسم",
                    dz: "اسمك",
                    fr: "Prénom",
                    en: "First name",
                  })}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-transparent outline-none text-xs text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="flex items-center gap-2 glass rounded-2xl px-3 py-2.5 border border-primary/20">
                <UserIcon className="w-4 h-4 text-primary shrink-0" />
                <input
                  type="text"
                  required
                  placeholder={getLocalizedText(lang, {
                    ar: "اللقب",
                    dz: "اللقب تاعك",
                    fr: "Nom",
                    en: "Last name",
                  })}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-transparent outline-none text-xs text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 glass rounded-2xl px-3 py-2.5 border border-primary/20">
              <Calendar className="w-4 h-4 text-primary shrink-0" />
              <input
                type="number"
                min={1}
                max={120}
                placeholder={getLocalizedText(lang, {
                  ar: "العمر (اختياري)",
                  dz: "شحال في عمرك بالسنين (اختياري)",
                  fr: "Âge (optionnel)",
                  en: "Age (optional)",
                })}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full bg-transparent outline-none text-xs text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex items-center gap-3 glass rounded-2xl px-3 py-2.5 border border-primary/20">
              <Mail className="w-4 h-4 text-primary shrink-0" />
              <input
                type="email"
                required
                placeholder={getLocalizedText(lang, {
                  ar: "البريد الإلكتروني",
                  dz: "البريد الإلكتروني",
                  fr: "Adresse email",
                  en: "Email address",
                })}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent outline-none text-xs text-foreground placeholder:text-muted-foreground"
                dir="ltr"
              />
            </div>

            <div className="flex items-center gap-3 glass rounded-2xl px-3 py-2.5 border border-primary/20">
              <Lock className="w-4 h-4 text-primary shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                placeholder={getLocalizedText(lang, {
                  ar: "كلمة المرور (6 أحرف على الأقل)",
                  dz: "كلمة السر (6 حروف أو أرقام على الأقل)",
                  fr: "Mot de passe (min 6 car.)",
                  en: "Password (min 6 chars)",
                })}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent outline-none text-xs text-foreground placeholder:text-muted-foreground"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-3 glass rounded-2xl px-3 py-2.5 border border-primary/20">
              <KeyRound className="w-4 h-4 text-primary shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                placeholder={getLocalizedText(lang, {
                  ar: "تأكيد كلمة المرور",
                  dz: "عاودي كلمة السر",
                  fr: "Confirmer le mot de passe",
                  en: "Confirm password",
                })}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-transparent outline-none text-xs text-foreground placeholder:text-muted-foreground"
                dir="ltr"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="gradient-neon text-primary-foreground w-full rounded-2xl py-3 font-bold text-xs neon-glow shadow-sm flex items-center justify-center gap-2 hover:scale-[1.01] transition disabled:opacity-60 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {loading
                  ? "..."
                  : getLocalizedText(lang, {
                      ar: "إنشاء حسابي والبدء",
                      dz: "فتحي حساب وابداي درك",
                      fr: "Créer mon compte",
                      en: "Create Account",
                    })}
              </span>
            </button>
          </form>
        )}

        {/* MODE 3: FORGOT PASSWORD */}
        {mode === "forgot" && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-1 text-center">
              <p className="text-xs font-bold text-foreground">
                {getLocalizedText(lang, {
                  ar: "استعادة كلمة المرور",
                  dz: "بدلي كلمة السر تاعك",
                  fr: "Réinitialiser le mot de passe",
                  en: "Reset password",
                })}
              </p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {getLocalizedText(lang, {
                  ar: "أدخلي بريدكِ الإلكتروني المسجل وسنرسل لكِ رابطاً آمناً لإعادة تعيين كلمة المرور.",
                  dz: "كتبي الإيميل تاعك المسجل وراح نبعتولك رابط آمن باش تبدلي كلمة السر.",
                  fr: "Entrez votre email pour recevoir le lien de réinitialisation sécurisé.",
                  en: "Enter your email to receive a secure password reset link.",
                })}
              </p>
            </div>

            <div className="flex items-center gap-3 glass rounded-2xl px-3 py-2.5 border border-primary/20">
              <Mail className="w-4 h-4 text-primary shrink-0" />
              <input
                type="email"
                required
                placeholder={getLocalizedText(lang, {
                  ar: "بريدكِ الإلكتروني",
                  dz: "الإيميل تاعك",
                  fr: "Votre adresse email",
                  en: "Your email address",
                })}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent outline-none text-xs text-foreground placeholder:text-muted-foreground"
                dir="ltr"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="gradient-neon text-primary-foreground w-full rounded-2xl py-3 font-bold text-xs neon-glow shadow-sm flex items-center justify-center gap-2 hover:scale-[1.01] transition disabled:opacity-60 cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>
                {loading
                  ? "..."
                  : getLocalizedText(lang, {
                      ar: "إرسال رابط الاستعادة",
                      dz: "ابعتي رابط التبديل",
                      fr: "Envoyer le lien",
                      en: "Send Reset Link",
                    })}
              </span>
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setStatusMessage(null);
                }}
                className="text-xs text-muted-foreground hover:text-foreground font-medium cursor-pointer"
              >
                {getLocalizedText(lang, {
                  ar: "العودة لتسجيل الدخول",
                  dz: "رجعي لتسجيل الدخول",
                  fr: "Retour à la connexion",
                  en: "Back to sign in",
                })}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Confidentiality & Security Notice */}
      <p className="text-[11px] text-muted-foreground text-center mt-6 max-w-xs leading-relaxed">
        {getLocalizedText(lang, {
          ar: "جميع بياناتكِ الصحية والشخصية محمية ومشفرة بأعلى معايير الخصوصية الطبية. 🌸",
          dz: "كل المعلومات والصحة تاعك محفوظة ومشفرة بأعلى درجات الأمان والسرية الطبية. 🌸",
          fr: "Toutes vos données médicales et personnelles sont strictement protégées et confidentielles. 🌸",
          en: "All your medical and personal data is strictly protected and encrypted. 🌸",
        })}
      </p>

      {/* Supabase Connection Settings Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="glass rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-primary/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Database className="w-4 h-4" />
                <span>إعداد اتصال Supabase الرسمي</span>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-muted-foreground hover:text-foreground text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] text-muted-foreground mb-1">
                  عنوان مشروع Supabase (URL):
                </label>
                <input
                  type="text"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  className="w-full bg-white/70 dark:bg-black/30 rounded-xl px-3 py-2 border border-primary/20 text-xs text-foreground font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-[11px] text-muted-foreground mb-1">
                  المفتاح العام (Supabase Anon / Publishable Key):
                </label>
                <textarea
                  rows={3}
                  value={customKeyInput}
                  onChange={(e) => setCustomKeyInput(e.target.value)}
                  placeholder="eyJhbGciOi..."
                  className="w-full bg-white/70 dark:bg-black/30 rounded-xl px-3 py-2 border border-primary/20 text-[11px] text-foreground font-mono"
                  dir="ltr"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-muted/40 text-[11px] text-muted-foreground leading-relaxed">
                مشروع Supabase المعتمد للتطبيق هو:
                <br />
                <span className="font-mono text-primary font-bold">vuvmptsfrywehibxeern</span>
                <br />
                يمكنك نسخ المفتاح العام من Supabase Dashboard &gt; Project Settings &gt; API وحفظه
                هنا للاتصال الفوري.
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleSaveCredentials}
                disabled={testingSupabase}
                className="gradient-neon text-primary-foreground flex-1 rounded-xl py-2.5 text-xs font-bold neon-glow transition"
              >
                {testingSupabase ? "جارٍ التحقق..." : "حفظ واختبار الاتصال"}
              </button>
              <button
                onClick={() => setShowConfigModal(false)}
                className="glass rounded-xl px-4 py-2.5 text-xs font-bold text-muted-foreground"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function formatAuthError(msg: string, lang: Lang): string {
  const lower = msg.toLowerCase();
  if (lower.includes("invalid login credentials")) {
    return getLocalizedText(lang, {
      ar: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
      dz: "الإيميل ولا كلمة السر غالطين. تأكدي منهم.",
      fr: "Email ou mot de passe incorrect.",
      en: "Incorrect email or password.",
    });
  }
  if (lower.includes("user already registered") || lower.includes("already registered")) {
    return getLocalizedText(lang, {
      ar: "هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول بدلاً من ذلك.",
      dz: "هاد الإيميل مسجل من قبل. دخلي لحسابك مباشرة.",
      fr: "Cette adresse email est déjà enregistrée. Veuillez vous connecter.",
      en: "This email is already registered. Please sign in.",
    });
  }
  if (lower.includes("email not confirmed")) {
    return getLocalizedText(lang, {
      ar: "يرجى تأكيد بريدك الإلكتروني أولاً عبر الرابط المرسل إليكِ.",
      dz: "لازم تأكدي الإيميل تاعك أولاً من الرابط اللي بعثناه لك.",
      fr: "Email non confirmé. Veuillez vérifier votre boîte de réception.",
      en: "Email not confirmed. Please check your inbox.",
    });
  }
  if (lower.includes("password should be at least")) {
    return getLocalizedText(lang, {
      ar: "كلمة المرور يجب أن لا تقل عن 6 أحرف.",
      dz: "كلمة السر لازم تكون فيها 6 حروف أو أرقام على الأقل.",
      fr: "Le mot de passe doit comporter au moins 6 caractères.",
      en: "Password must be at least 6 characters.",
    });
  }
  if (lower.includes("network") || lower.includes("fetch")) {
    return getLocalizedText(lang, {
      ar: "تعذر الاتصال بخادم المصادقة. يرجى التحقق من اتصال الإنترنت.",
      dz: "كاين مشكل في الاتصال بالسيرفر. شوفي الإنترنت تاعك وعاودي جربي.",
      fr: "Erreur de connexion au serveur. Vérifiez votre réseau.",
      en: "Connection error. Please check your internet connection.",
    });
  }
  return msg;
}
