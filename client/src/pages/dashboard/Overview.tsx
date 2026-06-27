import type { User } from '../../context/AuthContext';
import { AlertCircle, Building2, Users, FileText, Check, Phone, Mail, Folder, Monitor, Shield } from 'lucide-react';

interface OverviewProps {
  user: User;
  setTab: (tabId: string) => void;
}

export default function Overview({ user, setTab }: OverviewProps) {
  const milestones = [
    "Form Submitted", "Name Approved", "Docs Uploaded", "Ministry Review", "COI Issued",
  ];
  
  const progress = Math.round((user.progressDays / user.totalDays) * 100);

  return (
    <div className="animate-fade-in space-y-6">
      {/* Alert */}
      <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4">
        <AlertCircle size={18} className="text-amber-400 flex-shrink-0 mt-0.5"/>
        <div>
          <p className="text-amber-300 font-bold text-sm">Application In Progress — Day {user.progressDays} of {user.totalDays}</p>
          <p className="text-amber-400/80 text-xs mt-0.5 font-medium">Your application is currently under review with the Ministry of Corporate Affairs. Estimated completion in {user.totalDays - user.progressDays} working days.</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Company Type", val: user.companyType, icon: Building2, color: "text-blue-400" },
          { label: "Assigned Advisor", val: user.advisorName, icon: Users, color: "text-emerald-400" },
          { label: "PAN Status", val: user.panStatus, icon: FileText, color: "text-purple-400" },
          { label: "TAN Status", val: user.tanStatus, icon: FileText, color: "text-orange-400" },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="glass rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Icon size={15} className={s.color} /><p className="text-slate-400 text-xs font-semibold">{s.label}</p>
              </div>
              <p className="text-white font-bold text-sm truncate">{s.val}</p>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="glass rounded-3xl p-7">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white font-black text-lg">{user.companyName}</h2>
            <p className="text-slate-400 text-sm mt-0.5 font-medium">Incorporation Progress — {progress}% Complete</p>
          </div>
          <div className="text-right">
            <span className="inline-block px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-300 text-xs font-bold">
              {user.incorporationStatus === "processing" ? "🔄 In Progress" : "✅ Complete"}
            </span>
          </div>
        </div>

        {/* Day progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Day {user.progressDays} of {user.totalDays}</span><span>{progress}%</span>
          </div>
          <div className="w-full h-3 bg-slate-700/60 rounded-full overflow-hidden">
            <div className="h-full grad-em rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* Milestone steps */}
        <div className="overflow-x-auto">
          <div className="flex min-w-max pb-4">
            {milestones.map((m, i) => {
              const done = i < user.milestoneStep;
              const active = i === user.milestoneStep - 1;
              return (
                <div key={i} className="milestone-step px-3" style={{ minWidth: "120px" }}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 relative border-2 ${done ? "grad-em border-emerald-400" : active ? "border-amber-400 bg-amber-500/15" : "border-slate-600 bg-slate-800"}`}>
                    {done ? <Check size={14} className="text-white" strokeWidth={2.5} /> : <span className={`text-xs font-bold ${active ? "text-amber-400" : "text-slate-500"}`}>{i + 1}</span>}
                  </div>
                  <p className={`text-xs font-semibold mt-2 text-center ${done ? "text-emerald-400" : active ? "text-amber-400" : "text-slate-500"}`}>{m}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick action cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { icon: Folder, title: "Document Vault", desc: "View & download your corporate documents", tab: "wallet", color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { icon: Monitor, title: "Tech Setup Hub", desc: "Configure email, website & digital tools", tab: "techsetup", color: "text-blue-400", bg: "bg-blue-500/10" },
          { icon: Shield, title: "Compliance Tasks", desc: "View upcoming deadlines & filings", tab: "compliance", color: "text-purple-400", bg: "bg-purple-500/10" },
        ].map((c, i) => {
          const Icon = c.icon;
          return (
            <button key={i} onClick={() => setTab(c.tab)}
              className="glass bento rounded-2xl p-5 text-left hover:border-emerald-500/30 transition-all block w-full">
              <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center mb-4`}><Icon size={18} className={c.color} /></div>
              <h3 className="text-white font-bold text-sm mb-1">{c.title}</h3>
              <p className="text-slate-400 text-xs">{c.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Advisor contact */}
      <div className="glass rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl grad-blue flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black">{user.advisorName.split(" ")[1]?.charAt(0) || "R"}</span>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Your Dedicated Advisor</p>
            <p className="text-white font-bold text-base">{user.advisorName}</p>
            <p className="text-slate-400 text-xs font-medium">{user.advisorPhone} · Qualified Company Secretary & CA</p>
          </div>
        </div>
        <div className="flex gap-2">
          <a href={`tel:${user.advisorPhone}`} className="px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/25 transition-colors flex items-center gap-1.5 justify-center">
            <Phone size={14} /> Call Now
          </a>
          <a href={`mailto:advisor@aarambhh.com`} className="px-4 py-2 rounded-xl border border-slate-600 text-slate-300 text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5 justify-center">
            <Mail size={14} /> Email
          </a>
        </div>
      </div>
    </div>
  );
}
