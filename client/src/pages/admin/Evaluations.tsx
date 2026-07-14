import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { ShieldAlert, Loader2, ArrowLeft, TrendingUp, AlertTriangle, ListChecks, Rocket, FileText, Image as ImageIcon, Video } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { API_URL } from '../../utils/api';

interface EvaluationSummary {
  _id: string;
  founderName: string;
  startupName: string;
  email: string;
  mobileNumber: string;
  cityCountry: string;
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

const DETAIL_EXCLUDED_FIELDS = new Set([
  '_id', '__v', 'aiEvaluation', 'pitchDeck', 'screenshots', 'incorporationCert', 'trademarkCert', 'gstCert',
  'onePager', 'financialProjection', 'founderResume', 'passportPhoto', 'aadhaarCard', 'panCard'
]);

const DETAIL_LABELS: Record<string, string> = {
  founderName: 'Founder Name',
  startupName: 'Startup Name',
  email: 'Email',
  mobileNumber: 'Mobile Number',
  cityCountry: 'City / State',
  stage: 'Stage',
  industrySector: 'Industry Sector',
  status: 'Status',
  dateSubmitted: 'Date Submitted',
  linkedinProfile: 'LinkedIn Profile',
  estimatedMarketSize: 'Estimated Market Size',
  amountRaised: 'Amount Raised',
  raisedFundingBefore: 'Raised Funding Before',
  legalCompliance: 'Legal Compliance',
  expectedRevenue12Months: '12-Month Revenue Projection',
  productStage: 'Product Stage',
  numberOfFounders: 'Number of Founders',
  mainCompetitors: 'Main Competitors',
  plannedUseOfFunds: 'Planned Use of Funds',
};

const formatDetailValue = (value: any) => {
  if (value === null || value === undefined || value === '') return '-';
  if (Array.isArray(value)) return value.length ? value.join(', ') : '-';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

const FILE_FIELDS = [
  { key: 'pitchDeck', label: 'Pitch Deck', type: 'file' },
  { key: 'screenshots', label: 'Screenshots', type: 'image' },
  { key: 'incorporationCert', label: 'Certificate of Incorporation', type: 'file' },
  { key: 'trademarkCert', label: 'Trademark Certificate', type: 'file' },
  { key: 'gstCert', label: 'GST Certificate', type: 'file' },
  { key: 'onePager', label: 'One-Pager', type: 'file' },
  { key: 'financialProjection', label: 'Financial Projection', type: 'file' },
  { key: 'founderResume', label: 'Founder Resume', type: 'file' },
] as const;

const getFileUrl = (file: any) => {
  const filePath = file?.path;
  if (!filePath) return '';
  return `${API_URL.replace(/\/api$/, '')}/uploads/${filePath}`;
};

const normalizeCity = (value: string) => value.trim().replace(/\s+/g, ' ').toLowerCase();
const STATE_NAMES = new Set([
  'andhra pradesh', 'arunachal pradesh', 'assam', 'bihar', 'chhattisgarh', 'goa', 'gujarat', 'haryana', 'himachal pradesh',
  'jharkhand', 'karnataka', 'kerala', 'madhya pradesh', 'maharashtra', 'manipur', 'meghalaya', 'mizoram', 'nagaland', 'odisha',
  'punjab', 'rajasthan', 'sikkim', 'tamil nadu', 'telangana', 'tripura', 'uttar pradesh', 'uttarakhand', 'west bengal',
  'andaman and nicobar islands', 'chandigarh', 'dadra and nagar haveli and daman and diu', 'delhi', 'jammu and kashmir',
  'ladakh', 'lakshadweep', 'puducherry'
]);
const titleCase = (value: string) => value
  .replace(/\s+/g, ' ')
  .split(' ')
  .filter(Boolean)
  .map((part) => part ? part[0].toUpperCase() + part.slice(1).toLowerCase() : part)
  .join(' ');
const displayCity = (value: string) => {
  const raw = value.split(',')[0]?.trim() || '';
  if (!raw) return '';
  const words = raw.replace(/\s+/g, ' ').split(' ').filter(Boolean);
  for (let i = words.length; i >= 1; i -= 1) {
    const candidate = words.slice(0, i).join(' ').toLowerCase();
    if (STATE_NAMES.has(candidate)) {
      return titleCase(words.slice(0, Math.max(i - 1, 1)).join(' '));
    }
  }
  return titleCase(raw);
};
const displayState = (value: string) => {
  const raw = value.split(',').pop()?.trim() || '';
  if (!raw) return '';
  const normalized = raw.toLowerCase();
  const matched = Array.from(STATE_NAMES).find((state) => normalized.includes(state));
  return titleCase(matched || raw);
};

export default function AdminEvaluations() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [list, setList] = useState<EvaluationSummary[]>([]);
  const [selected, setSelected] = useState<EvaluationDetail | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [scoreFilter, setScoreFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState('');
  const [notLoggedIn, setNotLoggedIn] = useState(false);

  useEffect(() => {
    if (auth?.loading) return;

    if (!auth?.user) {
      setNotLoggedIn(true);
      setLoading(false);
      return;
    }

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
  }, [auth?.loading, auth?.user]);

  useEffect(() => {
    if (auth?.loading) return;
    if (!auth?.user) return;

    const id = searchParams.get('id');
    if (!id) return;
    if (selected?._id === id) return;

    openDetail(id);
  }, [auth?.loading, auth?.user, searchParams, selected]);

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

  const filteredList = list.filter((item) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesQuery = query === '' || [item.startupName, item.founderName, item.email, item.mobileNumber, item.cityCountry, item.stage, item.status]
      .some((value) => value?.toLowerCase().includes(query));

    const score = item.aiEvaluation?.overallScore ?? 0;
    const matchesScore = scoreFilter === 'all'
      || (scoreFilter === 'low' && score < 35)
      || (scoreFilter === 'medium' && score >= 35 && score <= 70)
      || (scoreFilter === 'high' && score > 70);

    const cityValue = normalizeCity(displayCity(item.cityCountry || ''));
    const matchesCity = cityFilter === 'all' || cityValue === cityFilter;
    const matchesState = stateFilter === 'all' || normalizeCity(displayState(item.cityCountry || '')) === stateFilter;

    return matchesQuery && matchesScore && matchesCity && matchesState;
  });

  const cityOptions = Array.from(new Map(list
    .map((item) => displayCity(item.cityCountry || ''))
    .filter(Boolean)
    .map((city) => [normalizeCity(city), city] as const))
    .values())
    .sort((a, b) => a.localeCompare(b));
  const stateOptions = Array.from(new Map(list
    .map((item) => displayState(item.cityCountry || ''))
    .filter(Boolean)
    .map((state) => [normalizeCity(state), state] as const))
    .values())
    .sort((a, b) => a.localeCompare(b));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1d]">
        <Loader2 size={28} className="animate-spin text-emerald-400" />
      </div>
    );
  }

  if (notLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1d] px-4">
        <div className="text-center max-w-md">
          <ShieldAlert size={40} className="text-emerald-400 mx-auto mb-4" />
          <h2 className="text-white font-bold text-lg mb-2">Admin Login Required</h2>
          <p className="text-slate-400 text-sm mb-5">Please sign in with an authorized admin account to view startup evaluations.</p>
          <Link to="/adminlogin" className="inline-block px-6 py-3 rounded-xl grad-em text-white text-sm font-bold shadow-lg hover:opacity-90 transition-all">
            Go to Admin Login
          </Link>
        </div>
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
          <Link to="/adminlogin" className="inline-block mt-4 px-6 py-3 rounded-xl border border-emerald-500/40 text-emerald-300 text-sm font-bold hover:bg-emerald-500/10 transition-all">
            Switch Account
          </Link>
        </div>
      </div>
    );
  }

  if (selected) {
    const ai = selected.aiEvaluation;
    const scoreItems = Object.entries(ai.scores || {});
    const strengthItems = ai.strengths || [];
    const riskItems = ai.risks || [];
    const missingItems = ai.missingInfo || [];
    const nextStepItems = ai.nextSteps || [];
    const detailEntries = Object.entries(selected)
      .filter(([key]) => !DETAIL_EXCLUDED_FIELDS.has(key))
      .map(([key, value]) => ({ key, label: DETAIL_LABELS[key] || key, value }));
    const fileEntries = FILE_FIELDS
      .map(({ key, label, type }) => ({ key, label, type, value: selected[key] }))
      .filter(({ value }) => value);

    return (
      <div className="min-h-screen bg-[#0a0f1d] pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 text-sm font-semibold mb-5 transition-colors"
          >
            <ArrowLeft size={16} /> Back to dashboard
          </button>

          {detailLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={24} className="animate-spin text-cyan-400" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-slate-950/80 border border-slate-800 rounded-[28px] p-6 shadow-2xl shadow-cyan-950/20">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <p className="text-cyan-400 text-[11px] font-bold uppercase tracking-[0.35em]">Startup Evaluations</p>
                    <h1 className="text-2xl md:text-3xl font-black text-white">{selected.startupName || 'No startup name'}</h1>
                    <p className="text-slate-300 text-sm md:text-base">
                      {selected.founderName} / {selected.email} / {selected.mobileNumber}
                    </p>
                    <p className="text-slate-500 text-xs md:text-sm">
                      {selected.industrySector || 'Industry not provided'} / {selected.stage || 'Stage not provided'}
                    </p>
                    <p className="text-slate-500 text-xs md:text-sm">
                      {displayCity(selected.cityCountry || '') || 'City not provided'} / {selected.status || 'submitted'}
                    </p>
                  </div>

                  <div className="shrink-0 rounded-3xl border border-cyan-500/30 bg-cyan-500/10 px-6 py-4 text-center min-w-[140px]">
                    <p className="text-[10px] uppercase font-bold text-cyan-300 tracking-[0.3em]">Overall Score</p>
                    <p className="text-4xl font-black text-cyan-300 leading-none mt-2">
                      {ai.overallScore}<span className="text-lg text-slate-500">/100</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-[28px] p-6">
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-[0.35em] mb-4 flex items-center gap-2">
                  <TrendingUp size={14} /> Category Scores
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {scoreItems.map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between rounded-2xl bg-slate-900/60 px-4 py-3 border border-slate-800/80">
                      <span className="text-xs text-slate-200 font-medium">{SCORE_LABELS[key] || key}</span>
                      <span className="text-xs font-black text-cyan-300">{val}/{SCORE_MAX[key] ?? 0}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="bg-slate-950/80 border border-slate-800 rounded-[28px] p-6">
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-[0.35em] mb-4">Strengths</h3>
                  <ul className="space-y-3">
                    {strengthItems.map((item, i) => (
                      <li key={i} className="text-sm text-slate-200 flex gap-2 leading-relaxed">
                        <span className="text-emerald-400 mt-0.5">-</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-[28px] p-6">
                  <h3 className="text-xs font-bold text-rose-400 uppercase tracking-[0.35em] mb-4 flex items-center gap-2">
                    <AlertTriangle size={13} /> Key Risks
                  </h3>
                  <ul className="space-y-3">
                    {riskItems.map((item, i) => (
                      <li key={i} className="text-sm text-slate-200 flex gap-2 leading-relaxed">
                        <span className="text-rose-400 mt-0.5">!</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="bg-slate-950/80 border border-slate-800 rounded-[28px] p-6">
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-[0.35em] mb-4 flex items-center gap-2">
                    <ListChecks size={13} /> Missing Information
                  </h3>
                  <ul className="space-y-3">
                    {missingItems.length === 0 ? (
                      <li className="text-sm text-slate-500">None</li>
                    ) : (
                      missingItems.map((item, i) => (
                        <li key={i} className="text-sm text-slate-200 flex gap-2 leading-relaxed">
                          <span className="text-amber-400 mt-0.5">-</span>
                          <span>{item}</span>
                        </li>
                      ))
                    )}
                  </ul>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-[28px] p-6">
                  <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-[0.35em] mb-4 flex items-center gap-2">
                    <Rocket size={13} /> Recommended Next Steps
                  </h3>
                  <ul className="space-y-3">
                    {nextStepItems.map((item, i) => (
                      <li key={i} className="text-sm text-slate-200 flex gap-2 leading-relaxed">
                        <span className="text-cyan-400 mt-0.5">-</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-[28px] p-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.35em] mb-4">Full Submission</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {detailEntries.map(({ key, label, value }) => (
                    <div key={key} className="rounded-2xl bg-slate-900/60 border border-slate-800/80 px-4 py-3">
                      <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500 mb-1">{label}</p>
                      <p className="text-sm text-slate-100 break-words">{formatDetailValue(value)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {fileEntries.length > 0 && (
                <div className="bg-slate-950/80 border border-slate-800 rounded-[28px] p-6">
                  <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-[0.35em] mb-4">Uploaded Files</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {fileEntries.map(({ key, label, type, value }) => {
                      const files = Array.isArray(value) ? value : [value];
                      return (
                        <div key={key} className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-4">
                          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500 mb-3">{label}</p>
                          <div className="space-y-2">
                            {files.map((file: any, index: number) => {
                              const url = getFileUrl(file);
                              return (
                                <a
                                  key={`${key}-${file?.filename || index}`}
                                  href={url || '#'}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 hover:border-cyan-500/40 transition-colors"
                                >
                                  {type === 'image' ? <ImageIcon size={14} className="text-cyan-400" /> : <FileText size={14} className="text-cyan-400" />}
                                  <span className="text-sm text-slate-200 break-words">{file?.filename || 'Uploaded file'}</span>
                                  <span className="ml-auto text-[10px] text-slate-500">{file?.size ? `${Math.round(file.size / 1024)} KB` : ''}</span>
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                    {(selected.demoVideoLink || selected.founderVideoLink || selected.productDemoLink) && (
                      <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-4 md:col-span-2">
                        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-500 mb-3">Media Links</p>
                        <div className="grid gap-2 md:grid-cols-3">
                          {selected.productDemoLink && (
                            <a href={selected.productDemoLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-200 hover:border-cyan-500/40 transition-colors">
                              <Video size={14} className="text-cyan-400" /> Product Demo
                            </a>
                          )}
                          {selected.demoVideoLink && (
                            <a href={selected.demoVideoLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-200 hover:border-cyan-500/40 transition-colors">
                              <Video size={14} className="text-cyan-400" /> Demo Video
                            </a>
                          )}
                          {selected.founderVideoLink && (
                            <a href={selected.founderVideoLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-200 hover:border-cyan-500/40 transition-colors">
                              <Video size={14} className="text-cyan-400" /> Founder Pitch
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
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
        <p className="text-slate-400 text-sm mb-6">{list.length} submission(s) - admin only</p>

        <div className="grid gap-3 mb-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(220px,1fr)_minmax(220px,1fr)_minmax(220px,1fr)]">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by startup, founder, email, mobile, city, or state"
            className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/15"
          />
          <select
            value={scoreFilter}
            onChange={(e) => setScoreFilter(e.target.value as any)}
            className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white focus:border-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/15"
          >
            <option value="all">Score: All</option>
            <option value="low">Score: Low (&lt; 35)</option>
            <option value="medium">Score: Medium (35-70)</option>
            <option value="high">Score: High (&gt; 70)</option>
          </select>
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white focus:border-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/15"
          >
            <option value="all">City: All</option>
            {cityOptions.map((city) => (
              <option key={city} value={city.toLowerCase()}>{city}</option>
            ))}
          </select>
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white focus:border-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/15"
          >
            <option value="all">State: All</option>
            {stateOptions.map((state) => (
              <option key={state} value={normalizeCity(state)}>{state}</option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          {filteredList.length === 0 ? (
            <p className="text-slate-500 text-sm">No evaluations match your search or filter.</p>
          ) : (
            filteredList.map((item) => (
              <button
                key={item._id}
                onClick={() => openDetail(item._id)}
                className="w-full flex items-start justify-between gap-4 bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 rounded-2xl px-5 py-4 text-left transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-white font-bold text-sm truncate">{item.startupName || 'No startup name'}</p>
                  <p className="text-slate-400 text-xs mt-0.5 truncate">{item.founderName} / {item.email}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-cyan-300">City: {displayCity(item.cityCountry || '') || 'Not provided'}</span>
                    <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-950/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-300">State: {item.status || 'submitted'}</span>
                  </div>
                </div>
                <div className="shrink-0 self-center text-emerald-400 font-black text-lg">{item.aiEvaluation?.overallScore ?? '-'}<span className="text-slate-600 text-xs">/100</span></div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
