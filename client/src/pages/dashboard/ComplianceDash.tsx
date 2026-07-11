import React, { useContext, useState } from 'react';
import { COMPLIANCE_ITEMS, colorMap, GOOGLE_FORM_URL } from '../../constants/data';
import { AuthContext, type User } from '../../context/AuthContext';
import { FileText, DollarSign, Users, Shield, Lock, Globe, AlertCircle, CheckCircle, Check, Loader2 } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  fileText: FileText,
  dollarSign: DollarSign,
  users: Users,
  shield: Shield,
  lock: Lock,
  globe: Globe
};

interface ComplianceDashProps {
  user: User;
}

export default function ComplianceDash({ user }: ComplianceDashProps) {
  const auth = useContext(AuthContext);
  const [savingIndex, setSavingIndex] = useState<number | null>(null);
  const configured: Record<number, boolean> = {};
  (user.complianceConfigured || []).forEach((i) => { configured[i] = true; });

  const handleConfigure = async (i: number) => {
    if (!auth) return;
    setSavingIndex(i);
    await auth.updateCompliance(i, true);
    setSavingIndex(null);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="glass rounded-3xl p-7">
        <h2 className="text-white font-black text-xl mb-2">Compliance Dashboard</h2>
        <p className="text-slate-400 text-sm">Monitor and configure all your mandatory corporate governance tasks from one place.</p>
      </div>

      {/* Alert */}
      <div className="flex items-start gap-3 bg-amber-500/8 border border-amber-500/20 rounded-2xl p-5">
        <AlertCircle size={18} className="text-amber-400 flex-shrink-0 mt-0.5"/>
        <div>
          <p className="text-amber-300 font-bold text-sm">Non-Compliance Penalties Are Severe</p>
          <p className="text-amber-400/75 text-xs mt-0.5 font-medium">MCA defaults: ₹200/day. GST non-filing: 18% interest. Late TDS: prosecution risk. Stay ahead with Aarambhh.</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {COMPLIANCE_ITEMS.map((item, i) => {
          const Icon = iconMap[item.icon] || FileText;
          return (
            <div key={i} className={`bento glass rounded-2xl p-6 border transition-all ${configured[i] ? "border-emerald-500/40 bg-emerald-500/5" : "border-slate-700/30"}`}>
              <div className={`inline-flex w-11 h-11 rounded-xl items-center justify-center mb-4 ${colorMap[item.color]}`}>
                <Icon size={19} />
              </div>
              <h3 className="font-bold text-white text-sm mb-2">{item.title}</h3>
              <p className="text-slate-400 text-xs mb-4 leading-relaxed font-medium">{item.desc}</p>
              <div className="flex items-center justify-between">
                {configured[i] ? (
                  <span className="flex items-center gap-1.5 text-emerald-400 font-semibold text-xs">
                    <CheckCircle size={13} className="text-emerald-400" />Configured
                  </span>
                ) : (
                  <button onClick={() => handleConfigure(i)} disabled={savingIndex === i}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg grad-em text-white text-xs font-bold hover:opacity-90 disabled:opacity-70">
                    {savingIndex === i ? <Loader2 size={12} className="animate-spin" /> : null}
                    {savingIndex === i ? 'Saving...' : 'Configure →'}
                  </button>
                )}
                <a href={GOOGLE_FORM_URL} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-emerald-400 transition-colors font-medium">Get Quote</a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Annual calendar */}
      <div className="glass rounded-3xl p-7">
        <h3 className="text-white font-bold text-base mb-5">Annual Compliance Calendar</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { q: "Q1 (Jan–Mar)", tasks: ["TDS Quarterly Return (Q3)", "Advance Tax (15 Mar)", "GSTR-1 Monthly"] },
            { q: "Q2 (Apr–Jun)", tasks: ["Annual ITR Filing", "AOC-4 Filing Prep", "GSTR-9 Annual Prep"] },
            { q: "Q3 (Jul–Sep)", tasks: ["AGM Conduct (by 30 Sep)", "MGT-7 Filing (60d post AGM)", "DIR-3 KYC (30 Sep)"] },
            { q: "Q4 (Oct–Dec)", tasks: ["Advance Tax (15 Dec)", "Board Minutes Finalization", "Year-end Audit Prep"] },
          ].map((q, i) => (
            <div key={i} className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/30">
              <h4 className="font-black text-slate-200 text-xs mb-3 pb-2 border-b border-slate-700/40">{q.q}</h4>
              <ul className="space-y-1.5">
                {q.tasks.map((t, j) => (
                  <li key={j} className="flex items-start gap-1.5 text-xs text-slate-400 font-semibold">
                    <Check size={11} className="text-emerald-500 flex-shrink-0 mt-0.5" strokeWidth={2.5} />{t}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
