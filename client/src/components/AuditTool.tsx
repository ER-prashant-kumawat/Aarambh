import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Loader2, Lock, RotateCcw, ShieldAlert, Sparkles } from 'lucide-react';
import { API_URL } from '../utils/api';

type AnswerKey = 'q1' | 'q2' | 'q3';
type Answers = Record<AnswerKey, string>;

interface Recommendation {
  tier: string;
  price: string;
  title: string;
  pitch: string;
  link: string;
  risk: string;
}

const questions: Array<{
  key: AnswerKey;
  label: string;
  text: string;
  options: string[];
}> = [
  {
    key: 'q1',
    label: 'Corporate Structure',
    text: 'Do you currently have a registered corporate entity (Pvt Ltd / LLP) for your startup?',
    options: ['Yes', 'No, we are unregistered'],
  },
  {
    key: 'q2',
    label: 'Digital Security & DPDP',
    text: 'Is your current website or app fully compliant with the new DPDP Data Privacy laws?',
    options: ['Yes', 'No', 'I have no idea'],
  },
  {
    key: 'q3',
    label: 'Equity Protection',
    text: 'Do you and your co-founders have a formal, legally binding agreement with equity vesting schedules?',
    options: ['Yes', "No, it's just a handshake/verbal", "I'm a solo founder"],
  },
];

const getRecommendation = (answers: Answers): Recommendation => {
  if (answers.q1 === 'No, we are unregistered' && answers.q3 === "I'm a solo founder") {
    return {
      tier: 'Tier 1',
      price: 'Rs. 9,500',
      title: 'The Digital Foundation',
      pitch: 'Secure your digital assets and transition smoothly into a One Person Company (OPC) or Sole Proprietorship when ready.',
      link: '/packages/tier-1-digital-foundation',
      risk: 'Solo bootstrapper baseline risk',
    };
  }

  if (answers.q1 === 'No, we are unregistered') {
    return {
      tier: 'Tier 3',
      price: 'Rs. 24,500',
      title: 'The Complete Tech-Legal Incubator',
      pitch: 'You need the full incorporation, website, and multi-founder legal baseline.',
      link: '/packages/tier-3-complete-incubator',
      risk: 'Raw startup structural risk',
    };
  }

  if (answers.q1 === 'Yes' && answers.q3 === "No, it's just a handshake/verbal") {
    return {
      tier: 'Tier 2',
      price: 'Rs. 14,000',
      title: 'The Co-Founder Shield',
      pitch: "Your biggest risk right now is losing your company to a co-founder dispute. Lock in your Founders' Agreement and NDA suite immediately.",
      link: '/packages/tier-2-cofounder-shield',
      risk: 'Vulnerable partnership risk',
    };
  }

  return {
    tier: 'Tier 1',
    price: 'Rs. 9,500',
    title: 'The Digital Foundation',
    pitch: 'Your corporate structure is sound, but your digital footprint is exposed. Deploy a secure web presence and DPDP-compliant privacy policies.',
    link: '/packages/tier-1-digital-foundation',
    risk: 'Digital privacy and security risk',
  };
};

const initialAnswers: Answers = { q1: '', q2: '', q3: '' };

const getAppBaseUrl = () => {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.location.origin;
};

const buildWhatsAppMessage = (name: string, recommendation: Recommendation) => {
  const baseUrl = getAppBaseUrl();
  return `Hey ${name}, thanks for taking the Aarambhh Audit. Your platform flagged a compliance risk based on your answers. Let's schedule a quick 5-minute chat to map out your infrastructure. Here is a custom breakdown of the Tier we recommended for you: ${baseUrl}${recommendation.link}`;
};

const buildResultLink = (recommendation: Recommendation) => `${getAppBaseUrl()}${recommendation.link}`;

export default function AuditTool() {
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [step, setStep] = useState(0);
  const [lead, setLead] = useState({ name: '', phone: '' });
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const progress = recommendation ? 100 : showLeadCapture ? 88 : Math.round(((step + 1) / questions.length) * 78);
  const activeQuestion = questions[step];

  const selectAnswer = (value: string) => {
    const nextAnswers = { ...answers, [activeQuestion.key]: value };
    setAnswers(nextAnswers);

    if (step === questions.length - 1) {
      setShowLeadCapture(true);
      return;
    }

    setStep((current) => current + 1);
  };

  const saveAuditLead = (snapshot: Answers, rec: Recommendation, leadData: { name: string; phone: string }) => {
    const payload = {
      name: leadData.name,
      phone: leadData.phone,
      answers: snapshot,
      recommendation: rec,
      whatsappMessage: buildWhatsAppMessage(leadData.name, rec),
      resultLink: buildResultLink(rec),
      source: 'homepage-audit-tool',
    };

    const body = JSON.stringify(payload);
    const url = `${API_URL}/leads/audit`;

    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      const queued = navigator.sendBeacon(url, blob);
      if (queued) {
        return Promise.resolve();
      }
    }

    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).then(() => undefined);
  };

  const revealResults = () => {
    const leadSnapshot = { name: lead.name.trim(), phone: lead.phone.trim() };
    const answerSnapshot = { ...answers };
    const rec = getRecommendation(answerSnapshot);

    setRecommendation(rec);
    setShowLeadCapture(false);
    setSaveError('');

    if (!leadSnapshot.name || !leadSnapshot.phone) {
      return;
    }

    setIsSaving(true);
    saveAuditLead(answerSnapshot, rec, leadSnapshot)
      .catch((err) => {
        console.error('Audit lead save failed:', err);
        setSaveError('We could not save your contact right now, but your results are still ready.');
      })
      .finally(() => setIsSaving(false));
  };

  const skipResults = () => {
    setRecommendation(getRecommendation(answers));
    setShowLeadCapture(false);
  };

  const reset = () => {
    setAnswers(initialAnswers);
    setStep(0);
    setLead({ name: '', phone: '' });
    setShowLeadCapture(false);
    setRecommendation(null);
    setIsSaving(false);
    setSaveError('');
  };

  return (
    <section id="audit-tool" className="py-20 bg-[#0f172a] scroll-mt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-300">
              <ShieldAlert size={13} /> Audit Tool
            </span>
            <h2 className="mt-4 text-3xl lg:text-4xl font-black text-white">Compare Your Current Setup</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Answer three quick questions to find the tech-legal tier that matches your current risk profile.
            </p>
          </div>
          {recommendation && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-xs font-bold text-slate-300 hover:border-cyan-400/50 hover:text-white transition-colors"
            >
              <RotateCcw size={14} /> Run Again
            </button>
          )}
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 sm:p-7 shadow-2xl">
          <div className="mb-7">
            <div className="mb-2 flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-slate-400">
              <span>{recommendation ? 'Results Ready' : showLeadCapture ? 'Unlock Score' : `Question ${step + 1} of 3`}</span>
              <span className="text-cyan-300">{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-300 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {questions.map((question, index) => {
                const isActive = index === step && !showLeadCapture && !recommendation;
                const isComplete = answers[question.key] !== '';

                return (
                  <div
                    key={question.key}
                    className={`rounded-2xl border px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                      isActive
                        ? 'border-cyan-400/50 bg-cyan-500/10 text-cyan-200'
                        : isComplete
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                          : 'border-slate-800 bg-slate-950/40 text-slate-500'
                    }`}
                  >
                    {index + 1}. {question.label}
                  </div>
                );
              })}
            </div>
          </div>

          {!showLeadCapture && !recommendation && (
            <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
                <p className="text-xs font-black uppercase tracking-wider text-cyan-300">{activeQuestion.label}</p>
                <div className="mt-5 space-y-3">
                  {questions.map((q, index) => (
                    <div
                      key={q.key}
                      className={`flex items-center gap-3 text-xs ${index <= step ? 'text-slate-200' : 'text-slate-600'}`}
                    >
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                          answers[q.key]
                            ? 'border-emerald-400 bg-emerald-500/15 text-emerald-300'
                            : index === step
                              ? 'border-cyan-400 text-cyan-300'
                              : 'border-slate-700'
                        }`}
                      >
                        {answers[q.key] ? <CheckCircle size={13} /> : index + 1}
                      </div>
                      <span className="font-semibold">{q.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black leading-tight text-white">{activeQuestion.text}</h3>
                <div className="mt-6 grid gap-3">
                  {activeQuestion.options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => selectAnswer(option)}
                      className="group flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/30 px-5 py-4 text-left text-sm font-bold text-slate-200 transition-all hover:border-cyan-400/50 hover:bg-cyan-500/10"
                    >
                      {option}
                      <ArrowRight size={16} className="text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-cyan-300" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {showLeadCapture && !recommendation && (
            <div className="mx-auto max-w-xl text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                <Lock size={24} />
              </div>
              <h3 className="text-3xl font-black text-white">Your Tech-Legal Risk Profile is Ready.</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Enter your details below to instantly unlock your score and receive a complimentary 5-point vulnerability breakdown of your platform via WhatsApp.
              </p>

              <div className="mt-7 grid gap-3 text-left">
                <input
                  type="text"
                  value={lead.name}
                  onChange={(e) => setLead((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Name"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-cyan-400/60"
                />
                <input
                  type="tel"
                  value={lead.phone}
                  onChange={(e) => setLead((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="WhatsApp Number"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-cyan-400/60"
                />
              </div>

              <button
                type="button"
                onClick={revealResults}
                disabled={!lead.name.trim() || !lead.phone.trim()}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-5 py-3 text-sm font-black text-white shadow-lg transition-all hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-45"
              >
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : null}
                Reveal My Results <ArrowRight size={16} />
              </button>
              <button type="button" onClick={skipResults} className="mt-3 text-xs font-semibold text-slate-500 hover:text-cyan-300 transition-colors">
                Skip and view basic results
              </button>
              <p className="mt-4 text-[11px] leading-relaxed text-slate-500">
                We save your details as soon as you reveal results so the WhatsApp follow-up can be prepared even if you close the tab right after clicking.
              </p>
            </div>
          )}

          {recommendation && (
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
              <div className="rounded-2xl border border-cyan-500/25 bg-cyan-500/10 p-6">
                <p className="text-xs font-black uppercase tracking-wider text-cyan-300">Recommended Tier</p>
                <h3 className="mt-3 text-3xl font-black text-white">{recommendation.tier}</h3>
                <p className="mt-1 text-xl font-black text-amber-300">{recommendation.title}</p>
                <p className="mt-1 text-sm font-bold text-cyan-200">{recommendation.price}</p>
                <p className="mt-5 text-sm leading-relaxed text-slate-300">{recommendation.pitch}</p>
                <Link
                  to={recommendation.link}
                  onClick={() => window.scrollTo(0, 0)}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-black text-slate-950 transition-transform hover:scale-[1.01]"
                >
                  Open Recommended Tier <ArrowRight size={16} />
                </Link>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/35 p-6">
                <div className="flex items-center gap-2 text-emerald-300">
                  <Sparkles size={18} />
                  <p className="text-sm font-black uppercase tracking-wider">5-point breakdown queued</p>
                </div>
                <div className="mt-5 grid gap-3 text-sm text-slate-300">
                  <p><span className="font-bold text-white">Risk flag:</span> {recommendation.risk}</p>
                  <p><span className="font-bold text-white">Corporate structure:</span> {answers.q1}</p>
                  <p><span className="font-bold text-white">DPDP posture:</span> {answers.q2}</p>
                  <p><span className="font-bold text-white">Equity protection:</span> {answers.q3}</p>
                </div>
                <p className="mt-5 rounded-xl border border-slate-800 bg-slate-900/70 p-4 text-xs leading-relaxed text-slate-400">
                  WhatsApp template prepared for this lead. Connect your WhatsApp Business provider to send it automatically from the saved audit lead.
                </p>
                {saveError && <p className="mt-3 text-xs font-semibold text-amber-300">{saveError}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
