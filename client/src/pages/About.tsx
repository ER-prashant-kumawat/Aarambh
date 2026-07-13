import JoinSection from '../components/JoinSection';
import { Shield, Zap, Users, Target } from 'lucide-react';

export default function About() {
  const vals = [
    { icon: Shield, label: "Integrity First", desc: "Full transparency — published fees, realistic timelines, no fine print, no grey zones." },
    { icon: Zap, label: "Speed as a Feature", desc: "We treat every founder's time as irreplaceable capital. Our systems are engineered for fastest-possible delivery." },
    { icon: Users, label: "Founder-Centric", desc: "Every product decision starts with: 'What would the founder prefer?' Not 'What's easiest for us?'" },
    { icon: Target, label: "Outcome-Driven", desc: "We measure success by your Certificate of Incorporation in hand — not by our NPS score or revenue targets." },
  ];

  return (
    <div className="pt-16">
      <section className="grad-hero py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute top-14 right-1/3 w-64 h-64 bg-emerald-400/8 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-5">
            <span className="text-emerald-400 text-xs font-semibold">Our Story</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-5 max-w-3xl mx-auto">
            We Started Aarambhh Because<br />We Felt the Pain Too.
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto font-medium">India's entrepreneurial energy has never been greater. But its legal infrastructure still moves at the pace of the 1990s.</p>
        </div>
      </section>

      <section className="py-20 bg-[#0a0f1d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <h2 className="text-3xl font-black text-white mb-6">The Origin Story</h2>
              <div className="space-y-5 text-slate-400 leading-relaxed font-medium">
                <p>Aarambhh — meaning <em>"the beginning"</em> in Hindi — was founded in Rajasthan by a team of legal professionals, businesswomen, and technology builders who were exhausted by watching brilliant Indian founders struggle with bureaucracy at the very moment they needed momentum.</p>
                <p>Our founders spent years inside India's legal, financial, and commercial frameworks. They saw first-hand how a talented founder with a world-changing idea could lose weeks — sometimes months — to back-and-forth paperwork, poorly drafted applications, and opaque government portals. Dreams deferred not because the ideas weren't good enough, but because the legal process was too slow, too complex, and too expensive.</p>
                <p>In 2025, they decided to build the platform they wished had existed when they were starting out. A single, trustworthy destination where an Indian entrepreneur could walk in with an idea on Monday and walk out with a legally registered company by Thursday.</p>
                <p>That platform is Aarambhh.com. And today, we're proud to serve over 25 startups across 5 cities — from solo SaaS founders in Pune to scaling D2C brands in Delhi, from day 0 incorporation to fully functional legally and commercially compliance proof private limited companies. Join Aarambhh. Live your dream!</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { l: "Founded", v: "2025" },
                { l: "Cities Served", v: "28+" },
                { l: "Startups Assisted", v: "25,000+" },
                { l: "Expert Professionals", v: "40+" },
                { l: "Avg. Processing Days", v: "7 Days" },
                { l: "Customer Rating", v: "4.9 / 5" }
              ].map((s, i) => (
                <div key={i} className="bento bg-slate-900/60 rounded-2xl p-5 border border-slate-800/80 text-center">
                  <div className="text-3xl font-black text-white mb-1">{s.v}</div>
                  <div className="text-slate-400 text-xs font-bold">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="grad-card rounded-3xl p-10 lg:p-14 mb-16 text-center">
            <Target size={38} className="text-emerald-400 mx-auto mb-5"/>
            <h2 className="text-3xl font-black text-white mb-5">Our Mission</h2>
            <p className="text-slate-300 text-lg max-w-3xl mx-auto leading-relaxed">To eliminate legal friction and bureaucratic delays for every Indian entrepreneur — making world-class company formation and compliance accessible to everyone, from the first-time founder in Tier-2 India to the seasoned serial entrepreneur raising institutional capital.</p>
          </div>
          <h2 className="text-3xl font-black text-white text-center mb-10">Our Core Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {vals.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="bento bg-slate-900/60 rounded-2xl p-6 border border-slate-800/80 shadow-sm text-center">
                  <div className="w-12 h-12 rounded-xl grad-em flex items-center justify-center mx-auto mb-4">
                    <Icon size={20} className="text-white" />
                  </div>
                  <h3 className="font-bold text-white mb-2">{v.label}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{v.desc}</p>
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
