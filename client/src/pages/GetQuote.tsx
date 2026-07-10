import { useEffect, useState } from 'react';
import QuoteForm from '../components/QuoteForm';
import ProfessionalQuoteForm from '../components/ProfessionalQuoteForm';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function GetQuote() {
  const [showProfessionalForm, setShowProfessionalForm] = useState(false);

  useEffect(() => {
    const syncFromHash = () => {
      setShowProfessionalForm(window.location.hash === '#professional-inquiry');
    };

    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  const openProfessionalForm = () => {
    setShowProfessionalForm(true);
    window.history.replaceState(null, '', '#professional-inquiry');
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const openStartupForm = () => {
    setShowProfessionalForm(false);
    window.history.replaceState(null, '', window.location.pathname);
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#0f172a] text-slate-200 px-4">
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6 px-1">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Close Portal
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700/80">
            <Sparkles size={11} className={showProfessionalForm ? 'text-cyan-400' : 'text-emerald-400'} />
            <span className="text-slate-300 text-[10px] font-black uppercase tracking-wider">Aarambhh Onboarding</span>
          </div>
        </div>

        {!showProfessionalForm ? (
          <>
            <div className="mb-8 rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
              <div className="max-w-3xl">
                <p className="text-xs font-black uppercase tracking-[0.35em] text-emerald-400 mb-3">Choose your path</p>
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                  Get the right form for your profile
                </h1>
                <p className="mt-4 text-slate-400 max-w-3xl leading-relaxed">
                  Startup founders can use the quote form here. Lawyers, advocates, CAs, CEOs, founders, and company owners can open a separate professional inquiry form.
                </p>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <button
                  type="button"
                  onClick={openStartupForm}
                  className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-left hover:border-emerald-400/50 transition-colors"
                >
                  <p className="text-[11px] font-black uppercase tracking-widest text-emerald-400">01. Startup Quote</p>
                  <p className="text-white font-bold mt-1">For new ventures, incorporation, and funding / launch planning.</p>
                </button>
                <button
                  type="button"
                  onClick={openProfessionalForm}
                  className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4 text-left hover:border-cyan-400/50 transition-colors"
                >
                  <p className="text-[11px] font-black uppercase tracking-widest text-cyan-400">02. Professional Inquiry</p>
                  <p className="text-white font-bold mt-1">For lawyers, advocates, CAs, CEOs, and company owners.</p>
                </button>
              </div>
            </div>

            <QuoteForm />
          </>
        ) : (
          <div id="professional-inquiry" className="scroll-mt-28">
            <div className="mb-6 flex justify-start">
              <button
                type="button"
                onClick={openStartupForm}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white hover:border-cyan-500/50 transition-colors"
              >
                <ArrowLeft size={14} /> Back to Startup Quote
              </button>
            </div>
            <ProfessionalQuoteForm />
          </div>
        )}
      </div>
    </div>
  );
}
