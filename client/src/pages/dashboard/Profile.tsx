import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import type { User } from '../../context/AuthContext';
import {
  User as UserIcon, Mail, Phone, Building2, MapPin, FileText,
  ClipboardList, CheckCircle2, Circle, ArrowRight
} from 'lucide-react';
import { API_URL } from '../../utils/api';

interface ProfileProps {
  user: User;
}

interface FormStatus {
  found: boolean;
  completionPercent?: number;
  missingFields?: string[];
  dateSubmitted?: string;
}

export default function Profile({ user }: ProfileProps) {
  const [formStatus, setFormStatus] = useState<FormStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  useEffect(() => {
    let cancelled = false;
    axios.get(`${API_URL}/quote/status`)
      .then((res) => { if (!cancelled) setFormStatus(res.data); })
      .catch(() => { if (!cancelled) setFormStatus(null); })
      .finally(() => { if (!cancelled) setLoadingStatus(false); });
    return () => { cancelled = true; };
  }, []);

  const formPercent = formStatus?.found ? (formStatus.completionPercent ?? 100) : null;
  const missing = formStatus?.missingFields || [];

  const personalDetails = [
    { label: 'Full Name', value: user.name, icon: UserIcon },
    { label: 'Email ID', value: user.email, icon: Mail },
    { label: 'Mobile Number', value: user.phone, icon: Phone },
  ];

  const companyDetails = [
    { label: 'Company Name', value: user.companyName, icon: Building2 },
    { label: 'Company Type', value: user.companyType, icon: FileText },
    { label: 'Registered State', value: user.registeredState, icon: MapPin },
  ];

  const statusChips = [
    { label: 'PAN', value: user.panStatus },
    { label: 'TAN', value: user.tanStatus },
    { label: 'GST', value: user.gstStatus },
  ];

  return (
    <div className="animate-fade-in space-y-6">

      {/* Profile header card */}
      <div className="glass rounded-3xl p-7 flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="w-20 h-20 rounded-2xl grad-em flex items-center justify-center shadow-xl flex-shrink-0">
          <span className="text-white font-black text-3xl">{user.name.charAt(0)}</span>
        </div>
        <div className="min-w-0">
          <h2 className="text-white font-black text-2xl tracking-tight truncate">{user.name}</h2>
          <p className="text-slate-400 text-sm font-medium truncate">{user.email}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="status-dot animate-pulse-slow"></div>
            <span className="text-emerald-400 text-xs font-semibold">Active Account</span>
          </div>
        </div>
      </div>

      {/* Onboarding form completion — the main "kitna baki hai" card */}
      <div className="glass rounded-3xl p-7">
        <div className="flex items-center gap-3 mb-5">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${formPercent === 100 ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
            <ClipboardList size={19} className={formPercent === 100 ? 'text-emerald-400' : 'text-amber-400'} />
          </div>
          <div>
            <h3 className="text-white font-bold text-base">Onboarding Form Status</h3>
            <p className="text-slate-400 text-xs font-medium">Your Instant Onboarding &amp; Quote form progress</p>
          </div>
        </div>

        {loadingStatus ? (
          <p className="text-slate-400 text-sm font-medium">Checking your form status…</p>
        ) : formPercent === null ? (
          <div>
            <p className="text-slate-300 text-sm font-medium mb-4">
              You haven't submitted the onboarding form yet. Fill in just 4 quick details to get started — the rest can be added anytime later.
            </p>
            <Link to="/get-quote"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl grad-em text-white text-sm font-bold shadow-lg hover:opacity-90 transition-opacity">
              Fill Onboarding Form <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div>
            {/* Progress bar */}
            <div className="flex justify-between text-xs mb-2">
              <span className={`font-black ${formPercent === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {formPercent}% Complete
              </span>
              {formPercent < 100 && (
                <span className="text-slate-400 font-semibold">{100 - formPercent}% remaining</span>
              )}
            </div>
            <div className="w-full h-3 bg-slate-700/60 rounded-full overflow-hidden mb-5">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${formPercent === 100 ? 'grad-em' : 'bg-gradient-to-r from-amber-500 to-amber-400'}`}
                style={{ width: `${formPercent}%` }}
              ></div>
            </div>

            {formPercent === 100 ? (
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                <CheckCircle2 size={17} /> All details submitted — your form is 100% complete! 🎉
              </div>
            ) : (
              <div>
                <p className="text-slate-300 text-sm font-semibold mb-3">
                  Details still pending — you can add these anytime:
                </p>
                <ul className="space-y-2 mb-5">
                  {missing.map((field) => (
                    <li key={field} className="flex items-center gap-2.5 text-slate-400 text-sm font-medium">
                      <Circle size={13} className="text-amber-400 flex-shrink-0" />
                      {field}
                    </li>
                  ))}
                </ul>
                <Link to="/get-quote"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl grad-em text-white text-sm font-bold shadow-lg hover:opacity-90 transition-opacity">
                  Complete Remaining Details <ArrowRight size={15} />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Personal + Company details */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass rounded-3xl p-7">
          <h3 className="text-white font-bold text-base mb-5">Personal Details</h3>
          <div className="space-y-4">
            {personalDetails.map((d) => {
              const Icon = d.icon;
              return (
                <div key={d.label} className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={15} className="text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">{d.label}</p>
                    <p className="text-white text-sm font-semibold truncate">{d.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass rounded-3xl p-7">
          <h3 className="text-white font-bold text-base mb-5">Company Details</h3>
          <div className="space-y-4">
            {companyDetails.map((d) => {
              const Icon = d.icon;
              return (
                <div key={d.label} className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={15} className="text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">{d.label}</p>
                    <p className="text-white text-sm font-semibold truncate">{d.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Registration status chips */}
          <div className="flex gap-2 mt-6 flex-wrap">
            {statusChips.map((s) => (
              <span key={s.label} className="px-3 py-1.5 rounded-full bg-slate-800/70 border border-slate-700 text-slate-300 text-xs font-bold">
                {s.label}: <span className="text-emerald-400">{s.value}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
