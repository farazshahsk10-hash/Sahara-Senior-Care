import React from 'react';
import {
  AlertCircle,
  ArrowRight,
  Check,
  FileCheck2,
  HeartHandshake,
  Lock,
  ShieldCheck,
  Stethoscope,
  Users,
} from 'lucide-react';
import { ResilientImage } from '../components/ResilientImage';
import { AppRoute, DbCarePlan } from '../types/sahara';

interface InfoPageProps {
  onNavigate: (path: AppRoute) => void;
  plans?: DbCarePlan[];
}

export const AboutPage: React.FC<InfoPageProps> = ({ onNavigate }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-14">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
      <div className="lg:col-span-6">
        <p className="text-xs font-semibold text-[#239B56] mb-2">About Sahara Senior Care</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1A5276]">
          Building a Better Future for Elderly Care in Pakistan.
        </h1>
        <p className="mt-4 text-base text-[#243342]/85 leading-relaxed">
          Sahara Senior Care is a technology-enabled elderly-care management platform connecting
          families, trained caregivers, and licensed healthcare professionals through organized
          home-care services.
        </p>
        <p className="mt-3 text-base text-[#243342]/85 leading-relaxed">
          We exist so elderly parents can age with dignity, comfort, and safety in their own homes
          while local and overseas families stay informed with clear, authorized updates.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onNavigate('/book')}
            className="px-5 py-3 text-sm font-semibold text-white bg-[#1A5276] rounded-xl hover:bg-[#14405D] cursor-pointer"
          >
            Book a Care Assessment
          </button>
          <button
            type="button"
            onClick={() => onNavigate('/safety')}
            className="px-5 py-3 text-sm font-semibold text-[#1A5276] border border-slate-300 rounded-xl hover:bg-slate-50 cursor-pointer"
          >
            Safety &amp; Privacy Standards
          </button>
        </div>
      </div>

      <div className="lg:col-span-6 h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200">
        <ResilientImage
          src="/src/assets/images/elderly_couple_home_1795689977951.jpg"
          alt="Elderly Pakistani couple enjoying tea together at home"
          className="w-full h-full object-cover"
        />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="rounded-2xl bg-[#D5F5E3]/40 border border-[#239B56]/25 p-6">
        <h2 className="font-display text-lg font-bold text-[#1A5276]">Mission</h2>
        <p className="mt-2 text-sm text-[#243342]/85 leading-relaxed">
          Provide strong, accessible, reliable, and compassionate elderly-care facilities across
          Pakistan, ensuring senior citizens live with dignity, comfort, safety, and respect.
        </p>
      </div>
      <div className="rounded-2xl bg-[#EBF5FB] border border-[#2E86C1]/30 p-6">
        <h2 className="font-display text-lg font-bold text-[#1A5276]">Vision</h2>
        <p className="mt-2 text-sm text-[#243342]/85 leading-relaxed">
          Build a trusted elderly-care ecosystem across Pakistan and make quality home-based care
          more accessible, transparent, and affordable for every family.
        </p>
      </div>
      <div className="rounded-2xl bg-[#F8FAFC] border border-slate-200 p-6">
        <h2 className="font-display text-lg font-bold text-[#1A5276]">Purpose</h2>
        <p className="mt-2 text-sm text-[#243342]/85 leading-relaxed">
          Make sure no elderly parent feels forgotten, unsupported, or alone when they need care.
        </p>
      </div>
    </div>
  </div>
);

export const ServicesPage: React.FC<InfoPageProps> = ({ onNavigate }) => {
  const services = [
    {
      title: '1. Personal Elderly Care',
      img: '/src/assets/images/hero_karachi_senior_care_1795688296778.jpg',
      desc: 'Supportive daily living assistance in the comfort of home, tailored to each senior’s agreed routine.',
      points: [
        'Daily living & mobility assistance',
        'Personal hygiene assistance where agreed and appropriate',
        'Meal assistance, routine reminders & non-medical support',
      ],
      cta: 'Explore Personal Care',
      action: () => onNavigate('/book'),
    },
    {
      title: '2. Trained Caregiver Network',
      img: '/src/assets/images/caregiver_team_sahara_1795689987591.jpg',
      desc: 'Connect families with caregivers screened through structured identity, reference, and skills checks.',
      points: [
        'Identity verification, reference checks & background screening where legally available',
        'Skills assessment, relevant training & written service agreements',
        'Ongoing performance monitoring (non-medical unless clinically certified)',
      ],
      cta: 'Find a Caregiver',
      action: () => onNavigate('/book'),
    },
    {
      title: '3. Doctor Home Visits',
      img: '/src/assets/images/doctor_home_visit_1795688298421.jpg',
      desc: 'Coordinated home consultations with qualified, licensed Pakistani doctors to reduce stressful clinic travel.',
      points: [
        'Home consultation requests & appointment scheduling',
        'Follow-up & referral coordination',
        'All diagnoses and prescriptions remain strictly with licensed doctors',
      ],
      cta: 'Request a Doctor',
      action: () => onNavigate('/book'),
    },
    {
      title: '4. Emergency Assistance Coordination',
      img: '/src/assets/images/visit_log_tea_medication_1795688297808.jpg',
      desc: 'Structured escalation workflow linking emergency alerts to family contacts, coordinators, and partner services.',
      points: [
        'Emergency contact records & family notification routing',
        'Care coordination desk alerts during published operating hours',
        'Clear disclaimer: response times depend on traffic, connectivity & partner capacity and are not guaranteed',
      ],
      cta: 'Review Safety Protocol',
      action: () => onNavigate('/safety'),
    },
    {
      title: '5. Family Monitoring Portal',
      img: '/src/assets/images/after_family_videocall_1795689977338.jpg',
      desc: 'A secure digital portal keeping authorized local and overseas family members informed.',
      points: [
        'Scheduled visit dates, caregiver attendance & daily care summaries',
        'Appointment tracking, service invoices & coordinator messaging',
        'Explicit consent required before capturing or sharing photos or sensitive records',
      ],
      cta: 'Explore Family Portal',
      action: () => onNavigate('/portal'),
    },
    {
      title: '6. Companionship and Well-being',
      img: '/src/assets/images/visit_log_morning_walk_1795688297964.jpg',
      desc: 'Respectful human presence to help reduce isolation and brighten daily routines at home.',
      points: [
        'Conversation, reading assistance & light recreational activities',
        'Family-approved outings or courtyard walks',
        'Supportive social companionship (not psychiatric or clinical therapy)',
      ],
      cta: 'Book Companionship',
      action: () => onNavigate('/book'),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold text-[#239B56] mb-2">Our Services</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1A5276]">
          Structured Support Designed Around Home Dignity
        </h1>
        <p className="mt-3 text-base text-[#243342]/85">
          Every service operates under clear written agreements, verified staff onboarding, and
          family consent.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((s) => (
          <div
            key={s.title}
            className="rounded-2xl border border-slate-200 bg-white overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="h-56 w-full border-b border-slate-200 overflow-hidden">
                <ResilientImage src={s.img} alt={s.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h2 className="font-display text-xl font-bold text-[#1A5276]">{s.title}</h2>
                <p className="mt-2 text-sm text-[#243342]/85 leading-relaxed">{s.desc}</p>
                <ul className="mt-4 space-y-1.5 text-sm text-[#243342]/90">
                  {s.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#239B56] shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="px-6 pb-6">
              <button
                type="button"
                onClick={s.action}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#1A5276] rounded-xl hover:bg-[#14405D] cursor-pointer"
              >
                <span>{s.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const HowItWorksPage: React.FC<InfoPageProps> = ({ onNavigate }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
    <div className="max-w-2xl">
      <p className="text-xs font-semibold text-[#2E86C1] mb-2">Step-by-Step Process</p>
      <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1A5276]">
        How Sahara Senior Care Works
      </h1>
      <p className="mt-3 text-base text-[#243342]/85">
        From initial assessment to verified daily visits, every step is transparent for your whole
        family.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        {
          step: 'STEP 1 — Family Contacts Sahara',
          body: 'Submit your name, phone, city, basic care needs, preferred service, and schedule online.',
        },
        {
          step: 'STEP 2 — Care Assessment',
          body: 'Our coordination team evaluates required support, mobility, schedule, and medical coordination needs (clinical assessments performed by qualified professionals when needed).',
        },
        {
          step: 'STEP 3 — Care Plan and Pricing',
          body: 'Receive a clear written proposal covering services included, hours, schedule, transparent PKR pricing, limitations, and terms.',
        },
        {
          step: 'STEP 4 — Caregiver Matching',
          body: 'Review our proposed caregiver match based on skills, experience, location, and family preferences before confirming.',
        },
        {
          step: 'STEP 5 — Care Begins',
          body: 'Caregiver delivers agreed support with recorded check-in/check-out, care notes, incident tracking, and coordinator follow-ups.',
        },
        {
          step: 'STEP 6 — Family Updates & Support',
          body: 'Authorized family members track updates via the Family Portal while Sahara manages ongoing reviews and renewals.',
        },
      ].map((item) => (
        <div key={item.step} className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6">
          <h2 className="font-display text-base font-bold text-[#1A5276]">{item.step}</h2>
          <p className="mt-2.5 text-sm text-[#243342]/85 leading-relaxed">{item.body}</p>
        </div>
      ))}
    </div>

    <div className="rounded-2xl bg-[#D5F5E3]/45 border border-[#239B56]/25 p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h3 className="font-display text-xl font-bold text-[#1A5276]">
          Ready to arrange a Care Assessment?
        </h3>
        <p className="mt-1 text-sm text-[#243342]/85">
          Takes less than 2 minutes to submit your family&apos;s request.
        </p>
      </div>
      <button
        type="button"
        onClick={() => onNavigate('/book')}
        className="px-6 py-3 text-sm font-semibold text-white bg-[#1A5276] rounded-xl hover:bg-[#14405D] whitespace-nowrap cursor-pointer"
      >
        Book a Care Assessment
      </button>
    </div>
  </div>
);

export const PricingPage: React.FC<InfoPageProps> = ({ onNavigate, plans = [] }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
    <div className="max-w-3xl">
      <p className="text-xs font-semibold text-[#239B56] mb-2">
        Pricing &amp; Unit Economics (Illustrative Starting Rates)
      </p>
      <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1A5276]">
        Clear Care Packages Built for Pakistani Families
      </h1>
      <p className="mt-3 text-base text-[#243342]/85 leading-relaxed">
        Prices below are illustrative starting rates editable via the Admin Dashboard. Final pricing
        is confirmed in writing after a Care Assessment based on location, hours, and support needs.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={`rounded-2xl bg-white p-6 flex flex-col justify-between ${
            plan.isFeatured ? 'border-2 border-[#1A5276]' : 'border border-slate-200'
          }`}
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-lg font-bold text-[#1A5276]">{plan.name}</h2>
              {plan.isFeatured && (
                <span className="text-xs font-semibold text-[#239B56]">Featured</span>
              )}
            </div>
            <p className="mt-1 text-xs text-[#243342]/80">{plan.tagline}</p>

            <div className="mt-5 pb-4 border-b border-slate-200">
              <span className="text-xs text-slate-500 block">Starting from</span>
              <span className="font-mono tabular-nums text-2xl font-bold text-[#1A5276]">
                PKR {plan.monthlyPricePkr.toLocaleString('en-PK')}
              </span>
              <span className="text-xs text-slate-500"> / month</span>
            </div>

            <div className="mt-4 space-y-2 text-xs text-[#243342]/90">
              <p className="font-semibold text-[#239B56]">{plan.hoursSummary}</p>
              <p>{plan.visitsSummary}</p>
              <p className="pt-2 border-t border-slate-100 text-slate-600 leading-relaxed">
                {plan.exclusions}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('/book')}
            className="mt-6 w-full py-2.5 px-4 text-sm font-semibold text-white bg-[#1A5276] rounded-xl hover:bg-[#14405D] cursor-pointer"
          >
            Select &amp; Book Assessment
          </button>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 sm:p-8">
        <h3 className="font-display text-xl font-bold text-[#1A5276]">
          Additional Services &amp; Transparent Revenue Model
        </h3>
        <ul className="mt-4 space-y-2.5 text-sm text-[#243342]/90">
          <li>· Monthly caregiver service subscriptions (hour-bounded schedules)</li>
          <li>· Doctor home-visit coordination fees (disclosed flat PKR 3,500 example fee)</li>
          <li>· Optional emergency-support coordination subscriptions (subject to tested protocol)</li>
          <li>· Wearable alert device sales &amp; setup</li>
          <li>· Custom care plans tailored to multi-shift or couple requirements</li>
        </ul>
      </div>

      <div className="lg:col-span-5 rounded-2xl border border-[#1A5276]/25 bg-[#D5F5E3]/40 p-6 sm:p-8 flex flex-col justify-between">
        <div>
          <h3 className="font-display text-xl font-bold text-[#1A5276]">
            Need Tailored Hours or Couple Care?
          </h3>
          <p className="mt-2 text-sm text-[#243342]/85">
            Request a custom service schedule with transparent pricing and no obligation.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('/book')}
          className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#239B56] rounded-xl hover:bg-[#1D8348] cursor-pointer"
        >
          <span>Request a Custom Plan</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

export const SafetyPage: React.FC<InfoPageProps> = () => (
  <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
    <div>
      <p className="text-xs font-semibold text-[#239B56] mb-2">Safeguarding &amp; Governance</p>
      <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1A5276]">
        Safety, Trust, Privacy &amp; Terms
      </h1>
      <p className="mt-3 text-base text-[#243342]/85 leading-relaxed">
        Protecting senior citizens and safeguarding family data are foundational to Sahara Senior
        Care. Screening and verification are conducted according to documented operating procedures
        and applicable Pakistani laws.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        {
          icon: ShieldCheck,
          title: 'Caregiver Screening & Verification',
          points: [
            'CNIC identity verification & documented address records',
            'Personal & professional reference checks',
            'Background screening where legally available',
            'Practical skills & safety training assessments prior to placement',
          ],
        },
        {
          icon: Lock,
          title: 'Privacy, Consent & Confidentiality',
          points: [
            'Explicit family consent before recording or sharing photos or care summaries',
            'Role-based access control: caregivers see only assigned visits; doctors see consented records',
            'Zero public exposure of identity documents, home addresses, or health logs',
            'Regular service reviews & documented complaint handling',
          ],
        },
        {
          icon: FileCheck2,
          title: 'Clear Service Agreements',
          points: [
            'Written scope of non-medical vs clinical duties',
            'Refundable security deposits held distinctly from service revenue',
            'Clear cancellation, replacement, and escalation policies',
          ],
        },
        {
          icon: AlertCircle,
          title: 'Emergency Escalation Boundaries',
          points: [
            'Emergency coordination features activate only with tested protocols and partner arrangements',
            'Operates as an alert and coordination workflow, not an emergency medical guarantee',
            'Every reported incident is logged, escalated to family, and reviewed before closure',
          ],
        },
      ].map((block) => {
        const Icon = block.icon;
        return (
          <div key={block.title} className="rounded-2xl border border-slate-200 bg-white p-6">
            <Icon className="w-6 h-6 text-[#1A5276] mb-3" />
            <h2 className="font-display text-lg font-bold text-[#1A5276]">{block.title}</h2>
            <ul className="mt-3 space-y-2 text-sm text-[#243342]/85">
              {block.points.map((pt) => (
                <li key={pt}>· {pt}</li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  </div>
);

export const PartnerPage: React.FC<InfoPageProps> = ({ onNavigate }) => (
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
      <div className="lg:col-span-6">
        <p className="text-xs font-semibold text-[#2E86C1] mb-2">
          Doctors, Clinics &amp; Institutional Partners
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1A5276]">
          Partner With Sahara Senior Care
        </h1>
        <p className="mt-4 text-base text-[#243342]/85 leading-relaxed">
          We collaborate with licensed general practitioners, geriatric specialists, diagnostic labs,
          hospitals, and community organizations to bring coordinated healthcare into seniors&apos;
          homes.
        </p>
        <div className="mt-6 space-y-3 text-sm text-[#243342]/90">
          <div className="flex items-start gap-2.5">
            <Stethoscope className="w-5 h-5 text-[#239B56] shrink-0 mt-0.5" />
            <span>
              <strong>Licensed Physicians:</strong> Receive scheduled home consultation requests,
              consented patient background, and digital consultation logging.
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <Users className="w-5 h-5 text-[#2E86C1] shrink-0 mt-0.5" />
            <span>
              <strong>Hospitals &amp; Labs:</strong> Seamless post-discharge home follow-up and
              at-home sample collection referrals.
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <HeartHandshake className="w-5 h-5 text-[#1A5276] shrink-0 mt-0.5" />
            <span>
              <strong>Corporate &amp; Incubator Allies:</strong> Collaborating across Pakistan to
              elevate eldercare standards.
            </span>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onNavigate('/contact')}
            className="px-6 py-3 text-sm font-semibold text-white bg-[#1A5276] rounded-xl hover:bg-[#14405D] cursor-pointer"
          >
            Submit Partnership Inquiry
          </button>
          <button
            type="button"
            onClick={() => onNavigate('/login')}
            className="px-5 py-3 text-sm font-semibold text-[#1A5276] border border-slate-300 rounded-xl hover:bg-slate-50 cursor-pointer"
          >
            Preview Doctor Partner Portal
          </button>
        </div>
      </div>

      <div className="lg:col-span-6 h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200">
        <ResilientImage
          src="/src/assets/images/doctor_home_visit_1795688298421.jpg"
          alt="Licensed Pakistani physician conducting a respectful home checkup"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  </div>
);
