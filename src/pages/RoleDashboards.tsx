import React, { useCallback, useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileText,
  HeartPulse,
  LogOut,
  MessageSquare,
  ShieldAlert,
  Stethoscope,
  UserCheck,
} from 'lucide-react';
import { SaharaLogo } from '../components/SaharaLogo';
import { ResilientImage } from '../components/ResilientImage';
import { useAuth } from '../context/AuthContext';
import {
  AppRoute,
  DbAppointment,
  DbCaregiverProfile,
  DbDoctorProfile,
  DbElderlyProfile,
  DbIncident,
  DbInvoice,
  DbMessage,
  DbVisitRecord,
} from '../types/sahara';

interface DashboardProps {
  onNavigate: (path: AppRoute) => void;
}

const DashboardAuthGate: React.FC<{
  title: string;
  role: 'family' | 'caregiver' | 'doctor' | 'admin';
  onNavigate: (path: AppRoute) => void;
}> = ({ title, role, onNavigate }) => {
  const { enterDemoWorkspace, signInWithGoogle, loading, error } = useAuth();
  return (
    <div className="min-h-screen bg-[#EAF7F0] flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5">
        <SaharaLogo showTagline />
        <div>
          <h1 className="font-display text-2xl font-bold text-[#1A5276]">{title}</h1>
          <p className="mt-1.5 text-sm text-[#243342]/80">
            This portal requires authentication. Sign in with Google or launch the clearly marked
            fictional sample demo workspace for this role.
          </p>
        </div>
        {error && (
          <div className="rounded-xl bg-amber-50 border border-amber-300 px-3.5 py-2.5 text-xs text-amber-900">
            {error}
          </div>
        )}
        <div className="space-y-3">
          <button
            type="button"
            disabled={loading}
            onClick={() => enterDemoWorkspace(role)}
            className="w-full py-3 px-4 text-sm font-semibold text-white bg-[#1A5276] rounded-xl hover:bg-[#14405D] cursor-pointer"
          >
            {loading ? 'Starting Session...' : `Open Sample ${role.toUpperCase()} Demo Workspace`}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => signInWithGoogle()}
            className="w-full py-3 px-4 text-sm font-semibold text-[#1A5276] border border-slate-300 rounded-xl hover:bg-slate-50 cursor-pointer"
          >
            Sign In with Google Account
          </button>
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="w-full py-2 text-xs font-medium text-slate-600 hover:text-[#1A5276] cursor-pointer"
          >
            ← Return to Public Website
          </button>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   1. FAMILY DASHBOARD (/portal)
============================================================================ */
export const FamilyDashboardPage: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { principal, token, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [elders, setElders] = useState<DbElderlyProfile[]>([]);
  const [caregivers, setCaregivers] = useState<DbCaregiverProfile[]>([]);
  const [doctors, setDoctors] = useState<DbDoctorProfile[]>([]);
  const [visits, setVisits] = useState<DbVisitRecord[]>([]);
  const [appointments, setAppointments] = useState<DbAppointment[]>([]);
  const [invoices, setInvoices] = useState<DbInvoice[]>([]);
  const [messages, setMessages] = useState<DbMessage[]>([]);

  const [selectedElderId, setSelectedElderId] = useState<number | null>(null);
  const [sosBanner, setSosBanner] = useState(false);

  const [apptForm, setApptForm] = useState({
    scheduledDate: '30 November 2026',
    scheduledTime: '11:00 AM',
    reason: '',
  });
  const [msgText, setMsgText] = useState('');
  const [feedbackBanner, setFeedbackBanner] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/dashboard/family', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Unable to fetch family records.');
      const data = await res.json();
      setElders(data.elderlyProfiles || []);
      setCaregivers(data.caregivers || []);
      setDoctors(data.doctors || []);
      setVisits(data.visits || []);
      setAppointments(data.appointments || []);
      setInvoices(data.invoices || []);
      setMessages(data.messages || []);
      if (data.elderlyProfiles?.length && !selectedElderId) {
        setSelectedElderId(data.elderlyProfiles[0].id);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard.');
    } finally {
      setLoading(false);
    }
  }, [token, selectedElderId]);

  useEffect(() => {
    if (token && (principal?.role === 'family' || principal?.role === 'admin')) {
      loadData();
    }
  }, [token, principal, loadData]);

  if (!principal || !token || !['family', 'admin', 'super_admin'].includes(principal.role)) {
    return <DashboardAuthGate title="Family Monitoring Portal" role="family" onNavigate={onNavigate} />;
  }

  const activeElder = elders.find((e) => e.id === selectedElderId) ?? elders[0];
  const elderVisits = activeElder ? visits.filter((v) => v.elderlyId === activeElder.id) : [];
  const elderAppts = activeElder ? appointments.filter((a) => a.elderlyId === activeElder.id) : [];
  const latestVisit = elderVisits[0];
  const assignedCg = caregivers.find((c) => c.id === latestVisit?.caregiverId) ?? caregivers[0];
  const elderInvoices = activeElder
    ? invoices.filter((i) => i.elderlyId === activeElder.id || i.elderlyId === null)
    : invoices;

  const handleRequestAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeElder || !apptForm.reason.trim()) return;
    const res = await fetch('/api/dashboard/family/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        elderlyId: activeElder.id,
        doctorId: doctors[0]?.id ?? null,
        ...apptForm,
      }),
    });
    if (res.ok) {
      setApptForm({ ...apptForm, reason: '' });
      setFeedbackBanner('Doctor home-visit request logged with coordinator.');
      loadData();
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgText.trim()) return;
    const res = await fetch('/api/public/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderName: principal.fullName,
        senderEmail: principal.email,
        senderRole: 'family',
        subject: `Family Portal Note · ${activeElder?.fullName || 'Parent'}`,
        body: msgText.trim(),
      }),
    });
    if (res.ok) {
      setMsgText('');
      setFeedbackBanner('Message sent to your Sahara Care Coordinator.');
      loadData();
    }
  };

  return (
    <div className="min-h-screen bg-[#EAF7F0] text-[#243342]">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="text-sm font-medium text-[#1A5276] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Website</span>
            </button>
            <span className="text-slate-300">|</span>
            <span className="font-display font-bold text-[#1A5276] text-sm sm:text-base">
              Family Dashboard
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSosBanner((p) => !p)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#E74C3C] text-white hover:bg-[#c0392b] cursor-pointer whitespace-nowrap"
            >
              {sosBanner ? 'Dismiss Demo Emergency' : 'Emergency Escalation Info'}
            </button>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1A5276] border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
        {principal.isDemo && (
          <div className="rounded-xl bg-[#EBF5FB] border border-[#2E86C1]/30 px-4 py-3 text-xs sm:text-sm text-[#1A5276] flex flex-wrap items-center justify-between gap-2">
            <span>
              <strong>Sample Demo Mode:</strong> Fictional family &amp; visit records shown for
              demonstration—not real customer or medical data.
            </span>
            <span className="font-mono text-xs">{principal.email}</span>
          </div>
        )}

        {sosBanner && (
          <div
            role="alert"
            className="rounded-2xl bg-[#E74C3C] text-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-6 h-6 shrink-0 mt-0.5" />
              <div>
                <h2 className="font-display font-bold text-base">
                  Emergency Escalation Coordination Protocol (Demo Preview)
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-white/95">
                  Alerts are routed to the assigned caregiver, authorized family contacts, and the
                  care coordination desk. Instant ambulance arrival or medical outcomes are not
                  guaranteed.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSosBanner(false)}
              className="px-4 py-2 text-xs font-semibold bg-white text-[#243342] rounded-lg shrink-0 cursor-pointer"
            >
              Close
            </button>
          </div>
        )}

        {feedbackBanner && (
          <div className="rounded-xl bg-[#D5F5E3] border border-[#239B56]/30 px-4 py-3 text-sm text-[#1A5276] flex items-center justify-between">
            <span>{feedbackBanner}</span>
            <button
              type="button"
              onClick={() => setFeedbackBanner(null)}
              className="text-xs font-semibold underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-amber-50 border border-amber-300 px-4 py-3 text-sm text-amber-900">
            {error}
          </div>
        )}

        {/* Senior Switcher & Profile Header */}
        <section className="rounded-2xl bg-white border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 shrink-0">
              <ResilientImage
                src="/src/assets/images/senior_profile_tariq_1795688297311.jpg"
                alt={activeElder?.fullName || 'Senior profile'}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="font-display text-xl sm:text-2xl font-bold text-[#1A5276]">
                {activeElder ? activeElder.fullName : loading ? 'Loading profile...' : 'No linked profile'}
              </h1>
              {activeElder && (
                <p className="text-sm text-[#243342]/80 mt-0.5">
                  Age {activeElder.age} · {activeElder.neighbourhood}, {activeElder.city} · Emergency
                  Contact: {activeElder.emergencyContactName} ({activeElder.emergencyContactPhone})
                </p>
              )}
            </div>
          </div>

          {elders.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {elders.map((el) => (
                <button
                  key={el.id}
                  type="button"
                  onClick={() => setSelectedElderId(el.id)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg border cursor-pointer ${
                    activeElder?.id === el.id
                      ? 'bg-[#1A5276] text-white border-[#1A5276]'
                      : 'bg-[#F8FAFC] text-[#1A5276] border-slate-200'
                  }`}
                >
                  {el.fullName}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* 6 Requested Overview Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="rounded-2xl bg-white border border-slate-200 p-5">
            <div className="flex items-center justify-between text-xs font-semibold text-[#239B56]">
              <span>1. Today&apos;s Care Visit</span>
              <Clock className="w-4 h-4" />
            </div>
            <p className="mt-2 font-display text-lg font-bold text-[#1A5276]">
              {latestVisit ? `${latestVisit.scheduledTime} · ${latestVisit.status}` : 'No visit today'}
            </p>
            <p className="mt-1 text-xs text-[#243342]/80">
              {latestVisit?.scheduledDate} · Check-in: {latestVisit?.checkInTime || 'Pending'}
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 p-5">
            <div className="flex items-center justify-between text-xs font-semibold text-[#2E86C1]">
              <span>2. Caregiver Information</span>
              <UserCheck className="w-4 h-4" />
            </div>
            <p className="mt-2 font-display text-lg font-bold text-[#1A5276]">
              {assignedCg ? assignedCg.fullName : 'Pending Assignment'}
            </p>
            <p className="mt-1 text-xs text-[#243342]/80">
              {assignedCg ? `${assignedCg.verificationStatus} · ${assignedCg.languages}` : '—'}
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 p-5">
            <div className="flex items-center justify-between text-xs font-semibold text-[#1A5276]">
              <span>3. Next Appointment</span>
              <Calendar className="w-4 h-4" />
            </div>
            <p className="mt-2 font-display text-lg font-bold text-[#1A5276]">
              {elderAppts[0]
                ? `${elderAppts[0].scheduledDate} · ${elderAppts[0].scheduledTime}`
                : 'No upcoming appointment'}
            </p>
            <p className="mt-1 text-xs text-[#243342]/80">
              {elderAppts[0]?.reason || 'Request a doctor home visit below.'}
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 p-5">
            <div className="flex items-center justify-between text-xs font-semibold text-[#239B56]">
              <span>4. Recent Care Updates</span>
              <HeartPulse className="w-4 h-4" />
            </div>
            <p className="mt-2 font-mono tabular-nums text-sm font-semibold text-[#1A5276]">
              {latestVisit?.bpReading || 'BP 118/76'} · {latestVisit?.pulseReading || '72 bpm'} ·{' '}
              {latestVisit?.tempReading || '98.4 °F'}
            </p>
            <p className="mt-1 text-xs text-[#243342]/80 line-clamp-2">
              {latestVisit?.careSummary || 'Routine daily update.'}
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 p-5">
            <div className="flex items-center justify-between text-xs font-semibold text-[#2E86C1]">
              <span>5. Monthly Subscription</span>
              <FileText className="w-4 h-4" />
            </div>
            <p className="mt-2 font-display text-lg font-bold text-[#1A5276]">
              {activeElder?.carePlanName || 'Family Peace Plan'}
            </p>
            <p className="mt-1 text-xs text-[#243342]/80">
              {elderInvoices.length} invoice record(s) · Refundable deposits tracked separately
            </p>
          </div>

          <div className="rounded-2xl bg-[#D5F5E3]/45 border border-[#239B56]/25 p-5">
            <div className="flex items-center justify-between text-xs font-semibold text-[#239B56]">
              <span>6. Contact Coordinator</span>
              <MessageSquare className="w-4 h-4" />
            </div>
            <p className="mt-2 font-display text-base font-bold text-[#1A5276]">
              Dedicated Care Desk
            </p>
            <p className="mt-1 text-xs text-[#243342]/80">
              Use the message panel below to request schedule changes or share notes.
            </p>
          </div>
        </section>

        {/* Visit History Table */}
        <section className="rounded-2xl bg-white border border-slate-200 p-6">
          <h2 className="font-display text-lg font-bold text-[#1A5276]">
            Visit History (Sample Demonstration Records)
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-500">
                  <th className="py-2.5 pr-4">Date</th>
                  <th className="py-2.5 px-4">Scheduled</th>
                  <th className="py-2.5 px-4">Check-in / Out</th>
                  <th className="py-2.5 px-4">Vitals</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 pl-4">Care Summary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {elderVisits.map((v) => (
                  <tr key={v.id}>
                    <td className="py-3 pr-4 font-mono tabular-nums font-medium whitespace-nowrap">
                      {v.scheduledDate}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums whitespace-nowrap">
                      {v.scheduledTime}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums whitespace-nowrap text-xs">
                      {v.checkInTime || '—'} → {v.checkOutTime || '—'}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs">
                      {v.bpReading ? `${v.bpReading} · ${v.pulseReading}` : 'Pending'}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#239B56]">{v.status}</td>
                    <td className="py-3 pl-4 text-xs text-[#243342]/85">{v.careSummary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Interactive Actions: Doctor Request + Coordinator Message + Invoices */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <form
            onSubmit={handleRequestAppointment}
            className="lg:col-span-4 rounded-2xl bg-white border border-slate-200 p-6 space-y-4"
          >
            <h3 className="font-display text-base font-bold text-[#1A5276]">
              Request Doctor Home Appointment
            </h3>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Preferred Date
              </label>
              <input
                value={apptForm.scheduledDate}
                onChange={(e) => setApptForm({ ...apptForm, scheduledDate: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Preferred Time
              </label>
              <input
                value={apptForm.scheduledTime}
                onChange={(e) => setApptForm({ ...apptForm, scheduledTime: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Reason for Visit
              </label>
              <textarea
                required
                rows={2}
                value={apptForm.reason}
                onChange={(e) => setApptForm({ ...apptForm, reason: e.target.value })}
                placeholder="e.g., Routine BP checkup and prescription renewal"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#1A5276] rounded-xl hover:bg-[#14405D] cursor-pointer"
            >
              Request Doctor Visit
            </button>
          </form>

          <form
            onSubmit={handleSendMessage}
            className="lg:col-span-4 rounded-2xl bg-white border border-slate-200 p-6 space-y-4"
          >
            <h3 className="font-display text-base font-bold text-[#1A5276]">
              Message Care Coordinator / Request Schedule Change
            </h3>
            <textarea
              required
              rows={4}
              value={msgText}
              onChange={(e) => setMsgText(e.target.value)}
              placeholder="Write a schedule change request, emergency contact update, or note..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#239B56] rounded-xl hover:bg-[#1D8348] cursor-pointer"
            >
              Send Message to Coordinator
            </button>
            {messages.length > 0 && (
              <div className="pt-3 border-t border-slate-100 text-xs text-slate-600">
                Latest sent: <span className="font-medium text-[#1A5276]">{messages[0].subject}</span>
              </div>
            )}
          </form>

          <div className="lg:col-span-4 rounded-2xl bg-white border border-slate-200 p-6 space-y-3">
            <h3 className="font-display text-base font-bold text-[#1A5276]">
              Service Invoices (Sample)
            </h3>
            <div className="divide-y divide-slate-100">
              {elderInvoices.map((inv) => (
                <div key={inv.id} className="py-2.5 text-xs">
                  <div className="flex justify-between font-semibold text-[#1A5276]">
                    <span className="font-mono">{inv.invoiceNumber}</span>
                    <span className="font-mono tabular-nums">
                      PKR {inv.amountPkr.toLocaleString('en-PK')}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{inv.description}</p>
                  <p className="text-slate-500 mt-0.5">
                    Status: <span className="font-semibold text-[#239B56]">{inv.status}</span>
                    {inv.securityDepositPkr > 0 &&
                      ` · Refundable Deposit: PKR ${inv.securityDepositPkr.toLocaleString('en-PK')}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

/* ============================================================================
   2. CAREGIVER DASHBOARD (/caregiver)
============================================================================ */
export const CaregiverDashboardPage: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { principal, token, logout } = useAuth();
  const [caregiver, setCaregiver] = useState<DbCaregiverProfile | null>(null);
  const [clients, setClients] = useState<DbElderlyProfile[]>([]);
  const [visits, setVisits] = useState<DbVisitRecord[]>([]);
  const [incidents, setIncidents] = useState<DbIncident[]>([]);
  const [noteByVisit, setNoteByVisit] = useState<Record<number, string>>({});
  const [bpByVisit, setBpByVisit] = useState<Record<number, string>>({});
  const [incidentForm, setIncidentForm] = useState({
    elderlyId: 0,
    title: '',
    location: '',
    escalationActions: '',
  });
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const loadCaregiverData = useCallback(async () => {
    if (!token) return;
    const res = await fetch('/api/dashboard/caregiver', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;
    const data = await res.json();
    setCaregiver(data.caregiver || null);
    setClients(data.assignedClients || []);
    setVisits(data.visits || []);
    setIncidents(data.incidents || []);
    if (data.assignedClients?.[0] && !incidentForm.elderlyId) {
      setIncidentForm((prev) => ({ ...prev, elderlyId: data.assignedClients[0].id }));
    }
  }, [token, incidentForm.elderlyId]);

  useEffect(() => {
    if (token && ['caregiver', 'admin', 'super_admin'].includes(principal?.role || '')) {
      loadCaregiverData();
    }
  }, [token, principal, loadCaregiverData]);

  if (!principal || !token || !['caregiver', 'admin', 'super_admin'].includes(principal.role)) {
    return (
      <DashboardAuthGate title="Caregiver Operations Portal" role="caregiver" onNavigate={onNavigate} />
    );
  }

  const handleVisitAction = async (visitId: number, action: 'check_in' | 'check_out' | 'save') => {
    const res = await fetch(`/api/dashboard/caregiver/visits/${visitId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        action,
        careSummary: noteByVisit[visitId],
        bpReading: bpByVisit[visitId],
      }),
    });
    if (res.ok) {
      setStatusMsg(`Visit #${visitId} updated in PostgreSQL.`);
      loadCaregiverData();
    }
  };

  const handleReportIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/dashboard/caregiver/incidents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(incidentForm),
    });
    if (res.ok) {
      setIncidentForm({ ...incidentForm, title: '', location: '', escalationActions: '' });
      setStatusMsg('Incident logged and escalated to Care Coordinator.');
      loadCaregiverData();
    }
  };

  return (
    <div className="min-h-screen bg-[#EAF7F0] text-[#243342]">
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="text-sm font-medium text-[#1A5276] hover:underline cursor-pointer"
          >
            ← Website
          </button>
          <span className="font-display font-bold text-[#1A5276]">Caregiver Dashboard</span>
        </div>
        <button
          type="button"
          onClick={logout}
          className="px-3 py-1.5 text-xs font-semibold text-[#1A5276] border border-slate-300 rounded-lg cursor-pointer"
        >
          Sign Out
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {principal.isDemo && (
          <div className="rounded-xl bg-[#D5F5E3]/60 border border-[#239B56]/30 px-4 py-3 text-xs sm:text-sm text-[#1A5276]">
            <strong>Sample Caregiver Workspace:</strong> Only clients explicitly assigned to{' '}
            <strong>{caregiver?.fullName || principal.fullName}</strong> are visible here.
          </div>
        )}

        {statusMsg && (
          <div className="rounded-xl bg-[#D5F5E3] border border-[#239B56]/30 px-4 py-3 text-sm text-[#1A5276] flex justify-between">
            <span>{statusMsg}</span>
            <button type="button" onClick={() => setStatusMsg(null)} className="underline text-xs cursor-pointer">
              Dismiss
            </button>
          </div>
        )}

        {/* Caregiver Profile */}
        {caregiver && (
          <section className="rounded-2xl bg-white border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-xl font-bold text-[#1A5276]">{caregiver.fullName}</h1>
              <p className="text-sm text-slate-600 mt-1">
                {caregiver.city} · {caregiver.experienceYears} yrs experience · Languages:{' '}
                {caregiver.languages}
              </p>
              <p className="text-xs text-[#239B56] font-semibold mt-1">
                Status: {caregiver.verificationStatus} · {caregiver.trainingNotes}
              </p>
            </div>
            <div className="text-xs text-slate-600">
              Coordinator Desk: <span className="font-mono">[Care Desk Placeholder]</span>
            </div>
          </section>
        )}

        {/* Assigned Visits & Check-in/Out */}
        <section className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4">
          <h2 className="font-display text-lg font-bold text-[#1A5276]">
            Assigned Elderly Clients &amp; Daily Visits
          </h2>
          <div className="space-y-4">
            {visits.map((v) => {
              const client = clients.find((c) => c.id === v.elderlyId);
              return (
                <div
                  key={v.id}
                  className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-5 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-display font-bold text-[#1A5276]">
                        {client?.fullName || `Client #${v.elderlyId}`} ·{' '}
                        <span className="font-mono text-sm">
                          {v.scheduledDate} at {v.scheduledTime}
                        </span>
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Location: {client?.neighbourhood}, {client?.city} · Mobility:{' '}
                        {client?.mobilityNotes}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-[#239B56]">{v.status}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      value={bpByVisit[v.id] ?? v.bpReading}
                      onChange={(e) => setBpByVisit({ ...bpByVisit, [v.id]: e.target.value })}
                      placeholder="Optional BP reading (e.g., 120/78 mmHg)"
                      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs"
                    />
                    <input
                      value={noteByVisit[v.id] ?? v.careSummary}
                      onChange={(e) => setNoteByVisit({ ...noteByVisit, [v.id]: e.target.value })}
                      placeholder="Care notes for authorized family..."
                      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleVisitAction(v.id, 'check_in')}
                      className="px-3.5 py-2 text-xs font-semibold text-white bg-[#239B56] rounded-lg hover:bg-[#1D8348] cursor-pointer"
                    >
                      Check In
                    </button>
                    <button
                      type="button"
                      onClick={() => handleVisitAction(v.id, 'save')}
                      className="px-3.5 py-2 text-xs font-semibold text-[#1A5276] bg-white border border-slate-300 rounded-lg cursor-pointer"
                    >
                      Save Care Notes
                    </button>
                    <button
                      type="button"
                      onClick={() => handleVisitAction(v.id, 'check_out')}
                      className="px-3.5 py-2 text-xs font-semibold text-white bg-[#1A5276] rounded-lg hover:bg-[#14405D] cursor-pointer"
                    >
                      Check Out
                    </button>
                    <span className="text-xs font-mono text-slate-500">
                      In: {v.checkInTime || '—'} · Out: {v.checkOutTime || '—'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Incident Reporting */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <form
            onSubmit={handleReportIncident}
            className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4"
          >
            <div className="flex items-center gap-2 text-[#E74C3C]">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-display text-base font-bold">Report Urgent Incident</h3>
            </div>
            <input
              required
              value={incidentForm.title}
              onChange={(e) => setIncidentForm({ ...incidentForm, title: e.target.value })}
              placeholder="Incident summary (e.g., Minor slip in corridor)"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <input
              required
              value={incidentForm.location}
              onChange={(e) => setIncidentForm({ ...incidentForm, location: e.target.value })}
              placeholder="Location (e.g., DHA Phase 6 Residence)"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <textarea
              required
              rows={2}
              value={incidentForm.escalationActions}
              onChange={(e) =>
                setIncidentForm({ ...incidentForm, escalationActions: e.target.value })
              }
              placeholder="Immediate actions taken and contacts notified..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="px-4 py-2.5 text-xs font-semibold text-white bg-[#E74C3C] rounded-lg hover:bg-[#c0392b] cursor-pointer"
            >
              Submit Incident Report
            </button>
          </form>

          <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-3">
            <h3 className="font-display text-base font-bold text-[#1A5276]">
              Logged Incidents (Assigned Clients)
            </h3>
            {incidents.map((inc) => (
              <div key={inc.id} className="rounded-xl border border-slate-200 p-3.5 text-xs">
                <p className="font-semibold text-[#1A5276]">{inc.title}</p>
                <p className="text-slate-600 mt-1">{inc.escalationActions}</p>
                <p className="mt-1 font-semibold text-[#239B56]">Status: {inc.status}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

/* ============================================================================
   3. DOCTOR / HEALTHCARE PARTNER DASHBOARD (/doctor)
============================================================================ */
export const DoctorDashboardPage: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { principal, token, logout } = useAuth();
  const [doctor, setDoctor] = useState<DbDoctorProfile | null>(null);
  const [appointments, setAppointments] = useState<DbAppointment[]>([]);
  const [elders, setElders] = useState<DbElderlyProfile[]>([]);
  const [notesDraft, setNotesDraft] = useState<Record<number, string>>({});
  const [followUpDraft, setFollowUpDraft] = useState<Record<number, string>>({});
  const [savedBanner, setSavedBanner] = useState<string | null>(null);

  const loadDoctorData = useCallback(async () => {
    if (!token) return;
    const res = await fetch('/api/dashboard/doctor', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;
    const data = await res.json();
    setDoctor(data.doctor || null);
    setAppointments(data.appointments || []);
    setElders(data.elderlyProfiles || []);
  }, [token]);

  useEffect(() => {
    if (token && ['doctor', 'admin', 'super_admin'].includes(principal?.role || '')) {
      loadDoctorData();
    }
  }, [token, principal, loadDoctorData]);

  if (!principal || !token || !['doctor', 'admin', 'super_admin'].includes(principal.role)) {
    return (
      <DashboardAuthGate
        title="Doctor & Healthcare Partner Portal"
        role="doctor"
        onNavigate={onNavigate}
      />
    );
  }

  const handleSaveConsult = async (apptId: number, status: string) => {
    const res = await fetch(`/api/dashboard/doctor/appointments/${apptId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status,
        consultationNotes: notesDraft[apptId],
        followUpNotes: followUpDraft[apptId],
      }),
    });
    if (res.ok) {
      setSavedBanner(`Consultation #${apptId} saved.`);
      loadDoctorData();
    }
  };

  return (
    <div className="min-h-screen bg-[#EAF7F0] text-[#243342]">
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="text-sm font-medium text-[#1A5276] hover:underline cursor-pointer"
          >
            ← Website
          </button>
          <span className="font-display font-bold text-[#1A5276]">
            Healthcare Partner Portal
          </span>
        </div>
        <button
          type="button"
          onClick={logout}
          className="px-3 py-1.5 text-xs font-semibold text-[#1A5276] border border-slate-300 rounded-lg cursor-pointer"
        >
          Sign Out
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {principal.isDemo && (
          <div className="rounded-xl bg-[#EBF5FB] border border-[#2E86C1]/30 px-4 py-3 text-xs sm:text-sm text-[#1A5276]">
            <strong>Sample Healthcare Partner Mode:</strong> Fictional patient &amp; consultation
            records accessed strictly under simulated family consent.
          </div>
        )}

        {savedBanner && (
          <div className="rounded-xl bg-[#D5F5E3] border border-[#239B56]/30 px-4 py-3 text-sm text-[#1A5276] flex justify-between">
            <span>{savedBanner}</span>
            <button type="button" onClick={() => setSavedBanner(null)} className="underline text-xs cursor-pointer">
              Dismiss
            </button>
          </div>
        )}

        {doctor && (
          <section className="rounded-2xl bg-white border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#D5F5E3] text-[#239B56] flex items-center justify-center">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-[#1A5276]">{doctor.fullName}</h1>
                <p className="text-sm text-slate-600">
                  {doctor.specialty} · Credentials: {doctor.pmdcNumber} · {doctor.city}
                </p>
              </div>
            </div>
            <div className="text-sm font-mono tabular-nums font-semibold text-[#239B56]">
              Fee: PKR {doctor.consultationFeePkr.toLocaleString('en-PK')} · {doctor.verificationStatus}
            </div>
          </section>
        )}

        <section className="space-y-4">
          <h2 className="font-display text-lg font-bold text-[#1A5276]">
            Home Consultation Requests &amp; Consented Records
          </h2>
          {appointments.map((appt) => {
            const elder = elders.find((e) => e.id === appt.elderlyId);
            return (
              <div key={appt.id} className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-display font-bold text-[#1A5276]">
                      {elder?.fullName || `Patient #${appt.elderlyId}`} (Age {elder?.age})
                    </h3>
                    <p className="text-xs text-slate-600">
                      {elder?.neighbourhood}, {elder?.city} · {appt.scheduledDate} at{' '}
                      {appt.scheduledTime}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#2E86C1]">{appt.status}</span>
                </div>

                <p className="text-sm text-[#243342]">
                  <strong>Reason:</strong> {appt.reason}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Consultation Notes (Licensed Physician)
                    </label>
                    <textarea
                      rows={2}
                      value={notesDraft[appt.id] ?? appt.consultationNotes}
                      onChange={(e) => setNotesDraft({ ...notesDraft, [appt.id]: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Follow-up &amp; Referral Recommendations
                    </label>
                    <textarea
                      rows={2}
                      value={followUpDraft[appt.id] ?? appt.followUpNotes}
                      onChange={(e) =>
                        setFollowUpDraft({ ...followUpDraft, [appt.id]: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleSaveConsult(appt.id, 'Scheduled')}
                    className="px-4 py-2 text-xs font-semibold text-[#1A5276] border border-slate-300 rounded-lg cursor-pointer"
                  >
                    Confirm Schedule
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveConsult(appt.id, 'Completed')}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#239B56] rounded-lg hover:bg-[#1D8348] cursor-pointer"
                  >
                    Complete Consultation
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
};
