import React from 'react';
import { SaharaLogo } from './SaharaLogo';
import { AppRoute } from '../types/sahara';

interface PublicFooterProps {
  onNavigate: (path: AppRoute) => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#1A5276] text-slate-200 border-t border-[#14405D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-white/15">
          <div className="md:col-span-4">
            <SaharaLogo showTagline inverted />
            <p className="mt-4 text-sm text-slate-200/90 leading-relaxed max-w-sm">
              Technology-enabled elderly home-care management platform connecting Pakistani
              families with trusted caregivers and coordinated healthcare support.
            </p>
            <p className="mt-3 text-xs font-medium text-[#D5F5E3]">
              Helping families care better, one home at a time.
            </p>
          </div>

          <div className="md:col-span-2 space-y-2.5 text-sm">
            <h3 className="font-display font-semibold text-white text-sm">Quick Links</h3>
            <ul className="space-y-2 text-slate-200/85">
              <li>
                <button type="button" onClick={() => onNavigate('/')} className="hover:text-white cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/about')} className="hover:text-white cursor-pointer">
                  About Us
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/services')} className="hover:text-white cursor-pointer">
                  Our Services
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/how-it-works')} className="hover:text-white cursor-pointer">
                  How It Works
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/pricing')} className="hover:text-white cursor-pointer">
                  Pricing &amp; Plans
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-2.5 text-sm">
            <h3 className="font-display font-semibold text-white text-sm">Portals &amp; Partners</h3>
            <ul className="space-y-2 text-slate-200/85">
              <li>
                <button type="button" onClick={() => onNavigate('/portal')} className="hover:text-white cursor-pointer">
                  Family Portal
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/become-caregiver')} className="hover:text-white cursor-pointer">
                  Become a Caregiver
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/partner')} className="hover:text-white cursor-pointer">
                  Partner With Us (Doctors)
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/admin')} className="hover:text-white cursor-pointer">
                  Admin Console (/admin)
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/login')} className="hover:text-white cursor-pointer">
                  Demo Accounts &amp; Sign In
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-2.5 text-sm">
            <h3 className="font-display font-semibold text-white text-sm">Trust &amp; Contact</h3>
            <ul className="space-y-2 text-slate-200/85">
              <li>
                <button type="button" onClick={() => onNavigate('/safety')} className="hover:text-white cursor-pointer">
                  Safety, Privacy &amp; Terms
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/book')} className="hover:text-white cursor-pointer">
                  Book a Care Assessment
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/contact')} className="hover:text-white cursor-pointer">
                  Contact Us
                </button>
              </li>
            </ul>
            <p className="pt-2 text-xs text-slate-300">
              Email: [hello@saharacare.example] · Office: [Pakistan Operations Placeholder]
            </p>
          </div>
        </div>

        <div className="pt-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-300">
          <p>© 2026 Sahara Senior Care. All rights reserved.</p>
          <p className="text-[#D5F5E3] font-medium">
            Sahara Senior Care — Caring for Our Parents. Supporting Our Families. Building a Better Future for Pakistan.
          </p>
        </div>
      </div>
    </footer>
  );
};
