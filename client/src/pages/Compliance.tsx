import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import JoinSection from '../components/JoinSection';
import { COMPLIANCE_ITEMS, colorMap, GOOGLE_FORM_URL } from '../constants/data';
import { FileText, DollarSign, Users, Shield, Lock, Globe, AlertCircle, CheckCircle } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  fileText: FileText,
  dollarSign: DollarSign,
  users: Users,
  shield: Shield,
  lock: Lock,
  globe: Globe
};

export default function Compliance() {
  const [configured, setConfigured] = useState<Record<number, boolean>>({});

  return (
    <div className="pt-16">
      <section className="grad-hero py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-blue-500/8 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-5">
            <span className="text-emerald-400 text-xs font-semibold">Corporate Compliance</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-5">The Compliance Hub</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto font-medium">Stay audit-ready, penalty-free, and investor-grade. Manage all corporate governance from one intelligent dashboard.</p>
        </div>
      </section>

      <section className="py-16 bg-[#0a0f1d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-8 flex items-start gap-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5">
            <AlertCircle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-300 text-sm">Non-Compliance Penalties in India Are Severe</p>
              <p className="text-amber-400/80 text-sm mt-0.5">MCA default filings: ₹200/day penalty. GST non-compliance: 18% interest charge. Late TDS filing: prosecution risk under Section 276B.</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
            {COMPLIANCE_ITEMS.map((item, i) => {
              const Icon = iconMap[item.icon] || FileText;
              return (
                <div key={i} className={`bento glass bg-slate-900/60 rounded-2xl p-6 border border-slate-800 shadow-md ${configured[i] ? "ring-2 ring-emerald-400 ring-offset-2" : ""}`}>
                  <div className={`inline-flex w-11 h-11 rounded-xl items-center justify-center mb-4 ${colorMap[item.color]}`}>
                    <Icon size={19} />
                  </div>
                  <h3 className="font-bold text-white text-sm mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm mb-5 leading-relaxed font-medium">{item.desc}</p>
                  <div className="flex items-center justify-between">
                    {configured[i] ? (
                      <span className="flex items-center gap-1.5 text-emerald-400 font-semibold text-sm">
                        <CheckCircle size={14} className="text-emerald-400" /> Configured
                      </span>
                    ) : (
                      <button onClick={() => setConfigured(p => ({ ...p, [i]: true }))}
                        className="px-4 py-1.5 rounded-lg grad-em text-white text-xs font-bold hover:opacity-90">
                        Configure →
                      </button>
                    )}
                    <Link to={GOOGLE_FORM_URL} onClick={() => window.scrollTo(0, 0)} className="text-xs text-slate-500 hover:text-emerald-400 font-medium transition-colors">
                      Get Quote
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* --- THE STARTUP PROTECTION ROADMAP SECTION (REPLACING LEGACY CALENDAR) --- */}
          <section className="py-16 text-center">
            <div className="max-w-6xl mx-auto px-4">
              
              {/* Section Typography */}
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">
                The Startup Protection Roadmap
              </h2>
              <p className="text-slate-400 text-sm font-medium max-w-2xl mx-auto mb-12">
                Ditch the generic timeline. Map out your complete tech-legal journey from Day 1 to institutional scaling.
              </p>

              {/* Responsive Grid Structure */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                {[
                  {
                    phase: "Phase 1",
                    title: "The Foundation",
                    tagline: "Deploy secure infra & legal entities.",
                    items: ["Digital Infrastructure Deployment", "SSL Security Implementation", "Private Limited / LLP Incorporation"]
                  },
                  {
                    phase: "Phase 2",
                    title: "The Shield",
                    tagline: "Protect core stakeholders & public portals.",
                    items: ["Founders' Agreement", "Website Terms of Service", "DPDP Privacy Policy"]
                  },
                  {
                    phase: "Phase 3",
                    title: "The Assets",
                    tagline: "Lock down operational IPs & core workforce.",
                    items: ["Trademark Filing", "Vendor Agreements", "Employment NDAs"]
                  },
                  {
                    phase: "Phase 4",
                    title: "The Growth",
                    tagline: "Prepare architecture for institutional scaling.",
                    items: ["Master Services Agreements", "Cap-Table Structuring", "Digital Vault Management"]
                  }
                ].map((item, index) => (
                  <div 
                    key={index} 
                    className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden transition-all hover:border-emerald-500/30 group"
                  >
                    {/* Phase Pill Badge */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">
                        {item.phase}
                      </span>
                      <span className="text-xs text-slate-600 group-hover:text-emerald-500/40 font-mono font-bold transition-colors">
                        0{index + 1}
                      </span>
                    </div>

                    {/* Heading Elements */}
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium mb-4 leading-normal">
                      {item.tagline}
                    </p>

                    {/* Map Items */}
                    <div className="space-y-2.5 pt-2 border-t border-slate-800/60">
                      {item.items.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-400 text-xs mt-0.5">✓</span>
                          <p className="text-xs text-slate-300 font-medium leading-relaxed">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </section>
        </div>
      </section>
      <JoinSection />
    </div>
  );
}
