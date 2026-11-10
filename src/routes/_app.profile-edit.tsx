import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  User as UserIcon,
  MapPin,
  Calendar,
  NotebookPen,
  Camera,
  ChevronRight,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_app/profile-edit")({
  component: EditProfilePage,
});

function EditProfilePage() {
  const { profile, updateProfile } = useAuth();
  const { t, lang } = useI18n();
  const nav = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [journeyStart, setJourneyStart] = useState("");
  const [notes, setNotes] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    setFirstName(profile.first_name ?? "");
    setLastName(profile.last_name ?? "");
    setAge(profile.age != null ? String(profile.age) : "");
    setCity(profile.city ?? "");
    setJourneyStart(profile.journey_start ?? "");
    setNotes(profile.notes ?? "");
    setAvatar(profile.avatar_url ?? null);
  }, [profile]);

  const onPickAvatar = (file: File | null) => {
    if (!file) return;
    if (file.size > 1_500_000) {
      toast.error(
        lang === "dz"
          ? "التصويرة كبيرة بزاف (الحد 1.5 ميغا)"
          : lang === "ar"
            ? "الصورة كبيرة (الحد 1.5MB)"
            : "Image too large (max 1.5MB)",
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAvatar(typeof reader.result === "string" ? reader.result : null);
    reader.readAsDataURL(file);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      toast.error(
        lang === "dz"
          ? "الاسم واللقب لازم تكتبيهم"
          : lang === "ar"
            ? "الاسم واللقب مطلوبان"
            : "First and last name required",
      );
      return;
    }
    updateProfile({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      age: age ? Number(age) : null,
      avatar_url: avatar,
      city: city.trim() || null,
      journey_start: journeyStart || null,
      notes: notes.trim() || null,
    });
    toast.success(t("saved"));
    nav({ to: "/profile" });
  };

  return (
    <div className="space-y-4 pb-6">
      <div className="flex items-center justify-between">
        <Link to="/profile" className="text-primary">
          <ChevronRight className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-bold text-gradient">{t("edit_my_info")}</h1>
        <span className="w-5" />
      </div>

      <form onSubmit={submit} className="glass rounded-3xl p-6 space-y-4">
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="relative w-24 h-24 rounded-full overflow-hidden glass border-2 border-primary/40 flex items-center justify-center text-primary"
          >
            {avatar ? (
              <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-10 h-10" />
            )}
            <span className="absolute bottom-0 inset-x-0 bg-primary/80 text-primary-foreground text-[10px] py-0.5 flex items-center justify-center gap-1">
              <Camera className="w-3 h-3" />
              {lang === "dz" ? "بدلي" : lang === "ar" ? "تغيير" : "Change"}
            </span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => onPickAvatar(e.target.files?.[0] ?? null)}
          />
        </div>

        <Field
          icon={<UserIcon className="w-4 h-4" />}
          placeholder={t("first_name")}
          value={firstName}
          onChange={setFirstName}
          required
        />
        <Field
          icon={<UserIcon className="w-4 h-4" />}
          placeholder={t("last_name")}
          value={lastName}
          onChange={setLastName}
          required
        />
        <Field
          icon={<Calendar className="w-4 h-4" />}
          placeholder={t("age")}
          value={age}
          onChange={setAge}
          type="number"
          inputMode="numeric"
        />
        <Field
          icon={<MapPin className="w-4 h-4" />}
          placeholder={t("city")}
          value={city}
          onChange={setCity}
        />

        <div className="flex items-center gap-3 border-b border-border pb-2">
          <span className="text-primary">
            <Calendar className="w-4 h-4" />
          </span>
          <input
            type="date"
            value={journeyStart}
            onChange={(e) => setJourneyStart(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm py-2 text-foreground num-en"
            dir="ltr"
          />
        </div>

        <div className="flex items-start gap-3 border-b border-border pb-2">
          <span className="text-primary mt-2">
            <NotebookPen className="w-4 h-4" />
          </span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t("personal_notes")}
            rows={3}
            className="flex-1 bg-transparent outline-none text-sm py-2 text-foreground placeholder:text-muted-foreground resize-none"
          />
        </div>

        <button
          type="submit"
          className="btn-glow w-full rounded-full py-3 font-semibold flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          {t("save")}
        </button>
      </form>
    </div>
  );
}

function Field({
  icon,
  placeholder,
  value,
  onChange,
  type = "text",
  required,
  inputMode,
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  inputMode?: "numeric" | "text";
}) {
  return (
    <div className="flex items-center gap-3 border-b border-border pb-2">
      <span className="text-primary">{icon}</span>
      <input
        className="flex-1 bg-transparent outline-none text-sm py-2 text-foreground placeholder:text-muted-foreground"
        type={type}
        inputMode={inputMode}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </div>
  );
}
