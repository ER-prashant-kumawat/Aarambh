import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { SERVICES, GOOGLE_FORM_URL } from '../constants/data';
import MCAChecker from '../components/MCAChecker';
import JoinSection from '../components/JoinSection';
import TrustedPartners from '../components/TrustedPartners';
import { Users, Star, Clock, Lock, DollarSign, Sparkles, Cpu, CheckCircle, ArrowRight, Zap, Check, Monitor, Layers, Search, Shield } from 'lucide-react';

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
      {/* HERO */}
      <section className="grad-hero pt-28 pb-16 lg:pt-36 lg:pb-24 relative overflow-hidden">
        <div className="absolute top-24 left-1/4 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-1/5 w-64 h-64 bg-blue-500/8 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left copy */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                <div className="status-dot animate-pulse-slow"></div>
                <span className="text-emerald-400 text-xs font-semibold tracking-wide uppercase">India's #1 Legal-Tech Startup Platform</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
                The All-in-One<br />
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg,#10b981,#34d399)" }}>
                  Tech & Legal
                </span><br />
                Launchpad
              </h1>
              <p className="text-slate-250 text-lg leading-relaxed mb-8 max-w-lg font-medium">
                Company registration to GST, trademark to compliance dashboards — Aarambhh.com is your single trusted partner to launch and legally protect your Indian startup. Fast. Transparent. Expert-supervised.
              </p>
              {/* Stats */}
              <div className="flex flex-wrap gap-6 mb-8">
                {stats.map((s, i) => {
                  const Icon = iconMap[s.icon] || Star;
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                        <Icon size={14} className="text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-white font-black text-lg leading-none">{s.val}</div>
                        <div className="text-slate-400 text-xs mt-0.5">{s.lbl}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/services/pvt-ltd" onClick={() => window.scrollTo(0, 0)}
                  className="px-6 py-3 rounded-xl bg-slate-100 text-slate-950 font-bold text-sm hover:bg-slate-200 hover:scale-105 transition-all shadow-sm text-center">
                  Explore Services
                </Link>
                <button onClick={handleDemoLogin}
                  className="px-6 py-3 rounded-xl border border-emerald-500/30 text-emerald-400 font-semibold text-sm hover:bg-emerald-500/10 transition-all flex items-center justify-center gap-2">
                  <Monitor size={15} /> Try Client Dashboard
                </button>
              </div>
                        </div>

            {/* Right: quote card + mca checker */}
            <div className="animate-fade-in" style={{ animationDelay: "0.12s" }}>
              {/* QUOTE CARD */}
              <div className="rounded-3xl p-6 shadow-2xl border border-emerald-500/20 relative overflow-hidden"
                style={{ background: "linear-gradient(148deg,rgba(16,185,129,0.11),rgba(15,23,42,0.92))", backdropFilter: "blur(22px)" }}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/8 rounded-full blur-2xl pointer-events-none"></div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl grad-em flex items-center justify-center shadow-lg">
                    <Zap size={22} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-white font-black text-lg">Get Quote Instantly</h2>
                    <p className="text-emerald-400 text-xs font-semibold">In Under 60 Seconds ⚡</p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm mb-5 leading-relaxed">
                  Tell us what you need — company registration, GST, trademark, or a full compliance stack. We'll send a custom quote within the hour with zero obligation.
                </p>
                <div className="grid grid-cols-2 gap-2 mb-5">
                  {["Company Registration", "GST Registration", "Trademark Filing", "Startup India"].map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-emerald-300">
                      <Check size={12} className="text-emerald-400 flex-shrink-0" /> {item}
                    </div>
                  ))}
                </div>
                <Link to={GOOGLE_FORM_URL} onClick={() => window.scrollTo(0, 0)}
                  className="w-full py-4 rounded-2xl grad-em text-white font-black text-base shadow-xl hover:opacity-90 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 text-center">
                  <Zap size={18} className="text-white" /> Get Your Free Quote Now
                </Link>
                <p className="text-center text-slate-500 text-xs mt-3">No credit card · No commitment · 100% free</p>
              </div>
              <MCAChecker />
            </div>
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
                <div className="grad-card rounded-2xl p-6 flex flex-col justify-between flex-shrink-0 min-w-[290px] sm:min-w-[340px] md:min-w-0 snap-center md:snap-align-none min-h-[220px]">
                  <div>
                    <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                      <Sparkles size={20} className="text-emerald-400" />
                    </div>
                    <h3 className="font-bold text-white text-base mb-2">Not Sure Where to Start?</h3>
                    <p className="text-slate-400 text-sm mb-5">Our consultants map the perfect compliance roadmap for your business. Free of charge.</p>
                  </div>
                  <Link to={GOOGLE_FORM_URL} onClick={() => window.scrollTo(0, 0)}
                    className="w-full py-3 rounded-xl grad-em text-white font-bold text-sm hover:opacity-90 transition-opacity text-center block">
                    Book Free Consultation
                  </Link>
                </div>
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
                {SERVICES.filter(s => ['nic-code', 'tm-search', 'name-check', 'company-details', 'tm-class-search', 'logo-maker'].includes(s.id)).map(s => {
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
            <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">Register in 3 Simple Steps</h2>
            <p className="text-slate-400 max-w-xl mx-auto font-semibold">Our streamlined process means you go from idea to incorporated in as little as 72 hours.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 relative">
            {[
              { step: "01", icon: "fileText", title: "Submit Documents", desc: "Upload your PAN, Aadhaar, and address proof through our secure portal. Takes less than 5 minutes." },
              { step: "02", icon: "cpu", title: "Expert Processing", desc: "Our qualified CS and CA team verifies, prepares, and files your application with government authorities." },
              { step: "03", icon: "checkCircle", title: "Get Certified", desc: "Receive your official Certificate of Incorporation, GSTIN, or Trademark filing acknowledgment directly." },
            ].map((item, i) => {
              const Icon = iconMap[item.icon] || Star;
              return (
                <div key={i} className="text-center relative">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
                    <Icon size={28} className="text-emerald-400" />
                  </div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-7 h-7 rounded-full grad-em flex items-center justify-center">
                    <span className="text-white text-xs font-black">{i + 1}</span>
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
    </div>
  );
}
