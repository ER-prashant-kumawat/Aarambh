import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import JoinSection from '../components/JoinSection';
import { SERVICES, SERVICE_TO_PACKAGE } from '../constants/data';
import { API_URL } from '../utils/api';
import { useToast } from '../context/ToastContext';
import { ChevronRight, Clock, Check, CheckCircle2, Shield } from 'lucide-react';

export default function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [contact, setContact] = useState({ name: '', phone: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const service = SERVICES.find((s) => s.id === id);
  const isFreeUtility = service?.fee === 'Free Utility';
  const serviceHighlights = service?.id === 'pvt-ltd' ? [
    'Incorporation documentation starts on Day 1',
    'Your business website is live within 5 days',
    'Your Pvt. Ltd. company is market-ready within 3 weeks',
  ] : service?.id === 'llp' ? [
    'Incorporation/Registration documentation starts on Day 1',
    'Your business website is live within 5 days',
    'Your LLP is market ready within 3 weeks',
  ] : service?.id === 'opc' ? [
    'Incorporation/Registration documentation starts on Day 1',
    'Your business website is live within 5 days',
    'Your OPC is market ready within 3 weeks',
  ] : [];
  if (!service) {
    return (
      <div className="pt-24 pb-16 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Service not found</h2>
        <Link to="/" className="text-emerald-500 hover:underline mt-4 inline-block">Back to Home</Link>
      </div>
    );
  }

  const handleFreeUtilitySubmit = async () => {
    const name = contact.name.trim();
    const phone = contact.phone.trim();
    const description = contact.description.trim();

    if (!name || !phone || !description) {
      showToast('Please add your name, phone number, and a short description.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(`${API_URL}/leads/callback`, {
        name,
        phone,
        service: service.label,
        message: description,
        type: 'tool-lead',
        source: 'free-utility-service-card',
      });

      showToast('Thanks. Our team will contact you shortly.', 'success');
      setContact({ name: '', phone: '', description: '' });
    } catch (err: any) {
      const msg = err.response?.data?.msg || 'Could not save your request right now.';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="grad-hero py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute top-20 right-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Link to="/" onClick={() => window.scrollTo(0, 0)}
              className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-400 text-sm mb-6 transition-colors">
              <ChevronRight size={14} className="rotate-180" />
              Back to Home
            </Link>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-5">
              <span className="text-emerald-400 text-xs font-semibold">Professional Service</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-white mb-4">{service.label}</h1>
            <p className="text-slate-300 text-lg mb-5 font-medium">{service.tagline}</p>
            {serviceHighlights.length > 0 && (
              <div className="mb-6 space-y-2 rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-4">
                {serviceHighlights.map((line) => (
                  <p key={line} className="text-sm sm:text-base font-semibold text-slate-200">{line}</p>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                <Clock size={15} className="text-emerald-400" />
                <span className="text-white text-sm font-semibold">{service.timeline}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-emerald-300 text-sm font-bold">{service.fee}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0a0f1d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-7 shadow-md">
                <h2 className="text-xl font-black text-white mb-4">Overview</h2>
                <p className="text-slate-400 leading-relaxed font-medium">{service.description}</p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-7 shadow-md">
                <h2 className="text-xl font-black text-white mb-5">Step-by-Step Process</h2>
                <div className="space-y-3">
                  {service.process.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full grad-em flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-black">{i + 1}</span>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed font-medium">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-7 shadow-md">
                <h2 className="text-xl font-black text-white mb-5">Required Documents</h2>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {service.docs.map((doc, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-400 text-sm font-medium">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              <div className="grad-card rounded-2xl p-6">
                <h3 className="text-white font-black text-lg mb-4">Key Benefits</h3>
                <div className="space-y-3">
                  {service.benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <Check size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300 text-sm font-medium">{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {isFreeUtility ? (
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-md">
                  <div className="mb-5">
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-400 mb-2">Quick Access</p>
                    <h3 className="text-2xl font-black text-white">{service.label}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-400">
                      Tell us what you need and we will reply with the right next step.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
                        Description
                      </label>
                      <textarea
                        value={contact.description}
                        onChange={(e) => setContact((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Write your requirement here..."
                        rows={4}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-cyan-400/60 resize-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
                        Name
                      </label>
                      <input
                        type="text"
                        value={contact.name}
                        onChange={(e) => setContact((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Your name"
                        className="w-full rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-cyan-400/60"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={contact.phone}
                        onChange={(e) => setContact((prev) => ({ ...prev, phone: e.target.value }))}
                        placeholder="WhatsApp number"
                        className="w-full rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-cyan-400/60"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleFreeUtilitySubmit}
                    disabled={isSubmitting || !contact.name.trim() || !contact.phone.trim() || !contact.description.trim()}
                    className="mt-5 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-3.5 text-sm font-black text-white shadow-lg transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : 'Get Started Now ->'}
                  </button>
                  <button
                    onClick={() => { navigate('/contact'); window.scrollTo(0, 0); }}
                    className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-800/40 py-3 text-sm font-semibold text-slate-300 transition-colors hover:bg-slate-800"
                  >
                    Schedule a Free Tech Consultation
                  </button>
                  <p className="mt-3 text-center text-xs font-semibold text-slate-500">Expert-supervised • Secure Architecture</p>
                </div>
              ) : (
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-md">
                  <div className="text-center mb-5">
                    <p className="text-slate-400 text-sm font-bold">Starting at</p>
                    <p className="text-3xl font-black text-white">{service.fee}</p>
                    <p className="text-emerald-400 text-xs font-bold mt-1">Zero hidden fees. Scalable architecture.</p>
                  </div>
                  <Link to={`/packages/${SERVICE_TO_PACKAGE[service.id] || 'tier-3-complete-incubator'}`}
                    onClick={() => window.scrollTo(0, 0)}
                    className="w-full py-3.5 rounded-xl grad-em text-white font-black text-sm hover:opacity-90 transition-opacity mb-3 shadow-lg text-center block">
                    Get Started Now →
                  </Link>
                  <button onClick={() => { navigate('/contact'); window.scrollTo(0, 0); }}
                    className="w-full py-3 rounded-xl border border-slate-700 bg-slate-800/40 text-slate-300 font-semibold text-sm hover:bg-slate-800 transition-colors">
                    Schedule a Free Tech Consultation
                  </button>
                  <p className="text-center text-slate-500 text-xs mt-3 font-semibold">✅ Expert-supervised • ✅  Secure Architecture</p>
                </div>
              )}

              <div className="bg-emerald-500/10 rounded-2xl p-5 border border-emerald-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={16} className="text-emerald-400" />
                  <span className="font-bold text-emerald-300 text-sm">YOUR PEACE OF MIND, OUR PROMISE</span>
                </div>
                <p className="text-emerald-400/90 text-xs leading-relaxed font-semibold">The Founder’s Peace of Mind
Transparent pricing, expert execution, and zero statutory shortcuts. We commit to delivering your corporate and digital architecture exactly as scoped, ensuring your business is protected from Day 1.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <JoinSection />
    </div>
  );
}



