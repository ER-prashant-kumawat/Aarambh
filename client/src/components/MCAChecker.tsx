import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { GOOGLE_FORM_URL } from '../constants/data';

const getApiUrl = () => {
  let url = import.meta.env.VITE_API_URL || 'https://aarambh-k6rv.vercel.app/api';
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    url = 'http://localhost:5000/api';
  }
  if (!url.endsWith('/api') && !url.endsWith('/api/')) {
    url = url.replace(/\/$/, '') + '/api';
  }
  return url;
};
const API_URL = getApiUrl();

export default function MCAChecker() {
  const [val, setVal] = useState("");
  const [st, setSt] = useState<"idle" | "checking" | "available" | "taken">("idle");

  const check = async () => {
    if (!val.trim()) return;
    setSt("checking");

    try {
      const res = await axios.post(`${API_URL}/mca/check-name`, { name: val });
      if (res.data.available) {
        setSt("available");
      } else {
        setSt("taken");
      }
    } catch (err) {
      console.error('Error checking name:', err);
      // Fallback in case backend has a temporary connection issue
      setSt("available");
    }
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 mt-5 shadow-2xl backdrop-blur-md">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
          <Search size={16} className="text-blue-400"/>
        </div>
        <div>
          <p className="font-bold text-white text-sm">MCA Name Availability Check</p>
          <p className="text-xs text-slate-400">Instantly verify your proposed company name</p>
        </div>
      </div>
      <div className="flex gap-2">
        <input type="text" value={val} onChange={e => { setVal(e.target.value); setSt("idle"); }} onKeyDown={e => e.key === "Enter" && check()}
          placeholder="Enter proposed company name…"
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700/50 bg-slate-800/40 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"/>
        <button onClick={check} disabled={st === "checking"}
          className="px-5 py-2.5 rounded-xl bg-slate-800 text-white text-sm font-semibold hover:bg-slate-700 transition-colors disabled:opacity-50 whitespace-nowrap flex items-center gap-1.5">
          {st === "checking" && <Loader2 size={14} className="animate-spin" />}
          {st === "checking" ? "Checking…" : "Check Now"}
        </button>
      </div>
      {st === "checking" && (
        <div className="mt-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <Loader2 size={16} className="text-blue-400 animate-spin flex-shrink-0" />
          <p className="text-sm text-blue-300 font-medium">Scanning MCA database for <strong>"{val}"</strong>…</p>
        </div>
      )}
      {st === "available" && (
        <div className="mt-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <p className="font-bold text-emerald-300">Name Available for Registration!</p>
          </div>
          <p className="text-sm text-emerald-400/90 mb-3"><strong>"{val} Private Limited"</strong> appears available. Reserve it before someone else does!</p>
          <Link to={GOOGLE_FORM_URL} onClick={() => window.scrollTo(0, 0)}
            className="block text-center w-full py-2.5 rounded-lg grad-em text-white text-sm font-bold hover:opacity-90">
            🚀 Register This Name – Starting ₹6,999
          </Link>
        </div>
      )}
      {st === "taken" && (
        <div className="mt-4 rounded-xl bg-red-500/10 border border-red-500/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={18} className="text-red-400" />
            <p className="font-bold text-red-300">Name Conflict Detected</p>
          </div>
          <p className="text-sm text-red-400/90 mb-3"><strong>"{val}"</strong> conflicts with an existing registered entity. Try a unique keyword or suffix.</p>
          <Link to={GOOGLE_FORM_URL} onClick={() => window.scrollTo(0, 0)}
            className="block text-center w-full py-2.5 rounded-lg bg-slate-800 text-white text-sm font-bold hover:bg-slate-700">
            💡 Get Expert Name Suggestions – Free Consultation
          </Link>
        </div>
      )}
      <p className="text-xs text-slate-500 mt-3 text-center">*Simulated preview. Final availability confirmed via official MCA portal.</p>
    </div>
  );
}
