import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { SaharaLogo } from './SaharaLogo';
import { AppRoute } from '../types/sahara';
import { useAuth } from '../context/AuthContext';

interface PublicHeaderProps {
  currentRoute: AppRoute;
  onNavigate: (path: AppRoute) => void;
}

const NAV_ITEMS: Array<{ label: string; path: AppRoute }> = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'How It Works', path: '/how-it-works' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'Contact', path: '/contact' },
];

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  currentRoute,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { principal } = useAuth();

  const roleRoute = (): AppRoute => {
    if (!principal) return '/login';
    if (principal.role === 'admin' || principal.role === 'super_admin') return '/admin';
    if (principal.role === 'caregiver') return '/caregiver';
    if (principal.role === 'doctor') return '/doctor';
    return '/portal';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Mark */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/');
          }}
          className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1A5276] rounded-md shrink-0"
          aria-label="Sahara Senior Care home"
        >
          <SaharaLogo />
        </a>

        {/* Zone 2: Clean single-line navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#243342]"
        >
          {NAV_ITEMS.map((item) => {
            const active = currentRoute === item.path;
            return (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(item.path);
                }}
                className={`whitespace-nowrap shrink-0 transition-colors underline-offset-4 hover:text-[#1A5276] hover:underline ${
                  active ? 'text-[#1A5276] font-semibold underline decoration-[#239B56]' : ''
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Login & Book Care */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate(roleRoute())}
            className="hidden sm:inline-flex items-center justify-center px-3.5 py-2 text-sm font-semibold text-[#1A5276] border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {principal ? `${principal.role.toUpperCase()} Portal` : 'Login'}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('/book')}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-[#239B56] rounded-lg hover:bg-[#1D8348] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Book Care
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg text-[#243342] hover:bg-slate-100"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-1.5">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate(item.path);
              }}
              className={`block w-full text-left py-2.5 px-3 text-sm font-medium rounded-lg ${
                currentRoute === item.path
                  ? 'bg-[#D5F5E3]/60 text-[#1A5276] font-semibold'
                  : 'text-[#243342] hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-3 mt-2 border-t border-slate-100 grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate(roleRoute());
              }}
              className="py-2.5 px-3 text-sm font-semibold text-[#1A5276] border border-slate-300 rounded-lg"
            >
              {principal ? 'Dashboard' : 'Login'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('/book');
              }}
              className="py-2.5 px-3 text-sm font-semibold text-white bg-[#1A5276] rounded-lg"
            >
              Book Care
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
