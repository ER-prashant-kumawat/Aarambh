import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Rocket, Loader2, ArrowRight } from 'lucide-react';

export default function Register() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    companyName: "",
    companyType: "Private Limited Company"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const user = auth ? auth.user : null;
  const register = auth ? auth.register : async () => ({ success: false, error: "Auth failed" });

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await register(form);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-12" style={{ background: "linear-gradient(165deg,#0f172a 0%,#1a2744 40%,#0d1f0f 100%)" }}>
      <div className="w-full max-w-lg px-4">
        <div className="glass rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl grad-em flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Rocket className="text-white" size={22} />
            </div>
            <h2 className="text-white text-2xl font-black">Register Your Company</h2>
            <p className="text-slate-400 text-sm mt-1">Start your tech & legal incorporation setup</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 text-red-400 border border-red-500/25 text-sm rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5">Founder Name *</label>
                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Priya Mehta"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5">Phone Number *</label>
                <input type="tel" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"/>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5">Email Address *</label>
              <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="founder@mycompany.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"/>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5">Password *</label>
              <input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"/>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5">Proposed Company Name *</label>
                <input type="text" required value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })}
                  placeholder="Technovance Solutions"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-1.5">Company Type</label>
                <select value={form.companyType} onChange={e => setForm({ ...form, companyType: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400">
                  <option value="Private Limited Company">Private Limited Company</option>
                  <option value="Limited Liability Partnership (LLP)">LLP</option>
                  <option value="One Person Company (OPC)">OPC</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 mt-2 rounded-xl grad-em text-white font-black text-sm hover:opacity-90 shadow-lg flex items-center justify-center gap-1.5 transition-all">
              {loading && <Loader2 size={16} className="animate-spin" />}
              Launch Company Setup <ArrowRight size={16} />
            </button>
          </form>

          <p className="text-slate-400 text-center text-xs mt-6 font-semibold">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-400 hover:underline font-bold">Founder Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
