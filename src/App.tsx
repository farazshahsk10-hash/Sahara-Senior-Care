import { useCallback, useEffect, useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { PublicHeader } from './components/PublicHeader';
import { PublicFooter } from './components/PublicFooter';
import { HomePage } from './pages/HomePage';
import {
  AboutPage,
  HowItWorksPage,
  PartnerPage,
  PricingPage,
  SafetyPage,
  ServicesPage,
} from './pages/InfoPages';
import {
  BookAssessmentPage,
  CaregiverApplyPage,
  ContactPage,
  LoginPage,
} from './pages/FormsAndAuthPages';
import {
  CaregiverDashboardPage,
  DoctorDashboardPage,
  FamilyDashboardPage,
} from './pages/RoleDashboards';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AppRoute, DbCarePlan, DbSiteContent } from './types/sahara';

const VALID_ROUTES: AppRoute[] = [
  '/',
  '/about',
  '/services',
  '/how-it-works',
  '/pricing',
  '/safety',
  '/become-caregiver',
  '/partner',
  '/book',
  '/contact',
  '/login',
  '/portal',
  '/caregiver',
  '/doctor',
  '/admin',
];

function resolveRoute(): AppRoute {
  if (typeof window === 'undefined') return '/';
  const pathname = window.location.pathname as AppRoute;
  return VALID_ROUTES.includes(pathname) ? pathname : '/';
}

const DASHBOARD_ROUTES = new Set<AppRoute>(['/portal', '/caregiver', '/doctor', '/admin']);

function SaharaAppShell() {
  const [route, setRoute] = useState<AppRoute>(resolveRoute);
  const [plans, setPlans] = useState<DbCarePlan[]>([]);
  const [siteContent, setSiteContent] = useState<DbSiteContent[]>([]);

  const fetchBootstrap = useCallback(async () => {
    try {
      const res = await fetch('/api/public/bootstrap');
      if (!res.ok) return;
      const data = await res.json();
      setPlans(data.plans || []);
      setSiteContent(data.content || []);
    } catch {
      // keep initial empty arrays until network responds
    }
  }, []);

  useEffect(() => {
    fetchBootstrap();
  }, [fetchBootstrap]);

  useEffect(() => {
    const onPopState = () => setRoute(resolveRoute());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (path: AppRoute) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setRoute(path);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  if (DASHBOARD_ROUTES.has(route)) {
    if (route === '/portal') return <FamilyDashboardPage onNavigate={navigate} />;
    if (route === '/caregiver') return <CaregiverDashboardPage onNavigate={navigate} />;
    if (route === '/doctor') return <DoctorDashboardPage onNavigate={navigate} />;
    return <AdminDashboardPage onNavigate={navigate} onDataUpdated={fetchBootstrap} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#EAF7F0] text-[#243342]">
      <PublicHeader currentRoute={route} onNavigate={navigate} />
      <main className="flex-1">
        {route === '/' && (
          <HomePage onNavigate={navigate} plans={plans} siteContent={siteContent} />
        )}
        {route === '/about' && <AboutPage onNavigate={navigate} />}
        {route === '/services' && <ServicesPage onNavigate={navigate} />}
        {route === '/how-it-works' && <HowItWorksPage onNavigate={navigate} />}
        {route === '/pricing' && <PricingPage onNavigate={navigate} plans={plans} />}
        {route === '/safety' && <SafetyPage onNavigate={navigate} />}
        {route === '/partner' && <PartnerPage onNavigate={navigate} />}
        {route === '/book' && <BookAssessmentPage onNavigate={navigate} />}
        {route === '/become-caregiver' && <CaregiverApplyPage onNavigate={navigate} />}
        {route === '/contact' && (
          <ContactPage onNavigate={navigate} siteContent={siteContent} />
        )}
        {route === '/login' && <LoginPage onNavigate={navigate} />}
      </main>
      <PublicFooter onNavigate={navigate} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SaharaAppShell />
    </AuthProvider>
  );
}
