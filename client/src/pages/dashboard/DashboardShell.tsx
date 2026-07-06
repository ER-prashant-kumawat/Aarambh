import { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Overview from './Overview';
import FounderWallet from './FounderWallet';
import TechSetupHub from './TechSetupHub';
import ComplianceDash from './ComplianceDash';
import Profile from './Profile';
import { Activity, Folder, Monitor, Shield, Loader2, UserCircle } from 'lucide-react';
import { GOOGLE_FORM_URL } from '../../constants/data';

const tabs = [
  { id: "overview", icon: Activity, label: "Dashboard" },
  { id: "wallet", icon: Folder, label: "Document Vault" },
  { id: "techsetup", icon: Monitor, label: "Tech Setup" },
  { id: "compliance", icon: Shield, label: "Compliance" },
  { id: "profile", icon: UserCircle, label: "My Profile" },
];

export default function DashboardShell() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState("overview");

  const user = auth ? auth.user : null;
  const loading = auth ? auth.loading : true;

  useEffect(() => {
    const activeTab = searchParams.get('tab');
    if (activeTab && tabs.some(t => t.id === activeTab)) {
      setTab(activeTab);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleTabChange = (tabId: string) => {
    setTab(tabId);
    setSearchParams({ tab: tabId });
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-navy">
        <Loader2 className="text-emerald-400 animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen" style={{ background: "linear-gradient(165deg,#0f172a 0%,#1a2744 40%,#0d1f0f 100%)" }}>
      {/* Dashboard header */}
      <div className="border-b border-slate-700/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => handleTabChange('profile')} title="View My Profile">
              <div className="w-14 h-14 rounded-2xl grad-em flex items-center justify-center shadow-xl">
                <span className="text-white font-black text-xl">{user.name.charAt(0)}</span>
              </div>
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Welcome back,</p>
                <h1 className="text-white font-black text-xl">{user.name}</h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="status-dot animate-pulse-slow"></div>
                  <span className="text-emerald-400 text-xs font-semibold">Active Account</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a href={GOOGLE_FORM_URL} target="_blank" rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl grad-em text-white text-sm font-bold shadow-lg hover:opacity-90">
                + Add Service
              </a>
              <button onClick={() => navigate('/contact')}
                className="px-4 py-2 rounded-xl border border-slate-600 text-slate-300 text-sm font-semibold hover:bg-slate-800 transition-colors">
                Talk to Advisor
              </button>
            </div>
          </div>

          {/* Tab nav */}
          <div className="flex gap-1 mt-6 overflow-x-auto">
            {tabs.map(t => {
              const Icon = t.icon;
              return (
                <button key={t.id} onClick={() => handleTabChange(t.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${tab === t.id ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "text-slate-400 hover:text-white hover:bg-slate-800"}`}>
                  <Icon size={15} /> {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {tab === "overview" && <Overview user={user} setTab={handleTabChange} />}
        {tab === "wallet" && <FounderWallet />}
        {tab === "techsetup" && <TechSetupHub user={user} />}
        {tab === "compliance" && <ComplianceDash />}
        {tab === "profile" && <Profile user={user} />}
      </div>
    </div>
  );
}
