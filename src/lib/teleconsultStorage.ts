import type {
  DoctorProfile,
  SpecialtyCategory,
  ConsultationBooking,
  InCallChatMessage,
  AppointmentStatus,
  ConsultationType,
} from "@/types/teleconsult";

const DOCTORS_KEY = "pc_teleconsult_doctors_v1";
const BOOKINGS_KEY = "pc_teleconsult_bookings_v1";
const CALL_MESSAGES_KEY_PREFIX = "pc_call_chat_";

const INITIAL_DOCTORS: DoctorProfile[] = [
  {
    id: "doc-1",
    name: "د. سارة بلقاسم",
    title: "استشارية جراحة وأورام الثدي",
    specialty: "oncology",
    licenseNumber: "DZ-MED-74829-ONC",
    hospital: "مركز مكافحة السرطان بيار وماري كوري (CPMC)",
    experienceYears: 14,
    bio: "أخصائية في جراحة أورام الثدي التجميلية والعلاج الموجه، عضو الجمعية الجزائرية لطب الأورام. متخصصة في متابعة بروتوكولات العلاج والرأي الطبي الثاني.",
    bioAr:
      "أخصائية في جراحة أورام الثدي التجميلية والعلاج الموجه، عضو الجمعية الجزائرية لطب الأورام. متخصصة في متابعة بروتوكولات العلاج والرأي الطبي الثاني.",
    languages: ["العربية", "Français", "English"],
    consultationFee: "مغطى بالكامل (دعم PinkCare)",
    isFree: true,
    rating: 4.9,
    reviewsCount: 138,
    avatar:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
    verificationStatus: "verified",
    verificationDate: "2025-01-10",
    verifiedBy: "اللجنة الطبية العليا - PinkCare",
    licenseDocumentName: "order_medecins_license_dz74829.pdf",
    medicalCouncil: "المجلس الوطني لأخلاقيات مهنة الطب",
    availableDays: ["الأحد", "الثلاثاء", "الخميس"],
    slots: [
      { id: "s-1", time: "09:30", period: "morning" },
      { id: "s-2", time: "11:00", period: "morning" },
      { id: "s-3", time: "14:30", period: "afternoon" },
      { id: "s-4", time: "16:00", period: "afternoon" },
    ],
  },
  {
    id: "doc-2",
    name: "د. إيناس بن شريف",
    title: "أخصائية علم النفس العيادي والدعم النفسي للأورام",
    specialty: "psychology",
    licenseNumber: "DZ-PSY-49201-CLIN",
    hospital: "عيادة السلامة النفسية والاستشارات العائلية",
    experienceYears: 11,
    bio: "دكتوراه في علم النفس الإكلينيكي المتخصص في دعم مريضات السرطان ومراحل التعافي. معالجة معتمدة في تقنيات الاسترخاء والتكيف الإيجابي والتخفيف من القلق.",
    bioAr:
      "دكتوراه في علم النفس الإكلينيكي المتخصص في دعم مريضات السرطان ومراحل التعافي. معالجة معتمدة في تقنيات الاسترخاء والتكيف الإيجابي والتخفيف من القلق.",
    languages: ["العربية", "Français"],
    consultationFee: "مجاني للمستفيدات",
    isFree: true,
    rating: 5.0,
    reviewsCount: 96,
    avatar:
      "https://images.unsplash.com/photo-1594824813572-c5136894d8cb?auto=format&fit=crop&w=400&q=80",
    verificationStatus: "verified",
    verificationDate: "2025-01-15",
    verifiedBy: "اللجنة الطبية العليا - PinkCare",
    licenseDocumentName: "psy_credentials_council_dz.pdf",
    medicalCouncil: "الرابطة الجزائرية للأخصائيين النفسانيين العياديين",
    availableDays: ["الإثنين", "الأربعاء", "السبت"],
    slots: [
      { id: "s-5", time: "10:00", period: "morning" },
      { id: "s-6", time: "11:30", period: "morning" },
      { id: "s-7", time: "15:00", period: "afternoon" },
      { id: "s-8", time: "17:00", period: "evening" },
    ],
  },
  {
    id: "doc-3",
    name: "أ. كريمة بوزيد",
    title: "أخصائية العلاج الطبيعي والتأهيل الحركي والوذمة اللمفية",
    specialty: "physiotherapy",
    licenseNumber: "DZ-PHY-88310-REHAB",
    hospital: "مركز التأهيل الطبي ووحدة تصريف الجهاز اللمفاوي",
    experienceYears: 9,
    bio: "أخصائية علاج فيزيائي حاصلة على شهادة دولية في التصريف اللمفاوي اليدوي والتأهيل الحركي لما بعد استئصال أورام الثدي. تركز على استعادة المدى الحركي بأمان.",
    bioAr:
      "أخصائية علاج فيزيائي حاصلة على شهادة دولية في التصريف اللمفاوي اليدوي والتأهيل الحركي لما بعد استئصال أورام الثدي. تركز على استعادة المدى الحركي بأمان.",
    languages: ["العربية", "Français"],
    consultationFee: "جلسة توجيه مجانية",
    isFree: true,
    rating: 4.8,
    reviewsCount: 82,
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    verificationStatus: "verified",
    verificationDate: "2025-02-01",
    verifiedBy: "اللجنة الطبية العليا - PinkCare",
    licenseDocumentName: "physio_kine_accreditation.pdf",
    medicalCouncil: "نقابة أخصائيي العلاج الطبيعي الفيزيائي",
    availableDays: ["الأحد", "الإثنين", "الأربعاء"],
    slots: [
      { id: "s-9", time: "09:00", period: "morning" },
      { id: "s-10", time: "10:30", period: "morning" },
      { id: "s-11", time: "14:00", period: "afternoon" },
    ],
  },
  {
    id: "doc-4",
    name: "د. هدى مراد",
    title: "أخصائية التغذية العلاجية والأيضية للأورام",
    specialty: "nutrition",
    licenseNumber: "DZ-NUT-31049-CLIN",
    hospital: "معهد التغذية الطبية والوقاية الصحية",
    experienceYears: 8,
    bio: "استشارية تغذية متخصصة في خطط التغذية أثناء العلاج الكيماوي والإشعاعي، والوقاية من مضاعفات الجهاز الهضمي، وبناء مناعة قوية وصحية.",
    bioAr:
      "استشارية تغذية متخصصة في خطط التغذية أثناء العلاج الكيماوي والإشعاعي، والوقاية من مضاعفات الجهاز الهضمي، وبناء مناعة قوية وصحية.",
    languages: ["العربية", "Français", "English"],
    consultationFee: "مجاني مدعوم",
    isFree: true,
    rating: 4.9,
    reviewsCount: 64,
    avatar:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=400&q=80",
    verificationStatus: "verified",
    verificationDate: "2025-02-12",
    verifiedBy: "اللجنة الطبية العليا - PinkCare",
    licenseDocumentName: "nutri_board_oncology.pdf",
    medicalCouncil: "الجمعية الوطنية للتغذية السريرية",
    availableDays: ["الثلاثاء", "الخميس", "السبت"],
    slots: [
      { id: "s-12", time: "11:00", period: "morning" },
      { id: "s-13", time: "15:30", period: "afternoon" },
      { id: "s-14", time: "18:00", period: "evening" },
    ],
  },
  {
    id: "doc-5",
    name: "الممرضة مريم قاسي",
    title: "ممرضة رئيسية متخصصة في رعاية مرضى الأورام والقسطرات",
    specialty: "nursing",
    licenseNumber: "DZ-NUR-92014-ONC",
    hospital: "قسم الأورام والاستشفاء النهاري",
    experienceYears: 12,
    bio: "خبرة واسعة في متابعة القسطرات الوريدية (Port-a-Cath / PICC)، التثقيف التمريضي حول العناية بالبشرة، والتعامل مع الغثيان والتعب المصاحب للبروتوكولات العلاجية.",
    bioAr:
      "خبرة واسعة في متابعة القسطرات الوريدية (Port-a-Cath / PICC)، التثقيف التمريضي حول العناية بالبشرة، والتعامل مع الغثيان والتعب المصاحب للبروتوكولات العلاجية.",
    languages: ["العربية", "Français"],
    consultationFee: "مجاني بالكامل",
    isFree: true,
    rating: 4.9,
    reviewsCount: 110,
    avatar:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=400&q=80",
    verificationStatus: "verified",
    verificationDate: "2025-02-18",
    verifiedBy: "اللجنة الطبية العليا - PinkCare",
    licenseDocumentName: "nursing_board_dz.pdf",
    medicalCouncil: "النقابة الوطنية للأسلاك شبه الطبية",
    availableDays: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء"],
    slots: [
      { id: "s-15", time: "09:00", period: "morning" },
      { id: "s-16", time: "10:30", period: "morning" },
      { id: "s-17", time: "14:00", period: "afternoon" },
      { id: "s-18", time: "16:30", period: "afternoon" },
    ],
  },
  // PENDING VERIFICATION DOCTOR (Submitted by applicant, awaiting admin review)
  {
    id: "doc-pending-1",
    name: "د. طارق عمروش",
    title: "أخصائي جراحة الأورام والأنسجة الرخوة",
    specialty: "oncology",
    licenseNumber: "DZ-MED-10842-PENDING",
    hospital: "المركز الاستشفائي الجامعي مصطفى باشا",
    experienceYears: 7,
    bio: "طبيب جراح متخصص في أورام الغدد والأنسجة السطحية، تقدم بطلب انضمام لفريق استشارات PinkCare للمتطوعين.",
    bioAr:
      "طبيب جراح متخصص في أورام الغدد والأنسجة السطحية، تقدم بطلب انضمام لفريق استشارات PinkCare للمتطوعين.",
    languages: ["العربية", "Français"],
    consultationFee: "مجاني تطوعي",
    isFree: true,
    rating: 0,
    reviewsCount: 0,
    avatar:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
    verificationStatus: "pending",
    licenseDocumentName: "diploma_and_council_submission_amrouche.pdf",
    medicalCouncil: "مجلس عمادة الأطباء - ناحية الوسط",
    availableDays: ["الأحد", "الأربعاء"],
    slots: [
      { id: "s-p1", time: "16:00", period: "afternoon" },
      { id: "s-p2", time: "17:30", period: "evening" },
    ],
  },
];

const INITIAL_BOOKINGS: ConsultationBooking[] = [
  {
    id: "book-sample-1",
    doctorId: "doc-1",
    doctorName: "د. سارة بلقاسم",
    doctorTitle: "استشارية جراحة وأورام الثدي",
    doctorSpecialty: "oncology",
    doctorAvatar:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
    patientId: "patient-current",
    patientName: "المستفيدة الكريمة",
    consultationType: "video",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    time: "11:00",
    status: "confirmed",
    reason: "متابعة نتائج التحاليل الروتينية ومناقشة أعراض الإرهاق",
    notes: "أجريت فحص تعداد الدم الكامل وأرغب في مراجعة النتائج مع الطبيبة.",
    roomId: "pinkcare-room-doc1-sample",
    createdAt: new Date().toISOString(),
  },
];

// Get doctors
export function getDoctors(options?: {
  specialty?: SpecialtyCategory;
  verifiedOnly?: boolean;
}): DoctorProfile[] {
  if (typeof window === "undefined") return INITIAL_DOCTORS;
  const raw = localStorage.getItem(DOCTORS_KEY);
  let doctors: DoctorProfile[] = INITIAL_DOCTORS;
  if (!raw) {
    localStorage.setItem(DOCTORS_KEY, JSON.stringify(INITIAL_DOCTORS));
  } else {
    try {
      doctors = JSON.parse(raw);
    } catch {
      doctors = INITIAL_DOCTORS;
    }
  }

  if (options?.specialty) {
    doctors = doctors.filter((d) => d.specialty === options.specialty);
  }
  if (options?.verifiedOnly) {
    doctors = doctors.filter((d) => d.verificationStatus === "verified");
  }

  return doctors;
}

export function saveDoctors(doctors: DoctorProfile[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(DOCTORS_KEY, JSON.stringify(doctors));
  window.dispatchEvent(new CustomEvent("pinkcare:doctors-updated"));
}

export function getDoctorById(id: string): DoctorProfile | undefined {
  const doctors = getDoctors();
  return doctors.find((d) => d.id === id);
}

// Doctor Self-Registration / Application
export function registerDoctorApplication(data: {
  name: string;
  title: string;
  specialty: SpecialtyCategory;
  licenseNumber: string;
  hospital: string;
  experienceYears: number;
  bio: string;
  languages: string[];
  medicalCouncil: string;
  documentName?: string;
  avatar?: string;
}): DoctorProfile {
  const doctors = getDoctors();
  const newDoctor: DoctorProfile = {
    id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: data.name.trim(),
    title: data.title.trim(),
    specialty: data.specialty,
    licenseNumber: data.licenseNumber.trim(),
    hospital: data.hospital.trim(),
    experienceYears: data.experienceYears,
    bio: data.bio.trim(),
    bioAr: data.bio.trim(),
    languages: data.languages.length > 0 ? data.languages : ["العربية"],
    consultationFee: "مجاني مدعوم",
    isFree: true,
    rating: 5.0,
    reviewsCount: 0,
    avatar:
      data.avatar ||
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80",
    verificationStatus: "pending", // CRITICAL: starts strictly as pending
    licenseDocumentName: data.documentName || "medical_license_document.pdf",
    medicalCouncil: data.medicalCouncil.trim(),
    availableDays: ["الأحد", "الثلاثاء", "الخميس"],
    slots: [
      { id: "s-new-1", time: "10:00", period: "morning" },
      { id: "s-new-2", time: "14:00", period: "afternoon" },
      { id: "s-new-3", time: "16:00", period: "afternoon" },
    ],
  };

  const next = [newDoctor, ...doctors];
  saveDoctors(next);
  return newDoctor;
}

// Verification Actions (by Admin)
export function approveDoctorVerification(doctorId: string, adminName: string): boolean {
  const doctors = getDoctors();
  const doc = doctors.find((d) => d.id === doctorId);
  if (!doc) return false;

  doc.verificationStatus = "verified";
  doc.verificationDate = new Date().toISOString().split("T")[0];
  doc.verifiedBy = adminName || "إدارة الاعتماد الطبي - PinkCare";

  saveDoctors(doctors);
  return true;
}

export function rejectDoctorVerification(doctorId: string, reason?: string): boolean {
  const doctors = getDoctors();
  const doc = doctors.find((d) => d.id === doctorId);
  if (!doc) return false;

  doc.verificationStatus = "rejected";
  doc.bio = doc.bio + (reason ? ` [ملاحظة رفض الاعتماد: ${reason}]` : "");

  saveDoctors(doctors);
  return true;
}

// Bookings
export function getBookings(patientId?: string): ConsultationBooking[] {
  if (typeof window === "undefined") return INITIAL_BOOKINGS;
  const raw = localStorage.getItem(BOOKINGS_KEY);
  let list: ConsultationBooking[] = INITIAL_BOOKINGS;
  if (!raw) {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(INITIAL_BOOKINGS));
  } else {
    try {
      list = JSON.parse(raw);
    } catch {
      list = INITIAL_BOOKINGS;
    }
  }

  if (patientId) {
    list = list.filter((b) => b.patientId === patientId || b.patientId === "patient-current");
  }
  return list;
}

export function saveBookings(bookings: ConsultationBooking[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  window.dispatchEvent(new CustomEvent("pinkcare:bookings-updated"));
}

export function bookConsultation(data: {
  doctorId: string;
  patientId: string;
  patientName: string;
  consultationType: ConsultationType;
  date: string;
  time: string;
  reason: string;
  notes?: string;
}): ConsultationBooking {
  const doc = getDoctorById(data.doctorId);
  if (!doc) {
    throw new Error("Doctor not found");
  }
  if (doc.verificationStatus !== "verified") {
    throw new Error("Cannot book consultation with an unverified doctor.");
  }

  const bookings = getBookings();
  const newBooking: ConsultationBooking = {
    id: `book-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    doctorId: doc.id,
    doctorName: doc.name,
    doctorTitle: doc.title,
    doctorSpecialty: doc.specialty,
    doctorAvatar: doc.avatar,
    patientId: data.patientId,
    patientName: data.patientName,
    consultationType: data.consultationType,
    date: data.date,
    time: data.time,
    status: "confirmed",
    reason: data.reason.trim(),
    notes: data.notes?.trim(),
    roomId: `pc-room-${doc.id.slice(-4)}-${Date.now().toString().slice(-5)}`,
    createdAt: new Date().toISOString(),
  };

  const next = [newBooking, ...bookings];
  saveBookings(next);
  return newBooking;
}

export function updateBookingStatus(
  bookingId: string,
  status: AppointmentStatus,
  summaryData?: { clinicalSummary?: string; recommendations?: string },
): ConsultationBooking | null {
  const bookings = getBookings();
  const booking = bookings.find((b) => b.id === bookingId);
  if (!booking) return null;

  booking.status = status;
  if (status === "completed") {
    booking.completedAt = new Date().toISOString();
  }
  if (summaryData?.clinicalSummary) {
    booking.clinicalSummary = summaryData.clinicalSummary;
  }
  if (summaryData?.recommendations) {
    booking.recommendations = summaryData.recommendations;
  }

  saveBookings(bookings);
  return booking;
}

// In-Call Real-Time Chat Storage
export function getInCallMessages(roomId: string): InCallChatMessage[] {
  if (typeof window === "undefined") return [];
  const key = `${CALL_MESSAGES_KEY_PREFIX}${roomId}`;
  const raw = localStorage.getItem(key);
  if (!raw) {
    const initial: InCallChatMessage[] = [
      {
        id: "msg-sys-1",
        sender: "system",
        senderName: "PinkCare Telemed",
        text: "تم تفعيل القناة المشفرة للاتصال الآمن. مرحباً بكِ في غرفة الاستشارة الطبية.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ];
    return initial;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function sendInCallMessage(
  roomId: string,
  message: Omit<InCallChatMessage, "id">,
): InCallChatMessage {
  const key = `${CALL_MESSAGES_KEY_PREFIX}${roomId}`;
  const messages = getInCallMessages(roomId);
  const newMsg: InCallChatMessage = {
    ...message,
    id: `cmsg-${Date.now()}`,
  };
  const next = [...messages, newMsg];
  localStorage.setItem(key, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(`pinkcare:call-message-${roomId}`, { detail: newMsg }));
  return newMsg;
}
