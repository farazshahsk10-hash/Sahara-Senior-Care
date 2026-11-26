export type AppRoute =
  | '/'
  | '/about'
  | '/services'
  | '/how-it-works'
  | '/pricing'
  | '/safety'
  | '/become-caregiver'
  | '/partner'
  | '/book'
  | '/contact'
  | '/login'
  | '/portal'
  | '/caregiver'
  | '/doctor'
  | '/admin';

export interface DbCarePlan {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  monthlyPricePkr: number;
  hoursSummary: string;
  visitsSummary: string;
  exclusions: string;
  isFeatured: boolean;
  isActive: boolean;
}

export interface DbSiteContent {
  id: number;
  key: string;
  title: string;
  body: string;
}

export interface DbElderlyProfile {
  id: number;
  familyUserId: number | null;
  fullName: string;
  age: number;
  gender: string;
  city: string;
  neighbourhood: string;
  carePlanName: string;
  mobilityNotes: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

export interface DbCaregiverProfile {
  id: number;
  userId: number | null;
  fullName: string;
  phone: string;
  city: string;
  experienceYears: number;
  languages: string;
  verificationStatus: string;
  availabilityStatus: string;
  trainingNotes: string;
}

export interface DbDoctorProfile {
  id: number;
  userId: number | null;
  fullName: string;
  specialty: string;
  pmdcNumber: string;
  city: string;
  consultationFeePkr: number;
  verificationStatus: string;
  availabilityStatus: string;
}

export interface DbBooking {
  id: number;
  referenceCode: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  elderlyAgeRange: string;
  relationship: string;
  serviceRequired: string;
  preferredSchedule: string;
  additionalInfo: string;
  status: string;
  assignedCaregiverId: number | null;
  cancellationReason: string;
  createdAt: string;
}

export interface DbVisitRecord {
  id: number;
  elderlyId: number;
  caregiverId: number | null;
  scheduledDate: string;
  scheduledTime: string;
  checkInTime: string;
  checkOutTime: string;
  status: string;
  bpReading: string;
  pulseReading: string;
  tempReading: string;
  careSummary: string;
}

export interface DbAppointment {
  id: number;
  elderlyId: number;
  doctorId: number | null;
  scheduledDate: string;
  scheduledTime: string;
  reason: string;
  status: string;
  consultationNotes: string;
  followUpNotes: string;
}

export interface DbIncident {
  id: number;
  elderlyId: number;
  reportedBy: string;
  title: string;
  location: string;
  severity: string;
  escalationActions: string;
  familyNotified: boolean;
  status: string;
  createdAt: string;
}

export interface DbInvoice {
  id: number;
  invoiceNumber: string;
  familyName: string;
  elderlyId: number | null;
  description: string;
  amountPkr: number;
  securityDepositPkr: number;
  category: string;
  status: string;
  dueDate: string;
}

export interface DbCaregiverApplication {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  education: string;
  experience: string;
  certifications: string;
  availability: string;
  languages: string;
  referencesInfo: string;
  resumeFilename: string;
  status: string;
}

export interface DbMessage {
  id: number;
  senderName: string;
  senderEmail: string;
  senderRole: string;
  subject: string;
  body: string;
  status: string;
  createdAt: string;
}

export interface DbAuditLog {
  id: number;
  actorEmail: string;
  actorRole: string;
  action: string;
  targetEntity: string;
  details: string;
  createdAt: string;
}
