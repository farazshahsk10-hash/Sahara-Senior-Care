import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { desc, eq } from 'drizzle-orm';
import { createServer as createViteServer } from 'vite';
import { db } from './src/db/index.ts';
import {
  appointments,
  auditLogs,
  bookings,
  carePlans,
  caregiverApplications,
  caregiverProfiles,
  doctorProfiles,
  elderlyProfiles,
  emergencyIncidents,
  invoices,
  messages,
  siteContent,
  users,
  visitRecords,
} from './src/db/schema.ts';
import { ensureSeedData } from './src/db/seed.ts';
import {
  AuthRequest,
  createDemoToken,
  requireAuth,
  requireRole,
} from './src/middleware/auth.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '1mb' }));

function sanitizeText(value: unknown, maxLen = 500): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLen);
}

function escapeCsvCell(value: unknown): string {
  const str = String(value ?? '');
  const safe = /^[=+\-@\t\r]/.test(str) ? `'${str}` : str;
  return `"${safe.replace(/"/g, '""')}"`;
}

// Lazily ensure initial seed records on API requests
app.use('/api', async (_req, _res, next) => {
  await ensureSeedData();
  next();
});

// ========================
// PUBLIC ENDPOINTS
// ========================
app.get('/api/public/bootstrap', async (_req, res) => {
  try {
    const [plans, content] = await Promise.all([
      db.select().from(carePlans).orderBy(carePlans.monthlyPricePkr),
      db.select().from(siteContent),
    ]);
    res.json({ plans, content });
  } catch (err) {
    console.error('Bootstrap query failed:', err);
    res.status(500).json({ error: 'Unable to load platform data right now.' });
  }
});

app.post('/api/public/bookings', async (req, res) => {
  try {
    const fullName = sanitizeText(req.body.fullName, 120);
    const phone = sanitizeText(req.body.phone, 40);
    const email = sanitizeText(req.body.email, 160);
    const city = sanitizeText(req.body.city, 120);
    const elderlyAgeRange = sanitizeText(req.body.elderlyAgeRange, 60);
    const relationship = sanitizeText(req.body.relationship, 80);
    const serviceRequired = sanitizeText(req.body.serviceRequired, 120);
    const preferredSchedule = sanitizeText(req.body.preferredSchedule, 120);
    const additionalInfo = sanitizeText(req.body.additionalInfo, 800);
    const consentGiven = Boolean(req.body.consentGiven);

    if (fullName.length < 2) {
      return res.status(400).json({ error: 'Please enter your full name.' });
    }
    const digits = phone.replace(/[^\d]/g, '');
    if (digits.length < 9 || digits.length > 15) {
      return res.status(400).json({ error: 'Please enter a valid contact phone number.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    if (!city || !elderlyAgeRange || !relationship || !serviceRequired || !preferredSchedule) {
      return res.status(400).json({ error: 'Please complete all required assessment fields.' });
    }
    if (!consentGiven) {
      return res.status(400).json({ error: 'Consent is required to schedule an assessment.' });
    }

    const referenceCode = `SAH-${Math.floor(100000 + Math.random() * 900000)}`;
    const [created] = await db
      .insert(bookings)
      .values({
        referenceCode,
        fullName,
        phone,
        email,
        city,
        elderlyAgeRange,
        relationship,
        serviceRequired,
        preferredSchedule,
        additionalInfo,
        consentGiven,
        status: 'Pending',
      })
      .returning();

    res.status(201).json({
      booking: created,
      message: 'Assessment request recorded. No automated email/SMS sent unless configured.',
    });
  } catch (err) {
    console.error('Create booking failed:', err);
    res.status(500).json({ error: 'Unable to save assessment request.' });
  }
});

app.post('/api/public/caregiver-applications', async (req, res) => {
  try {
    const fullName = sanitizeText(req.body.fullName, 120);
    const phone = sanitizeText(req.body.phone, 40);
    const email = sanitizeText(req.body.email, 160);
    const city = sanitizeText(req.body.city, 120);
    const education = sanitizeText(req.body.education, 200);
    const experience = sanitizeText(req.body.experience, 500);
    const certifications = sanitizeText(req.body.certifications, 300);
    const availability = sanitizeText(req.body.availability, 120);
    const languages = sanitizeText(req.body.languages, 160);
    const referencesInfo = sanitizeText(req.body.referencesInfo, 400);
    const resumeFilename = sanitizeText(req.body.resumeFilename, 180);
    const consent = Boolean(req.body.consent);

    if (
      fullName.length < 2 ||
      phone.replace(/[^\d]/g, '').length < 9 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !city ||
      !education ||
      !experience ||
      !availability ||
      !languages ||
      !referencesInfo ||
      !consent
    ) {
      return res
        .status(400)
        .json({ error: 'Please complete all required caregiver application fields and consent.' });
    }

    const [created] = await db
      .insert(caregiverApplications)
      .values({
        fullName,
        phone,
        email,
        city,
        education,
        experience,
        certifications,
        availability,
        languages,
        referencesInfo,
        resumeFilename,
        status: 'Submitted',
      })
      .returning();

    res.status(201).json({ application: created });
  } catch (err) {
    console.error('Caregiver application error:', err);
    res.status(500).json({ error: 'Unable to submit caregiver application.' });
  }
});

app.post('/api/public/contact', async (req, res) => {
  try {
    const senderName = sanitizeText(req.body.senderName, 120);
    const senderEmail = sanitizeText(req.body.senderEmail, 160);
    const subject = sanitizeText(req.body.subject, 160);
    const body = sanitizeText(req.body.body, 1500);
    const senderRole = sanitizeText(req.body.senderRole, 40) || 'visitor';

    if (senderName.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail) || !subject || !body) {
      return res.status(400).json({ error: 'Please fill out name, valid email, subject, and message.' });
    }

    const [created] = await db
      .insert(messages)
      .values({
        senderName,
        senderEmail,
        senderRole,
        subject,
        body,
        status: 'Unread',
      })
      .returning();

    res.status(201).json({ messageRecord: created });
  } catch (err) {
    console.error('Contact submission error:', err);
    res.status(500).json({ error: 'Unable to send message.' });
  }
});

// ========================
// AUTH & DEMO SESSIONS
// ========================
app.post('/api/auth/sync', requireAuth, async (req: AuthRequest, res) => {
  res.json({ principal: req.principal });
});

app.post('/api/demo/session', (req, res) => {
  const role = sanitizeText(req.body.role, 30);
  if (!['admin', 'family', 'caregiver', 'doctor'].includes(role)) {
    return res.status(400).json({ error: 'Invalid demo role requested.' });
  }
  const typedRole = role as 'admin' | 'family' | 'caregiver' | 'doctor';
  const token = createDemoToken(typedRole);
  res.json({ token, role: typedRole, isDemo: true });
});

// ========================
// FAMILY DASHBOARD ROUTES
// ========================
app.get(
  '/api/dashboard/family',
  requireAuth,
  requireRole('family', 'admin', 'super_admin'),
  async (req: AuthRequest, res) => {
    try {
      const [elders, caregiversList, doctorsList, visits, appts, invs, msgs] =
        await Promise.all([
          db.select().from(elderlyProfiles).orderBy(elderlyProfiles.id),
          db.select().from(caregiverProfiles),
          db.select().from(doctorProfiles),
          db.select().from(visitRecords).orderBy(desc(visitRecords.id)),
          db.select().from(appointments).orderBy(desc(appointments.id)),
          db.select().from(invoices).orderBy(desc(invoices.id)),
          db.select().from(messages).orderBy(desc(messages.id)),
        ]);

      // Non-demo authenticated family users only see profiles linked to their userId
      const scopedElders = req.principal?.isDemo
        ? elders
        : elders.filter((e) => e.familyUserId === req.principal?.userId);

      const elderIds = new Set(scopedElders.map((e) => e.id));

      res.json({
        isDemo: req.principal?.isDemo ?? false,
        elderlyProfiles: scopedElders,
        caregivers: caregiversList,
        doctors: doctorsList,
        visits: visits.filter((v) => elderIds.has(v.elderlyId)),
        appointments: appts.filter((a) => elderIds.has(a.elderlyId)),
        invoices: invs.filter((i) => i.elderlyId === null || elderIds.has(i.elderlyId)),
        messages: req.principal?.isDemo
          ? msgs
          : msgs.filter((m) => m.senderEmail === req.principal?.email),
      });
    } catch (err) {
      console.error('Family dashboard fetch failed:', err);
      res.status(500).json({ error: 'Unable to load family dashboard.' });
    }
  }
);

app.post(
  '/api/dashboard/family/appointments',
  requireAuth,
  requireRole('family', 'admin', 'super_admin'),
  async (req: AuthRequest, res) => {
    try {
      const elderlyId = Number(req.body.elderlyId);
      const doctorId = req.body.doctorId ? Number(req.body.doctorId) : null;
      const scheduledDate = sanitizeText(req.body.scheduledDate, 60);
      const scheduledTime = sanitizeText(req.body.scheduledTime, 40);
      const reason = sanitizeText(req.body.reason, 400);

      if (!elderlyId || !scheduledDate || !scheduledTime || !reason) {
        return res.status(400).json({ error: 'Complete all appointment request fields.' });
      }

      const [created] = await db
        .insert(appointments)
        .values({
          elderlyId,
          doctorId,
          scheduledDate,
          scheduledTime,
          reason,
          status: 'Requested',
        })
        .returning();

      res.status(201).json({ appointment: created });
    } catch (err) {
      console.error('Family appointment request error:', err);
      res.status(500).json({ error: 'Failed to request doctor appointment.' });
    }
  }
);

// ========================
// CAREGIVER DASHBOARD ROUTES
// ========================
app.get(
  '/api/dashboard/caregiver',
  requireAuth,
  requireRole('caregiver', 'admin', 'super_admin'),
  async (req: AuthRequest, res) => {
    try {
      const [allCaregivers, allVisits, allElders, allIncidents] = await Promise.all([
        db.select().from(caregiverProfiles),
        db.select().from(visitRecords).orderBy(desc(visitRecords.id)),
        db.select().from(elderlyProfiles),
        db.select().from(emergencyIncidents).orderBy(desc(emergencyIncidents.id)),
      ]);

      const activeCaregiver =
        allCaregivers.find((c) => c.userId === req.principal?.userId) ?? allCaregivers[0];

      // Strict scoping: only expose clients/visits assigned to this caregiver
      const assignedVisits = activeCaregiver
        ? allVisits.filter((v) => v.caregiverId === activeCaregiver.id)
        : [];
      const assignedElderIds = new Set(assignedVisits.map((v) => v.elderlyId));
      const assignedElders = allElders.filter((e) => assignedElderIds.has(e.id));

      res.json({
        isDemo: req.principal?.isDemo ?? false,
        caregiver: activeCaregiver,
        assignedClients: assignedElders,
        visits: assignedVisits,
        incidents: allIncidents.filter((inc) => assignedElderIds.has(inc.elderlyId)),
      });
    } catch (err) {
      console.error('Caregiver dashboard error:', err);
      res.status(500).json({ error: 'Unable to load caregiver dashboard.' });
    }
  }
);

app.patch(
  '/api/dashboard/caregiver/visits/:id',
  requireAuth,
  requireRole('caregiver', 'admin', 'super_admin'),
  async (req: AuthRequest, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) {
        return res.status(400).json({ error: 'Invalid visit ID.' });
      }
      const action = sanitizeText(req.body.action, 40);
      const bpReading = sanitizeText(req.body.bpReading, 40);
      const pulseReading = sanitizeText(req.body.pulseReading, 40);
      const tempReading = sanitizeText(req.body.tempReading, 40);
      const careSummary = sanitizeText(req.body.careSummary, 800);

      const nowStr = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });

      const updateValues: Partial<typeof visitRecords.$inferInsert> = {};
      if (action === 'check_in') {
        updateValues.checkInTime = nowStr;
        updateValues.status = 'In Progress';
      } else if (action === 'check_out') {
        updateValues.checkOutTime = nowStr;
        updateValues.status = 'Completed';
      }
      if (bpReading) updateValues.bpReading = bpReading;
      if (pulseReading) updateValues.pulseReading = pulseReading;
      if (tempReading) updateValues.tempReading = tempReading;
      if (careSummary) updateValues.careSummary = careSummary;

      const [updated] = await db
        .update(visitRecords)
        .set(updateValues)
        .where(eq(visitRecords.id, id))
        .returning();

      if (!updated) {
        return res.status(404).json({ error: 'Visit record not found.' });
      }
      res.json({ visit: updated });
    } catch (err) {
      console.error('Caregiver visit update error:', err);
      res.status(500).json({ error: 'Failed to update visit.' });
    }
  }
);

app.post(
  '/api/dashboard/caregiver/incidents',
  requireAuth,
  requireRole('caregiver', 'admin', 'super_admin'),
  async (req: AuthRequest, res) => {
    try {
      const elderlyId = Number(req.body.elderlyId);
      const title = sanitizeText(req.body.title, 200);
      const location = sanitizeText(req.body.location, 200);
      const escalationActions = sanitizeText(req.body.escalationActions, 600);
      const severity = sanitizeText(req.body.severity, 30) || 'Urgent';

      if (!elderlyId || !title || !location || !escalationActions) {
        return res.status(400).json({ error: 'All incident fields are required.' });
      }

      const [created] = await db
        .insert(emergencyIncidents)
        .values({
          elderlyId,
          reportedBy: req.principal?.fullName || 'Caregiver',
          title,
          location,
          severity,
          escalationActions,
          familyNotified: true,
          status: 'Open',
        })
        .returning();

      res.status(201).json({ incident: created });
    } catch (err) {
      console.error('Incident report error:', err);
      res.status(500).json({ error: 'Unable to submit incident report.' });
    }
  }
);

// ========================
// DOCTOR DASHBOARD ROUTES
// ========================
app.get(
  '/api/dashboard/doctor',
  requireAuth,
  requireRole('doctor', 'admin', 'super_admin'),
  async (req: AuthRequest, res) => {
    try {
      const [allDoctors, allAppts, allElders] = await Promise.all([
        db.select().from(doctorProfiles),
        db.select().from(appointments).orderBy(desc(appointments.id)),
        db.select().from(elderlyProfiles),
      ]);

      const activeDoctor =
        allDoctors.find((d) => d.userId === req.principal?.userId) ?? allDoctors[0];

      res.json({
        isDemo: req.principal?.isDemo ?? false,
        doctor: activeDoctor,
        appointments: allAppts,
        elderlyProfiles: allElders,
      });
    } catch (err) {
      console.error('Doctor dashboard error:', err);
      res.status(500).json({ error: 'Unable to load doctor dashboard.' });
    }
  }
);

app.patch(
  '/api/dashboard/doctor/appointments/:id',
  requireAuth,
  requireRole('doctor', 'admin', 'super_admin'),
  async (req: AuthRequest, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) {
        return res.status(400).json({ error: 'Invalid appointment ID.' });
      }
      const status = sanitizeText(req.body.status, 40);
      const consultationNotes = sanitizeText(req.body.consultationNotes, 1000);
      const followUpNotes = sanitizeText(req.body.followUpNotes, 600);

      const updateValues: Partial<typeof appointments.$inferInsert> = {};
      if (status) updateValues.status = status;
      if (consultationNotes) updateValues.consultationNotes = consultationNotes;
      if (followUpNotes) updateValues.followUpNotes = followUpNotes;

      const [updated] = await db
        .update(appointments)
        .set(updateValues)
        .where(eq(appointments.id, id))
        .returning();

      if (!updated) {
        return res.status(404).json({ error: 'Appointment not found.' });
      }
      res.json({ appointment: updated });
    } catch (err) {
      console.error('Doctor appointment update error:', err);
      res.status(500).json({ error: 'Failed to update consultation record.' });
    }
  }
);

// ========================
// ADMIN DASHBOARD ROUTES
// ========================
app.get(
  '/api/admin/overview',
  requireAuth,
  requireRole('admin', 'super_admin'),
  async (req: AuthRequest, res) => {
    try {
      const [
        allUsers,
        allElders,
        allCaregivers,
        allDoctors,
        allBookings,
        allPlans,
        allVisits,
        allAppointments,
        allIncidents,
        allInvoices,
        allApplications,
        allMessages,
        allSiteContent,
        allAuditLogs,
      ] = await Promise.all([
        db.select().from(users).orderBy(desc(users.id)),
        db.select().from(elderlyProfiles).orderBy(desc(elderlyProfiles.id)),
        db.select().from(caregiverProfiles).orderBy(desc(caregiverProfiles.id)),
        db.select().from(doctorProfiles).orderBy(desc(doctorProfiles.id)),
        db.select().from(bookings).orderBy(desc(bookings.id)),
        db.select().from(carePlans).orderBy(carePlans.monthlyPricePkr),
        db.select().from(visitRecords).orderBy(desc(visitRecords.id)),
        db.select().from(appointments).orderBy(desc(appointments.id)),
        db.select().from(emergencyIncidents).orderBy(desc(emergencyIncidents.id)),
        db.select().from(invoices).orderBy(desc(invoices.id)),
        db.select().from(caregiverApplications).orderBy(desc(caregiverApplications.id)),
        db.select().from(messages).orderBy(desc(messages.id)),
        db.select().from(siteContent).orderBy(siteContent.id),
        db.select().from(auditLogs).orderBy(desc(auditLogs.id)),
      ]);

      res.json({
        isDemo: req.principal?.isDemo ?? false,
        users: allUsers,
        elderlyProfiles: allElders,
        caregivers: allCaregivers,
        doctors: allDoctors,
        bookings: allBookings,
        carePlans: allPlans,
        visits: allVisits,
        appointments: allAppointments,
        incidents: allIncidents,
        invoices: allInvoices,
        applications: allApplications,
        messages: allMessages,
        siteContent: allSiteContent,
        auditLogs: allAuditLogs,
      });
    } catch (err) {
      console.error('Admin overview failed:', err);
      res.status(500).json({ error: 'Unable to load admin console data.' });
    }
  }
);

app.patch(
  '/api/admin/bookings/:id',
  requireAuth,
  requireRole('admin', 'super_admin'),
  async (req: AuthRequest, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) {
        return res.status(400).json({ error: 'Invalid booking ID.' });
      }
      const status = sanitizeText(req.body.status, 50);
      const assignedCaregiverId = req.body.assignedCaregiverId
        ? Number(req.body.assignedCaregiverId)
        : undefined;
      const cancellationReason = sanitizeText(req.body.cancellationReason, 400);

      const updateValues: Partial<typeof bookings.$inferInsert> = {};
      if (status) updateValues.status = status;
      if (assignedCaregiverId !== undefined) {
        updateValues.assignedCaregiverId = assignedCaregiverId || null;
      }
      if (cancellationReason !== undefined) {
        updateValues.cancellationReason = cancellationReason;
      }

      const [updated] = await db
        .update(bookings)
        .set(updateValues)
        .where(eq(bookings.id, id))
        .returning();

      if (!updated) {
        return res.status(404).json({ error: 'Booking not found.' });
      }

      await db.insert(auditLogs).values({
        actorEmail: req.principal?.email || 'admin',
        actorRole: req.principal?.role || 'admin',
        action: 'UPDATE_BOOKING',
        targetEntity: `Booking ${updated.referenceCode}`,
        details: `Updated status to "${updated.status}"${
          updated.assignedCaregiverId ? ` · Caregiver ID #${updated.assignedCaregiverId}` : ''
        }`,
      });

      res.json({ booking: updated });
    } catch (err) {
      console.error('Admin booking update failed:', err);
      res.status(500).json({ error: 'Failed to update booking.' });
    }
  }
);

app.patch(
  '/api/admin/care-plans/:id',
  requireAuth,
  requireRole('admin', 'super_admin'),
  async (req: AuthRequest, res) => {
    try {
      const id = Number(req.params.id);
      const monthlyPricePkr = Number(req.body.monthlyPricePkr);
      const hoursSummary = sanitizeText(req.body.hoursSummary, 160);
      const tagline = sanitizeText(req.body.tagline, 200);

      if (!Number.isInteger(id) || !Number.isFinite(monthlyPricePkr) || monthlyPricePkr < 1000) {
        return res.status(400).json({ error: 'Provide a valid plan ID and monthly PKR price.' });
      }

      const updateValues: Partial<typeof carePlans.$inferInsert> = {
        monthlyPricePkr,
        updatedAt: new Date(),
      };
      if (hoursSummary) updateValues.hoursSummary = hoursSummary;
      if (tagline) updateValues.tagline = tagline;

      const [updated] = await db
        .update(carePlans)
        .set(updateValues)
        .where(eq(carePlans.id, id))
        .returning();

      if (!updated) {
        return res.status(404).json({ error: 'Care plan not found.' });
      }

      await db.insert(auditLogs).values({
        actorEmail: req.principal?.email || 'admin',
        actorRole: req.principal?.role || 'admin',
        action: 'UPDATE_CARE_PLAN',
        targetEntity: updated.name,
        details: `Updated monthly rate to PKR ${updated.monthlyPricePkr}`,
      });

      res.json({ plan: updated });
    } catch (err) {
      console.error('Admin plan update failed:', err);
      res.status(500).json({ error: 'Failed to update care plan.' });
    }
  }
);

app.patch(
  '/api/admin/caregiver-applications/:id',
  requireAuth,
  requireRole('admin', 'super_admin'),
  async (req: AuthRequest, res) => {
    try {
      const id = Number(req.params.id);
      const status = sanitizeText(req.body.status, 40);
      const allowedStatuses = [
        'Submitted',
        'Under Review',
        'Interview',
        'Screening',
        'Approved',
        'Rejected',
      ];
      if (!Number.isInteger(id) || !allowedStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid application status.' });
      }

      const [updated] = await db
        .update(caregiverApplications)
        .set({ status })
        .where(eq(caregiverApplications.id, id))
        .returning();

      if (!updated) {
        return res.status(404).json({ error: 'Application not found.' });
      }

      await db.insert(auditLogs).values({
        actorEmail: req.principal?.email || 'admin',
        actorRole: req.principal?.role || 'admin',
        action: 'REVIEW_CAREGIVER_APP',
        targetEntity: updated.fullName,
        details: `Updated application status to ${status}`,
      });

      res.json({ application: updated });
    } catch (err) {
      console.error('Admin caregiver app update failed:', err);
      res.status(500).json({ error: 'Failed to update caregiver application.' });
    }
  }
);

app.patch(
  '/api/admin/incidents/:id',
  requireAuth,
  requireRole('admin', 'super_admin'),
  async (req: AuthRequest, res) => {
    try {
      const id = Number(req.params.id);
      const status = sanitizeText(req.body.status, 40);
      const escalationActions = sanitizeText(req.body.escalationActions, 600);

      if (!Number.isInteger(id) || !status) {
        return res.status(400).json({ error: 'Invalid incident update.' });
      }

      const updateValues: Partial<typeof emergencyIncidents.$inferInsert> = { status };
      if (escalationActions) updateValues.escalationActions = escalationActions;

      const [updated] = await db
        .update(emergencyIncidents)
        .set(updateValues)
        .where(eq(emergencyIncidents.id, id))
        .returning();

      if (!updated) {
        return res.status(404).json({ error: 'Incident not found.' });
      }

      await db.insert(auditLogs).values({
        actorEmail: req.principal?.email || 'admin',
        actorRole: req.principal?.role || 'admin',
        action: 'UPDATE_INCIDENT',
        targetEntity: `Incident #${updated.id}`,
        details: `Incident status changed to ${updated.status}`,
      });

      res.json({ incident: updated });
    } catch (err) {
      console.error('Admin incident update failed:', err);
      res.status(500).json({ error: 'Failed to update incident.' });
    }
  }
);

app.patch(
  '/api/admin/invoices/:id',
  requireAuth,
  requireRole('admin', 'super_admin'),
  async (req: AuthRequest, res) => {
    try {
      const id = Number(req.params.id);
      const status = sanitizeText(req.body.status, 30);
      if (!Number.isInteger(id) || !['Paid', 'Pending', 'Refunded'].includes(status)) {
        return res.status(400).json({ error: 'Invalid invoice status.' });
      }

      const [updated] = await db
        .update(invoices)
        .set({ status })
        .where(eq(invoices.id, id))
        .returning();

      if (!updated) {
        return res.status(404).json({ error: 'Invoice not found.' });
      }

      await db.insert(auditLogs).values({
        actorEmail: req.principal?.email || 'admin',
        actorRole: req.principal?.role || 'admin',
        action: 'UPDATE_INVOICE',
        targetEntity: updated.invoiceNumber,
        details: `Marked invoice ${updated.status}`,
      });

      res.json({ invoice: updated });
    } catch (err) {
      console.error('Invoice update failed:', err);
      res.status(500).json({ error: 'Failed to update invoice.' });
    }
  }
);

app.patch(
  '/api/admin/site-content/:key',
  requireAuth,
  requireRole('admin', 'super_admin'),
  async (req: AuthRequest, res) => {
    try {
      const key = sanitizeText(req.params.key, 80);
      const title = sanitizeText(req.body.title, 200);
      const body = sanitizeText(req.body.body, 2000);
      if (!key || !title || !body) {
        return res.status(400).json({ error: 'Content title and body are required.' });
      }

      const [updated] = await db
        .update(siteContent)
        .set({ title, body, updatedAt: new Date() })
        .where(eq(siteContent.key, key))
        .returning();

      if (!updated) {
        return res.status(404).json({ error: 'Content key not found.' });
      }

      await db.insert(auditLogs).values({
        actorEmail: req.principal?.email || 'admin',
        actorRole: req.principal?.role || 'admin',
        action: 'UPDATE_SITE_CONTENT',
        targetEntity: key,
        details: `Updated website content block "${key}"`,
      });

      res.json({ content: updated });
    } catch (err) {
      console.error('Site content update failed:', err);
      res.status(500).json({ error: 'Failed to update website content.' });
    }
  }
);

app.get(
  '/api/admin/reports/csv',
  requireAuth,
  requireRole('admin', 'super_admin'),
  async (req: AuthRequest, res) => {
    try {
      const type = sanitizeText(req.query.type, 40) || 'bookings';
      let csv = '';

      if (type === 'invoices') {
        const rows = await db.select().from(invoices).orderBy(desc(invoices.id));
        csv += 'Invoice Number,Family,Category,Service Revenue (PKR),Refundable Deposit (PKR),Status,Due Date\n';
        for (const r of rows) {
          csv +=
            [
              escapeCsvCell(r.invoiceNumber),
              escapeCsvCell(r.familyName),
              escapeCsvCell(r.category),
              escapeCsvCell(r.amountPkr),
              escapeCsvCell(r.securityDepositPkr),
              escapeCsvCell(r.status),
              escapeCsvCell(r.dueDate),
            ].join(',') + '\n';
        }
      } else {
        const rows = await db.select().from(bookings).orderBy(desc(bookings.id));
        csv += 'Reference,Name,City,Service,Preferred Schedule,Status,Created\n';
        for (const r of rows) {
          csv +=
            [
              escapeCsvCell(r.referenceCode),
              escapeCsvCell(r.fullName),
              escapeCsvCell(r.city),
              escapeCsvCell(r.serviceRequired),
              escapeCsvCell(r.preferredSchedule),
              escapeCsvCell(r.status),
              escapeCsvCell(r.createdAt?.toISOString() ?? ''),
            ].join(',') + '\n';
        }
      }

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="sahara-${type}-report.csv"`
      );
      res.send(csv);
    } catch (err) {
      console.error('CSV export failed:', err);
      res.status(500).json({ error: 'Failed to export report.' });
    }
  }
);

// ========================
// VITE / STATIC SERVING
// ========================
async function startServer() {
  const port = Number(process.env.PORT) || 3000;

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Sahara Senior Care server listening on port ${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Sahara server:', err);
  process.exit(1);
});
