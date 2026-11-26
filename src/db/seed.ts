import { count } from 'drizzle-orm';
import { db } from './index.ts';
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
} from './schema.ts';

let seedPromise: Promise<void> | null = null;

export async function ensureSeedData(): Promise<void> {
  if (!seedPromise) {
    seedPromise = runIdempotentSeed().catch((err) => {
      seedPromise = null;
      console.error('Failed to seed Sahara database:', err);
    });
  }
  await seedPromise;
}

async function runIdempotentSeed(): Promise<void> {
  const [{ value: planCount }] = await db.select({ value: count() }).from(carePlans);
  if (planCount > 0) {
    return;
  }

  // 1. Seed Care Plans (editable from Admin Dashboard)
  await db.insert(carePlans).values([
    {
      slug: 'basic-care',
      name: 'Basic Care',
      tagline: 'Scheduled daily check-ins for independent seniors',
      monthlyPricePkr: 18000,
      hoursSummary: '3 hours/day · 5 days/week (60 hours/month)',
      visitsSummary: '20 scheduled home visits/month',
      exclusions:
        'Excludes transportation, licensed GP home visits (PKR 3,500/visit), medical consumables, and extra hours.',
      isFeatured: false,
      isActive: true,
    },
    {
      slug: 'family-peace-plan',
      name: 'Family Peace Plan',
      tagline: 'Defined support schedule with organized family updates',
      monthlyPricePkr: 20000,
      hoursSummary: '4 hours/day · 6 days/week (96 hours/month)',
      visitsSummary: '24 scheduled home visits/month + digital portal logs',
      exclusions:
        'Excludes clinical nursing procedures, medical supplies, transport, and GP visits (available separately).',
      isFeatured: true,
      isActive: true,
    },
    {
      slug: 'extended-care',
      name: 'Extended Care',
      tagline: 'Daytime mobility, meal, and companionship support',
      monthlyPricePkr: 35000,
      hoursSummary: '8 hours/day · 6 days/week (192 hours/month)',
      visitsSummary: '24 full daytime shifts/month + backup caregiver cover',
      exclusions:
        'Excludes overnight duties, specialized nursing consumables, and external hospital transport.',
      isFeatured: false,
      isActive: true,
    },
    {
      slug: 'premium-live-in',
      name: 'Premium / Live-In Care',
      tagline: 'Comprehensive home arrangement subject to assessment',
      monthlyPricePkr: 65000,
      hoursSummary: 'Full-day live-in rotation · 6 days/week (subject to agreement)',
      visitsSummary: 'Continuous scheduled residence coverage',
      exclusions:
        'Subject to availability & formal care agreement; excludes specialized clinical equipment and medical visits.',
      isFeatured: false,
      isActive: true,
    },
  ]);

  // 2. Seed Demo Users (clearly marked fictional sample accounts)
  const insertedUsers = await db
    .insert(users)
    .values([
      {
        uid: 'demo-admin',
        email: 'admin.demo@saharacare.example',
        fullName: 'Sara Mansoor (Demo Admin)',
        phone: '+92 300 0000101',
        city: 'Karachi',
        role: 'admin',
        status: 'Active',
      },
      {
        uid: 'demo-family',
        email: 'family.demo@saharacare.example',
        fullName: 'Zara Tariq (Demo Family)',
        phone: '+44 7700 900412',
        city: 'London / Karachi',
        role: 'family',
        status: 'Active',
      },
      {
        uid: 'demo-family-2',
        email: 'usman.demo@saharacare.example',
        fullName: 'Usman Kasi (Demo Family)',
        phone: '+44 7700 900881',
        city: 'Manchester / Quetta',
        role: 'family',
        status: 'Active',
      },
      {
        uid: 'demo-caregiver',
        email: 'caregiver.demo@saharacare.example',
        fullName: 'Ayesha Siddiqui (Demo Caregiver)',
        phone: '+92 321 0000202',
        city: 'Karachi',
        role: 'caregiver',
        status: 'Active',
      },
      {
        uid: 'demo-doctor',
        email: 'doctor.demo@saharacare.example',
        fullName: 'Dr. Sana Iqbal (Demo GP)',
        phone: '+92 333 0000303',
        city: 'Karachi',
        role: 'doctor',
        status: 'Active',
      },
    ])
    .returning();

  const familyUser = insertedUsers.find((u) => u.uid === 'demo-family')!;
  const familyUser2 = insertedUsers.find((u) => u.uid === 'demo-family-2')!;
  const caregiverUser = insertedUsers.find((u) => u.uid === 'demo-caregiver')!;
  const doctorUser = insertedUsers.find((u) => u.uid === 'demo-doctor')!;

  // 3. Seed Elderly Profiles
  const insertedElderly = await db
    .insert(elderlyProfiles)
    .values([
      {
        familyUserId: familyUser.id,
        fullName: 'Tariq Mahmood (Sample)',
        age: 74,
        gender: 'Male',
        city: 'Karachi',
        neighbourhood: 'DHA Phase 6',
        carePlanName: 'Family Peace Plan',
        mobilityNotes: 'Independent indoors with walking cane; prefers morning courtyard walks.',
        emergencyContactName: 'Zara Tariq (Daughter)',
        emergencyContactPhone: '+44 7700 900412',
      },
      {
        familyUserId: familyUser.id,
        fullName: 'Salma Begum (Sample)',
        age: 78,
        gender: 'Female',
        city: 'Karachi',
        neighbourhood: 'Clifton Block 4',
        carePlanName: 'Extended Care',
        mobilityNotes: 'Mild knee arthritis; requires gentle assistance on stairs.',
        emergencyContactName: 'Bilal Ahmed (Son)',
        emergencyContactPhone: '+971 50 0000912',
      },
      {
        familyUserId: familyUser2.id,
        fullName: 'Zubaida Bibi (Sample)',
        age: 76,
        gender: 'Female',
        city: 'Quetta',
        neighbourhood: 'Jinnah Town',
        carePlanName: 'Family Peace Plan',
        mobilityNotes: 'Alert and active; needs routine reminders and afternoon companionship.',
        emergencyContactName: 'Usman Kasi (Son)',
        emergencyContactPhone: '+44 7700 900881',
      },
    ])
    .returning();

  // 4. Seed Caregiver Profiles
  const insertedCaregivers = await db
    .insert(caregiverProfiles)
    .values([
      {
        userId: caregiverUser.id,
        fullName: 'Ayesha Siddiqui',
        phone: '+92 321 0000202',
        city: 'Karachi (DHA / Clifton)',
        experienceYears: 5,
        languages: 'Urdu, English',
        verificationStatus: 'Verified',
        availabilityStatus: 'Assigned',
        trainingNotes: 'CNIC & police character check verified; basic elder mobility & vital logging.',
      },
      {
        fullName: 'Nadia Parveen',
        phone: '+92 301 0000205',
        city: 'Karachi (Clifton)',
        experienceYears: 4,
        languages: 'Urdu, Sindhi',
        verificationStatus: 'Verified',
        availabilityStatus: 'Assigned',
        trainingNotes: 'Reference checked; trained in meal support and safe transfer assistance.',
      },
      {
        fullName: 'Kamran Malik',
        phone: '+92 334 0000209',
        city: 'Karachi (PECHS / DHA)',
        experienceYears: 6,
        languages: 'Urdu, English, Punjabi',
        verificationStatus: 'Verified',
        availabilityStatus: 'Available',
        trainingNotes: 'Male eldercare specialist; verified background and physiotherapy assistance.',
      },
      {
        fullName: 'Farzana Bibi',
        phone: '+92 315 0000214',
        city: 'Quetta',
        experienceYears: 3,
        languages: 'Urdu, Pashto, Brahui',
        verificationStatus: 'Verified',
        availabilityStatus: 'Available',
        trainingNotes: 'Verified ID and references; companionship and daily living support.',
      },
    ])
    .returning();

  // 5. Seed Doctor Profiles
  const insertedDoctors = await db
    .insert(doctorProfiles)
    .values([
      {
        userId: doctorUser.id,
        fullName: 'Dr. Sana Iqbal',
        specialty: 'General Physician (Family Medicine)',
        pmdcNumber: 'PMDC-Sample-48210',
        city: 'Karachi',
        consultationFeePkr: 3500,
        verificationStatus: 'Verified',
        availabilityStatus: 'Available',
      },
      {
        fullName: 'Dr. Kamran Raza',
        specialty: 'Geriatric & Internal Medicine',
        pmdcNumber: 'PMDC-Sample-39104',
        city: 'Karachi',
        consultationFeePkr: 3500,
        verificationStatus: 'Verified',
        availabilityStatus: 'Available',
      },
    ])
    .returning();

  // 6. Seed Bookings
  await db.insert(bookings).values([
    {
      referenceCode: 'SAH-202601',
      familyUserId: familyUser.id,
      fullName: 'Zara Tariq',
      phone: '+44 7700 900412',
      email: 'family.demo@saharacare.example',
      city: 'Karachi — DHA Phase 6',
      elderlyAgeRange: '70–79 years',
      relationship: 'Daughter (Overseas)',
      serviceRequired: 'Personal Elderly Care',
      preferredSchedule: 'Morning · 4 hrs/day (6 days/wk)',
      additionalInfo: 'Interested in Family Peace Plan with portal updates for London family.',
      consentGiven: true,
      status: 'Active',
      assignedCaregiverId: insertedCaregivers[0].id,
    },
    {
      referenceCode: 'SAH-202602',
      familyUserId: familyUser2.id,
      fullName: 'Usman Kasi',
      phone: '+44 7700 900881',
      email: 'usman.demo@saharacare.example',
      city: 'Quetta — Jinnah Town',
      elderlyAgeRange: '70–79 years',
      relationship: 'Son (Overseas)',
      serviceRequired: 'Companionship',
      preferredSchedule: 'Afternoon · 3 hrs/day',
      additionalInfo: 'Looking for Urdu/Pashto-speaking female caregiver for mother.',
      consentGiven: true,
      status: 'Assessment Scheduled',
      assignedCaregiverId: insertedCaregivers[3].id,
    },
    {
      referenceCode: 'SAH-202603',
      fullName: 'Hina Waqar',
      phone: '+92 300 0000512',
      email: 'hina.sample@example.com',
      city: 'Karachi — Clifton Block 5',
      elderlyAgeRange: '80+ years',
      relationship: 'Daughter',
      serviceRequired: 'Doctor Home Visit',
      preferredSchedule: 'Flexible Weekday',
      additionalInfo: 'Requesting initial assessment and GP review for elderly father.',
      consentGiven: true,
      status: 'Pending',
    },
  ]);

  // 7. Seed Visit Records (includes exact example date/time from prompt)
  await db.insert(visitRecords).values([
    {
      elderlyId: insertedElderly[0].id,
      caregiverId: insertedCaregivers[0].id,
      scheduledDate: '26 November 2026',
      scheduledTime: '10:00 AM',
      checkInTime: '10:05 AM',
      checkOutTime: '12:00 PM',
      status: 'Completed',
      bpReading: '118/76 mmHg',
      pulseReading: '72 bpm',
      tempReading: '98.4 °F',
      careSummary:
        'Sample record: Assistance with agreed daily activities, morning walk, medication reminders, and companionship.',
    },
    {
      elderlyId: insertedElderly[0].id,
      caregiverId: insertedCaregivers[0].id,
      scheduledDate: '27 November 2026',
      scheduledTime: '10:00 AM',
      checkInTime: '',
      checkOutTime: '',
      status: 'Scheduled',
      bpReading: '',
      pulseReading: '',
      tempReading: '',
      careSummary: 'Upcoming morning routine, hydration tracking, and garden walk.',
    },
    {
      elderlyId: insertedElderly[1].id,
      caregiverId: insertedCaregivers[1].id,
      scheduledDate: '26 November 2026',
      scheduledTime: '09:00 AM',
      checkInTime: '09:02 AM',
      checkOutTime: '',
      status: 'In Progress',
      bpReading: '126/80 mmHg',
      pulseReading: '76 bpm',
      tempReading: '98.2 °F',
      careSummary: 'Sample record: Assisted with morning breakfast, knee stretches, and tea.',
    },
  ]);

  // 8. Seed Doctor Appointments
  await db.insert(appointments).values([
    {
      elderlyId: insertedElderly[0].id,
      doctorId: insertedDoctors[0].id,
      scheduledDate: '28 November 2026',
      scheduledTime: '11:30 AM',
      reason: 'Routine monthly GP home checkup and prescription review',
      status: 'Scheduled',
      consultationNotes: '',
      followUpNotes: '',
    },
    {
      elderlyId: insertedElderly[1].id,
      doctorId: insertedDoctors[1].id,
      scheduledDate: '22 November 2026',
      scheduledTime: '04:00 PM',
      reason: 'Knee stiffness review & blood pressure follow-up',
      status: 'Completed',
      consultationNotes:
        'Sample GP note: Vitals steady; advised warm compress and continued light seated mobility.',
      followUpNotes: 'Re-evaluate in 4 weeks; family summary shared with consent.',
    },
  ]);

  // 9. Seed Emergency Incidents
  await db.insert(emergencyIncidents).values([
    {
      elderlyId: insertedElderly[0].id,
      reportedBy: 'Ayesha Siddiqui (Caregiver)',
      title: 'Sample Incident: Mild dizziness during afternoon walk',
      location: 'DHA Phase 6 Residence, Karachi',
      severity: 'Urgent',
      escalationActions:
        'Seated client immediately, checked blood pressure (112/74), notified family coordinator & Care Desk, contacted partner GP for same-day guidance.',
      familyNotified: true,
      status: 'Reviewed & Closed',
    },
  ]);

  // 10. Seed Invoices (Deposits strictly separated from Revenue)
  await db.insert(invoices).values([
    {
      invoiceNumber: 'INV-2026-101',
      familyName: 'Tariq Mahmood Family (Sample)',
      elderlyId: insertedElderly[0].id,
      description: 'Family Peace Plan — November 2026 + Refundable Security Deposit',
      amountPkr: 20000,
      securityDepositPkr: 10000,
      category: 'Subscription',
      status: 'Paid',
      dueDate: '01 Nov 2026',
    },
    {
      invoiceNumber: 'INV-2026-102',
      familyName: 'Tariq Mahmood Family (Sample)',
      elderlyId: insertedElderly[0].id,
      description: 'Doctor Home Visit Coordination (Dr. Sana Iqbal)',
      amountPkr: 3500,
      securityDepositPkr: 0,
      category: 'Doctor Coordination',
      status: 'Paid',
      dueDate: '24 Nov 2026',
    },
    {
      invoiceNumber: 'INV-2026-103',
      familyName: 'Salma Begum Family (Sample)',
      elderlyId: insertedElderly[1].id,
      description: 'Extended Care Subscription — November 2026',
      amountPkr: 35000,
      securityDepositPkr: 0,
      category: 'Subscription',
      status: 'Pending',
      dueDate: '30 Nov 2026',
    },
  ]);

  // 11. Seed Caregiver Applications
  await db.insert(caregiverApplications).values([
    {
      fullName: 'Saima Noreen (Sample)',
      phone: '+92 312 0000771',
      email: 'saima.applicant@example.com',
      city: 'Karachi',
      education: 'Intermediate + Home Nursing Certificate',
      experience: '4 years assisting elderly parents in private homes',
      certifications: 'First Aid & Vital Signs Course',
      availability: 'Full-Time / Half-Day',
      languages: 'Urdu, English',
      referencesInfo: '2 verifiable family references available',
      resumeFilename: 'saima-noreen-cv.pdf',
      status: 'Screening',
    },
    {
      fullName: 'Tariq Aziz (Sample)',
      phone: '+92 345 0000772',
      email: 'tariq.applicant@example.com',
      city: 'Lahore',
      education: 'Matric + Physiotherapy Aide Diploma',
      experience: '3 years geriatric mobility support',
      certifications: 'Basic Life Support (BLS)',
      availability: 'Morning Shifts',
      languages: 'Urdu, Punjabi',
      referencesInfo: 'Clinic supervisor reference',
      resumeFilename: 'tariq-aziz-resume.pdf',
      status: 'Submitted',
    },
  ]);

  // 12. Seed Messages
  await db.insert(messages).values([
    {
      senderName: 'Zara Tariq (Sample Family)',
      senderEmail: 'family.demo@saharacare.example',
      senderRole: 'family',
      subject: 'Thursday GP home visit timing',
      body: 'Could Dr. Sana confirm arrival between 11:30 AM and 12:00 PM PKT so I can join via video from London?',
      status: 'Unread',
    },
  ]);

  // 13. Seed Editable Website Content
  await db.insert(siteContent).values([
    {
      key: 'hero_headline',
      title: 'Because Your Parents Deserve the Best Care.',
      body: 'Reliable elderly home-care services, trusted caregivers, healthcare support, and family peace of mind — all connected through one platform.',
    },
    {
      key: 'announcement',
      title: 'Karachi Pilot Onboarding Open',
      body: 'Currently welcoming families in Karachi (DHA & Clifton) and accepting waitlist inquiries for Lahore, Islamabad, and Quetta.',
    },
    {
      key: 'contact_info',
      title: 'Official Contact Placeholders',
      body: JSON.stringify({
        email: '[hello@saharacare.example — Editable in Admin]',
        phone: '[+92 XXX XXXXXXX — Official Care Desk Placeholder]',
        whatsapp: '[+92 XXX XXXXXXX — Family Coordination WhatsApp Placeholder]',
        address: '[Office Address Placeholder, Karachi, Pakistan]',
      }),
    },
  ]);

  // 14. Seed Audit Logs
  await db.insert(auditLogs).values([
    {
      actorEmail: 'admin.demo@saharacare.example',
      actorRole: 'admin',
      action: 'ASSIGN_CAREGIVER',
      targetEntity: 'Booking #SAH-202601',
      details: 'Assigned Ayesha Siddiqui after family review of verified profile.',
    },
    {
      actorEmail: 'admin.demo@saharacare.example',
      actorRole: 'admin',
      action: 'REVIEW_INCIDENT',
      targetEntity: 'Incident #1',
      details: 'Verified family notification and GP follow-up; marked incident Reviewed & Closed.',
    },
  ]);
}
