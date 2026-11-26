import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  ShieldCheck,
  Stethoscope,
  UserCog,
  Users,
} from 'lucide-react';
import { ResilientImage } from '../components/ResilientImage';
import { AppRoute, DbSiteContent } from '../types/sahara';
import { useAuth } from '../context/AuthContext';

interface PageProps {
  onNavigate: (path: AppRoute) => void;
  siteContent?: DbSiteContent[];
}

export const BookAssessmentPage: React.FC<PageProps> = ({ onNavigate }) => {
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: 'Karachi',
    elderlyAgeRange: '70–79 years',
    relationship: 'Son / Daughter',
    serviceRequired: 'Personal Elderly Care',
    preferredSchedule: 'Morning · 4 hrs/day (Family Peace Plan)',
    additionalInfo: '',
    consentGiven: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [refCode, setRefCode] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/public/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Could not submit booking request.');
      }
      setRefCode(data.booking.referenceCode);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="mb-8">
        <p className="text-xs font-semibold text-[#239B56] mb-2">Care Assessment Request</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1A5276]">
          Book a Care Assessment
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[#243342]/85 max-w-2xl">
          Share basic coordination details below. To protect your parent&apos;s privacy, please do
          not include detailed medical diagnoses in this public form.
        </p>
      </div>

      {refCode ? (
        <div className="rounded-2xl border-2 border-[#239B56] bg-[#D5F5E3]/30 p-8 space-y-4">
          <div className="flex items-center gap-3 text-[#239B56]">
            <CheckCircle2 className="w-7 h-7 shrink-0" />
            <h2 className="font-display text-2xl font-bold text-[#1A5276]">
              Assessment Request Saved · Reference {refCode}
            </h2>
          </div>
          <p className="text-sm text-[#243342]/90 max-w-2xl leading-relaxed">
            Your booking request has been saved to the Sahara database under reference{' '}
            <span className="font-mono font-semibold">{refCode}</span>. Automated email/WhatsApp
            notifications are sent only when external messaging credentials are configured.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigate('/login')}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-[#1A5276] rounded-xl hover:bg-[#14405D] cursor-pointer"
            >
              Preview Family &amp; Admin Portals
            </button>
            <button
              type="button"
              onClick={() => setRefCode(null)}
              className="px-5 py-2.5 text-sm font-semibold text-[#1A5276] border border-slate-300 rounded-xl bg-white cursor-pointer"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 sm:p-8 space-y-5"
        >
          {error && (
            <div className="rounded-xl bg-amber-50 border border-amber-300 px-4 py-3 text-sm text-amber-900">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="bk-name" className="block text-sm font-semibold text-[#1A5276] mb-1">
                Your Full Name *
              </label>
              <input
                id="bk-name"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="e.g., Zara Tariq"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm"
              />
            </div>

            <div>
              <label htmlFor="bk-phone" className="block text-sm font-semibold text-[#1A5276] mb-1">
                Phone / WhatsApp Number *
              </label>
              <input
                id="bk-phone"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+92 300 0000000 or +44..."
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm"
              />
            </div>

            <div>
              <label htmlFor="bk-email" className="block text-sm font-semibold text-[#1A5276] mb-1">
                Email Address *
              </label>
              <input
                id="bk-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="name@example.com"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm"
              />
            </div>

            <div>
              <label htmlFor="bk-city" className="block text-sm font-semibold text-[#1A5276] mb-1">
                City (Elderly Parent&apos;s Residence) *
              </label>
              <select
                id="bk-city"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm"
              >
                <option value="Karachi">Karachi</option>
                <option value="Lahore">Lahore</option>
                <option value="Islamabad / Rawalpindi">Islamabad / Rawalpindi</option>
                <option value="Quetta">Quetta</option>
                <option value="Peshawar">Peshawar</option>
                <option value="Multan / Faisalabad / Other">Multan / Faisalabad / Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="bk-age" className="block text-sm font-semibold text-[#1A5276] mb-1">
                Elderly Person&apos;s Age Range *
              </label>
              <select
                id="bk-age"
                value={form.elderlyAgeRange}
                onChange={(e) => setForm({ ...form, elderlyAgeRange: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm"
              >
                <option value="60–69 years">60–69 years</option>
                <option value="70–79 years">70–79 years</option>
                <option value="80+ years">80+ years</option>
              </select>
            </div>

            <div>
              <label htmlFor="bk-rel" className="block text-sm font-semibold text-[#1A5276] mb-1">
                Relationship to Elderly Person *
              </label>
              <input
                id="bk-rel"
                required
                value={form.relationship}
                onChange={(e) => setForm({ ...form, relationship: e.target.value })}
                placeholder="e.g., Son (Overseas UK), Daughter, Spouse"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm"
              />
            </div>

            <div>
              <label htmlFor="bk-srv" className="block text-sm font-semibold text-[#1A5276] mb-1">
                Service Required *
              </label>
              <select
                id="bk-srv"
                value={form.serviceRequired}
                onChange={(e) => setForm({ ...form, serviceRequired: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm"
              >
                <option value="Personal Elderly Care">Personal Elderly Care</option>
                <option value="Caregiver Support">Caregiver Support</option>
                <option value="Doctor Home Visit">Doctor Home Visit</option>
                <option value="Companionship">Companionship</option>
                <option value="Emergency Support Information">Emergency Support Information</option>
                <option value="Custom Care Plan">Custom Care Plan</option>
              </select>
            </div>

            <div>
              <label htmlFor="bk-sch" className="block text-sm font-semibold text-[#1A5276] mb-1">
                Preferred Care Schedule *
              </label>
              <select
                id="bk-sch"
                value={form.preferredSchedule}
                onChange={(e) => setForm({ ...form, preferredSchedule: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm"
              >
                <option value="Morning · 3 hrs/day (Basic Care)">
                  Morning · 3 hrs/day (Basic Care)
                </option>
                <option value="Morning · 4 hrs/day (Family Peace Plan)">
                  Morning · 4 hrs/day (Family Peace Plan)
                </option>
                <option value="Daytime · 8 hrs/day (Extended Care)">
                  Daytime · 8 hrs/day (Extended Care)
                </option>
                <option value="Live-In Care Inquiry">Live-In Care Inquiry</option>
                <option value="Single Doctor Home Visit">Single Doctor Home Visit</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="bk-info" className="block text-sm font-semibold text-[#1A5276] mb-1">
              Additional Non-Medical Notes (Optional)
            </label>
            <textarea
              id="bk-info"
              rows={3}
              value={form.additionalInfo}
              onChange={(e) => setForm({ ...form, additionalInfo: e.target.value })}
              placeholder="Preferred caregiver language, neighbourhood, or best time zone to reach your family..."
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm"
            />
          </div>

          <label className="flex items-start gap-3 text-sm text-[#243342]/90 cursor-pointer">
            <input
              type="checkbox"
              checked={form.consentGiven}
              onChange={(e) => setForm({ ...form, consentGiven: e.target.checked })}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-[#1A5276]"
            />
            <span>
              I consent to Sahara Senior Care contacting me to coordinate a care assessment in
              accordance with the Privacy Policy.
            </span>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#1A5276] rounded-xl hover:bg-[#14405D] disabled:opacity-60 cursor-pointer"
          >
            <span>{submitting ? 'Submitting Request...' : 'Submit Assessment Request'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  );
};

export const CaregiverApplyPage: React.FC<PageProps> = () => {
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: 'Karachi',
    education: '',
    experience: '',
    certifications: '',
    availability: 'Full-Time Daytime',
    languages: 'Urdu',
    referencesInfo: '',
    resumeFilename: '',
    consent: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedAppId, setSubmittedAppId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/public/caregiver-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not submit application.');
      setSubmittedAppId(data.application.id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Submission error.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6">
          <p className="text-xs font-semibold text-[#239B56] mb-2">Career &amp; Screening</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1A5276]">
            Become a Sahara Caregiver
          </h1>
          <p className="mt-3 text-base text-[#243342]/85 leading-relaxed">
            Join a dignified, structured care team supporting Pakistani senior citizens. Every
            applicant undergoes manual review, interview, reference verification, and screening
            before placement.
          </p>
          <p className="mt-3 text-xs text-[#243342]/75">
            Review Pipeline: Submitted → Under Review → Interview → Screening → Approved
          </p>
        </div>
        <div className="lg:col-span-6 h-64 sm:h-72 rounded-2xl overflow-hidden border border-slate-200">
          <ResilientImage
            src="/src/assets/images/caregiver_team_sahara_1795689987591.jpg"
            alt="Sahara Senior Care trained caregivers in uniform"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {submittedAppId ? (
        <div className="rounded-2xl border-2 border-[#239B56] bg-[#D5F5E3]/30 p-8 space-y-3">
          <h2 className="font-display text-2xl font-bold text-[#1A5276]">
            Application Received (Status: Submitted)
          </h2>
          <p className="text-sm text-[#243342]/90">
            Application #{submittedAppId} has been recorded for manual review by our Care Operations
            team. Applicants are never auto-approved; our coordinator contacts shortlisted
            candidates for interview and reference checks.
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 sm:p-8 space-y-5"
        >
          {error && (
            <div className="rounded-xl bg-amber-50 border border-amber-300 px-4 py-3 text-sm text-amber-900">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-semibold text-[#1A5276] mb-1">Full Name *</label>
              <input
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1A5276] mb-1">Phone *</label>
              <input
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1A5276] mb-1">Email *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1A5276] mb-1">City *</label>
              <input
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1A5276] mb-1">Education *</label>
              <input
                required
                value={form.education}
                onChange={(e) => setForm({ ...form, education: e.target.value })}
                placeholder="e.g., Intermediate / Home Nursing"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1A5276] mb-1">
                Availability *
              </label>
              <select
                value={form.availability}
                onChange={(e) => setForm({ ...form, availability: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm"
              >
                <option value="Full-Time Daytime">Full-Time Daytime</option>
                <option value="Half-Day Morning">Half-Day Morning</option>
                <option value="Half-Day Evening">Half-Day Evening</option>
                <option value="Live-In Rotation">Live-In Rotation</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-[#1A5276] mb-1">
                Relevant Caregiving Experience *
              </label>
              <textarea
                required
                rows={2}
                value={form.experience}
                onChange={(e) => setForm({ ...form, experience: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1A5276] mb-1">
                Training or Certifications
              </label>
              <textarea
                rows={2}
                value={form.certifications}
                onChange={(e) => setForm({ ...form, certifications: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1A5276] mb-1">Languages *</label>
              <input
                required
                value={form.languages}
                onChange={(e) => setForm({ ...form, languages: e.target.value })}
                placeholder="e.g., Urdu, English, Sindhi"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1A5276] mb-1">
                References (2 verifiable contacts) *
              </label>
              <input
                required
                value={form.referencesInfo}
                onChange={(e) => setForm({ ...form, referencesInfo: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1A5276] mb-1">
              Resume / CV File (PDF or DOCX)
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) =>
                setForm({ ...form, resumeFilename: e.target.files?.[0]?.name || '' })
              }
              className="block text-sm text-[#243342]"
            />
          </div>

          <label className="flex items-start gap-3 text-sm text-[#243342]/90 cursor-pointer">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(e) => setForm({ ...form, consent: e.target.checked })}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-[#1A5276]"
            />
            <span>
              I confirm all details are accurate and consent to identity, reference, and background
              screening checks.
            </span>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3.5 text-sm font-semibold text-white bg-[#239B56] rounded-xl hover:bg-[#1D8348] disabled:opacity-60 cursor-pointer"
          >
            {submitting ? 'Submitting Application...' : 'Submit Caregiver Application'}
          </button>
        </form>
      )}
    </div>
  );
};

export const ContactPage: React.FC<PageProps> = ({ siteContent = [] }) => {
  const contactItem = siteContent.find((c) => c.key === 'contact_info');
  let placeholders = {
    email: '[hello@saharacare.example — Editable Placeholder]',
    phone: '[+92 XXX XXXXXXX — Official Phone Placeholder]',
    whatsapp: '[+92 XXX XXXXXXX — WhatsApp Placeholder]',
    address: '[Office Address Placeholder, Pakistan]',
  };
  if (contactItem) {
    try {
      placeholders = { ...placeholders, ...JSON.parse(contactItem.body) };
    } catch {
      // keep default placeholders
    }
  }

  const [form, setForm] = useState({
    senderName: '',
    senderEmail: '',
    subject: '',
    body: '',
  });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await fetch('/api/public/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Could not send message.');
      return;
    }
    setSent(true);
    setForm({ senderName: '', senderEmail: '', subject: '', body: '' });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-5 space-y-6">
        <div>
          <p className="text-xs font-semibold text-[#2E86C1] mb-2">Contact Sahara Senior Care</p>
          <h1 className="font-display text-3xl font-bold text-[#1A5276]">Get in Touch</h1>
          <p className="mt-2 text-sm text-[#243342]/85 leading-relaxed">
            Reach out for family inquiries, doctor partnerships, or institutional collaborations.
            Official contact placeholders below can be updated directly from the Admin Console.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 space-y-4 text-sm">
          <div>
            <p className="text-xs font-semibold text-slate-500">Business Email</p>
            <p className="font-mono text-[#1A5276]">{placeholders.email}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Official Phone</p>
            <p className="font-mono text-[#1A5276]">{placeholders.phone}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">WhatsApp Contact</p>
            <p className="font-mono text-[#1A5276]">{placeholders.whatsapp}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Office Address</p>
            <p className="text-[#243342]">{placeholders.address}</p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-7">
        {sent ? (
          <div className="rounded-2xl border-2 border-[#239B56] bg-[#D5F5E3]/30 p-8">
            <h2 className="font-display text-xl font-bold text-[#1A5276]">
              Message Recorded in Admin Inbox
            </h2>
            <p className="mt-2 text-sm text-[#243342]/85">
              Thank you for contacting Sahara Senior Care. Your inquiry is visible to our
              coordinators inside the Admin Console.
            </p>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="mt-4 px-4 py-2 text-sm font-semibold text-[#1A5276] border border-slate-300 bg-white rounded-lg cursor-pointer"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 sm:p-8 space-y-4"
          >
            {error && (
              <div className="rounded-xl bg-amber-50 border border-amber-300 px-4 py-3 text-sm text-amber-900">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#1A5276] mb-1">Name *</label>
                <input
                  required
                  value={form.senderName}
                  onChange={(e) => setForm({ ...form, senderName: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1A5276] mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={form.senderEmail}
                  onChange={(e) => setForm({ ...form, senderEmail: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1A5276] mb-1">Subject *</label>
              <input
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1A5276] mb-1">Message *</label>
              <textarea
                required
                rows={4}
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 text-sm font-semibold text-white bg-[#1A5276] rounded-xl hover:bg-[#14405D] cursor-pointer"
            >
              Send Inquiry
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export const LoginPage: React.FC<PageProps> = ({ onNavigate }) => {
  const { signInWithGoogle, enterDemoWorkspace, loading, error, clearError } = useAuth();

  const handleGoogleSignIn = async () => {
    const res = await signInWithGoogle();
    if (!res) return;
    if (res.role === 'admin' || res.role === 'super_admin') onNavigate('/admin');
    else if (res.role === 'caregiver') onNavigate('/caregiver');
    else if (res.role === 'doctor') onNavigate('/doctor');
    else onNavigate('/portal');
  };

  const handleDemo = async (
    role: 'admin' | 'family' | 'caregiver' | 'doctor',
    target: AppRoute
  ) => {
    const res = await enterDemoWorkspace(role);
    if (res) onNavigate(target);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold text-[#239B56] mb-2">
          Role-Based Portals &amp; Interactive Demo Environment
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1A5276]">
          Sign In or Explore Sample Dashboards
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[#243342]/85 leading-relaxed">
          Sign in securely with Google for your account, or enter any of the four interactive
          sample demo workspaces designed for families, investors, and NIC reviewers.
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-amber-50 border border-amber-300 px-4 py-3 text-sm text-amber-900 flex items-center justify-between gap-4">
          <span>{error}</span>
          <button type="button" onClick={clearError} className="underline text-xs cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Real Google Sign-In Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="font-display text-xl font-bold text-[#1A5276]">
            Account Sign-In (Firebase Authentication)
          </h2>
          <p className="mt-1 text-sm text-[#243342]/80">
            Authenticate with your Google account to access role-protected dashboards and live
            PostgreSQL records.
          </p>
        </div>
        <button
          type="button"
          disabled={loading}
          onClick={handleGoogleSignIn}
          className="px-6 py-3 text-sm font-semibold text-white bg-[#1A5276] rounded-xl hover:bg-[#14405D] whitespace-nowrap shrink-0 disabled:opacity-60 cursor-pointer"
        >
          {loading ? 'Signing In...' : 'Sign In with Google'}
        </button>
      </div>

      {/* Clearly Labeled Demo Mode Accounts */}
      <div className="rounded-2xl border border-[#2E86C1]/30 bg-[#EBF5FB]/75 p-6 sm:p-8 space-y-6">
        <div>
          <p className="text-xs font-semibold text-[#1A5276]">
            Sample Demonstration Mode — Fictional Records Only
          </p>
          <h2 className="mt-1 font-display text-xl font-bold text-[#1A5276]">
            Select a Role Workspace to Preview
          </h2>
          <p className="mt-1 text-sm text-[#243342]/80">
            All names, visits, vitals, and invoices inside Demo Mode are fictional sample data for
            platform evaluation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleDemo('family', '/portal')}
            className="text-left rounded-2xl bg-white border border-slate-200 p-5 hover:border-[#2E86C1] transition-colors cursor-pointer"
          >
            <Users className="w-6 h-6 text-[#2E86C1] mb-3" />
            <h3 className="font-display font-bold text-base text-[#1A5276]">Family Dashboard</h3>
            <p className="mt-1 text-xs text-[#243342]/80">
              Zara Tariq (Demo) · Visit history, vitals, invoices &amp; doctor requests.
            </p>
            <p className="mt-3 text-xs font-semibold text-[#2E86C1]">Open Family Demo →</p>
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => handleDemo('caregiver', '/caregiver')}
            className="text-left rounded-2xl bg-white border border-slate-200 p-5 hover:border-[#239B56] transition-colors cursor-pointer"
          >
            <ClipboardCheck className="w-6 h-6 text-[#239B56] mb-3" />
            <h3 className="font-display font-bold text-base text-[#1A5276]">Caregiver Dashboard</h3>
            <p className="mt-1 text-xs text-[#243342]/80">
              Ayesha Siddiqui (Demo) · Assigned visits, check-in/out, care notes &amp; incidents.
            </p>
            <p className="mt-3 text-xs font-semibold text-[#239B56]">Open Caregiver Demo →</p>
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => handleDemo('doctor', '/doctor')}
            className="text-left rounded-2xl bg-white border border-slate-200 p-5 hover:border-[#1A5276] transition-colors cursor-pointer"
          >
            <Stethoscope className="w-6 h-6 text-[#1A5276] mb-3" />
            <h3 className="font-display font-bold text-base text-[#1A5276]">Doctor Portal</h3>
            <p className="mt-1 text-xs text-[#243342]/80">
              Dr. Sana Iqbal (Demo) · Consented appointments, clinical notes &amp; follow-ups.
            </p>
            <p className="mt-3 text-xs font-semibold text-[#1A5276]">Open Doctor Demo →</p>
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => handleDemo('admin', '/admin')}
            className="text-left rounded-2xl bg-[#1A5276] text-white p-5 hover:bg-[#14405D] transition-colors cursor-pointer"
          >
            <UserCog className="w-6 h-6 text-[#D5F5E3] mb-3" />
            <h3 className="font-display font-bold text-base">Admin Console (/admin)</h3>
            <p className="mt-1 text-xs text-slate-200">
              Sara Mansoor (Demo) · Full CRM, bookings, pricing, finance, incidents &amp; CMS.
            </p>
            <p className="mt-3 text-xs font-semibold text-[#D5F5E3]">Open Admin Demo →</p>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#243342]/75">
          <ShieldCheck className="w-4 h-4 text-[#239B56] shrink-0" />
          <span>
            Role-based access control is enforced server-side on every dashboard API endpoint.
          </span>
        </div>
      </div>
    </div>
  );
};
