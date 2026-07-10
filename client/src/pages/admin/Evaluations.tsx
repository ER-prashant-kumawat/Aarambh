import { useEffect, useState } from 'react';
import axios from 'axios';
import { ShieldAlert, Loader2, ArrowLeft, TrendingUp, AlertTriangle, ListChecks, Rocket } from 'lucide-react';
import { API_URL } from '../../utils/api';

interface EvaluationSummary {
  _id: string;
  founderName: string;
  startupName: string;
  email: string;
  mobileNumber: string;
  stage: string;
  industrySector: string;
  aiEvaluation: { overallScore: number };
  dateSubmitted: string;
  status: string;
}

interface EvaluationDetail extends EvaluationSummary {
  [key: string]: any;
  aiEvaluation: {
    scores: Record<string, number>;
    overallScore: number;
    strengths: string[];
    risks: string[];
    missingInfo: string[];
    nextSteps: string[];
  };
}

const SCORE_LABELS: Record<string, string> = {
  founderProfile: 'Founder Profile',
  problemSolution: 'Problem & Solution',
  marketOpportunity: 'Market Opportunity',
  productReadiness: 'Product Readiness',
  traction: 'Traction',
  businessModel: 'Business Model',
  fundingReadiness: 'Funding Readiness',
  legalCompliance: 'Legal & Compliance',
  visionInvestment: 'Vision & Investment'
};

const SCORE_MAX: Record<string, number> = {
  founderProfile: 15, problemSolution: 20, marketOpportunity: 10, productReadiness: 15,
  traction: 15, businessModel: 10, fundingReadiness: 10, legalCompliance: 5, visionInvestment: 10
};

export default function AdminEvaluations() {
  const [list, setList] = useState<EvaluationSummary[]>([]);
  const [selected, setSelected] = useState<EvaluationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await axios.get(`${API_URL}/evaluations`);
        setList(res.data.evaluations || []);
      } catch (err: any) {
        setError(err.response?.status === 403 ? 'Access denied. Your account is not authorized to view evaluations.' : (err.response?.data?.msg || 'Failed to load evaluations.'));
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, []);

  const openDetail = async (id: string) => {
    setDetailLoading(true);
    try {
      const res = await axios.get(`${API_URL}/evaluations/${id}`);
      setSelected(res.data.evaluation);
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Failed to load evaluation detail.');
    } finally {
      setDetailLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1d]">
        <Loader2 size={28} className="animate-spin text-emerald-400" />
      </div>
    );
  }

  if (error && list.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1d] px-4">
        <div className="text-center max-w-md">
          <ShieldAlert size={40} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-white font-bold text-lg mb-2">Access Restricted</h2>
          <p className="text-slate-400 text-sm">{error}</p>
          <p className="text-slate-500 text-xs mt-3">Log in with an authorized admin account to view startup evaluations.</p>
        </div>
      </div>
    );
  }

  if (selected) {
    const ai = selected.aiEvaluation;
    return (
      <div className="min-h-screen bg-[#0a0f1d] pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 text-sm font-semibold mb-6 transition-colors">
            <ArrowLeft size={16} /> Back to list
          </button>

          {detailLoading ? (
            <Loader2 size={24} className="animate-spin text-emerald-400" />
          ) : (
            <div className="space-y-6">
              <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <h1 className="text-2xl font-black text-white">{selected.startupName}</h1>
                    <p className="text-slate-400 text-sm mt-1">{selected.founderName} — {selected.email} — {selected.mobileNumber}</p>
                    <p className="text-slate-500 text-xs mt-1">{selected.industrySector} · {selected.stage}</p>
                  </div>
                  <div className="text-center bg-emerald-500/10 border border-emerald-500/25 rounded-2xl px-6 py-3">
                    <p className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Overall Score</p>
                    <p className="text-3xl font-black text-emerald-400">{ai.overallScore}<span className="text-base text-slate-500">/100</span></p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6">
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2"><TrendingUp size={14} /> Category Scores</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {Object.entries(ai.scores).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between bg-slate-950/40 rounded-xl px-4 py-2.5">
                      <span className="text-xs text-slate-300 font-medium">{SCORE_LABELS[key] || key}</span>
                      <span className="text-xs font-bold text-emerald-400">{val}/{SCORE_MAX[key]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6">
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">Strengths</h3>
                  <ul className="space-y-2">{ai.strengths.map((s, i) => <li key={i} className="text-xs text-slate-300 flex gap-2"><span className="text-emerald-400">✓</span>{s}</li>)}</ul>
                </div>
                <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6">
                  <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3 flex items-center gap-2"><AlertTriangle size={13} /> Key Risks</h3>
                  <ul className="space-y-2">{ai.risks.map((s, i) => <li key={i} className="text-xs text-slate-300 flex gap-2"><span className="text-red-400">!</span>{s}</li>)}</ul>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6">
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-2"><ListChecks size={13} /> Missing Information</h3>
                  <ul className="space-y-2">{ai.missingInfo.length === 0 ? <li className="text-xs text-slate-500">None</li> : ai.missingInfo.map((s, i) => <li key={i} className="text-xs text-slate-300 flex gap-2"><span className="text-amber-400">•</span>{s}</li>)}</ul>
                </div>
                <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6">
                  <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2"><Rocket size={13} /> Recommended Next Steps</h3>
                  <ul className="space-y-2">{ai.nextSteps.map((s, i) => <li key={i} className="text-xs text-slate-300 flex gap-2"><span className="text-cyan-400">→</span>{s}</li>)}</ul>
                </div>
              </div>

              <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Full Submission</h3>
                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  {Object.entries(selected).filter(([k]) => !['_id', '__v', 'aiEvaluation', 'pitchDeck', 'screenshots', 'incorporationCert', 'trademarkCert', 'gstCert', 'onePager', 'financialProjection', 'founderResume'].includes(k)).map(([k, v]) => (
                    v ? (
                      <div key={k} className="bg-slate-950/40 rounded-lg px-3 py-2">
                        <p className="text-slate-500 uppercase tracking-wide text-[10px] font-bold">{k}</p>
                        <p className="text-slate-200 mt-0.5 break-words">{Array.isArray(v) ? v.join(', ') : String(v)}</p>
                      </div>
                    ) : null
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1d] pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-black text-white mb-1">Startup Evaluations</h1>
        <p className="text-slate-400 text-sm mb-6">{list.length} submission(s) — admin only</p>

        <div className="space-y-3">
          {list.map((item) => (
            <button
              key={item._id}
              onClick={() => openDetail(item._id)}
              className="w-full flex items-center justify-between bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 rounded-2xl px-5 py-4 text-left transition-colors"
            >
              <div>
                <p className="text-white font-bold text-sm">{item.startupName}</p>
                <p className="text-slate-400 text-xs mt-0.5">{item.founderName} · {item.email} · {new Date(item.dateSubmitted).toLocaleDateString()}</p>
              </div>
              <div className="text-emerald-400 font-black text-lg">{item.aiEvaluation?.overallScore ?? '-'}<span className="text-slate-600 text-xs">/100</span></div>
            </button>
          ))}
          {list.length === 0 && <p className="text-slate-500 text-sm">No evaluations submitted yet.</p>}
        </div>
      </div>
    </div>
  );
}
