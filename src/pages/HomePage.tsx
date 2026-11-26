import React from 'react';
import {
  ArrowRight,
  CalendarCheck,
  Check,
  HeartHandshake,
  ShieldCheck,
  Stethoscope,
  Users,
  Video,
} from 'lucide-react';
import { ResilientImage } from '../components/ResilientImage';
import { AppRoute, DbCarePlan, DbSiteContent } from '../types/sahara';

interface HomePageProps {
  onNavigate: (path: AppRoute) => void;
  plans: DbCarePlan[];
  siteContent: DbSiteContent[];
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  plans,
  siteContent,
}) => {
  const heroBlock = siteContent.find((c) => c.key === 'hero_headline');
  const announcementBlock = siteContent.find((c) => c.key === 'announcement');

  const heroTitle = heroBlock?.title || 'Because Your Parents Deserve the Best Care.';
  const heroSubtitle =
    heroBlock?.body ||
    'Reliable elderly home-care services, trusted caregivers, healthcare support, and family peace of mind — all connected through one platform.';

  return (
    <div className="bg-[#EAF7F0] text-[#243342]">
      {/* Announcement strip (editable via Admin Dashboard) */}
      {announcementBlock && (
        <div className="bg-[#D5F5E3] border-b border-[#239B56]/25 px-4 py-2.5 text-center text-xs sm:text-sm text-[#1A5276]">
          <span className="font-semibold">{announcementBlock.title}:</span>{' '}
          <span>{announcementBlock.body}</span>
        </div>
      )}

      {/* 1. HERO SECTION */}
      <section className="border-b border-[#239B56]/20 bg-gradient-to-b from-[#D5F5E3]/80 via-[#EAF7F0] to-[#EAF7F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-between py-2">
              <div>
                <p className="text-xs font-semibold tracking-wide text-[#239B56] mb-3">
                  Technology-Enabled Elderly Home-Care Platform · Pakistan
                </p>
                <h1
                  className="font-display font-bold tracking-tight text-[#1A5276] leading-[1.12]"
                  style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)', textWrap: 'balance' }}
                >
                  {heroTitle}
                </h1>
                <p className="mt-5 text-base sm:text-lg text-[#243342]/85 leading-relaxed max-w-xl">
                  {heroSubtitle}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => onNavigate('/book')}
                    className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#1A5276] rounded-xl hover:bg-[#14405D] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Book a Care Assessment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('/services')}
                    className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-[#1A5276] bg-[#D5F5E3]/65 border border-[#239B56]/40 rounded-xl hover:bg-[#D5F5E3] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Explore Our Services</span>
                  </button>
                </div>

                <p className="mt-6 text-sm font-medium text-[#239B56]">
                  Care with dignity. Support with compassion. Technology with purpose.
                </p>
              </div>

              <div className="mt-10 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm font-medium text-[#1A5276]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#239B56] shrink-0" />
                  <span>Trusted Caregiver Network</span>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-[#2E86C1] shrink-0" />
                  <span>Family Care Updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-[#239B56] shrink-0" />
                  <span>Coordinated Healthcare Support</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative h-72 sm:h-96 lg:h-full min-h-[360px] rounded-2xl overflow-hidden border border-[#2E86C1]/25 bg-[#EBF5FB]">
                <ResilientImage
                  src="/src/assets/images/hero_karachi_senior_care_1795688296778.jpg"
                  alt="Elderly Pakistani father sitting comfortably at home with a compassionate Sahara caregiver"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                  <p className="text-xs font-semibold text-[#D5F5E3]">
                    Compassionate Care. Trusted Support. Peace of Mind.
                  </p>
                  <p className="mt-1 text-sm text-white/95 max-w-md">
                    Helping senior citizens live comfortably at home while keeping families informed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MISSION, VISION, PURPOSE & CORE VALUES */}
      <section className="py-16 lg:py-20 bg-[#D5F5E3]/35 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-semibold text-[#239B56] mb-2">
              Our Mission, Vision &amp; Purpose
            </p>
            <h2
              className="font-display font-bold text-[#1A5276]"
              style={{ fontSize: 'clamp(1.65rem, 2.8vw, 2.25rem)', textWrap: 'balance' }}
            >
              Built to ensure no elderly parent feels unsupported or alone.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7">
              <h3 className="font-display text-lg font-bold text-[#1A5276]">Our Mission</h3>
              <p className="mt-3 text-sm text-[#243342]/85 leading-relaxed">
                Our mission is to provide strong, accessible, reliable, and compassionate
                elderly-care facilities to our nation, ensuring that every senior citizen can live
                with dignity, comfort, safety, and respect.
              </p>
              <p className="mt-3 text-sm text-[#243342]/85 leading-relaxed">
                We aim to support families through trusted caregivers, coordinated healthcare
                services, and innovative technology that brings families closer to their loved ones.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7">
              <h3 className="font-display text-lg font-bold text-[#1A5276]">Our Vision</h3>
              <p className="mt-3 text-sm text-[#243342]/85 leading-relaxed">
                To build a trusted elderly-care ecosystem across Pakistan and make quality
                home-based care more accessible, transparent, and affordable for every family.
              </p>
              <div className="mt-6 pt-5 border-t border-slate-100">
                <h4 className="font-display text-base font-bold text-[#239B56]">Our Purpose</h4>
                <p className="mt-2 text-sm text-[#243342]/85 leading-relaxed">
                  To make sure no elderly parent feels forgotten, unsupported, or alone when they
                  need care.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7">
              <h3 className="font-display text-lg font-bold text-[#1A5276]">Our Core Values</h3>
              <ul className="mt-3 space-y-2.5 text-sm text-[#243342]/90">
                <li>
                  <span className="font-semibold text-[#1A5276]">Dignity:</span> Every elderly
                  person deserves respect.
                </li>
                <li>
                  <span className="font-semibold text-[#1A5276]">Trust:</span> Families deserve
                  reliable and transparent care.
                </li>
                <li>
                  <span className="font-semibold text-[#1A5276]">Compassion:</span> Care begins
                  with understanding.
                </li>
                <li>
                  <span className="font-semibold text-[#1A5276]">Safety:</span> Protecting elderly
                  people is our priority.
                </li>
                <li>
                  <span className="font-semibold text-[#1A5276]">Innovation:</span> Technology
                  should improve human care.
                </li>
                <li>
                  <span className="font-semibold text-[#1A5276]">Accessibility:</span> Quality care
                  should become more accessible.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE PROBLEM — 6 REALISTIC CHALLENGES */}
      <section className="py-16 lg:py-20 bg-[#EAF7F0] border-b border-[#239B56]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <p className="text-xs font-semibold text-[#2E86C1] mb-2">
              The Reality Families Face Across Pakistan
            </p>
            <h2
              className="font-display font-bold text-[#1A5276]"
              style={{ fontSize: 'clamp(1.65rem, 2.8vw, 2.35rem)', textWrap: 'balance' }}
            >
              Many Parents Need Support. Many Families Need Peace of Mind.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                num: '01',
                title: 'Parents Living Alone',
                desc: 'An elderly mother or father lives alone while their children work in another city or country. They may need daily assistance, companionship, or help with basic activities.',
                img: '/src/assets/images/elderly_mother_home_1795689976789.jpg',
                alt: 'Elderly Pakistani mother seated comfortably at home',
              },
              {
                num: '02',
                title: 'Difficulty Finding Trusted Caregivers',
                desc: 'Families struggle to identify reliable, trained, and properly screened caregivers. They worry about the safety and well-being of their parents.',
                img: '/src/assets/images/caregiver_team_sahara_1795689987591.jpg',
                alt: 'Trained caregivers in neat uniforms',
              },
              {
                num: '03',
                title: 'Medical Appointments',
                desc: 'Older people may struggle to travel to hospitals for routine consultations and follow-up appointments. Families need help coordinating suitable medical support.',
                img: '/src/assets/images/doctor_home_visit_1795688298421.jpg',
                alt: 'Doctor conducting a home checkup for an elderly patient',
              },
              {
                num: '04',
                title: 'Lack of Family Updates',
                desc: 'Children living abroad or away from home may not know whether a caregiver arrived, whether a visit happened, or what assistance was provided.',
                img: '/src/assets/images/after_family_videocall_1795689977338.jpg',
                alt: 'Elderly mother smiling with family on tablet',
              },
              {
                num: '05',
                title: 'Emergency Concerns',
                desc: 'Families worry about falls, sudden illness, and situations in which an elderly person may need urgent assistance.',
                img: '/src/assets/images/visit_log_tea_medication_1795688297808.jpg',
                alt: 'Blood pressure monitor and organized medication box at home',
              },
              {
                num: '06',
                title: 'Emotional Loneliness',
                desc: 'Some elderly people experience loneliness because their family members are busy or live far away. They need companionship, respect, and meaningful human interaction.',
                img: '/src/assets/images/elderly_couple_home_1795689977951.jpg',
                alt: 'Elderly couple enjoying tea and companionship at home',
              },
            ].map((item) => (
              <div
                key={item.num}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden flex flex-col"
              >
                <div className="h-44 w-full bg-slate-100 border-b border-slate-200 overflow-hidden">
                  <ResilientImage
                    src={item.img}
                    alt={item.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex-1">
                  <p className="font-mono text-xs font-semibold text-[#2E86C1]">
                    Challenge {item.num}
                  </p>
                  <h3 className="mt-1.5 font-display text-lg font-bold text-[#1A5276]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#243342]/85 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-base font-medium text-[#1A5276] max-w-3xl mx-auto">
            These are not just healthcare challenges. They are family challenges. Sahara Senior
            Care aims to bring a more organized, trustworthy, and compassionate solution.
          </p>
        </div>
      </section>

      {/* 4. BEFORE AND AFTER TRANSFORMATION */}
      <section className="py-16 lg:py-20 bg-[#EBF5FB] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <p className="text-xs font-semibold text-[#1A5276] mb-2">
              Illustrative Service Experience
            </p>
            <h2
              className="font-display font-bold text-[#1A5276]"
              style={{ fontSize: 'clamp(1.65rem, 2.8vw, 2.35rem)', textWrap: 'balance' }}
            >
              From Fragmented Worries to Organized Home Care
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* BEFORE */}
            <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
              <div className="h-60 w-full border-b border-slate-200 overflow-hidden">
                <ResilientImage
                  src="/src/assets/images/before_alone_parent_1795689976730.jpg"
                  alt="Elderly parent sitting alone by a sunlit window"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 sm:p-8">
                <p className="text-xs font-semibold text-slate-500">Before Sahara</p>
                <h3 className="mt-1 font-display text-xl font-bold text-[#243342]">
                  Before: Families Are Worried
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-[#243342]/85">
                  <li>· Uncertain caregiver arrangements</li>
                  <li>· No organized visit tracking</li>
                  <li>· Difficulty coordinating medical appointments</li>
                  <li>· Limited updates for family members</li>
                  <li>· Stress for children living away</li>
                  <li>· Elderly parents may lack regular assistance</li>
                </ul>
              </div>
            </div>

            {/* WITH SAHARA */}
            <div className="rounded-2xl bg-white border-2 border-[#239B56] overflow-hidden">
              <div className="h-60 w-full border-b border-slate-200 overflow-hidden">
                <ResilientImage
                  src="/src/assets/images/after_family_videocall_1795689977338.jpg"
                  alt="Elderly mother smiling with caregiver while video calling family"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 sm:p-8">
                <p className="text-xs font-semibold text-[#239B56]">With Sahara Senior Care</p>
                <h3 className="mt-1 font-display text-xl font-bold text-[#1A5276]">
                  With Sahara: Care Becomes More Organized
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-[#243342]/90">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#239B56] shrink-0" />
                    <span>Vetted caregiver arrangements</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#239B56] shrink-0" />
                    <span>Scheduled care visits &amp; digital visit records</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#239B56] shrink-0" />
                    <span>Authorized family updates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#239B56] shrink-0" />
                    <span>Coordinated doctor appointments</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#239B56] shrink-0" />
                    <span>A dedicated care coordination contact</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="mt-8 bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[#1A5276] text-white">
                  <th className="py-3.5 px-6 font-display font-semibold">Before</th>
                  <th className="py-3.5 px-6 font-display font-semibold">With Sahara</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {[
                  ['Uncertain arrangements', 'Organized care plans'],
                  ['Manual coordination', 'Centralized coordination'],
                  ['Limited visit visibility', 'Digital visit records'],
                  ['Difficult appointment planning', 'Doctor coordination'],
                  ['Family communication gaps', 'Authorized family updates'],
                  ['Stressful arrangements', 'More organized support'],
                ].map(([before, after]) => (
                  <tr key={before}>
                    <td className="py-3 px-6 text-[#243342]/80">{before}</td>
                    <td className="py-3 px-6 font-semibold text-[#239B56]">{after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="px-6 py-3 bg-slate-50 text-xs text-slate-600 border-t border-slate-200">
              Note: Shown as an illustrative service experience, not a guaranteed medical outcome
              or claim that every family will experience identical results.
            </p>
          </div>
        </div>
      </section>

      {/* 5. OUR SERVICES SUMMARY */}
      <section className="py-16 lg:py-20 bg-[#EAF7F0] border-b border-[#239B56]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold text-[#239B56] mb-2">Comprehensive Home Care</p>
              <h2
                className="font-display font-bold text-[#1A5276]"
                style={{ fontSize: 'clamp(1.65rem, 2.8vw, 2.35rem)' }}
              >
                Six Core Support Services
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/services')}
              className="text-sm font-semibold text-[#2E86C1] hover:underline underline-offset-4 cursor-pointer"
            >
              View All Service Details →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Personal Elderly Care',
                desc: 'Daily living support, mobility assistance, meal help, routine reminders, and respectful non-medical home care.',
                cta: 'Explore Personal Care',
                to: '/services' as AppRoute,
              },
              {
                title: 'Trained Caregiver Network',
                desc: 'Identity verification, reference checks, background screening where legally available, skills assessment, and monitoring.',
                cta: 'Find a Caregiver',
                to: '/book' as AppRoute,
              },
              {
                title: 'Doctor Home Visits',
                desc: 'Coordinated consultations with qualified licensed doctors at home, with family-approved summaries.',
                cta: 'Request a Doctor',
                to: '/partner' as AppRoute,
              },
              {
                title: 'Emergency Assistance Coordination',
                desc: 'Clear escalation steps alerting family and coordination team (response subject to operational hours & partner capacity).',
                cta: 'Explore Emergency Support',
                to: '/safety' as AppRoute,
              },
              {
                title: 'Family Monitoring Portal',
                desc: 'Authorized digital access to visit schedules, attendance records, care summaries, and service invoices.',
                cta: 'Explore Family Portal',
                to: '/portal' as AppRoute,
              },
              {
                title: 'Companionship & Well-being',
                desc: 'Warm conversation, reading assistance, light recreational activities, and social engagement at home.',
                cta: 'Book Companionship',
                to: '/book' as AppRoute,
              },
            ].map((srv) => (
              <div
                key={srv.title}
                className="rounded-2xl border border-[#2E86C1]/20 bg-[#EBF5FB]/45 p-6 flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-display text-lg font-bold text-[#1A5276]">{srv.title}</h3>
                  <p className="mt-2.5 text-sm text-[#243342]/85 leading-relaxed">{srv.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate(srv.to)}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#2E86C1] hover:text-[#1A5276] cursor-pointer"
                >
                  <span>{srv.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS (6 STEPS) */}
      <section className="py-16 lg:py-20 bg-[#D5F5E3]/30 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-semibold text-[#239B56] mb-2">Organized Onboarding</p>
            <h2
              className="font-display font-bold text-[#1A5276]"
              style={{ fontSize: 'clamp(1.65rem, 2.8vw, 2.35rem)' }}
            >
              How Sahara Senior Care Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              ['Step 1', 'Family Contacts Sahara', 'Submit name, contact, city, basic requirements, preferred service, and schedule online.'],
              ['Step 2', 'Care Assessment', 'Our coordinator contacts your family to review daily support, mobility, and medical coordination needs.'],
              ['Step 3', 'Care Plan and Pricing', 'Receive a clear proposed plan detailing services, care hours, pricing, limitations, and terms.'],
              ['Step 4', 'Caregiver Matching', 'Review a matched caregiver selected by availability, skills, language, and neighbourhood before confirming.'],
              ['Step 5', 'Care Begins', 'Visits proceed with check-in/check-out records, care notes, incident tracking, and coordinator follow-ups.'],
              ['Step 6', 'Family Updates & Support', 'Authorized family members view updates in the Family Portal alongside ongoing reviews and renewals.'],
            ].map(([step, title, desc]) => (
              <div key={step} className="bg-white rounded-2xl border border-slate-200 p-6">
                <span className="font-mono text-xs font-semibold text-[#239B56]">{step}</span>
                <h3 className="mt-1.5 font-display text-base font-bold text-[#1A5276]">{title}</h3>
                <p className="mt-2 text-sm text-[#243342]/85 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. REAL-LIFE FAMILY EXAMPLES */}
      <section className="py-16 lg:py-20 bg-[#EAF7F0] border-b border-[#239B56]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-semibold text-[#2E86C1] mb-2">
              Illustrative Family Scenarios
            </p>
            <h2
              className="font-display font-bold text-[#1A5276]"
              style={{ fontSize: 'clamp(1.65rem, 2.8vw, 2.35rem)' }}
            >
              Care That Understands Real Families.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              {
                label: 'Illustrative family scenario · Example A',
                title: 'The Overseas Son (UK & Quetta)',
                situation:
                  'A son lives in the United Kingdom while his elderly mother lives in Quetta, Pakistan, worrying because he cannot visit daily.',
                support:
                  'Sahara helps arrange a suitable caregiver, schedules regular visits, provides authorized visit updates, and coordinates doctor appointments when requested.',
                result:
                  'Better visibility into care arrangements while his mother receives organized support at home.',
              },
              {
                label: 'Illustrative family scenario · Example B',
                title: 'The Busy Working Family (Karachi)',
                situation:
                  'A working family in Karachi needs dependable daytime support for their elderly father while at work.',
                support:
                  'Agreed care schedule, matched caregiver, recorded attendance, structured care summaries, and coordinated follow-ups.',
                result:
                  'A reliable, organized care routine that supports both father and family.',
              },
              {
                label: 'Illustrative family scenario · Example C',
                title: 'The Elderly Couple',
                situation:
                  'An elderly couple remains independent in daily life but needs assistance with household routines and appointments.',
                support:
                  'Tailored home assistance, appointment coordination, respectful companionship, and updates for authorized family members.',
                result:
                  'The couple receives support while preserving independence at home.',
              },
            ].map((sc) => (
              <div
                key={sc.title}
                className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 flex flex-col justify-between"
              >
                <div>
                  <p className="text-xs font-medium text-[#2E86C1]">{sc.label}</p>
                  <h3 className="mt-1.5 font-display text-lg font-bold text-[#1A5276]">
                    {sc.title}
                  </h3>
                  <p className="mt-3 text-sm text-[#243342]/85">
                    <span className="font-semibold text-[#243342]">Situation:</span> {sc.situation}
                  </p>
                  <p className="mt-2.5 text-sm text-[#243342]/85">
                    <span className="font-semibold text-[#243342]">Proposed Support:</span>{' '}
                    {sc.support}
                  </p>
                </div>
                <p className="mt-4 pt-4 border-t border-slate-200 text-sm text-[#239B56] font-medium">
                  Outcome: {sc.result}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. PRICING OVERVIEW */}
      <section className="py-16 lg:py-20 bg-[#D5F5E3]/55 border-b border-[#239B56]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold text-[#239B56] mb-2">
                Illustrative Starting Packages (Editable in Admin)
              </p>
              <h2
                className="font-display font-bold text-[#1A5276]"
                style={{ fontSize: 'clamp(1.65rem, 2.8vw, 2.35rem)' }}
              >
                Transparent Care Plans
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/pricing')}
              className="text-sm font-semibold text-[#2E86C1] hover:underline underline-offset-4 cursor-pointer"
            >
              Compare Full Plans &amp; Custom Options →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-2xl bg-white p-6 flex flex-col justify-between ${
                  plan.isFeatured
                    ? 'border-2 border-[#1A5276]'
                    : 'border border-slate-200'
                }`}
              >
                <div>
                  <h3 className="font-display text-lg font-bold text-[#1A5276]">{plan.name}</h3>
                  <p className="mt-1 text-xs text-[#243342]/80">{plan.tagline}</p>
                  <div className="mt-4 pb-4 border-b border-slate-200">
                    <span className="text-xs text-slate-500 block">Starting from</span>
                    <span className="font-mono tabular-nums text-2xl font-bold text-[#1A5276]">
                      PKR {plan.monthlyPricePkr.toLocaleString('en-PK')}
                    </span>
                    <span className="text-xs text-slate-500"> / month</span>
                  </div>
                  <p className="mt-4 text-xs font-semibold text-[#239B56]">{plan.hoursSummary}</p>
                  <p className="mt-1 text-xs text-[#243342]/80">{plan.visitsSummary}</p>
                  <p className="mt-3 text-xs text-slate-500 leading-relaxed">{plan.exclusions}</p>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate('/book')}
                  className="mt-6 w-full py-2.5 px-4 text-sm font-semibold text-white bg-[#1A5276] rounded-xl hover:bg-[#14405D] transition-colors cursor-pointer"
                >
                  Book Assessment
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. INVESTOR, NIC & ROADMAP SECTION */}
      <section className="py-16 lg:py-20 bg-[#EAF7F0] border-b border-[#239B56]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5">
              <p className="text-xs font-semibold text-[#239B56] mb-2">
                HealthTech Infrastructure for Pakistan
              </p>
              <h2
                className="font-display font-bold text-[#1A5276]"
                style={{ fontSize: 'clamp(1.65rem, 2.8vw, 2.25rem)', textWrap: 'balance' }}
              >
                Building a Better Future for Elderly Care in Pakistan.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[#243342]/85 leading-relaxed">
                We believe every senior citizen deserves dignity, safety, and compassionate
                support. Sahara Senior Care aims to make organized home-based elderly care more
                accessible through trained people, responsible partnerships, and technology.
              </p>
              <div className="mt-6 rounded-xl bg-[#D5F5E3]/50 border border-[#239B56]/30 p-5 text-sm space-y-2">
                <p className="font-semibold text-[#1A5276]">Platform Pillars</p>
                <p className="text-xs text-[#243342]/85">
                  · Addressing real-world eldercare &amp; overseas family coordination gaps
                </p>
                <p className="text-xs text-[#243342]/85">
                  · Structured caregiver training, dignified employment &amp; digital transparency
                </p>
                <p className="text-xs text-[#243342]/85">
                  · Recurring care plans, GP visit coordination &amp; multi-city scalability
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                {
                  phase: 'Phase 1 — Foundation',
                  points: [
                    'Validate family needs',
                    'Recruit and assess caregivers',
                    'Launch booking and admin management',
                    'Start focused city pilot',
                  ],
                },
                {
                  phase: 'Phase 2 — Digital Care Management',
                  points: [
                    'Family & Caregiver dashboards',
                    'Visit check-in/out tracking',
                    'Secure care summaries',
                    'Licensed doctor partnerships',
                  ],
                },
                {
                  phase: 'Phase 3 — Expanded Services',
                  points: [
                    'Tested emergency coordination protocols',
                    'Wearable alert device exploration',
                    'Operational reporting & analytics',
                    'Additional neighbourhood coverage',
                  ],
                },
                {
                  phase: 'Phase 4 — National Expansion',
                  points: [
                    'Expand across major Pakistani cities',
                    'Deeper hospital & GP networks',
                    'Structured caregiver training academy',
                    'Scalable national eldercare ecosystem',
                  ],
                },
              ].map((road) => (
                <div
                  key={road.phase}
                  className="rounded-2xl border border-[#2E86C1]/20 bg-[#EBF5FB]/45 p-5"
                >
                  <h3 className="font-display text-sm font-bold text-[#1A5276]">{road.phase}</h3>
                  <ul className="mt-3 space-y-1.5 text-xs sm:text-sm text-[#243342]/85">
                    {road.points.map((pt) => (
                      <li key={pt}>· {pt}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 10. MULTI-STAKEHOLDER ACTION STRIP */}
      <section className="py-14 bg-[#D5F5E3]/45">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-5">
          <button
            type="button"
            onClick={() => onNavigate('/book')}
            className="text-left rounded-2xl bg-[#1A5276] text-white p-6 hover:bg-[#14405D] transition-colors cursor-pointer"
          >
            <CalendarCheck className="w-6 h-6 text-[#D5F5E3] mb-3" />
            <h3 className="font-display font-bold text-base">Book Care Assessment</h3>
            <p className="mt-1 text-xs text-slate-200">Start an assessment for your parents.</p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('/become-caregiver')}
            className="text-left rounded-2xl bg-white border border-slate-200 p-6 hover:border-[#239B56] transition-colors cursor-pointer"
          >
            <Users className="w-6 h-6 text-[#239B56] mb-3" />
            <h3 className="font-display font-bold text-base text-[#1A5276]">Become a Caregiver</h3>
            <p className="mt-1 text-xs text-[#243342]/80">Apply to join our vetted caregiver team.</p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('/partner')}
            className="text-left rounded-2xl bg-white border border-slate-200 p-6 hover:border-[#2E86C1] transition-colors cursor-pointer"
          >
            <Stethoscope className="w-6 h-6 text-[#2E86C1] mb-3" />
            <h3 className="font-display font-bold text-base text-[#1A5276]">Partner With Us</h3>
            <p className="mt-1 text-xs text-[#243342]/80">Doctors, clinics &amp; healthcare partners.</p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('/login')}
            className="text-left rounded-2xl bg-white border border-slate-200 p-6 hover:border-[#1A5276] transition-colors cursor-pointer"
          >
            <HeartHandshake className="w-6 h-6 text-[#1A5276] mb-3" />
            <h3 className="font-display font-bold text-base text-[#1A5276]">Explore Demo Portals</h3>
            <p className="mt-1 text-xs text-[#243342]/80">
              Try Family, Caregiver, Doctor &amp; Admin views.
            </p>
          </button>
        </div>
      </section>
    </div>
  );
};
