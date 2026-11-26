import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  fullName: text('full_name').notNull(),
  phone: text('phone').default(''),
  city: text('city').default('Karachi'),
  role: text('role').notNull().default('family'), // super_admin | admin | family | caregiver | doctor
  status: text('status').notNull().default('Active'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const carePlans = pgTable('care_plans', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  tagline: text('tagline').notNull(),
  monthlyPricePkr: integer('monthly_price_pkr').notNull(),
  hoursSummary: text('hours_summary').notNull(),
  visitsSummary: text('visits_summary').notNull(),
  exclusions: text('exclusions').notNull(),
  isFeatured: boolean('is_featured').default(false).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const elderlyProfiles = pgTable('elderly_profiles', {
  id: serial('id').primaryKey(),
  familyUserId: integer('family_user_id').references(() => users.id),
  fullName: text('full_name').notNull(),
  age: integer('age').notNull(),
  gender: text('gender').notNull(),
  city: text('city').notNull(),
  neighbourhood: text('neighbourhood').notNull(),
  carePlanName: text('care_plan_name').notNull(),
  mobilityNotes: text('mobility_notes').notNull(),
  emergencyContactName: text('emergency_contact_name').notNull(),
  emergencyContactPhone: text('emergency_contact_phone').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const caregiverProfiles = pgTable('caregiver_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  fullName: text('full_name').notNull(),
  phone: text('phone').notNull(),
  city: text('city').notNull(),
  experienceYears: integer('experience_years').notNull(),
  languages: text('languages').notNull(),
  verificationStatus: text('verification_status').notNull().default('Verified'),
  availabilityStatus: text('availability_status').notNull().default('Available'),
  trainingNotes: text('training_notes').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const doctorProfiles = pgTable('doctor_profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  fullName: text('full_name').notNull(),
  specialty: text('specialty').notNull(),
  pmdcNumber: text('pmdc_number').notNull(),
  city: text('city').notNull(),
  consultationFeePkr: integer('consultation_fee_pkr').notNull(),
  verificationStatus: text('verification_status').notNull().default('Verified'),
  availabilityStatus: text('availability_status').notNull().default('Available'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  referenceCode: text('reference_code').notNull().unique(),
  familyUserId: integer('family_user_id').references(() => users.id),
  fullName: text('full_name').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  city: text('city').notNull(),
  elderlyAgeRange: text('elderly_age_range').notNull(),
  relationship: text('relationship').notNull(),
  serviceRequired: text('service_required').notNull(),
  preferredSchedule: text('preferred_schedule').notNull(),
  additionalInfo: text('additional_info').default(''),
  consentGiven: boolean('consent_given').default(true).notNull(),
  status: text('status').notNull().default('Pending'), // Pending | Assessment Scheduled | Approved | Active | Completed | Cancelled
  assignedCaregiverId: integer('assigned_caregiver_id').references(() => caregiverProfiles.id),
  cancellationReason: text('cancellation_reason').default(''),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const visitRecords = pgTable('visit_records', {
  id: serial('id').primaryKey(),
  elderlyId: integer('elderly_id').references(() => elderlyProfiles.id).notNull(),
  caregiverId: integer('caregiver_id').references(() => caregiverProfiles.id),
  scheduledDate: text('scheduled_date').notNull(),
  scheduledTime: text('scheduled_time').notNull(),
  checkInTime: text('check_in_time').default(''),
  checkOutTime: text('check_out_time').default(''),
  status: text('status').notNull().default('Scheduled'), // Scheduled | In Progress | Completed | Missed
  bpReading: text('bp_reading').default(''),
  pulseReading: text('pulse_reading').default(''),
  tempReading: text('temp_reading').default(''),
  careSummary: text('care_summary').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const appointments = pgTable('appointments', {
  id: serial('id').primaryKey(),
  elderlyId: integer('elderly_id').references(() => elderlyProfiles.id).notNull(),
  doctorId: integer('doctor_id').references(() => doctorProfiles.id),
  scheduledDate: text('scheduled_date').notNull(),
  scheduledTime: text('scheduled_time').notNull(),
  reason: text('reason').notNull(),
  status: text('status').notNull().default('Requested'), // Requested | Scheduled | Completed | Cancelled
  consultationNotes: text('consultation_notes').default(''),
  followUpNotes: text('follow_up_notes').default(''),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const emergencyIncidents = pgTable('emergency_incidents', {
  id: serial('id').primaryKey(),
  elderlyId: integer('elderly_id').references(() => elderlyProfiles.id).notNull(),
  reportedBy: text('reported_by').notNull(),
  title: text('title').notNull(),
  location: text('location').notNull(),
  severity: text('severity').notNull().default('Urgent'),
  escalationActions: text('escalation_actions').notNull(),
  familyNotified: boolean('family_notified').default(true).notNull(),
  status: text('status').notNull().default('Open'), // Open | Escalated | Reviewed & Closed
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  invoiceNumber: text('invoice_number').notNull().unique(),
  familyName: text('family_name').notNull(),
  elderlyId: integer('elderly_id').references(() => elderlyProfiles.id),
  description: text('description').notNull(),
  amountPkr: integer('amount_pkr').notNull(),
  securityDepositPkr: integer('security_deposit_pkr').default(0).notNull(),
  category: text('category').notNull(), // Subscription | Doctor Coordination | Wearable Device | Custom Plan
  status: text('status').notNull().default('Pending'), // Paid | Pending | Refunded
  dueDate: text('due_date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const caregiverApplications = pgTable('caregiver_applications', {
  id: serial('id').primaryKey(),
  fullName: text('full_name').notNull(),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  city: text('city').notNull(),
  education: text('education').notNull(),
  experience: text('experience').notNull(),
  certifications: text('certifications').default(''),
  availability: text('availability').notNull(),
  languages: text('languages').notNull(),
  referencesInfo: text('references_info').notNull(),
  resumeFilename: text('resume_filename').default(''),
  status: text('status').notNull().default('Submitted'), // Submitted | Under Review | Interview | Screening | Approved | Rejected
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  senderName: text('sender_name').notNull(),
  senderEmail: text('sender_email').notNull(),
  senderRole: text('sender_role').notNull(),
  subject: text('subject').notNull(),
  body: text('body').notNull(),
  status: text('status').notNull().default('Unread'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const siteContent = pgTable('site_content', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  actorEmail: text('actor_email').notNull(),
  actorRole: text('actor_role').notNull(),
  action: text('action').notNull(),
  targetEntity: text('target_entity').notNull(),
  details: text('details').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
