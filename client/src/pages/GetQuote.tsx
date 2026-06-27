import QuoteForm from '../components/QuoteForm';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function GetQuote() {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#0f172a] text-slate-200 flex flex-col items-center justify-center px-4">
      {/* Outer wrapper to contain the form on the page */}
      <div className="w-full max-w-xl">
        {/* Back Link & Header Badge */}
        <div className="flex justify-between items-center mb-6 px-1">
          <button 
            onClick={() => window.history.back()} 
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Close Portal
          </button>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700/80">
            <Sparkles size={11} className="text-emerald-400" />
            <span className="text-slate-300 text-[10px] font-black uppercase tracking-wider">Aarambhh Onboarding</span>
          </div>
        </div>

        {/* The Quote Form Component */}
        <QuoteForm />
      </div>
    </div>
  );
}
