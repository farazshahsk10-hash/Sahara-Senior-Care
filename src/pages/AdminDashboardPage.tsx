import React, { useCallback, useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  CalendarCheck,
  ClipboardList,
  CreditCard,
  Download,
  FileEdit,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  ShieldCheck,
  Stethoscope,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { SaharaLogo } from '../components/SaharaLogo';
import { useAuth } from '../context/AuthContext';
import {
  AppRoute,
  DbAuditLog,
  DbBooking,
  DbCarePlan,
  DbCaregiverApplication,
  DbCaregiverProfile,
  DbDoctorProfile,
  DbElderlyProfile,
  DbIncident,
  DbInvoice,
  DbMessage,
  DbSiteContent,
  DbVisitRecord,
} from '../types/sahara';

interface AdminUserRow {
  id: number;
  uid: string;
  email: string;
  fullName: string;
  phone: string;
  city: string;
  role: string;
  status: string;
}

type AdminSection =
  | 'overview'
  | 'customers'
  | 'caregivers'
  | 'doctors'
  | 'bookings'
  | 'plans'
  | 'visits'
  | 'incidents'
  | 'finance'
  | 'reports'
  | 'messages'
  | 'content'
  | 'audit';

interface AdminDashboardProps {
  onNavigate: (path: AppRoute) => void;
  onDataUpdated?: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardProps> = ({
  onNavigate,
  onDataUpdated,
}) => {
  const { principal, token, enterDemoWorkspace, signInWithGoogle, logout, loading: authLoading } =
    useAuth();

  const [section, setSection] = useState<AdminSection>('overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [usersList, setUsersList] = useState<AdminUserRow[]>([]);
  const [elders, setElders] = useState<DbElderlyProfile[]>([]);
  const [caregivers, setCaregivers] = useState<DbCaregiverProfile[]>([]);
  const [doctors, setDoctors] = useState<DbDoctorProfile[]>([]);
  const [bookingsList, setBookingsList] = useState<DbBooking[]>([]);
  const [plans, setPlans] = useState<DbCarePlan[]>([]);
  const [visits, setVisits] = useState<DbVisitRecord[]>([]);
  const [incidents, setIncidents] = useState<DbIncident[]>([]);
  const [invoicesList, setInvoicesList] = useState<DbInvoice[]>([]);
  const [applications, setApplications] = useState<DbCaregiverApplication[]>([]);
  const [messagesList, setMessagesList] = useState<DbMessage[]>([]);
  const [siteContentList, setSiteContentList] = useState<DbSiteContent[]>([]);
  const [auditLogsList, setAuditLogsList] = useState<DbAuditLog[]>([]);

  const [planPriceEdits, setPlanPriceEdits] = useState<Record<number, number>>({});
  const [contentEdits, setContentEdits] = useState<
    Record<string, { title: string; body: string }>
  >({});

  const loadAdminOverview = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/overview', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setUsersList(data.users || []);
      setElders(data.elderlyProfiles || []);
      setCaregivers(data.caregivers || []);
      setDoctors(data.doctors || []);
      setBookingsList(data.bookings || []);
      setPlans(data.carePlans || []);
      setVisits(data.visits || []);
      setIncidents(data.incidents || []);
      setInvoicesList(data.invoices || []);
      setApplications(data.applications || []);
      setMessagesList(data.messages || []);
      setSiteContentList(data.siteContent || []);
      setAuditLogsList(data.auditLogs || []);

      const nextPrices: Record<number, number> = {};
      (data.carePlans || []).forEach((p: DbCarePlan) => {
        nextPrices[p.id] = p.monthlyPricePkr;
      });
      setPlanPriceEdits(nextPrices);

      const nextContent: Record<string, { title: string; body: string }> = {};
      (data.siteContent || []).forEach((c: DbSiteContent) => {
        nextContent[c.key] = { title: c.title, body: c.body };
      });
      setContentEdits(nextContent);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token && ['admin', 'super_admin'].includes(principal?.role || '')) {
      loadAdminOverview();
    }
  }, [token, principal, loadAdminOverview]);

  if (!principal || !token || !['admin', 'super_admin'].includes(principal.role)) {
    return (
      <div className="min-h-screen bg-[#EAF7F0] flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-2xl border border-slate-200 p-8 space-y-5">
          <SaharaLogo showTagline />
          <div>
            <p className="text-xs font-semibold text-[#239B56]">Central Operations Console</p>
            <h1 className="font-display text-2xl font-bold text-[#1A5276] mt-1">
              Admin Dashboard (/admin)
            </h1>
            <p className="mt-2 text-sm text-[#243342]/80">
              Role-based administrator permissions are required. Sign in with an authorized Google
              admin account or launch the interactive Sample Admin Demo Workspace.
            </p>
          </div>
          <div className="space-y-3">
            <button
              type="button"
              disabled={authLoading}
              onClick={() => enterDemoWorkspace('admin')}
              className="w-full py-3 px-4 text-sm font-semibold text-white bg-[#1A5276] rounded-xl hover:bg-[#14405D] cursor-pointer"
            >
              {authLoading ? 'Opening...' : 'Launch Sample Admin Demo Workspace'}
            </button>
            <button
              type="button"
              disabled={authLoading}
              onClick={() => signInWithGoogle()}
              className="w-full py-3 px-4 text-sm font-semibold text-[#1A5276] border border-slate-300 rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              Sign In with Google Admin
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
  }

  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 4000);
  };

  const updateBooking = async (
    id: number,
    payload: { status?: string; assignedCaregiverId?: number; cancellationReason?: string }
  ) => {
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      notify('Booking updated and audit logged.');
      loadAdminOverview();
    }
  };

  const updateCarePlanPrice = async (id: number) => {
    const price = planPriceEdits[id];
    const res = await fetch(`/api/admin/care-plans/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ monthlyPricePkr: price }),
    });
    if (res.ok) {
      notify('Care plan price saved in PostgreSQL.');
      loadAdminOverview();
      onDataUpdated?.();
    }
  };

  const updateApplicationStatus = async (id: number, status: string) => {
    const res = await fetch(`/api/admin/caregiver-applications/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      notify(`Applicant updated to "${status}".`);
      loadAdminOverview();
    }
  };

  const updateIncidentStatus = async (id: number, status: string) => {
    const res = await fetch(`/api/admin/incidents/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      notify(`Incident #${id} marked ${status}.`);
      loadAdminOverview();
    }
  };

  const updateInvoiceStatus = async (id: number, status: string) => {
    const res = await fetch(`/api/admin/invoices/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      notify(`Invoice status updated to ${status}.`);
      loadAdminOverview();
    }
  };

  const saveSiteContent = async (key: string) => {
    const draft = contentEdits[key];
    if (!draft) return;
    const res = await fetch(`/api/admin/site-content/${key}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(draft),
    });
    if (res.ok) {
      notify(`Website content "${key}" saved.`);
      loadAdminOverview();
      onDataUpdated?.();
    }
  };

  const downloadCsv = async (type: 'bookings' | 'invoices') => {
    const res = await fetch(`/api/admin/reports/csv?type=${type}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sahara-${type}-report.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  // Financial aggregations — Security Deposits strictly separated from Gross Revenue & Profit!
  const grossServiceRevenue = invoicesList
    .filter((i) => i.status === 'Paid')
    .reduce((sum, i) => sum + i.amountPkr, 0);
  const outstandingBalance = invoicesList
    .filter((i) => i.status === 'Pending')
    .reduce((sum, i) => sum + i.amountPkr, 0);
  const escrowDepositsHeld = invoicesList
    .filter((i) => i.status !== 'Refunded')
    .reduce((sum, i) => sum + i.securityDepositPkr, 0);
  const estimatedDirectCaregiverCost = Math.round(grossServiceRevenue * 0.65);
  const grossProfit = grossServiceRevenue - estimatedDirectCaregiverCost;
  const openIncidentsCount = incidents.filter((i) => i.status !== 'Reviewed & Closed').length;

  const sidebarLinks: Array<{ id: AdminSection; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'customers', label: 'Customers & Elderly', icon: Users },
    { id: 'caregivers', label: 'Caregivers & Apps', icon: UserCheck },
    { id: 'doctors', label: 'Doctors', icon: Stethoscope },
    { id: 'bookings', label: 'Bookings', icon: CalendarCheck },
    { id: 'plans', label: 'Care Plans & Pricing', icon: HeartHandshake },
    { id: 'visits', label: 'Visit Management', icon: ClipboardList },
    { id: 'incidents', label: 'Emergency Incidents', icon: AlertTriangle },
    { id: 'finance', label: 'Payments & Finance', icon: CreditCard },
    { id: 'reports', label: 'Reports & CSV', icon: BarChart3 },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'content', label: 'Website Content', icon: FileEdit },
    { id: 'audit', label: 'User Roles & Audit', icon: ShieldCheck },
  ];

  const SidebarEl = (
    <div className="h-full flex flex-col justify-between bg-[#1A5276] text-white p-4">
      <div className="overflow-y-auto space-y-4">
        <div className="px-2 pt-1">
          <SaharaLogo showTagline inverted />
        </div>

        <nav aria-label="Admin sidebar" className="space-y-0.5">
          {sidebarLinks.map((item) => {
            const Icon = item.icon;
            const active = section === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSection(item.id);
                  setMobileNavOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  active
                    ? 'bg-white text-[#1A5276] font-semibold'
                    : 'text-slate-200 hover:bg-white/10'
                }`}
              >
                <span className="flex items-center gap-2.5 truncate">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </span>
                {item.id === 'incidents' && openIncidentsCount > 0 && (
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#E74C3C] text-white">
                    {openIncidentsCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-white/15 space-y-2">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium bg-white/10 rounded-lg hover:bg-white/20 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Public Website</span>
        </button>
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-[#D5F5E3] hover:text-white cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#EAF7F0] text-[#243342] flex">
      <aside className="hidden lg:block w-64 shrink-0 sticky top-0 h-screen">{SidebarEl}</aside>

      {mobileNavOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setMobileNavOpen(false)} />
          <div className="relative w-64 h-full z-10">{SidebarEl}</div>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden p-2 rounded-lg border border-slate-200"
              aria-label="Open admin menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-display font-bold text-[#1A5276] text-base sm:text-lg capitalize">
              {sidebarLinks.find((l) => l.id === section)?.label || 'Admin Overview'}
            </h1>
            {principal.isDemo && (
              <span className="text-xs font-semibold text-[#239B56] bg-[#D5F5E3] px-2 py-0.5 rounded">
                Sample Demo Mode
              </span>
            )}
          </div>

          <div className="text-xs text-slate-600 hidden sm:block font-mono">
            {principal.email} · Role: {principal.role}
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {toast && (
            <div className="rounded-xl bg-[#D5F5E3] border border-[#239B56]/30 px-4 py-3 text-sm text-[#1A5276] flex items-center justify-between">
              <span>{toast}</span>
              <button type="button" onClick={() => setToast(null)} className="cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {loading && (
            <p className="text-xs font-mono text-slate-500">Synchronizing with PostgreSQL...</p>
          )}

          {/* OVERVIEW SECTION */}
          {section === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                  ['Registered Families', usersList.filter((u) => u.role === 'family').length],
                  ['Active Elderly Profiles', elders.length],
                  ['Verified Caregivers', caregivers.length],
                  ['Partner Doctors', doctors.length],
                  ['Pending Bookings', bookingsList.filter((b) => b.status === 'Pending').length],
                ].map(([label, val]) => (
                  <div key={String(label)} className="rounded-2xl bg-white border border-slate-200 p-4">
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="mt-1 font-mono tabular-nums text-2xl font-bold text-[#1A5276]">
                      {val}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="rounded-2xl bg-white border border-slate-200 p-5">
                  <p className="text-xs text-slate-500">Paid Service Revenue (Excl. Deposits)</p>
                  <p className="mt-1 font-mono tabular-nums text-xl font-bold text-[#239B56]">
                    PKR {grossServiceRevenue.toLocaleString('en-PK')}
                  </p>
                </div>
                <div className="rounded-2xl bg-white border border-slate-200 p-5">
                  <p className="text-xs text-slate-500">Outstanding Receivables</p>
                  <p className="mt-1 font-mono tabular-nums text-xl font-bold text-[#2E86C1]">
                    PKR {outstandingBalance.toLocaleString('en-PK')}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#EBF5FB] border border-[#2E86C1]/30 p-5">
                  <p className="text-xs text-[#1A5276]">Refundable Deposits Held (Liability)</p>
                  <p className="mt-1 font-mono tabular-nums text-xl font-bold text-[#1A5276]">
                    PKR {escrowDepositsHeld.toLocaleString('en-PK')}
                  </p>
                </div>
                <div className="rounded-2xl bg-white border border-slate-200 p-5">
                  <p className="text-xs text-slate-500">Open Incidents</p>
                  <p
                    className={`mt-1 font-mono tabular-nums text-xl font-bold ${
                      openIncidentsCount > 0 ? 'text-[#E74C3C]' : 'text-[#239B56]'
                    }`}
                  >
                    {openIncidentsCount}
                  </p>
                </div>
              </div>

              {/* Charts: Service Distribution & Caregiver Utilization */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-2xl bg-white border border-slate-200 p-6">
                  <h2 className="font-display text-base font-bold text-[#1A5276]">
                    Booking Status Distribution (Sample Metrics)
                  </h2>
                  <div className="mt-5 space-y-3">
                    {['Active', 'Assessment Scheduled', 'Pending', 'Completed'].map((st) => {
                      const count = bookingsList.filter((b) => b.status === st).length;
                      const pct = bookingsList.length
                        ? Math.round((count / bookingsList.length) * 100)
                        : 0;
                      return (
                        <div key={st} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-medium">{st}</span>
                            <span className="font-mono tabular-nums">
                              {count} ({pct}%)
                            </span>
                          </div>
                          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#2E86C1]"
                              style={{ width: `${Math.max(pct, 4)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl bg-white border border-slate-200 p-6">
                  <h2 className="font-display text-base font-bold text-[#1A5276]">
                    Caregiver Utilization &amp; Pipeline
                  </h2>
                  <div className="mt-5 space-y-3">
                    {[
                      {
                        label: 'Assigned Caregivers',
                        count: caregivers.filter((c) => c.availabilityStatus === 'Assigned').length,
                        color: 'bg-[#239B56]',
                      },
                      {
                        label: 'Available Caregivers',
                        count: caregivers.filter((c) => c.availabilityStatus === 'Available').length,
                        color: 'bg-[#1A5276]',
                      },
                      {
                        label: 'Applicants Under Review / Screening',
                        count: applications.length,
                        color: 'bg-[#2E86C1]',
                      },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between text-sm py-2 border-b border-slate-100 last:border-b-0">
                        <span className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-sm ${row.color}`} />
                          <span>{row.label}</span>
                        </span>
                        <span className="font-mono tabular-nums font-bold text-[#1A5276]">
                          {row.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CUSTOMERS & ELDERLY PROFILES */}
          {section === 'customers' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 max-w-md">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search customers or elderly profiles..."
                  className="w-full text-sm focus:outline-none"
                />
              </div>

              <div className="rounded-2xl bg-white border border-slate-200 p-6 overflow-x-auto">
                <h2 className="font-display text-base font-bold text-[#1A5276] mb-4">
                  Elderly Care Profiles &amp; Family Contacts
                </h2>
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs text-slate-500">
                      <th className="py-2 pr-4">Senior Name</th>
                      <th className="py-2 px-4">Age</th>
                      <th className="py-2 px-4">City / Area</th>
                      <th className="py-2 px-4">Care Plan</th>
                      <th className="py-2 pl-4">Emergency Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {elders
                      .filter(
                        (e) =>
                          e.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.city.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((e) => (
                        <tr key={e.id}>
                          <td className="py-3 pr-4 font-semibold text-[#1A5276]">{e.fullName}</td>
                          <td className="py-3 px-4 font-mono tabular-nums">{e.age}</td>
                          <td className="py-3 px-4">
                            {e.neighbourhood}, {e.city}
                          </td>
                          <td className="py-3 px-4 text-[#239B56] font-medium">{e.carePlanName}</td>
                          <td className="py-3 pl-4 text-xs">
                            {e.emergencyContactName} · {e.emergencyContactPhone}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CAREGIVERS & APPLICATIONS */}
          {section === 'caregivers' && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-white border border-slate-200 p-6 overflow-x-auto">
                <h2 className="font-display text-base font-bold text-[#1A5276] mb-4">
                  Active Caregiver Network
                </h2>
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs text-slate-500">
                      <th className="py-2 pr-4">Name</th>
                      <th className="py-2 px-4">City</th>
                      <th className="py-2 px-4">Languages</th>
                      <th className="py-2 px-4">Verification</th>
                      <th className="py-2 pl-4">Availability</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {caregivers.map((c) => (
                      <tr key={c.id}>
                        <td className="py-3 pr-4 font-semibold text-[#1A5276]">{c.fullName}</td>
                        <td className="py-3 px-4">{c.city}</td>
                        <td className="py-3 px-4 text-xs">{c.languages}</td>
                        <td className="py-3 px-4 text-[#239B56] font-semibold">
                          {c.verificationStatus}
                        </td>
                        <td className="py-3 pl-4">{c.availabilityStatus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="rounded-2xl bg-white border border-slate-200 p-6 overflow-x-auto">
                <h2 className="font-display text-base font-bold text-[#1A5276] mb-4">
                  Caregiver Applications Pipeline (Manual Approval Required)
                </h2>
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs text-slate-500">
                      <th className="py-2 pr-4">Applicant</th>
                      <th className="py-2 px-4">City</th>
                      <th className="py-2 px-4">Experience</th>
                      <th className="py-2 px-4">Status</th>
                      <th className="py-2 pl-4">Review Stage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applications.map((app) => (
                      <tr key={app.id}>
                        <td className="py-3 pr-4">
                          <div className="font-semibold text-[#1A5276]">{app.fullName}</div>
                          <div className="text-xs text-slate-500">{app.email}</div>
                        </td>
                        <td className="py-3 px-4">{app.city}</td>
                        <td className="py-3 px-4 text-xs max-w-xs">{app.experience}</td>
                        <td className="py-3 px-4 font-semibold text-[#2E86C1]">{app.status}</td>
                        <td className="py-3 pl-4">
                          <select
                            value={app.status}
                            onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                            className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs"
                          >
                            {[
                              'Submitted',
                              'Under Review',
                              'Interview',
                              'Screening',
                              'Approved',
                              'Rejected',
                            ].map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* DOCTORS */}
          {section === 'doctors' && (
            <div className="rounded-2xl bg-white border border-slate-200 p-6 overflow-x-auto">
              <h2 className="font-display text-base font-bold text-[#1A5276] mb-4">
                Partnered Licensed Doctors
              </h2>
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs text-slate-500">
                    <th className="py-2 pr-4">Doctor</th>
                    <th className="py-2 px-4">Specialty</th>
                    <th className="py-2 px-4">Credentials</th>
                    <th className="py-2 px-4">Fee (PKR)</th>
                    <th className="py-2 pl-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {doctors.map((d) => (
                    <tr key={d.id}>
                      <td className="py-3 pr-4 font-semibold text-[#1A5276]">{d.fullName}</td>
                      <td className="py-3 px-4">{d.specialty}</td>
                      <td className="py-3 px-4 font-mono text-xs">{d.pmdcNumber}</td>
                      <td className="py-3 px-4 font-mono tabular-nums">
                        PKR {d.consultationFeePkr.toLocaleString('en-PK')}
                      </td>
                      <td className="py-3 pl-4 text-[#239B56] font-semibold">
                        {d.verificationStatus} · {d.availabilityStatus}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* BOOKINGS MANAGEMENT */}
          {section === 'bookings' && (
            <div className="rounded-2xl bg-white border border-slate-200 p-6 overflow-x-auto">
              <h2 className="font-display text-base font-bold text-[#1A5276] mb-4">
                Booking Requests &amp; Caregiver Assignment
              </h2>
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs text-slate-500">
                    <th className="py-2 pr-4">Reference</th>
                    <th className="py-2 px-4">Family Contact</th>
                    <th className="py-2 px-4">City / Service</th>
                    <th className="py-2 px-4">Assign Caregiver</th>
                    <th className="py-2 pl-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookingsList.map((b) => (
                    <tr key={b.id}>
                      <td className="py-3 pr-4 font-mono font-semibold text-[#1A5276]">
                        {b.referenceCode}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium">{b.fullName}</div>
                        <div className="text-xs text-slate-500">{b.phone}</div>
                      </td>
                      <td className="py-3 px-4 text-xs">
                        <div>{b.city}</div>
                        <div className="text-slate-500">{b.serviceRequired}</div>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={b.assignedCaregiverId ?? ''}
                          onChange={(e) =>
                            updateBooking(b.id, {
                              assignedCaregiverId: e.target.value ? Number(e.target.value) : 0,
                            })
                          }
                          className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs"
                        >
                          <option value="">Unassigned</option>
                          {caregivers.map((cg) => (
                            <option key={cg.id} value={cg.id}>
                              {cg.fullName}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 pl-4">
                        <select
                          value={b.status}
                          onChange={(e) => updateBooking(b.id, { status: e.target.value })}
                          className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs"
                        >
                          {[
                            'Pending',
                            'Assessment Scheduled',
                            'Approved',
                            'Active',
                            'Completed',
                            'Cancelled',
                          ].map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* CARE PLANS EDITOR */}
          {section === 'plans' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {plans.map((plan) => (
                <div key={plan.id} className="rounded-2xl bg-white border border-slate-200 p-6 space-y-3">
                  <h3 className="font-display text-lg font-bold text-[#1A5276]">{plan.name}</h3>
                  <p className="text-xs text-slate-600">{plan.hoursSummary}</p>
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-semibold text-slate-600">
                      Monthly Rate (PKR):
                    </label>
                    <input
                      type="number"
                      value={planPriceEdits[plan.id] ?? plan.monthlyPricePkr}
                      onChange={(e) =>
                        setPlanPriceEdits({ ...planPriceEdits, [plan.id]: Number(e.target.value) })
                      }
                      className="w-36 rounded-lg border border-slate-300 px-3 py-1.5 font-mono text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => updateCarePlanPrice(plan.id)}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-[#1A5276] rounded-lg hover:bg-[#14405D] cursor-pointer"
                    >
                      Save Price
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VISIT MANAGEMENT */}
          {section === 'visits' && (
            <div className="rounded-2xl bg-white border border-slate-200 p-6 overflow-x-auto">
              <h2 className="font-display text-base font-bold text-[#1A5276] mb-4">
                Visit Attendance &amp; Care Summary Log
              </h2>
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs text-slate-500">
                    <th className="py-2 pr-4">Date &amp; Time</th>
                    <th className="py-2 px-4">Check-In / Out</th>
                    <th className="py-2 px-4">Status</th>
                    <th className="py-2 pl-4">Care Summary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visits.map((v) => (
                    <tr key={v.id}>
                      <td className="py-3 pr-4 font-mono text-xs whitespace-nowrap">
                        {v.scheduledDate} · {v.scheduledTime}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs">
                        {v.checkInTime || '—'} → {v.checkOutTime || '—'}
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#239B56]">{v.status}</td>
                      <td className="py-3 pl-4 text-xs">{v.careSummary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* EMERGENCY INCIDENTS */}
          {section === 'incidents' && (
            <div className="space-y-4">
              {incidents.map((inc) => (
                <div
                  key={inc.id}
                  className={`rounded-2xl p-6 border ${
                    inc.status === 'Reviewed & Closed'
                      ? 'bg-white border-slate-200'
                      : 'bg-[#E74C3C]/10 border-[#E74C3C]'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-display font-bold text-[#1A5276]">{inc.title}</h3>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Reported by {inc.reportedBy} · {inc.location}
                      </p>
                    </div>
                    <select
                      value={inc.status}
                      onChange={(e) => updateIncidentStatus(inc.id, e.target.value)}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold"
                    >
                      <option value="Open">Open</option>
                      <option value="Escalated">Escalated</option>
                      <option value="Reviewed & Closed">Reviewed &amp; Closed</option>
                    </select>
                  </div>
                  <p className="mt-3 text-sm text-[#243342]">{inc.escalationActions}</p>
                </div>
              ))}
            </div>
          )}

          {/* FINANCE (DEPOSITS SEPARATE FROM REVENUE) */}
          {section === 'finance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="rounded-2xl bg-white border border-slate-200 p-5">
                  <p className="text-xs text-slate-500">Gross Service Revenue</p>
                  <p className="mt-1 font-mono tabular-nums text-xl font-bold text-[#1A5276]">
                    PKR {grossServiceRevenue.toLocaleString('en-PK')}
                  </p>
                </div>
                <div className="rounded-2xl bg-white border border-slate-200 p-5">
                  <p className="text-xs text-slate-500">Est. Direct Caregiver Costs</p>
                  <p className="mt-1 font-mono tabular-nums text-xl font-bold text-[#243342]">
                    PKR {estimatedDirectCaregiverCost.toLocaleString('en-PK')}
                  </p>
                </div>
                <div className="rounded-2xl bg-white border border-slate-200 p-5">
                  <p className="text-xs text-slate-500">Gross Profit (Excl. Deposits)</p>
                  <p className="mt-1 font-mono tabular-nums text-xl font-bold text-[#239B56]">
                    PKR {grossProfit.toLocaleString('en-PK')}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#EBF5FB] border border-[#2E86C1]/30 p-5">
                  <p className="text-xs text-[#1A5276]">
                    Customer Security Deposits (Escrow Liability)
                  </p>
                  <p className="mt-1 font-mono tabular-nums text-xl font-bold text-[#1A5276]">
                    PKR {escrowDepositsHeld.toLocaleString('en-PK')}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-white border border-slate-200 p-6 overflow-x-auto">
                <h2 className="font-display text-base font-bold text-[#1A5276] mb-4">
                  Invoices &amp; Payment Ledger
                </h2>
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs text-slate-500">
                      <th className="py-2 pr-4">Invoice #</th>
                      <th className="py-2 px-4">Family</th>
                      <th className="py-2 px-4">Category</th>
                      <th className="py-2 px-4">Service Revenue</th>
                      <th className="py-2 px-4">Security Deposit</th>
                      <th className="py-2 pl-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoicesList.map((inv) => (
                      <tr key={inv.id}>
                        <td className="py-3 pr-4 font-mono font-semibold text-[#1A5276]">
                          {inv.invoiceNumber}
                        </td>
                        <td className="py-3 px-4">{inv.familyName}</td>
                        <td className="py-3 px-4 text-xs">{inv.category}</td>
                        <td className="py-3 px-4 font-mono tabular-nums">
                          PKR {inv.amountPkr.toLocaleString('en-PK')}
                        </td>
                        <td className="py-3 px-4 font-mono tabular-nums text-slate-600">
                          PKR {inv.securityDepositPkr.toLocaleString('en-PK')}
                        </td>
                        <td className="py-3 pl-4">
                          <select
                            value={inv.status}
                            onChange={(e) => updateInvoiceStatus(inv.id, e.target.value)}
                            className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs"
                          >
                            <option value="Paid">Paid</option>
                            <option value="Pending">Pending</option>
                            <option value="Refunded">Refunded</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* REPORTS & CSV */}
          {section === 'reports' && (
            <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4">
              <h2 className="font-display text-lg font-bold text-[#1A5276]">
                Export Operational &amp; Financial Reports (CSV)
              </h2>
              <p className="text-sm text-slate-600">
                Download sanitized CSV exports directly from PostgreSQL for board reviews,
                auditors, and care operations.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => downloadCsv('bookings')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1A5276] rounded-xl hover:bg-[#14405D] cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Bookings CSV</span>
                </button>
                <button
                  type="button"
                  onClick={() => downloadCsv('invoices')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#239B56] rounded-xl hover:bg-[#1D8348] cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Invoices &amp; Deposits CSV</span>
                </button>
              </div>
            </div>
          )}

          {/* MESSAGES */}
          {section === 'messages' && (
            <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4">
              <h2 className="font-display text-base font-bold text-[#1A5276]">
                Family &amp; Public Inquiries Inbox
              </h2>
              {messagesList.map((m) => (
                <div key={m.id} className="rounded-xl border border-slate-200 p-4 text-sm">
                  <div className="flex justify-between gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-[#1A5276]">
                      {m.senderName} ({m.senderEmail})
                    </span>
                    <span>{m.status}</span>
                  </div>
                  <p className="mt-1 font-semibold">{m.subject}</p>
                  <p className="mt-1 text-slate-600">{m.body}</p>
                </div>
              ))}
            </div>
          )}

          {/* WEBSITE CONTENT CMS */}
          {section === 'content' && (
            <div className="space-y-5">
              {siteContentList.map((item) => (
                <div key={item.key} className="rounded-2xl bg-white border border-slate-200 p-6 space-y-3">
                  <p className="font-mono text-xs text-[#2E86C1]">Content Key: {item.key}</p>
                  <input
                    value={contentEdits[item.key]?.title ?? item.title}
                    onChange={(e) =>
                      setContentEdits({
                        ...contentEdits,
                        [item.key]: {
                          title: e.target.value,
                          body: contentEdits[item.key]?.body ?? item.body,
                        },
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold"
                  />
                  <textarea
                    rows={3}
                    value={contentEdits[item.key]?.body ?? item.body}
                    onChange={(e) =>
                      setContentEdits({
                        ...contentEdits,
                        [item.key]: {
                          title: contentEdits[item.key]?.title ?? item.title,
                          body: e.target.value,
                        },
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => saveSiteContent(item.key)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#1A5276] rounded-lg hover:bg-[#14405D] cursor-pointer"
                  >
                    Publish Content Update
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* USER ROLES & AUDIT LOGS */}
          {section === 'audit' && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-white border border-slate-200 p-6 overflow-x-auto">
                <h2 className="font-display text-base font-bold text-[#1A5276] mb-4">
                  User Accounts &amp; Role Assignments
                </h2>
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs text-slate-500">
                      <th className="py-2 pr-4">Name</th>
                      <th className="py-2 px-4">Email</th>
                      <th className="py-2 px-4">Role</th>
                      <th className="py-2 pl-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {usersList.map((u) => (
                      <tr key={u.id}>
                        <td className="py-3 pr-4 font-semibold text-[#1A5276]">{u.fullName}</td>
                        <td className="py-3 px-4 font-mono text-xs">{u.email}</td>
                        <td className="py-3 px-4 uppercase text-xs font-semibold text-[#2E86C1]">
                          {u.role}
                        </td>
                        <td className="py-3 pl-4 text-xs text-[#239B56]">{u.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="rounded-2xl bg-white border border-slate-200 p-6">
                <h2 className="font-display text-base font-bold text-[#1A5276] mb-4">
                  Administrative Audit Trail
                </h2>
                <div className="divide-y divide-slate-100 text-xs">
                  {auditLogsList.map((log) => (
                    <div key={log.id} className="py-2.5 flex flex-wrap justify-between gap-2">
                      <div>
                        <span className="font-mono font-semibold text-[#1A5276]">{log.action}</span>{' '}
                        · <span>{log.targetEntity}</span> —{' '}
                        <span className="text-slate-600">{log.details}</span>
                      </div>
                      <span className="font-mono text-slate-500">{log.actorEmail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
