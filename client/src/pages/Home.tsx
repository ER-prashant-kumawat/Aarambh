import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { SERVICES, GOOGLE_FORM_URL } from '../constants/data';
import MCAChecker from '../components/MCAChecker';
import JoinSection from '../components/JoinSection';
import TrustedPartners from '../components/TrustedPartners';
import BciYuvaModal, { type BciYuvaMode } from '../components/BciYuvaModal';
import { Users, Star, Clock, Lock, DollarSign, Sparkles, Cpu, CheckCircle, ArrowRight, Zap, Check, Monitor, Layers, Search, Shield, KeyRound } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  users: Users,
  star: Star,
  clock: Clock,
  lock: Lock,
  dollarSign: DollarSign,
  sparkles: Sparkles,
  cpu: Cpu,
  checkCircle: CheckCircle,
  building: Cpu,
  fileText: Cpu,
  award: Star,
  briefcase: Users,
  rocket: Sparkles,
  layers: Layers,
  search: Search,
  shield: Shield
};

export default function Home() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const user = auth ? auth.user : null;
  const [bciModal, setBciModal] = useState<BciYuvaMode | null>(null);

  const handleDemoLogin = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
    window.scrollTo(0, 0);
  };

  const stats = [
    { icon: "users", val: "5,000+", lbl: "Startups Assisted" },
    { icon: "star", val: "4.9 / 5", lbl: "Customer Rating" },
    { icon: "clock", val: "3 Days", lbl: "Avg. Processing" }
  ];

  const features = [
    { icon: "lock", title: "Bank-Grade Security", desc: "AES-256 encryption, ISO-certified servers, zero third-party data sharing. Your documents are as secure as a Swiss vault.", color: "bg-blue-500/10 text-blue-400" },
    { icon: "dollarSign", title: "Transparent Flat Fees", desc: "One published price, zero hidden charges. Government fees, professional service, and post-filing support — all included.", color: "bg-emerald-500/10 text-emerald-400" },
    { icon: "users", title: "Human Legal Supervision", desc: "Every application is reviewed by a qualified Company Secretary or CA before submission. Expert eyes on every filing.", color: "bg-purple-500/10 text-purple-400" },
  ];

  return (
    <div>
      {/* BCI YUVA - INVESTOR CONNECT BANNER */}
      <div className="pt-[76px] bg-[#0a0f1d] border-b border-emerald-500/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="relative rounded-3xl border border-emerald-500/25 bg-gradient-to-br from-emerald-950/60 via-slate-900/80 to-slate-900/80 p-5 sm:p-8 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 mb-4">
                <div className="status-dot animate-pulse-slow"></div>
                <span className="text-emerald-300 text-[11px] font-bold tracking-wide uppercase">Registrations Open from 20 July 2026</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">BCI Yuva – Investor Connect</h2>
              <p className="text-emerald-400 text-sm sm:text-base font-bold mb-4">Where India's Next High-Growth Startups Meet Investors</p>

              <p className="text-slate-300 text-sm leading-relaxed max-w-3xl mx-auto mb-6">
                Join one of India's premier startup-investor networking platforms, connecting 100+ promising startups with an investment opportunity pool of up to ₹10 Crore. Pitch your vision, gain guidance from experienced mentors, industry leaders, and investors, and unlock opportunities to scale your venture.
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-left mb-7">
                {[
                  { emoji: '🚀', text: '100+ Curated Startups' },
                  { emoji: '💰', text: 'Up to ₹10 Crore Investment Pool' },
                  { emoji: '👨‍💼', text: 'Investors & Venture Capital Network' },
                  { emoji: '🧠', text: 'Mentors & Industry Leaders' },
                  { emoji: '🎤', text: 'Live Startup Pitch Sessions' },
                  { emoji: '🤝', text: 'Networking & Partnership Opportunities' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 bg-slate-900/60 border border-slate-800 rounded-xl px-3.5 py-2.5">
                    <span className="text-lg flex-shrink-0">{item.emoji}</span>
                    <span className="text-slate-200 text-xs sm:text-sm font-semibold">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button onClick={() => setBciModal('register')} className="px-6 py-3 rounded-xl grad-em text-white text-sm font-bold shadow-lg hover:opacity-90 hover:scale-105 transition-all cursor-pointer">
                  Register Now
                </button>
                <button onClick={() => setBciModal('investor')} className="px-6 py-3 rounded-xl border border-emerald-500/40 text-emerald-300 text-sm font-bold hover:bg-emerald-500/10 transition-all cursor-pointer">
                  Become an Investor
                </button>
                <button onClick={() => setBciModal('partner')} className="px-6 py-3 rounded-xl border border-slate-700 text-slate-300 text-sm font-bold hover:bg-slate-800/60 hover:text-white transition-all cursor-pointer">
                  Partner With Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="grad-hero pt-4 pb-4 lg:pt-5 lg:pb-6 relative overflow-hidden">
        <div className="absolute top-24 left-1/4 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-1/5 w-64 h-64 bg-blue-500/8 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-4 lg:gap-5 items-start lg:pt-2">
            {/* Left copy */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-2">
                <div className="status-dot animate-pulse-slow"></div>
                <span className="text-emerald-400 text-xs font-semibold tracking-wide uppercase">India's #1 Legal-Tech Startup Platform</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-[2.2rem] font-black text-white leading-tight mb-2">
                Your All-in-One<br />
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg,#10b981,#34d399)" }}>
                  Tech & Legal
                </span><br />
                Launchpad
              </h1>
              <p className="text-slate-250 text-xs sm:text-sm leading-relaxed mb-3 max-w-lg font-medium">
                Company registration to Digital Footprint , trademark to compliance dashboards — Aarambhh.com is your single trusted partner to launch and legally protect your Indian startup. Fast. Transparent. Expert-supervised.
              </p>
              {/* Stats */}
              <div className="flex flex-wrap gap-2.5 mb-3">
                {stats.map((s, i) => {
                  const Icon = iconMap[s.icon] || Star;
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                        <Icon size={11} className="text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-white font-black text-sm leading-none">{s.val}</div>
                        <div className="text-slate-400 text-[9px] mt-0.5">{s.lbl}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/our-services" onClick={() => window.scrollTo(0, 0)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-950 font-bold text-[10px] sm:text-[11px] hover:bg-slate-200 hover:scale-105 transition-all shadow-sm text-center">
                  Explore Services
                </Link>
                <button onClick={handleDemoLogin}
                  className="px-3.5 py-1.5 rounded-xl border border-emerald-500/30 text-emerald-400 font-semibold text-[10px] sm:text-[11px] hover:bg-emerald-500/10 transition-all flex items-center justify-center gap-2">
                  <Monitor size={15} /> Try Client Dashboard
                </button>
              </div>
                        </div>

            {/* Right: quote card + audit card */}
            <div className="animate-fade-in" style={{ animationDelay: "0.12s" }}>
              {/* QUOTE CARD */}
              <div className="rounded-3xl p-3 shadow-2xl border border-emerald-500/20 relative overflow-hidden"
                style={{ background: "linear-gradient(148deg,rgba(16,185,129,0.11),rgba(15,23,42,0.92))", backdropFilter: "blur(22px)" }}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/8 rounded-full blur-2xl pointer-events-none"></div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-2xl grad-em flex items-center justify-center shadow-lg">
                    <Zap size={22} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-white font-black text-sm sm:text-base">Get Quote Instantly</h2>
                    <p className="text-emerald-400 text-xs font-semibold">In Under 60 Seconds ⚡</p>
                  </div>
                </div>
                <p className="text-slate-300 text-[10px] sm:text-[11px] mb-2 leading-relaxed">
                  Tell us what you need — company registration, Digital Footprint, trademark, or a full compliance stack. We'll send a custom quote within the hour with zero obligation.
                </p>
                <div className="grid grid-cols-2 gap-1 mb-2">
                  {["Company Registration", "GST Registration", "Trademark Filing", "Startup India"].map((item, i) => (
                    <div key={i} className="flex items-center gap-1 text-[9px] sm:text-[10px] text-emerald-300">
                      <Check size={12} className="text-emerald-400 flex-shrink-0" /> {item}
                    </div>
                  ))}
                </div>
                <Link to={GOOGLE_FORM_URL} onClick={() => window.scrollTo(0, 0)}
                  className="w-full py-2 rounded-2xl grad-em text-white font-black text-[10px] sm:text-[11px] shadow-xl hover:opacity-90 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 text-center">
                  <Zap size={18} className="text-white" /> Get Your Free Quote Now
                </Link>
                <p className="text-center text-slate-500 text-[11px] mt-2">No credit card · No commitment · 100% free</p>
              </div>
              <Link
                to="/audit"
                onClick={() => window.scrollTo(0, 0)}
                className="mt-3 block rounded-3xl border border-cyan-500/20 bg-slate-950/45 p-3.5 shadow-2xl transition-all hover:border-cyan-400/40 hover:bg-slate-950/55"
              >
                <div className="w-9 h-9 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-3">
                  <Sparkles size={16} className="text-cyan-300" />
                </div>
                <h3 className="text-white font-black text-base mb-2">Not Sure Where to Start?</h3>
                <p className="text-slate-400 text-[11px] sm:text-xs leading-relaxed mb-3 max-w-md">
                  Run the 3-step Aarambhh Audit to compare your current setup and reveal the right tech-legal tier instantly.
                </p>
                <span className="inline-flex w-full items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/10 py-2 text-cyan-300 font-bold text-xs hover:bg-cyan-500/15 transition-colors">
                  Open Audit Tool
                </span>
              </Link>
            </div>
          </div>
          <div className="mt-2.5 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <MCAChecker />
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="bg-brand-navy py-8 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-5">Trusted by founders from</p>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-14 opacity-35">
            {["IIT Delhi", "IIM Bangalore", "Y Combinator Alumni", "Google Launchpad", "NASSCOM Startup"].map((n, i) => (
              <span key={i} className="text-slate-300 font-bold text-sm tracking-wide">{n}</span>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES BENTO */}
      <section className="py-20 bg-[#0a0f1d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 mb-4">Our Core Services</span>
            <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">Everything Your Startup Needs</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">From day-zero incorporation to year-round compliance — handled by qualified professionals.</p>
          </div>
          <div className="space-y-16">
            {/* Core Services Section */}
            <div>
              <h3 className="text-emerald-400 font-extrabold text-lg uppercase tracking-wider border-b border-slate-800 pb-2.5 mb-6">Core Services</h3>
              <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory md:snap-none gap-6 pb-6 md:pb-0 scrollbar-none">
                {SERVICES.filter(s => ['pvt-ltd', 'gst', 'trademark', 'llp', 'startup-india'].includes(s.id)).map(s => {
                  const Icon = iconMap[s.icon] || Cpu;
                  return (
                    <Link key={s.id} to={`/services/${s.id}`} onClick={() => window.scrollTo(0, 0)}
                      className="bento text-left bg-slate-900/60 rounded-2xl p-6 border border-slate-800/80 shadow-md hover:border-emerald-500/30 block flex-shrink-0 min-w-[290px] sm:min-w-[340px] md:min-w-0 snap-center md:snap-align-none">
                      <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                        <Icon size={20} className="text-emerald-400" />
                      </div>
                      <h3 className="font-bold text-white text-base mb-1">{s.label}</h3>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2">{s.tagline}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-emerald-400 font-black text-sm">{s.fee}</span>
                        <span className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">View Details <ArrowRight size={12} /></span>
                      </div>
                    </Link>
                  );
                })}
                <Link to="/dsc" onClick={() => window.scrollTo(0, 0)}
                  className="bento text-left bg-slate-900/60 rounded-2xl p-6 border border-slate-800/80 shadow-md hover:border-emerald-500/30 block flex-shrink-0 min-w-[290px] sm:min-w-[340px] md:min-w-0 snap-center md:snap-align-none">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                    <KeyRound size={20} className="text-emerald-400" />
                  </div>
                  <h3 className="font-bold text-white text-base mb-1">DSC (Digital Signature Certificate)</h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">Secure your e-filings, tenders, and online signing with a government-recognized DSC.</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-emerald-400 font-black text-sm">Starts at ₹826</span>
                    <span className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">View Details <ArrowRight size={12} /></span>
                  </div>
                </Link>
                <Link to="/audit" onClick={() => window.scrollTo(0, 0)} className="grad-card rounded-2xl p-6 flex flex-col justify-between flex-shrink-0 min-w-[290px] sm:min-w-[340px] md:min-w-0 snap-center md:snap-align-none min-h-[220px] border border-cyan-500/15 hover:border-cyan-400/30 transition-all">
                  <div>
                    <div className="w-11 h-11 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4">
                      <Sparkles size={20} className="text-cyan-300" />
                    </div>
                    <h3 className="font-bold text-white text-base mb-2">Not Sure Where to Start?</h3>
                    <p className="text-slate-400 text-sm mb-5">Run the 3-step Aarambhh Audit to compare your current setup and reveal the right tech-legal tier instantly.</p>
                  </div>
                  <span className="w-full py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-bold text-sm hover:bg-cyan-500/15 transition-opacity text-center block">
                    Open Audit Tool
                  </span>
                </Link>
              </div>
            </div>

            {/* Agreements & Contracts Section */}
            <div>
              <h3 className="text-orange-400 font-extrabold text-lg uppercase tracking-wider border-b border-slate-800 pb-2.5 mb-6">Agreement & Contracts</h3>
              <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory md:snap-none gap-6 pb-6 md:pb-0 scrollbar-none">
                {SERVICES.filter(s => ['mou', 'jv-agreement'].includes(s.id)).map(s => {
                  const Icon = iconMap[s.icon] || Cpu;
                  return (
                    <Link key={s.id} to={`/services/${s.id}`} onClick={() => window.scrollTo(0, 0)}
                      className="bento text-left bg-slate-900/60 rounded-2xl p-6 border border-slate-800/80 shadow-md hover:border-orange-500/30 block flex-shrink-0 min-w-[290px] sm:min-w-[340px] md:min-w-0 snap-center md:snap-align-none">
                      <div className="w-11 h-11 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
                        <Icon size={20} className="text-orange-400" />
                      </div>
                      <h3 className="font-bold text-white text-base mb-1">{s.label}</h3>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2">{s.tagline}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-orange-400 font-black text-sm">{s.fee}</span>
                        <span className="flex items-center gap-1 text-orange-400 text-xs font-semibold">View Details <ArrowRight size={12} /></span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Tools & Utilities Section */}
            <div>
              <h3 className="text-blue-400 font-extrabold text-lg uppercase tracking-wider border-b border-slate-800 pb-2.5 mb-6">Tools & Utilities</h3>
              <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory md:snap-none gap-6 pb-6 md:pb-0 scrollbar-none">
                {SERVICES.filter(s => ['nic-code', 'tm-search', 'name-check', 'company-details', 'tm-class-search'].includes(s.id)).map(s => {
                  const Icon = iconMap[s.icon] || Cpu;
                  return (
                    <Link key={s.id} to={`/services/${s.id}`} onClick={() => window.scrollTo(0, 0)}
                      className="bento text-left bg-slate-900/60 rounded-2xl p-6 border border-slate-800/80 shadow-md hover:border-blue-500/30 block flex-shrink-0 min-w-[290px] sm:min-w-[340px] md:min-w-0 snap-center md:snap-align-none">
                      <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                        <Icon size={20} className="text-blue-400" />
                      </div>
                      <h3 className="font-bold text-white text-base mb-1">{s.label}</h3>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2">{s.tagline}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-blue-400 font-black text-sm">{s.fee}</span>
                        <span className="flex items-center gap-1 text-blue-400 text-xs font-semibold">View Details <ArrowRight size={12} /></span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-20 bg-[#0f172a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 mb-4">Why Aarambhh</span>
            <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">Built Different. Built for Founders.</h2>
            <p className="text-slate-400 max-w-xl mx-auto font-medium">We combine legal expertise, cutting-edge technology, and genuine human care to deliver a registration experience that's fast, reliable, and truly founder-first.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => {
              const Icon = iconMap[f.icon] || Star;
              return (
                <div key={i} className="bento bg-slate-900/60 rounded-2xl p-7 border border-slate-800/80 shadow-md text-center">
                  <div className={`w-14 h-14 rounded-2xl ${f.color} flex items-center justify-center mx-auto mb-5`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="font-bold text-white text-lg mb-3">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TRUSTED PARTNERS */}
      <TrustedPartners />

      {/* PROCESS STRIP */}
      <section className="py-20 grad-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">Launch in 3 Simple Steps</h2>
            <p className="text-slate-400 max-w-xl mx-auto font-semibold">Our frictionless process takes you from ideation to secure deployment without the traditional administrative chaos.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 relative">
            {[
              { stepNumber: 1, icon: "fileText", title: "Request Your Scope (Get a Quote)", desc: "Tell us about your business stage and desired infrastructure. We'll instantly provide a transparent, flat-fee proposal tailored to your exact tech and legal requirements." },
              { stepNumber: 2, icon: "cpu",      title: "Submit Your Documents",            desc: "Upload your basic KYC through our encrypted portal. Our tech-legal architects take over immediately—handling all government filings, contract drafting, and server deployments." },
              { stepNumber: 3, icon: "checkCircle", title: "Receive Your Assets",           desc: "Your business is live and protected. Receive your official Incorporation Certificates, bespoke legal contracts, and access credentials to your secure digital vault and website." },
            ].map((item, i) => {
              const Icon = iconMap[item.icon] || Star;
              return (
                <div key={i} className="text-center relative">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
                    <Icon size={28} className="text-emerald-400" />
                  </div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-7 h-7 rounded-full grad-em flex items-center justify-center">
                    <span className="text-white text-xs font-black">{item.stepNumber}</span>
                  </div>
                  <h3 className="font-bold text-white text-lg mb-3">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <JoinSection />

      {bciModal && <BciYuvaModal mode={bciModal} onClose={() => setBciModal(null)} />}
    </div>
  );
}















