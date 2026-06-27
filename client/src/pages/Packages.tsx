import JoinSection from '../components/JoinSection';
import { PACKAGES, GOOGLE_FORM_URL } from '../constants/data';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function Packages() {
  return (
    <div className="pt-16">
      <section className="grad-hero py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute top-10 right-1/4 w-64 h-64 bg-emerald-400/8 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-5">
            <span className="text-emerald-400 text-xs font-semibold">Transparent Pricing</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-5">Premium Packages</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto font-medium">One flat price. Zero hidden fees. Everything your startup needs legally — bundled intelligently.</p>
        </div>
      </section>

      <section className="py-16 bg-[#0a0f1d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
            {PACKAGES.map((pkg, i) => (
              <div key={i} className={`price-card bg-slate-900/60 rounded-3xl p-6 border-2 ${pkg.border} shadow-md relative overflow-hidden flex flex-col justify-between h-full`}>
                <div>
                  {pkg.badge && (
                    <div className="absolute top-4 right-4">
                      <span className="tag-badge text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg">{pkg.badge}</span>
                    </div>
                  )}
                  <div className="mb-5">
                    <h3 className="font-black text-white text-lg mb-0.5">{pkg.name}</h3>
                    <p className="text-slate-400 text-xs">{pkg.subtitle}</p>
                    <div className="mt-3">
                      <span className="text-3xl font-black text-white">{pkg.price}</span>
                      <span className="text-slate-400 text-xs ml-1.5">one-time</span>
                    </div>
                    <p className="text-emerald-400 text-[10px] font-semibold mt-1">Govt. fees & professional charges included</p>
                  </div>
                  <a href={GOOGLE_FORM_URL} target="_blank" rel="noopener noreferrer"
                    className={`w-full py-2.5 rounded-xl font-black text-xs mb-5 hover:scale-[1.01] transition-all text-center block ${pkg.btn}`}>
                    Get Started →
                  </a>
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-2">What's Included</p>
                    {pkg.features.map((f, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <CheckCircle size={11} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-400 text-xs font-medium">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Custom Quote Card */}
            <div className="price-card bg-slate-900/60 rounded-3xl p-6 border-2 border-slate-800 shadow-md relative overflow-hidden flex flex-col justify-between h-full">
              <div>
                <div className="mb-5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-3">
                    <AlertCircle size={18} className="text-emerald-400" />
                  </div>
                  <h3 className="font-black text-white text-lg mb-0.5">Custom Quote</h3>
                  <p className="text-slate-400 text-xs">For complex or custom structures</p>
                  <div className="mt-3">
                    <span className="text-2xl font-black text-white">Custom Pricing</span>
                  </div>
                  <p className="text-emerald-400 text-[10px] font-semibold mt-1">Tailored CS/CA retainer plans</p>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed mb-5 font-medium">
                  Multi-entity structures, sector-specific licenses (FSSAI, NBFC, SEBI), or a full-year outsourced compliance retainer. We build custom engagement models.
                </p>
              </div>
              <a href={GOOGLE_FORM_URL} target="_blank" rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl font-black text-xs hover:scale-[1.01] transition-all text-center block grad-em text-white hover:opacity-90">
                Request Custom Package →
              </a>
            </div>
          </div>
        </div>
      </section>
      <JoinSection />
    </div>
  );
}
