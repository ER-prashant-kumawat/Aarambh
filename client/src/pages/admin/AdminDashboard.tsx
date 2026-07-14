import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  ShieldAlert, Loader2, Users, Phone, KeyRound, ShoppingBag,
  ClipboardCheck, LayoutDashboard, LogOut, ExternalLink, ListChecks, Search,
  Mail, Send, CheckCircle2, AlertCircle, Eye
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { API_URL } from '../../utils/api';

interface Lead {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  service?: string;
  message?: string;
  type: string;
  source?: string;
  answers?: Record<string, string>;
  recommendation?: { tier?: string; title?: string; price?: string };
  dateSubmitted: string;
}

const AUDIT_QUESTIONS: { key: string; label: string }[] = [
  { key: 'q1', label: 'Corporate Structure' },
  { key: 'q2', label: 'Digital Security & DPDP' },
  { key: 'q3', label: 'Equity Protection' },
];

interface RegisteredUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  incorporationStatus: string;
  dateCreated: string;
}

interface DscApp {
  _id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  certificateClass?: string;
  price?: number;
  dateSubmitted: string;
}

interface Order {
  _id: string;
  name: string;
  email: string;
  phone: string;
  packageName: string;
  packagePrice: string;
  status: string;
  dateSubmitted: string;
}

interface EvaluationSummary {
  _id: string;
  founderName: string;
  startupName: string;
  email: string;
  mobileNumber: string;
  cityCountry?: string;
  aiEvaluation: { overallScore: number };
  dateSubmitted: string;
  status?: string;
}

interface EvaluationDetail extends EvaluationSummary {
  stage?: string;
  industrySector?: string;
  status?: string;
  [key: string]: any;
}

type TabId = 'overview' | 'leads' | 'audit' | 'tools' | 'users' | 'dsc' | 'orders' | 'evaluations' | 'broadcast';

const TABS: { id: TabId; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'leads', label: 'Visitors & Leads', icon: Phone },
  { id: 'audit', label: 'Audit Tool', icon: ListChecks },
  { id: 'tools', label: 'Tools (NIC/TM/etc.)', icon: Search },
  { id: 'users', label: 'Registered Users', icon: Users },
  { id: 'dsc', label: 'DSC Applications', icon: KeyRound },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'evaluations', label: 'Startup Evaluations', icon: ClipboardCheck },
  { id: 'broadcast', label: 'Send Mail', icon: Mail },
];

const fmtDate = (d: string) => new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const STATE_NAMES = new Set([
  'andhra pradesh', 'arunachal pradesh', 'assam', 'bihar', 'chhattisgarh', 'goa', 'gujarat', 'haryana', 'himachal pradesh',
  'jharkhand', 'karnataka', 'kerala', 'madhya pradesh', 'maharashtra', 'manipur', 'meghalaya', 'mizoram', 'nagaland', 'odisha',
  'punjab', 'rajasthan', 'sikkim', 'tamil nadu', 'telangana', 'tripura', 'uttar pradesh', 'uttarakhand', 'west bengal',
  'andaman and nicobar islands', 'chandigarh', 'dadra and nagar haveli and daman and diu', 'delhi', 'jammu and kashmir',
  'ladakh', 'lakshadweep', 'puducherry'
]);
const normalizeText = (value: string) => value.trim().replace(/\s+/g, ' ').toLowerCase();
const titleCase = (value: string) => value.replace(/\s+/g, ' ').split(' ').filter(Boolean).map((part) => part ? part[0].toUpperCase() + part.slice(1).toLowerCase() : part).join(' ');
const extractState = (value: string) => {
  const raw = value.split(',').pop()?.trim() || '';
  if (!raw) return '';
  const normalized = raw.toLowerCase();
  const matched = Array.from(STATE_NAMES).find((state) => normalized.includes(state));
  return titleCase(matched || raw);
};

const Th = ({ children }: { children: React.ReactNode }) => (
  <th className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider px-4 py-3 border-b border-slate-800">{children}</th>
);
const Td = ({ children, className = '', colSpan }: { children: React.ReactNode; className?: string; colSpan?: number }) => (
  <td colSpan={colSpan} className={`text-xs text-slate-300 px-4 py-3 border-b border-slate-800/60 ${className}`}>{children}</td>
);

const SOURCE_OPTIONS: { key: string; label: string }[] = [
  { key: 'users', label: 'Registered Users' },
  { key: 'leads', label: 'Visitors & Leads' },
  { key: 'evaluations', label: 'Startup Evaluations' },
  { key: 'dsc', label: 'DSC Applications' },
  { key: 'orders', label: 'Orders' },
];

function BroadcastMail() {
  const [counts, setCounts] = useState<Record<string, number> | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [selected, setSelected] = useState<string[]>(SOURCE_OPTIONS.map((s) => s.key));
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);

  useEffect(() => {
    axios.get(`${API_URL}/broadcast/recipients`)
      .then((res) => { setCounts(res.data.counts || {}); setTotal(res.data.total ?? null); })
      .catch(() => setCounts({}));
  }, []);

  const toggle = (key: string) =>
    setSelected((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);

  const approxCount = counts === null
    ? null
    : selected.length === SOURCE_OPTIONS.length && total !== null
      ? total
      : selected.reduce((n, k) => n + (counts[k] || 0), 0);

  const send = async () => {
    setResult(null);
    if (!subject.trim() || !message.trim()) {
      setResult({ ok: false, msg: 'Subject and message are both required.' });
      return;
    }
    if (selected.length === 0) {
      setResult({ ok: false, msg: 'Select at least one recipient group.' });
      return;
    }
    const label = approxCount !== null ? `~${approxCount}` : 'all';
    if (!window.confirm(`This mail will be sent to ${label} users. Send now?`)) return;

    setSending(true);
    try {
      const res = await axios.post(`${API_URL}/broadcast`, { subject, message, sources: selected });
      setResult({ ok: true, msg: res.data.msg || 'Mail sent.' });
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setResult({ ok: false, msg: err.response?.data?.msg || 'Failed to send mail.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
        <p className="text-white font-bold text-sm mb-1">Recipients</p>
        <p className="text-slate-500 text-[11px] mb-4">Choose which groups receive this mail. Duplicate email IDs are sent only once, and addresses stay hidden from each other (BCC).</p>
        <div className="space-y-2">
          {SOURCE_OPTIONS.map((s) => {
            const on = selected.includes(s.key);
            return (
              <button key={s.key} type="button" onClick={() => toggle(s.key)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                  on ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-slate-950/40 border-slate-700 text-slate-400 hover:border-slate-500'
                }`}>
                <span className="flex items-center gap-2">
                  <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${on ? 'border-emerald-400 bg-emerald-500/20' : 'border-slate-600'}`}>
                    {on && <span className="w-1.5 h-1.5 rounded-sm bg-emerald-400" />}
                  </span>
                  {s.label}
                </span>
                <span className="text-[10px] font-black text-slate-500">
                  {counts === null ? '…' : `${counts[s.key] ?? 0} emails`}
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-slate-400 text-xs font-bold">Total unique recipients</span>
          <span className="text-emerald-400 text-sm font-black">{approxCount === null ? '…' : approxCount}</span>
        </div>
      </div>

      <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
        <p className="text-white font-bold text-sm mb-4">Compose Mail</p>

        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Subject</label>
        <input value={subject} onChange={(e) => setSubject(e.target.value)} disabled={sending}
          placeholder="e.g. Big news from Aarambhh!"
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-600 bg-slate-950/70 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/15 placeholder-slate-500 mb-4" />

        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Message</label>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} disabled={sending} rows={9}
          placeholder={'Dear founder,\n\nWrite your announcement here...'}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-600 bg-slate-950/70 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/15 placeholder-slate-500 resize-none mb-2" />
        <p className="text-slate-600 text-[10px] mb-4">The message is wrapped in the Aarambhh email template automatically (logo header + "Team Aarambhh" signature). Line breaks are preserved.</p>

        {result && (
          <div className={`mb-4 p-3 rounded-xl border text-xs flex items-start gap-2 ${result.ok ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300' : 'bg-red-500/10 border-red-500/25 text-red-400'}`}>
            {result.ok ? <CheckCircle2 size={15} className="flex-shrink-0 mt-0.5" /> : <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />}
            <span>{result.msg}</span>
          </div>
        )}

        <button type="button" onClick={send} disabled={sending}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl grad-em text-white text-xs font-extrabold shadow-lg hover:opacity-90 transition-all cursor-pointer ${sending ? 'opacity-70 pointer-events-none' : ''}`}>
          {sending ? (<><Loader2 size={14} className="animate-spin" /> Sending to all users…</>) : (<><Send size={14} /> Send to All Users</>)}
        </button>
      </div>
    </div>
  );
}

// Daily-activity chart for the last 14 days — bar, line, or dot (scatter) form.
function ActivityChart({
  dates,
  title = 'Daily Activity — Last 14 Days',
  subtitle = 'Every form submission and signup (leads, users, DSC, orders, evaluations)',
  type = 'bar',
  color = '#059669',
}: {
  dates: string[];
  title?: string;
  subtitle?: string;
  type?: 'bar' | 'line' | 'dot';
  color?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);

  const DAYS = 14;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const buckets = Array.from({ length: DAYS }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (DAYS - 1 - i));
    return d;
  });
  const counts = buckets.map((d) => {
    const start = d.getTime();
    const end = start + 86400000;
    return dates.reduce((n, s) => {
      const t = new Date(s).getTime();
      return t >= start && t < end ? n + 1 : n;
    }, 0);
  });
  const total = counts.reduce((a, b) => a + b, 0);
  const max = Math.max(...counts, 1);

  const W = 600, H = 220, padL = 30, padR = 8, padT = 12, padB = 26;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const slot = plotW / DAYS;
  const barW = Math.max(slot - 8, 8);

  const yFor = (v: number) => padT + plotH - (v / max) * plotH;
  const midTick = Math.ceil(max / 2);

  // Bar with a 4px rounded top (data end) and a square baseline.
  const barPath = (x: number, y: number, w: number, h: number) => {
    if (h <= 0) return '';
    const r = Math.min(4, h, w / 2);
    return `M${x},${y + h} L${x},${y + r} Q${x},${y} ${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h} Z`;
  };

  const fmtDay = (d: Date) => d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
        <div>
          <p className="text-white font-bold text-sm">{title}</p>
          <p className="text-slate-500 text-[11px]">{subtitle}</p>
        </div>
        <p className="text-white text-lg font-black">{total}<span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider ml-1.5">total</span></p>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Bar chart of daily submissions for the last 14 days">
          {/* recessive gridlines + y labels */}
          {[0, midTick, max].map((v) => (
            <g key={v}>
              <line x1={padL} x2={W - padR} y1={yFor(v)} y2={yFor(v)} stroke="#1e293b" strokeWidth="1" />
              <text x={padL - 6} y={yFor(v) + 3} textAnchor="end" fontSize="9" fill="#64748b">{v}</text>
            </g>
          ))}

          {/* data marks — bar, line, or dot form */}
          {type === 'bar' && counts.map((c, i) => {
            const x = padL + i * slot + (slot - barW) / 2;
            const h = (c / max) * plotH;
            return (
              <path key={i} d={barPath(x, yFor(c), barW, h)} fill={color}
                style={{ filter: hover === i ? 'brightness(1.35)' : undefined }} />
            );
          })}

          {type === 'line' && (
            <>
              <polyline
                points={counts.map((c, i) => `${padL + i * slot + slot / 2},${yFor(c)}`).join(' ')}
                fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
              {counts.map((c, i) => (
                <circle key={i} cx={padL + i * slot + slot / 2} cy={yFor(c)} r={hover === i ? 5 : 4}
                  fill={color} stroke="#0f172a" strokeWidth="2"
                  style={{ filter: hover === i ? 'brightness(1.35)' : undefined }} />
              ))}
            </>
          )}

          {type === 'dot' && counts.map((c, i) => (
            <circle key={i} cx={padL + i * slot + slot / 2} cy={yFor(c)} r={c === 0 ? 2.5 : (hover === i ? 6.5 : 5.5)}
              fill={c === 0 ? '#334155' : color} stroke="#0f172a" strokeWidth="2"
              style={{ filter: hover === i ? 'brightness(1.35)' : undefined }} />
          ))}

          {/* crosshair for line/dot hover */}
          {hover !== null && type !== 'bar' && (
            <line x1={padL + hover * slot + slot / 2} x2={padL + hover * slot + slot / 2}
              y1={padT} y2={padT + plotH} stroke="#334155" strokeWidth="1" />
          )}

          {/* full-column hover targets, larger than the marks */}
          {counts.map((_, i) => (
            <rect key={i} x={padL + i * slot} y={padT} width={slot} height={plotH} fill="transparent"
              onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} />
          ))}

          {/* x labels — every other day to avoid collisions */}
          {buckets.map((d, i) => (i % 2 === 1 ? (
            <text key={i} x={padL + i * slot + slot / 2} y={H - 8} textAnchor="middle" fontSize="9" fill="#64748b">
              {fmtDay(d)}
            </text>
          ) : null))}
        </svg>

        {hover !== null && (
          <div className="absolute pointer-events-none -translate-x-1/2 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 shadow-xl"
            style={{ left: `${((padL + hover * slot + slot / 2) / W) * 100}%`, top: 0 }}>
            <p className="text-slate-400 text-[10px] whitespace-nowrap">{fmtDay(buckets[hover])}</p>
            <p className="text-white text-xs font-bold whitespace-nowrap">{counts[hover]} submission{counts[hover] === 1 ? '' : 's'}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const auth = useContext(AuthContext);
  const [tab, setTab] = useState<TabId>('overview');
  const [authChecked, setAuthChecked] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [notLoggedIn, setNotLoggedIn] = useState(false);

  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [users, setUsers] = useState<RegisteredUser[] | null>(null);
  const [dscApps, setDscApps] = useState<DscApp[] | null>(null);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [evaluations, setEvaluations] = useState<EvaluationSummary[] | null>(null);
  const [selectedEvaluation, setSelectedEvaluation] = useState<EvaluationDetail | null>(null);
  const detailLoading = false;
  const detailError = '';
  const [evalSearchQuery, setEvalSearchQuery] = useState('');
  const [evalScoreFilter, setEvalScoreFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [evalCityFilter, setEvalCityFilter] = useState('all');
  const [evalStateFilter, setEvalStateFilter] = useState('all');
  const [loadingTab, setLoadingTab] = useState(false);
  const [tabError, setTabError] = useState('');

  // Initial admin-access probe using the leads endpoint
  useEffect(() => {
    if (auth?.loading) return;
    if (!auth?.user) {
      setNotLoggedIn(true);
      setAuthChecked(true);
      return;
    }
    const probe = async () => {
      try {
        await axios.get(`${API_URL}/leads`);
        setAuthChecked(true);
      } catch (err: any) {
        if (err.response?.status === 403) setAccessDenied(true);
        else setNotLoggedIn(true);
        setAuthChecked(true);
      }
    };
    probe();
  }, [auth?.loading, auth?.user]);

  useEffect(() => {
    if (!authChecked || notLoggedIn || accessDenied) return;

    const load = async () => {
      setLoadingTab(true);
      setTabError('');
      try {
        if (tab === 'overview' || tab === 'leads' || tab === 'audit' || tab === 'tools') {
          if (leads === null) {
            const res = await axios.get(`${API_URL}/leads`);
            setLeads(res.data.leads || []);
          }
        }
        if (tab === 'overview' || tab === 'users') {
          if (users === null) {
            const res = await axios.get(`${API_URL}/auth/users`);
            setUsers(res.data.users || []);
          }
        }
        if (tab === 'overview' || tab === 'dsc') {
          if (dscApps === null) {
            const res = await axios.get(`${API_URL}/dsc`);
            setDscApps(res.data.applications || []);
          }
        }
        if (tab === 'overview' || tab === 'orders') {
          if (orders === null) {
            const res = await axios.get(`${API_URL}/orders`);
            setOrders(res.data.orders || []);
          }
        }
        if (tab === 'overview' || tab === 'evaluations') {
          if (evaluations === null) {
            const res = await axios.get(`${API_URL}/evaluations`);
            setEvaluations(res.data.evaluations || []);
          }
        }
      } catch (err: any) {
        setTabError(err.response?.data?.msg || 'Failed to load data.');
      } finally {
        setLoadingTab(false);
      }
    };
    load();
  }, [tab, authChecked, notLoggedIn, accessDenied]);


  const filteredEvaluations = (evaluations || []).filter((e) => {
    const query = evalSearchQuery.trim().toLowerCase();
    const matchQuery = query === '' || [e.startupName, e.founderName, e.email, e.mobileNumber, e.cityCountry, e.status]
      .some((value) => value?.toLowerCase().includes(query));
    const score = e.aiEvaluation?.overallScore ?? 0;
    const matchScore = evalScoreFilter === 'all'
      || (evalScoreFilter === 'low' && score < 35)
      || (evalScoreFilter === 'medium' && score >= 35 && score <= 70)
      || (evalScoreFilter === 'high' && score > 70);
    const cityValue = (e.cityCountry || '').split(',')[0]?.trim().toLowerCase() || '';
    const matchCity = evalCityFilter === 'all' || cityValue === evalCityFilter;
    const matchState = evalStateFilter === 'all' || normalizeText(extractState(e.cityCountry || '')) === evalStateFilter;
    return matchQuery && matchScore && matchCity && matchState;
  });

  const evalCityOptions = Array.from(new Map((evaluations || [])
    .map((e) => (e.cityCountry || '').split(',')[0]?.trim())
    .filter(Boolean)
    .map((city) => [normalizeText(city), city] as const))
    .values())
    .sort((a, b) => a.localeCompare(b));

  const evalStateOptions = Array.from(new Map((evaluations || [])
    .map((e) => extractState(e.cityCountry || ''))
    .filter(Boolean)
    .map((state) => [normalizeText(state), state] as const))
    .values())
    .sort((a, b) => a.localeCompare(b));

  if (!authChecked) {
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
          <p className="text-slate-400 text-sm mb-5">Please sign in with an authorized admin account.</p>
          <Link to="/adminlogin" className="inline-block px-6 py-3 rounded-xl grad-em text-white text-sm font-bold shadow-lg hover:opacity-90 transition-all">
            Go to Admin Login
          </Link>
        </div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1d] px-4">
        <div className="text-center max-w-md">
          <ShieldAlert size={40} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-white font-bold text-lg mb-2">Access Restricted</h2>
          <p className="text-slate-400 text-sm">Your account ({auth?.user?.email}) is not authorized as an admin.</p>
          <Link to="/adminlogin" className="inline-block mt-4 px-6 py-3 rounded-xl border border-emerald-500/40 text-emerald-300 text-sm font-bold hover:bg-emerald-500/10 transition-all">
            Switch Account
          </Link>
        </div>
      </div>
    );
  }

  const totalVisitors = (leads?.length || 0) + (users?.length || 0);

  return (
    <div className="min-h-screen bg-[#0a0f1d] pt-20 pb-16">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-black text-white">Admin Dashboard</h1>
            <p className="text-slate-400 text-xs mt-1">Full site access — logged in as {auth?.user?.email}</p>
          </div>
          <button onClick={() => { auth?.logout(); }} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-800/60 transition-all cursor-pointer">
            <LogOut size={13} /> Log Out
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left sidebar — section list */}
          <aside className="lg:w-60 flex-shrink-0">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 lg:sticky lg:top-24 bg-slate-900/70 border border-slate-800 rounded-2xl p-2">
              {TABS.map((t) => {
                const Icon = t.icon;
                return (
                  <button key={t.id} onClick={() => setTab(t.id)}
                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap lg:w-full text-left transition-all cursor-pointer ${
                      tab === t.id
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'text-slate-400 border border-transparent hover:text-white hover:bg-slate-800/60'
                    }`}>
                    <Icon size={14} className="flex-shrink-0" /> {t.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Right content area */}
          <div className="flex-1 min-w-0">

        {tabError && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/25 text-red-400 text-xs rounded-xl">{tabError}</div>
        )}

        {loadingTab && (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="animate-spin text-emerald-400" />
          </div>
        )}

        {!loadingTab && tab === 'overview' && (
          <div className="space-y-4">
            <div className="grid lg:grid-cols-5 gap-4">
              {/* Chart in the middle-left */}
              <div className="lg:col-span-3 bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
                <ActivityChart dates={[
                  ...(leads || []).map((l) => l.dateSubmitted),
                  ...(users || []).map((u) => u.dateCreated),
                  ...(dscApps || []).map((d) => d.dateSubmitted),
                  ...(orders || []).map((o) => o.dateSubmitted),
                  ...(evaluations || []).map((e) => e.dateSubmitted),
                ]} />
              </div>

              {/* Stat boxes on the right, 2 per row */}
              <div className="lg:col-span-2 grid grid-cols-2 gap-4 content-start">
                {[
                  { label: 'Total Leads', value: leads?.length ?? '-', icon: Phone, color: 'text-emerald-400' },
                  { label: 'Audit Tool Submissions', value: leads?.filter((l) => l.type === 'audit').length ?? '-', icon: ListChecks, color: 'text-pink-400' },
                  { label: 'Tool Requests (NIC/TM/etc.)', value: leads?.filter((l) => l.type === 'tool-lead').length ?? '-', icon: Search, color: 'text-amber-400' },
                  { label: 'Registered Users', value: users?.length ?? '-', icon: Users, color: 'text-blue-400' },
                  { label: 'DSC Applications', value: dscApps?.length ?? '-', icon: KeyRound, color: 'text-purple-400' },
                  { label: 'Orders', value: orders?.length ?? '-', icon: ShoppingBag, color: 'text-orange-400' },
                  { label: 'Evaluations', value: evaluations?.length ?? '-', icon: ClipboardCheck, color: 'text-cyan-400' },
                  { label: 'People Reached', value: totalVisitors, icon: Users, color: 'text-emerald-400' },
                ].map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div key={i} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4">
                      <Icon size={16} className={`${s.color} mb-2`} />
                      <p className="text-xl font-black text-white">{s.value}</p>
                      <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-wide mt-0.5 leading-tight">{s.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Per-section charts — all graphs live here on the Overview only */}
            <div className="grid md:grid-cols-2 gap-4">
              {([
                { title: 'Visitors & Leads', subtitle: 'New leads per day (callback, quote, audit, BCI Yuva forms) — line chart', dates: (leads || []).map((l) => l.dateSubmitted), type: 'line', color: '#059669' },
                { title: 'Audit Tool', subtitle: 'Audit Tool quiz submissions per day — bar chart', dates: (leads || []).filter((l) => l.type === 'audit').map((l) => l.dateSubmitted), type: 'bar', color: '#3b82f6' },
                { title: 'Tools (NIC/TM/etc.)', subtitle: 'NIC / Trademark / Company tool requests per day — scatter plot', dates: (leads || []).filter((l) => l.type === 'tool-lead').map((l) => l.dateSubmitted), type: 'dot', color: '#d97706' },
                { title: 'Registered Users', subtitle: 'New founder accounts created per day — line chart', dates: (users || []).map((u) => u.dateCreated), type: 'line', color: '#9333ea' },
                { title: 'DSC Applications', subtitle: 'Digital Signature Certificate applications per day — bar chart', dates: (dscApps || []).map((d) => d.dateSubmitted), type: 'bar', color: '#0891b2' },
                { title: 'Orders', subtitle: 'Premium package orders per day — scatter plot', dates: (orders || []).map((o) => o.dateSubmitted), type: 'dot', color: '#db2777' },
                { title: 'Startup Evaluations', subtitle: 'Basic Startup Evaluation Form submissions per day — line chart', dates: (evaluations || []).map((e) => e.dateSubmitted), type: 'line', color: '#ea580c' },
              ] as { title: string; subtitle: string; dates: string[]; type: 'bar' | 'line' | 'dot'; color: string }[]).map((c) => (
                <div key={c.title} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
                  <ActivityChart dates={c.dates} title={`${c.title} — Last 14 Days`} subtitle={c.subtitle} type={c.type} color={c.color} />
                </div>
              ))}
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
              <p className="text-white font-bold text-sm mb-1">Total People Reached: {totalVisitors}</p>
              <p className="text-slate-500 text-xs">Sum of all leads (callback/quote/audit/BCI Yuva forms) + registered founder accounts. Switch sections on the left to see full contact details (name, email, phone) for each.</p>
            </div>
          </div>
        )}

        {!loadingTab && tab === 'leads' && (
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead><tr><Th>Name</Th><Th>Phone</Th><Th>Email</Th><Th>Type / Source</Th><Th>Message</Th><Th>Date</Th></tr></thead>
              <tbody>
                {(leads || []).map((l) => (
                  <tr key={l._id} className="hover:bg-slate-800/30">
                    <Td className="font-semibold text-white">{l.name}</Td>
                    <Td>{l.phone}</Td>
                    <Td>{l.email || '-'}</Td>
                    <Td>{l.type}{l.source ? ` · ${l.source}` : ''}</Td>
                    <Td className="max-w-xs truncate">{l.message || l.service || '-'}</Td>
                    <Td>{fmtDate(l.dateSubmitted)}</Td>
                  </tr>
                ))}
                {(leads || []).length === 0 && <tr><Td className="text-slate-500" >No leads yet.</Td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {!loadingTab && tab === 'audit' && (
          <div className="space-y-4">
            <p className="text-slate-500 text-xs">Every submission from the homepage Audit Tool quiz — name, phone, each answer, and the tier it recommended.</p>
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr>
                    <Th>Name</Th><Th>Phone</Th>
                    {AUDIT_QUESTIONS.map((q) => <Th key={q.key}>{q.label}</Th>)}
                    <Th>Recommended Tier</Th><Th>Date</Th>
                  </tr>
                </thead>
                <tbody>
                  {(leads || []).filter((l) => l.type === 'audit').map((l) => (
                    <tr key={l._id} className="hover:bg-slate-800/30">
                      <Td className="font-semibold text-white">{l.name}</Td>
                      <Td>{l.phone}</Td>
                      {AUDIT_QUESTIONS.map((q) => <Td key={q.key}>{l.answers?.[q.key] || '-'}</Td>)}
                      <Td>{l.recommendation?.tier ? `${l.recommendation.tier} (${l.recommendation.price || ''})` : '-'}</Td>
                      <Td>{fmtDate(l.dateSubmitted)}</Td>
                    </tr>
                  ))}
                  {(leads || []).filter((l) => l.type === 'audit').length === 0 && <tr><Td className="text-slate-500">No Audit Tool submissions yet.</Td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loadingTab && tab === 'tools' && (
          <div className="space-y-4">
            <p className="text-slate-500 text-xs">Requests from the "Tools" cards (NIC Code, Trademark Search, Company Name Check, Company Details, Trademark Class Search) — name, phone, and what they typed in Description.</p>
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead><tr><Th>Name</Th><Th>Phone</Th><Th>Tool</Th><Th>Description</Th><Th>Date</Th></tr></thead>
                <tbody>
                  {(leads || []).filter((l) => l.type === 'tool-lead').map((l) => (
                    <tr key={l._id} className="hover:bg-slate-800/30">
                      <Td className="font-semibold text-white">{l.name}</Td>
                      <Td>{l.phone}</Td>
                      <Td>{l.service || '-'}</Td>
                      <Td className="max-w-sm">{l.message || '-'}</Td>
                      <Td>{fmtDate(l.dateSubmitted)}</Td>
                    </tr>
                  ))}
                  {(leads || []).filter((l) => l.type === 'tool-lead').length === 0 && <tr><Td className="text-slate-500">No tool requests yet.</Td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loadingTab && tab === 'users' && (
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead><tr><Th>Name</Th><Th>Email</Th><Th>Phone</Th><Th>Company</Th><Th>State</Th><Th>Joined</Th></tr></thead>
              <tbody>
                {(users || []).map((u) => (
                  <tr key={u._id} className="hover:bg-slate-800/30">
                    <Td className="font-semibold text-white">{u.name}</Td>
                    <Td>{u.email}</Td>
                    <Td>{u.phone}</Td>
                    <Td>{u.companyName}</Td>
                    <Td>{u.incorporationStatus}</Td>
                    <Td>{fmtDate(u.dateCreated)}</Td>
                  </tr>
                ))}
                {(users || []).length === 0 && <tr><Td className="text-slate-500">No registered users yet.</Td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {!loadingTab && tab === 'dsc' && (
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead><tr><Th>Name</Th><Th>Email</Th><Th>Mobile</Th><Th>Certificate</Th><Th>Price</Th><Th>Date</Th></tr></thead>
              <tbody>
                {(dscApps || []).map((d) => (
                  <tr key={d._id} className="hover:bg-slate-800/30">
                    <Td className="font-semibold text-white">{d.fullName}</Td>
                    <Td>{d.email}</Td>
                    <Td>{d.mobileNumber}</Td>
                    <Td>{d.certificateClass || '-'}</Td>
                    <Td>{d.price ? `?${d.price}` : '-'}</Td>
                    <Td>{fmtDate(d.dateSubmitted)}</Td>
                  </tr>
                ))}
                {(dscApps || []).length === 0 && <tr><Td className="text-slate-500">No DSC applications yet.</Td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {!loadingTab && tab === 'orders' && (
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead><tr><Th>Name</Th><Th>Email</Th><Th>Phone</Th><Th>Package</Th><Th>Price</Th><Th>State</Th><Th>Date</Th></tr></thead>
              <tbody>
                {(orders || []).map((o) => (
                  <tr key={o._id} className="hover:bg-slate-800/30">
                    <Td className="font-semibold text-white">{o.name}</Td>
                    <Td>{o.email}</Td>
                    <Td>{o.phone}</Td>
                    <Td>{o.packageName}</Td>
                    <Td>{o.packagePrice}</Td>
                    <Td>{o.status}</Td>
                    <Td>{fmtDate(o.dateSubmitted)}</Td>
                  </tr>
                ))}
                {(orders || []).length === 0 && <tr><Td className="text-slate-500">No orders yet.</Td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {!loadingTab && tab === 'broadcast' && <BroadcastMail />}

        {!loadingTab && tab === 'evaluations' && (
          <div className="space-y-4">
            <div className="grid gap-3 mb-4 md:grid-cols-[1fr_repeat(3,minmax(0,260px))]">
              <input
                value={evalSearchQuery}
                onChange={(e) => setEvalSearchQuery(e.target.value)}
                placeholder="Search by startup, founder, email, mobile, city, or state"
                className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/15"
              />
              <select
                value={evalScoreFilter}
                onChange={(e) => setEvalScoreFilter(e.target.value as any)}
                className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white focus:border-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/15"
              >
                <option value="all">Score: All</option>
                <option value="low">Score: Low (&lt; 35)</option>
                <option value="medium">Score: Medium (35-70)</option>
                <option value="high">Score: High (&gt; 70)</option>
              </select>
              <select
                value={evalCityFilter}
                onChange={(e) => setEvalCityFilter(e.target.value)}
                className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white focus:border-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/15"
              >
                <option value="all">City: All</option>
                {evalCityOptions.map((city) => (
                  <option key={city} value={city.toLowerCase()}>{city}</option>
                ))}
              </select>
              <select
                value={evalStateFilter}
                onChange={(e) => setEvalStateFilter(e.target.value)}
                className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-white focus:border-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/15"
              >
                <option value="all">State: All</option>
                {evalStateOptions.map((state) => (
                  <option key={state} value={normalizeText(state)}>{state}</option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              <Link to="/admin/evaluations" className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-bold hover:underline">
                Open Full Evaluations Dashboard (scores, strengths, risks) <ExternalLink size={12} />
              </Link>

              {selectedEvaluation ? (
                <div className="bg-slate-900/80 border border-cyan-500/20 rounded-3xl p-5 mb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div>
                      <p className="text-slate-400 text-xs uppercase tracking-[0.3em] mb-2">Evaluation Detail</p>
                      <h2 className="text-xl font-black text-white">{selectedEvaluation.startupName || 'No startup name'}</h2>
                      <p className="text-slate-400 text-sm">
                        {selectedEvaluation.founderName} / {selectedEvaluation.email} / {selectedEvaluation.mobileNumber}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedEvaluation(null)}
                      className="rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-2 text-xs font-bold text-slate-200 hover:border-cyan-500/40 hover:text-white transition-all"
                    >
                      Back to table
                    </button>
                  </div>

                  {detailError ? (
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-red-300 text-sm">{detailError}</div>
                  ) : detailLoading ? (
                    <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-3 text-slate-400 text-sm">Loading detail...</div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                        <p className="text-slate-400 text-xs uppercase tracking-[0.3em] mb-2">Overall Score</p>
                        <p className="text-3xl font-black text-emerald-400">
                          {selectedEvaluation.aiEvaluation?.overallScore ?? '-'}<span className="text-slate-500 text-sm">/100</span>
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                        <p className="text-slate-400 text-xs uppercase tracking-[0.3em] mb-2">Submitted</p>
                        <p className="text-sm text-slate-200">{fmtDate(selectedEvaluation.dateSubmitted)}</p>
                        <p className="text-sm text-slate-400 mt-2">State: {selectedEvaluation.status || 'N/A'}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}

              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr>
                      <Th>Startup</Th>
                      <Th>Founder</Th>
                      <Th>Email</Th>
                      <Th>Mobile</Th>
                      <Th>City</Th>
                      <Th>State</Th>
                      <Th>Score</Th>
                      <Th>Date</Th>
                      <Th>Action</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvaluations.map((e) => (
                      <tr key={e._id} className="hover:bg-slate-800/30">
                        <Td className="font-semibold text-white">{e.startupName || '-'}</Td>
                        <Td>{e.founderName}</Td>
                        <Td>{e.email}</Td>
                        <Td>{e.mobileNumber}</Td>
                        <Td>{e.cityCountry || 'City not provided'}</Td>
                        <Td>{e.status || 'submitted'}</Td>
                        <Td>{e.aiEvaluation?.overallScore ?? '-'}/100</Td>
                        <Td>{fmtDate(e.dateSubmitted)}</Td>
                        <Td>
                          <Link to={`/admin/evaluations?id=${e._id}`} className="inline-flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-[11px] font-semibold text-cyan-300 hover:border-cyan-500/40 hover:bg-slate-900/80 transition-all">
                            <Eye size={14} /> View
                          </Link>
                        </Td>
                      </tr>
                    ))}
                    {filteredEvaluations.length === 0 && (
                      <tr><Td colSpan={9} className="text-slate-500">No evaluations match your search or filter.</Td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
}

