import { useState } from 'react';
import axios from 'axios';
import { X, Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { API_URL } from '../utils/api';

export type BciYuvaMode = 'register' | 'investor' | 'partner';

const MODE_CONFIG: Record<BciYuvaMode, { title: string; type: string; messagePlaceholder: string }> = {
  register: {
    title: 'Register Your Startup',
    type: 'bci-yuva-register',
    messagePlaceholder: 'Tell us briefly about your startup (optional)'
  },
  investor: {
    title: 'Become an Investor',
    type: 'bci-yuva-investor',
    messagePlaceholder: 'Your investment focus / ticket size (optional)'
  },
  partner: {
    title: 'Partner With Us',
    type: 'bci-yuva-partner',
    messagePlaceholder: 'How would you like to partner? (optional)'
  }
};

interface BciYuvaModalProps {
  mode: BciYuvaMode;
  onClose: () => void;
}

export default function BciYuvaModal({ mode, onClose }: BciYuvaModalProps) {
  const { showToast } = useToast();
  const cfg = MODE_CONFIG[mode];
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      showToast('Name and phone number are required.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/leads/callback`, {
        name,
        phone,
        email,
        message,
        service: 'BCI Yuva - Investor Connect',
        type: cfg.type,
        source: 'bci-yuva-banner'
      });
      setSuccess(true);
      showToast('Submitted! Our team will reach out shortly.', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.msg || 'Failed to submit. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-md rounded-2xl border border-emerald-500/25 bg-slate-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors cursor-pointer">
          <X size={18} />
        </button>

        {success ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 border border-emerald-500/25">
              <CheckCircle2 size={30} className="text-emerald-400" />
            </div>
            <h3 className="text-white font-black text-lg mb-2">Thank You!</h3>
            <p className="text-slate-400 text-sm">Our BCI Yuva team will contact you soon.</p>
          </div>
        ) : (
          <>
            <h3 className="text-white font-black text-lg mb-1">{cfg.title}</h3>
            <p className="text-slate-400 text-xs mb-5">BCI Yuva – Investor Connect</p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">Full Name *</label>
                <input value={name} onChange={(e) => setName(e.target.value)} disabled={isSubmitting} placeholder="Your name"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 bg-slate-955/40 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/15 focus:border-emerald-500/50" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">Mobile Number *</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} disabled={isSubmitting} placeholder="10 digit number"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 bg-slate-955/40 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/15 focus:border-emerald-500/50" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isSubmitting} placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 bg-slate-955/40 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/15 focus:border-emerald-500/50" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">Message</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} disabled={isSubmitting} rows={2} placeholder={cfg.messagePlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-800 bg-slate-955/40 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/15 focus:border-emerald-500/50 resize-none" />
              </div>
              <button type="submit" disabled={isSubmitting}
                className={`w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-extrabold text-sm shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer ${isSubmitting ? 'opacity-85 pointer-events-none' : ''}`}>
                {isSubmitting ? (<><Loader2 size={15} className="animate-spin" /><span>Submitting...</span></>) : (<span>Submit</span>)}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
