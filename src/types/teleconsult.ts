export type SpecialtyCategory =
  "oncology" | "psychology" | "physiotherapy" | "nutrition" | "nursing";

export type VerificationStatus = "verified" | "pending" | "rejected";

export type ConsultationSlot = {
  id: string;
  time: string; // e.g. "09:30"
  period: "morning" | "afternoon" | "evening";
  isBooked?: boolean;
};

export type DoctorProfile = {
  id: string;
  name: string;
  title: string;
  specialty: SpecialtyCategory;
  licenseNumber: string;
  hospital: string;
  experienceYears: number;
  bio: string;
  bioAr: string;
  languages: string[];
  consultationFee: string;
  isFree: boolean;
  rating: number;
  reviewsCount: number;
  avatar: string;
  verificationStatus: VerificationStatus;
  verificationDate?: string;
  verifiedBy?: string;
  licenseDocumentName?: string;
  medicalCouncil?: string;
  availableDays: string[];
  slots: ConsultationSlot[];
};

export type ConsultationType = "video" | "audio" | "messaging";

export type AppointmentStatus = "confirmed" | "in_progress" | "completed" | "cancelled";

export type ConsultationBooking = {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorTitle: string;
  doctorSpecialty: SpecialtyCategory;
  doctorAvatar: string;
  patientId: string;
  patientName: string;
  consultationType: ConsultationType;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: AppointmentStatus;
  reason: string;
  notes?: string;
  roomId: string;
  createdAt: string;
  clinicalSummary?: string;
  recommendations?: string;
  completedAt?: string;
};

export type InCallChatMessage = {
  id: string;
  sender: "patient" | "doctor" | "system";
  senderName: string;
  text: string;
  timestamp: string;
};
