import { Link } from 'react-router-dom';
import { GOOGLE_FORM_URL } from '../constants/data';
import { Sparkles } from 'lucide-react';

export default function JoinSection() {
  return (
    <section className="py-20 grad-hero relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/8 rounded-full blur-3xl pointer-events-none"></div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-7">
          <Sparkles size={13} className="text-emerald-400" />
          <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wide">Join 5,000+ Founders</span>
        </div>
        <h2 className="text-4xl lg:text-5xl font-black text-white mb-5">
          Be A Part of<br />
          <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg,#10b981,#34d399)" }}>
            Something Bigger
          </span>
        </h2>
        <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto font-medium">
          India's most ambitious founders trust Aarambhh.com to handle legal complexities so they can focus on building category-defining companies. Your aarambhh starts here.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to={GOOGLE_FORM_URL} onClick={() => window.scrollTo(0, 0)}
            className="px-8 py-4 rounded-2xl grad-em text-white font-black text-base shadow-xl hover:opacity-90 hover:scale-105 transition-all text-center">
             Start My Startup Journey
          </Link>
          <Link to="/packages" onClick={() => window.scrollTo(0, 0)}
            className="px-8 py-4 rounded-2xl border border-slate-600 text-white font-semibold text-base hover:bg-white/5 transition-colors text-center">
            Explore Packages
          </Link>
        </div>
      </div>
    </section>
  );
}
