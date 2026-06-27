import React, { useState } from 'react';
import axios from 'axios';
import JoinSection from '../components/JoinSection';
import { SERVICES } from '../constants/data';
import { Phone, Mail, MapPin, CheckCircle, Loader2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", service: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post(`${API_URL}/leads/callback`, form);
      setSubmitted(true);
    } catch (err: any) {
      console.error('Error submitting callback:', err);
      setError(err.response?.data?.msg || 'Something went wrong, please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="pt-16">
      <section className="grad-hero py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-emerald-400/8 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-5">
            <span className="text-emerald-400 text-xs font-semibold">Get in Touch</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-5">Contact & Support</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto font-medium">Real humans. Real expertise. Available six days a week to answer your questions and guide your startup's legal journey.</p>
        </div>
      </section>

      <section className="py-16 bg-[#0a0f1d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Contact info */}
            <div>
              <h2 className="text-2xl font-black text-white mb-7">Reach Our Expert Team</h2>
              <div className="space-y-4">
                {[
                  { icon: Phone, label: "Direct Consultation Line", val: "+91 98765 43210", sub: "Mon–Sat, 9:30 AM – 7:00 PM IST" },
                  { icon: Phone, label: "Corporate Support Desk", val: "+91 80 4567 8901", sub: "Dedicated B2B & enterprise helpline" },
                  { icon: Mail, label: "General Enquiries", val: "hello@aarambhh.com", sub: "Response within 2 business hours" },
                  { icon: Mail, label: "Legal & Compliance Support", val: "legal@aarambhh.com", sub: "For ongoing compliance queries" },
                  { icon: MapPin, label: "Registered Office", val: "Aarambhh Legal-Tech Pvt. Ltd.", sub: "27, 3rd Floor, Sector 6, HSR Layout, Bengaluru, Karnataka – 560 102" },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-start gap-4 p-5 bg-slate-900/60 rounded-2xl border border-slate-800/80 shadow-md bento">
                      <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <Icon size={17} className="text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-0.5">{item.label}</p>
                        <p className="font-bold text-white text-sm">{item.val}</p>
                        <p className="text-slate-500 text-xs mt-0.5">{item.sub}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-5 p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0">
                  <Phone size={19} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-emerald-400 text-sm">Chat on WhatsApp</p>
                  <p className="text-emerald-500/90 text-xs">Instant responses: <strong>+91 98765 43210</strong></p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div>
              {!submitted ? (
                <div className="bg-slate-900/60 rounded-3xl p-8 border border-slate-800/80 shadow-xl">
                  <h2 className="text-2xl font-black text-white mb-2">Schedule a Free Callback</h2>
                  <p className="text-slate-400 text-sm mb-7 font-medium">Our experts call back within 30 minutes during business hours. No sales pitch — just genuine guidance.</p>
                  
                  {error && (
                    <div className="mb-4 p-3 bg-red-500/10 text-red-400 border border-red-500/25 text-sm rounded-xl">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">Full Name *</label>
                        <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                          placeholder="Rahul Sharma"
                          className="w-full px-4 py-3 rounded-xl border border-slate-700/50 bg-slate-800/60 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"/>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">Phone Number *</label>
                        <input type="tel" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-3 rounded-xl border border-slate-700/50 bg-slate-800/60 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"/>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">Email Address</label>
                      <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="rahul@yourstartup.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-700/50 bg-slate-800/60 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"/>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">Service of Interest</label>
                      <select value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-700/50 bg-slate-800/80 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400">
                        <option value="">Select a service…</option>
                        {SERVICES.map(s => <option key={s.id} value={s.id} className="bg-slate-900 text-white">{s.label}</option>)}
                        <option value="package" className="bg-slate-900 text-white">Premium Package</option>
                        <option value="compliance" className="bg-slate-900 text-white">Compliance Hub</option>
                        <option value="other" className="bg-slate-900 text-white">General Inquiry</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">Brief Message</label>
                      <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                        placeholder="Tell us about your startup and what you need help with…" rows={4}
                        className="w-full px-4 py-3 rounded-xl border border-slate-700/50 bg-slate-800/60 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"/>
                    </div>
                    <button type="submit" disabled={loading}
                      className="w-full py-4 rounded-xl grad-em text-white font-black text-sm hover:opacity-90 shadow-lg flex items-center justify-center gap-2">
                      {loading && <Loader2 size={16} className="animate-spin" />}
                      📞 Schedule My Free Callback
                    </button>
                    <p className="text-center text-slate-500 text-xs mt-3">Your information is 100% confidential. We never share your data.</p>
                  </form>
                </div>
              ) : (
                <div className="bg-slate-900/60 rounded-3xl p-8 border border-slate-800/80 shadow-xl text-center">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={38} className="text-emerald-400"/>
                  </div>
                  <h2 className="text-2xl font-black text-white mb-3">Callback Scheduled! 🎉</h2>
                  <p className="text-slate-300 mb-2">Thank you, <strong>{form.name}</strong>! A consultant will call <strong>{form.phone}</strong> within 30 minutes.</p>
                  <p className="text-slate-400 text-sm mb-7 font-medium">In the meantime, explore our services and packages to get a head start.</p>
                  <button onClick={() => setSubmitted(false)}
                    className="px-6 py-3 rounded-xl border border-slate-700 text-slate-300 font-semibold text-sm hover:bg-slate-800">Submit Another Request</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <JoinSection />
    </div>
  );
}
