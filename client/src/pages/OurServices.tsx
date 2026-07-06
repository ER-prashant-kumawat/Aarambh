import { Link } from 'react-router-dom';
import JoinSection from '../components/JoinSection';
import { GOOGLE_FORM_URL } from '../constants/data';
import {
  Landmark, Building2, Handshake, UserCheck,
  MonitorSmartphone, Globe, ShieldCheck, Vault,
  FileSignature, ScrollText, Briefcase, Lock, ArrowRight
} from 'lucide-react';

const SECTIONS = [
  {
    emoji: '🏛️',
    icon: Landmark,
    accent: 'emerald',
    title: 'Corporate Structuring & Incorporation',
    intro: 'The right entity structure dictates your ability to raise funds, protect personal assets, and scale.',
    items: [
      {
        icon: Building2,
        name: 'Private Limited Company (Pvt Ltd)',
        tag: 'The Gold Standard',
        desc: 'The gold standard for high-growth startups. Ideal if you plan to raise venture capital, issue ESOPs to employees, and require a highly scalable equity structure.',
      },
      {
        icon: Handshake,
        name: 'Limited Liability Partnership (LLP)',
        tag: "The Bootstrapper's Shield",
        desc: 'Perfect for service-based businesses, agencies, and tech-founders who want premium personal asset protection without the heavy, expensive statutory audit compliance of a Pvt Ltd.',
      },
      {
        icon: UserCheck,
        name: 'One Person Company (OPC)',
        tag: "The Solo Founder's Launchpad",
        desc: 'Transition from a sole proprietorship to a recognized corporate entity with limited liability, while retaining 100% control.',
      },
    ],
  },
  {
    emoji: '💻',
    icon: MonitorSmartphone,
    accent: 'blue',
    title: 'Secure Digital Infrastructure (Tech)',
    intro: "Traditional law firms don't write code. We build your digital footprint to pass enterprise IT audits.",
    items: [
      {
        icon: Globe,
        name: 'Express Web Presence',
        tag: 'Live in 3 Days',
        desc: 'From domain procurement to custom responsive web deployment, we get your brand live before your competitors even finish drafting their ideas.',
      },
      {
        icon: ShieldCheck,
        name: 'Enterprise-Grade SSL Security',
        tag: 'Top-Tier Encryption',
        desc: 'We secure your platform with top-tier encryption, ensuring you meet global data security standards and build instant trust with your users.',
      },
      {
        icon: Vault,
        name: 'Encrypted Digital Vault & Dashboard',
        tag: 'Your Secure Cloud Portal',
        desc: 'Stop digging through old WhatsApp chats for your incorporation certificate. We provide a dedicated, secure cloud portal to host your contracts, track entity milestones, and manage your boardroom data safely.',
      },
    ],
  },
  {
    emoji: '📄',
    icon: ScrollText,
    accent: 'purple',
    title: 'Corporate Contracts & Compliance Hub',
    intro: 'Stop using free templates. Protect your business with contracts drafted by legal architects.',
    items: [
      {
        icon: FileSignature,
        name: 'Foundational Agreements',
        tag: 'Protect Your IP & Equity',
        desc: "Bespoke Co-Founders' Agreements, Vesting Schedules, and Mutual NDAs to protect your IP and equity splits.",
      },
      {
        icon: Briefcase,
        name: 'Commercial Infrastructure',
        tag: 'Protect Your Cash Flow',
        desc: 'Master Service Agreements (MSAs), Vendor Contracts, and Employment Offer Letters designed to protect your operational cash flow.',
      },
      {
        icon: Lock,
        name: 'Data & Digital Compliance',
        tag: 'DPDP Act Ready',
        desc: 'Comprehensive Website Terms of Service (ToS) and Privacy Policies updated to strictly comply with the new Digital Personal Data Protection (DPDP) Act.',
      },
    ],
  },
];

const ACCENTS: Record<string, { text: string; bg: string; border: string; glow: string }> = {
  emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', glow: 'hover:border-emerald-500/40' },
  blue: { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/25', glow: 'hover:border-blue-500/40' },
  purple: { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/25', glow: 'hover:border-purple-500/40' },
};

export default function OurServices() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="grad-hero py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute top-10 right-1/4 w-64 h-64 bg-emerald-400/8 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-5">
            <span className="text-emerald-400 text-xs font-semibold">Tech + Legal, Under One Roof</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-5">Our Services</h1>
          <p className="text-slate-300 text-lg font-medium mb-4">
            Building bulletproof digital and legal foundations for the next generation of businesses.
          </p>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-3xl mx-auto font-medium">
            At Aarambhh, we don't just file paperwork. We architect your corporate structure, deploy your
            secure digital infrastructure, and draft the bespoke contracts that protect your equity.
          </p>
        </div>
      </section>

      {/* Service sections */}
      <section className="py-20 bg-[#0a0f1d] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {SECTIONS.map((section) => {
            const accent = ACCENTS[section.accent];
            const SectionIcon = section.icon;
            return (
              <div key={section.title}>
                {/* Section header */}
                <div className="flex items-start gap-4 mb-3">
                  <div className={`w-13 h-13 p-3 rounded-2xl ${accent.bg} border ${accent.border} flex items-center justify-center flex-shrink-0`}>
                    <SectionIcon size={24} className={accent.text} />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {section.emoji} {section.title}
                    </h2>
                    <p className="text-slate-400 text-sm sm:text-base mt-2 font-medium max-w-3xl">
                      {section.intro}
                    </p>
                  </div>
                </div>

                {/* Cards */}
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  {section.items.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <div
                        key={item.name}
                        className={`glass rounded-3xl p-7 border border-slate-800/80 ${accent.glow} transition-all duration-300 hover:-translate-y-1.5 flex flex-col`}
                      >
                        <div className={`w-11 h-11 rounded-xl ${accent.bg} flex items-center justify-center mb-5`}>
                          <ItemIcon size={19} className={accent.text} />
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${accent.text} mb-1.5`}>
                          {item.tag}
                        </span>
                        <h3 className="text-white font-bold text-base mb-3 leading-snug">{item.name}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed font-medium">{item.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* CTA */}
          <div className="text-center pt-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={GOOGLE_FORM_URL} onClick={() => window.scrollTo(0, 0)}
                className="px-8 py-3.5 rounded-xl grad-em text-white font-extrabold text-sm shadow-xl hover:opacity-95 transition-all inline-flex items-center gap-2">
                Get Your Custom Quote <ArrowRight size={16} />
              </Link>
              <Link to="/packages" onClick={() => window.scrollTo(0, 0)}
                className="px-8 py-3.5 rounded-xl border border-slate-700 text-slate-300 font-bold text-sm hover:bg-slate-800 transition-all">
                View Premium Packages
              </Link>
            </div>
          </div>
        </div>
      </section>

      <JoinSection />
    </div>
  );
}
