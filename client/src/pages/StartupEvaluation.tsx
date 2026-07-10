import React, { useRef, useState } from 'react';
import axios from 'axios';
import { ClipboardCheck, Loader2, CheckCircle2, AlertCircle, Upload, ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { API_URL } from '../utils/api';

interface FormState {
  founderName: string;
  email: string;
  mobileNumber: string;
  linkedinProfile: string;
  cityCountry: string;
  startupName: string;
  website: string;
  industrySector: string;
  stage: string;
  fullTime: string;
  numberOfFounders: string;
  founderBackground: string;

  oneLineDescription: string;
  problemSolved: string;
  targetCustomer: string;
  howItWorks: string;
  differentiation: string;

  targetMarket: string;
  estimatedMarketSize: string;
  mainCompetitors: string;
  whyCustomersChooseYou: string;

  productStage: string;
  productDemoLink: string;

  numberOfUsers: string;
  payingCustomers: string;
  monthlyRevenue: string;
  monthlyGrowthPercent: string;
  pilotCustomers: string;
  partnerships: string;

  howYouMakeMoney: string;
  pricingModel: string;
  expectedRevenue12Months: string;

  raisedFundingBefore: string;
  amountRaised: string;
  expectedFundingCurrentStage: string;
  plannedUseOfFunds: string[];

  legalCompliance: string[];

  whyBuildingThis: string;
  fiveYearVision: string;
  whyInvestInYou: string;

  demoVideoLink: string;
  founderVideoLink: string;
}

interface FileState {
  pitchDeck: File | null;
  screenshots: File[];
  incorporationCert: File | null;
  trademarkCert: File | null;
  gstCert: File | null;
  onePager: File | null;
  financialProjection: File | null;
  founderResume: File | null;
}

const initialForm: FormState = {
  founderName: '', email: '', mobileNumber: '', linkedinProfile: '', cityCountry: '',
  startupName: '', website: '', industrySector: '', stage: '', fullTime: '', numberOfFounders: '', founderBackground: '',
  oneLineDescription: '', problemSolved: '', targetCustomer: '', howItWorks: '', differentiation: '',
  targetMarket: '', estimatedMarketSize: '', mainCompetitors: '', whyCustomersChooseYou: '',
  productStage: '', productDemoLink: '',
  numberOfUsers: '', payingCustomers: '', monthlyRevenue: '', monthlyGrowthPercent: '', pilotCustomers: '', partnerships: '',
  howYouMakeMoney: '', pricingModel: '', expectedRevenue12Months: '',
  raisedFundingBefore: '', amountRaised: '', expectedFundingCurrentStage: '', plannedUseOfFunds: [],
  legalCompliance: [],
  whyBuildingThis: '', fiveYearVision: '', whyInvestInYou: '',
  demoVideoLink: '', founderVideoLink: ''
};

const initialFiles: FileState = {
  pitchDeck: null, screenshots: [], incorporationCert: null, trademarkCert: null, gstCert: null,
  onePager: null, financialProjection: null, founderResume: null
};

const SECTIONS = [
  { title: 'Founder Details', points: 15 },
  { title: 'Startup Overview', points: 20 },
  { title: 'Market Opportunity', points: 10 },
  { title: 'Product Status', points: 15 },
  { title: 'Customers & Traction', points: 15 },
  { title: 'Business Model', points: 10 },
  { title: 'Funding', points: 10 },
  { title: 'Legal & Compliance', points: 5 },
  { title: 'Vision', points: 10 },
  { title: 'Documents', points: 0 }
];

const inputCls = (hasError?: boolean) =>
  `w-full px-3.5 py-2.5 rounded-lg border bg-slate-955/40 text-white text-sm focus:outline-none focus:ring-2 transition-all duration-300 placeholder-slate-600 ${
    hasError ? 'border-red-500/50 focus:ring-red-500/25' : 'border-slate-800 focus:border-emerald-500/50 focus:ring-emerald-500/15'
  }`;

const labelCls = 'block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5';

function Field({ id, label, required, error, children }: { id: string; label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div id={id}>
      <label className={labelCls}>{label} {required && <span className="text-emerald-400">*</span>}</label>
      {children}
      {error && <p className="text-red-400 text-[10px] font-bold mt-1">{error}</p>}
    </div>
  );
}

function ChoiceGroup({ options, value, onChange, columns = 2 }: { options: string[]; value: string; onChange: (v: string) => void; columns?: number }) {
  return (
    <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))` }}>
      {options.map((opt) => {
        const selected = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(selected ? '' : opt)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg border text-left transition-all duration-200 cursor-pointer ${
              selected ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-slate-950/20 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center flex-shrink-0 ${selected ? 'border-emerald-400 bg-emerald-500/20' : 'border-slate-600'}`}>
              {selected && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
            </div>
            <span className="text-xs font-semibold">{opt}</span>
          </button>
        );
      })}
    </div>
  );
}

function MultiChoiceGroup({ options, values, onToggle, columns = 2 }: { options: string[]; values: string[]; onToggle: (v: string) => void; columns?: number }) {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))` }}>
      {options.map((opt) => {
        const selected = values.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg border text-left transition-all duration-200 cursor-pointer ${
              selected ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-slate-950/20 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 ${selected ? 'border-emerald-400 bg-emerald-500/20' : 'border-slate-600'}`}>
              {selected && <div className="w-1.5 h-1.5 rounded-sm bg-emerald-400" />}
            </div>
            <span className="text-xs font-semibold">{opt}</span>
          </button>
        );
      })}
    </div>
  );
}

function FileInput({ label, file, onChange, accept, multiple }: { label: string; file: File | File[] | null; onChange: (f: FileList | null) => void; accept?: string; multiple?: boolean }) {
  const files = Array.isArray(file) ? file : (file ? [file] : []);
  return (
    <div>
      <label className={labelCls}>{label} <span className="text-slate-500 font-medium normal-case italic">(optional)</span></label>
      <label className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg border border-dashed border-slate-700 bg-slate-950/20 text-slate-400 text-xs font-semibold cursor-pointer hover:border-emerald-500/40 hover:text-emerald-300 transition-colors">
        <Upload size={14} />
        <span>{files.length > 0 ? `${files.length} file(s) selected` : 'Click to upload'}</span>
        <input type="file" accept={accept} multiple={multiple} className="hidden" onChange={(e) => onChange(e.target.files)} />
      </label>
      {files.length > 0 && (
        <div className="mt-1 space-y-1">
          {files.map((f, i) => (
            <div key={i} className="flex items-center justify-between text-[10px] text-slate-500 bg-slate-900/50 rounded-md px-2 py-1">
              <span className="truncate">{f.name} ({(f.size / 1024).toFixed(0)} KB)</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function StartupEvaluation() {
  const { showToast } = useToast();
  const [form, setForm] = useState<FormState>(initialForm);
  const [files, setFiles] = useState<FileState>(initialFiles);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [step, setStep] = useState(0);
  const topRef = useRef<HTMLDivElement>(null);

  const lastStep = SECTIONS.length - 1;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const setChoice = (field: keyof FormState) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const toggleMulti = (field: 'plannedUseOfFunds' | 'legalCompliance') => (value: string) => {
    setForm((prev) => {
      const current = prev[field];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      return { ...prev, [field]: next };
    });
  };

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Validates only the fields belonging to a given step; returns the errors found.
  const validateStep = (s: number): Record<string, string> => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!form.founderName.trim()) e.founderName = 'Founder name is required';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!form.email.trim()) e.email = 'Email is required';
      else if (!emailRegex.test(form.email)) e.email = 'Enter a valid email';
      const phoneRegex = /^[+]?[0-9\s\-()]{10,18}$/;
      if (!form.mobileNumber.trim()) e.mobileNumber = 'Mobile number is required';
      else if (!phoneRegex.test(form.mobileNumber.replace(/\s+/g, ''))) e.mobileNumber = 'Enter a valid mobile number';
      if (!form.startupName.trim()) e.startupName = 'Startup name is required';
    }
    if (s === 1) {
      if (!form.oneLineDescription.trim()) e.oneLineDescription = 'One-line description is required';
      if (!form.problemSolved.trim()) e.problemSolved = 'Please describe the problem you are solving';
      if (!form.targetCustomer.trim()) e.targetCustomer = 'Please describe your target customer';
    }
    return e;
  };

  const validateAll = (): Record<string, string> => ({
    ...validateStep(0),
    ...validateStep(1)
  });

  const goNext = () => {
    const stepErrors = validateStep(step);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      showToast('Please complete the required fields before continuing.', 'error');
      const firstError = Object.keys(stepErrors)[0];
      if (firstError) document.getElementById(firstError)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, lastStep));
    scrollToTop();
  };

  const goBack = () => {
    setStep((s) => Math.max(s - 1, 0));
    scrollToTop();
  };

  const resetForm = () => {
    setForm(initialForm);
    setFiles(initialFiles);
    setErrors({});
    setStep(0);
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const allErrors = validateAll();
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      showToast('Please complete the required fields before submitting.', 'error');
      const firstError = Object.keys(allErrors)[0];
      const firstErrorStep = validateStep(0)[firstError] !== undefined ? 0 : 1;
      setStep(firstErrorStep);
      setTimeout(() => document.getElementById(firstError)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (Array.isArray(value)) fd.append(key, JSON.stringify(value));
        else fd.append(key, value);
      });
      if (files.pitchDeck) fd.append('pitchDeck', files.pitchDeck);
      files.screenshots.forEach((f) => fd.append('screenshots', f));
      if (files.incorporationCert) fd.append('incorporationCert', files.incorporationCert);
      if (files.trademarkCert) fd.append('trademarkCert', files.trademarkCert);
      if (files.gstCert) fd.append('gstCert', files.gstCert);
      if (files.onePager) fd.append('onePager', files.onePager);
      if (files.financialProjection) fd.append('financialProjection', files.financialProjection);
      if (files.founderResume) fd.append('founderResume', files.founderResume);

      await axios.post(`${API_URL}/evaluations`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });

      setSubmitStatus('success');
      showToast('Evaluation submitted successfully!', 'success');
      resetForm();
    } catch (err: any) {
      console.error('Startup evaluation submission error:', err);
      setSubmitStatus('error');
      const msg = err.response?.data?.msg || err.message || 'Failed to submit your evaluation. Please try again.';
      setErrorMessage(msg);
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-[#0a0f1d]">
      <div className="w-full max-w-3xl mx-auto px-4" ref={topRef}>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000" />

          <div className="relative glass rounded-2xl p-4 sm:p-6 shadow-2xl overflow-hidden bg-slate-900/80 border border-slate-800/80">
            {submitStatus === 'success' ? (
              <div className="text-center py-8 px-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 border border-emerald-500/25">
                  <CheckCircle2 size={36} className="text-emerald-400" />
                </div>
                <h2 className="text-2xl font-extrabold text-white mb-2 tracking-tight">Evaluation Submitted</h2>
                <p className="text-emerald-400 text-xs font-bold tracking-wider uppercase mb-4">Our investment team will review your startup</p>
                <p className="text-slate-400 text-xs leading-relaxed mb-6 max-w-md mx-auto">
                  Thank you for sharing your details. Our team will evaluate your submission and reach out with feedback and next steps.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitStatus('idle')}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-extrabold text-xs shadow-lg hover:opacity-95 transition-all duration-300 transform active:scale-95 cursor-pointer"
                >
                  Submit Another Evaluation
                </button>
              </div>
            ) : (
              <>
                <div className="mb-3 border-b border-slate-800/60 pb-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <ClipboardCheck size={14} className="text-emerald-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400">Investment Readiness</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">Basic Startup Evaluation Form</h2>

                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Step {step + 1} of {SECTIONS.length} — {SECTIONS[step].title}
                      </span>
                      <span className="text-[10px] font-black text-emerald-400">
                        {Math.round(((step + 1) / SECTIONS.length) * 100)}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-500"
                        style={{ width: `${((step + 1) / SECTIONS.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {submitStatus === 'error' && (
                  <div className="mb-3 p-3 bg-red-500/10 border border-red-500/25 text-red-400 text-xs rounded-xl flex items-start gap-2.5">
                    <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-red-400" />
                    <div>
                      <span className="font-bold block text-xs">Submission Error</span>
                      <span className="text-[11px] leading-relaxed">{errorMessage}</span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="h-[64vh] min-h-[420px] max-h-[560px] overflow-y-auto pr-1 -mr-1">
                  {/* Section 1: Founder Details */}
                  {step === 0 && (
                    <div className="space-y-2.5">
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        <Field id="founderName" label="Founder Name" required error={errors.founderName}>
                          <input name="founderName" value={form.founderName} onChange={handleChange} disabled={isSubmitting} placeholder="Your full name" className={inputCls(!!errors.founderName)} />
                        </Field>
                        <Field id="email" label="Email" required error={errors.email}>
                          <input type="email" name="email" value={form.email} onChange={handleChange} disabled={isSubmitting} placeholder="you@startup.com" className={inputCls(!!errors.email)} />
                        </Field>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        <Field id="mobileNumber" label="Mobile Number" required error={errors.mobileNumber}>
                          <input type="tel" name="mobileNumber" value={form.mobileNumber} onChange={handleChange} disabled={isSubmitting} placeholder="10 digit number" className={inputCls(!!errors.mobileNumber)} />
                        </Field>
                        <Field id="linkedinProfile" label="LinkedIn Profile">
                          <input name="linkedinProfile" value={form.linkedinProfile} onChange={handleChange} disabled={isSubmitting} placeholder="linkedin.com/in/you" className={inputCls()} />
                        </Field>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        <Field id="cityCountry" label="City & Country">
                          <input name="cityCountry" value={form.cityCountry} onChange={handleChange} disabled={isSubmitting} placeholder="Bengaluru, India" className={inputCls()} />
                        </Field>
                        <Field id="startupName" label="Startup Name" required error={errors.startupName}>
                          <input name="startupName" value={form.startupName} onChange={handleChange} disabled={isSubmitting} placeholder="Your startup's name" className={inputCls(!!errors.startupName)} />
                        </Field>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        <Field id="website" label="Website">
                          <input name="website" value={form.website} onChange={handleChange} disabled={isSubmitting} placeholder="yourstartup.com" className={inputCls()} />
                        </Field>
                        <Field id="industrySector" label="Industry / Sector">
                          <input name="industrySector" value={form.industrySector} onChange={handleChange} disabled={isSubmitting} placeholder="Fintech, SaaS, D2C..." className={inputCls()} />
                        </Field>
                      </div>
                      <Field id="stage" label="Stage">
                        <ChoiceGroup options={['Idea', 'Prototype', 'MVP', 'Early Revenue']} value={form.stage} onChange={setChoice('stage')} columns={4} />
                      </Field>
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        <Field id="fullTime" label="Working full-time on this startup?">
                          <ChoiceGroup options={['Yes', 'No']} value={form.fullTime} onChange={setChoice('fullTime')} columns={2} />
                        </Field>
                        <Field id="numberOfFounders" label="Number of Founders">
                          <input type="number" min="1" name="numberOfFounders" value={form.numberOfFounders} onChange={handleChange} disabled={isSubmitting} placeholder="e.g. 2" className={inputCls()} />
                        </Field>
                      </div>
                      <Field id="founderBackground" label="Briefly describe your background">
                        <textarea name="founderBackground" value={form.founderBackground} onChange={handleChange} disabled={isSubmitting} rows={2} maxLength={2000} placeholder="Relevant experience, past ventures, education... (max 300 words)" className={`${inputCls()} resize-none`} />
                      </Field>
                    </div>
                  )}

                  {/* Section 2: Startup Overview */}
                  {step === 1 && (
                    <div className="space-y-2.5">
                      <Field id="oneLineDescription" label="One-line startup description" required error={errors.oneLineDescription}>
                        <input name="oneLineDescription" value={form.oneLineDescription} onChange={handleChange} disabled={isSubmitting} placeholder="What you do, in one sentence" className={inputCls(!!errors.oneLineDescription)} />
                      </Field>
                      <Field id="problemSolved" label="What problem are you solving?" required error={errors.problemSolved}>
                        <textarea name="problemSolved" value={form.problemSolved} onChange={handleChange} disabled={isSubmitting} rows={2} className={`${inputCls(!!errors.problemSolved)} resize-none`} />
                      </Field>
                      <Field id="targetCustomer" label="Who is your target customer?" required error={errors.targetCustomer}>
                        <textarea name="targetCustomer" value={form.targetCustomer} onChange={handleChange} disabled={isSubmitting} rows={2} className={`${inputCls(!!errors.targetCustomer)} resize-none`} />
                      </Field>
                      <Field id="howItWorks" label="How does your solution work?">
                        <textarea name="howItWorks" value={form.howItWorks} onChange={handleChange} disabled={isSubmitting} rows={2} className={`${inputCls()} resize-none`} />
                      </Field>
                      <Field id="differentiation" label="What makes your solution different?">
                        <textarea name="differentiation" value={form.differentiation} onChange={handleChange} disabled={isSubmitting} rows={2} className={`${inputCls()} resize-none`} />
                      </Field>
                    </div>
                  )}

                  {/* Section 3: Market Opportunity */}
                  {step === 2 && (
                    <div className="space-y-2.5">
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        <Field id="targetMarket" label="Target Market">
                          <input name="targetMarket" value={form.targetMarket} onChange={handleChange} disabled={isSubmitting} placeholder="e.g. Indian D2C brands" className={inputCls()} />
                        </Field>
                        <Field id="estimatedMarketSize" label="Estimated Market Size">
                          <input name="estimatedMarketSize" value={form.estimatedMarketSize} onChange={handleChange} disabled={isSubmitting} placeholder="e.g. $2B TAM" className={inputCls()} />
                        </Field>
                      </div>
                      <Field id="mainCompetitors" label="Main Competitors">
                        <input name="mainCompetitors" value={form.mainCompetitors} onChange={handleChange} disabled={isSubmitting} placeholder="List key competitors" className={inputCls()} />
                      </Field>
                      <Field id="whyCustomersChooseYou" label="Why will customers choose you?">
                        <textarea name="whyCustomersChooseYou" value={form.whyCustomersChooseYou} onChange={handleChange} disabled={isSubmitting} rows={2} className={`${inputCls()} resize-none`} />
                      </Field>
                    </div>
                  )}

                  {/* Section 4: Product Status */}
                  {step === 3 && (
                    <div className="space-y-2.5">
                      <Field id="productStage" label="Current Stage">
                        <ChoiceGroup options={['Idea', 'Prototype', 'MVP', 'Live Product']} value={form.productStage} onChange={setChoice('productStage')} columns={4} />
                      </Field>
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        <FileInput label="Pitch Deck (PDF)" file={files.pitchDeck} accept=".pdf" onChange={(fl) => setFiles((p) => ({ ...p, pitchDeck: fl?.[0] || null }))} />
                        <Field id="productDemoLink" label="Product Demo Link">
                          <input name="productDemoLink" value={form.productDemoLink} onChange={handleChange} disabled={isSubmitting} placeholder="Link to demo video (optional)" className={inputCls()} />
                        </Field>
                      </div>
                      <FileInput label="Screenshots" file={files.screenshots} accept="image/*" multiple onChange={(fl) => setFiles((p) => ({ ...p, screenshots: fl ? Array.from(fl) : [] }))} />
                    </div>
                  )}

                  {/* Section 5: Customers & Traction */}
                  {step === 4 && (
                    <div className="space-y-2.5">
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        <Field id="numberOfUsers" label="Number of Users">
                          <input name="numberOfUsers" value={form.numberOfUsers} onChange={handleChange} disabled={isSubmitting} placeholder="e.g. 1,200" className={inputCls()} />
                        </Field>
                        <Field id="payingCustomers" label="Paying Customers">
                          <input name="payingCustomers" value={form.payingCustomers} onChange={handleChange} disabled={isSubmitting} placeholder="e.g. 40" className={inputCls()} />
                        </Field>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        <Field id="monthlyRevenue" label="Monthly Revenue (₹)">
                          <input name="monthlyRevenue" value={form.monthlyRevenue} onChange={handleChange} disabled={isSubmitting} placeholder="e.g. 50,000" className={inputCls()} />
                        </Field>
                        <Field id="monthlyGrowthPercent" label="Monthly Growth (%)">
                          <input name="monthlyGrowthPercent" value={form.monthlyGrowthPercent} onChange={handleChange} disabled={isSubmitting} placeholder="e.g. 15" className={inputCls()} />
                        </Field>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        <Field id="pilotCustomers" label="Pilot Customers">
                          <ChoiceGroup options={['Yes', 'No']} value={form.pilotCustomers} onChange={setChoice('pilotCustomers')} columns={2} />
                        </Field>
                        <Field id="partnerships" label="Any Partnerships?">
                          <input name="partnerships" value={form.partnerships} onChange={handleChange} disabled={isSubmitting} placeholder="Optional" className={inputCls()} />
                        </Field>
                      </div>
                    </div>
                  )}

                  {/* Section 6: Business Model */}
                  {step === 5 && (
                    <div className="space-y-2.5">
                      <Field id="howYouMakeMoney" label="How will you make money?">
                        <textarea name="howYouMakeMoney" value={form.howYouMakeMoney} onChange={handleChange} disabled={isSubmitting} rows={2} className={`${inputCls()} resize-none`} />
                      </Field>
                      <Field id="pricingModel" label="Pricing Model">
                        <ChoiceGroup options={['Subscription', 'Commission', 'One-time Sale', 'Marketplace', 'Freemium', 'Other']} value={form.pricingModel} onChange={setChoice('pricingModel')} columns={3} />
                      </Field>
                      <Field id="expectedRevenue12Months" label="Expected revenue in the next 12 months">
                        <input name="expectedRevenue12Months" value={form.expectedRevenue12Months} onChange={handleChange} disabled={isSubmitting} placeholder="e.g. ₹25,00,000" className={inputCls()} />
                      </Field>
                    </div>
                  )}

                  {/* Section 7: Funding */}
                  {step === 6 && (
                    <div className="space-y-2.5">
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        <Field id="raisedFundingBefore" label="Have you raised funding before?">
                          <ChoiceGroup options={['Yes', 'No']} value={form.raisedFundingBefore} onChange={setChoice('raisedFundingBefore')} columns={2} />
                        </Field>
                        <Field id="amountRaised" label="Amount Raised">
                          <input name="amountRaised" value={form.amountRaised} onChange={handleChange} disabled={isSubmitting} placeholder="If applicable" className={inputCls()} />
                        </Field>
                      </div>
                      <Field id="expectedFundingCurrentStage" label="Expected Funding at Current Stage">
                        <input name="expectedFundingCurrentStage" value={form.expectedFundingCurrentStage} onChange={handleChange} disabled={isSubmitting} placeholder="e.g. ₹50,00,000" className={inputCls()} />
                      </Field>
                      <Field id="plannedUseOfFunds" label="Planned Use of Funds">
                        <MultiChoiceGroup options={['Product Development', 'Marketing', 'Hiring', 'Operations', 'Technology', 'Working Capital']} values={form.plannedUseOfFunds} onToggle={toggleMulti('plannedUseOfFunds')} columns={3} />
                      </Field>
                    </div>
                  )}

                  {/* Section 8: Legal & Compliance */}
                  {step === 7 && (
                    <div className="space-y-2.5">
                      <Field id="legalCompliance" label="Select all that apply">
                        <MultiChoiceGroup options={['Company Incorporated', 'Startup India Registered', 'DPIIT Recognition', 'GST Registered', 'Trademark Filed', 'Patent Filed']} values={form.legalCompliance} onToggle={toggleMulti('legalCompliance')} columns={2} />
                      </Field>
                      <div className="grid sm:grid-cols-3 gap-2.5">
                        <FileInput label="Certificate of Incorporation" file={files.incorporationCert} onChange={(fl) => setFiles((p) => ({ ...p, incorporationCert: fl?.[0] || null }))} />
                        <FileInput label="Trademark Certificate" file={files.trademarkCert} onChange={(fl) => setFiles((p) => ({ ...p, trademarkCert: fl?.[0] || null }))} />
                        <FileInput label="GST Certificate" file={files.gstCert} onChange={(fl) => setFiles((p) => ({ ...p, gstCert: fl?.[0] || null }))} />
                      </div>
                    </div>
                  )}

                  {/* Section 9: Vision */}
                  {step === 8 && (
                    <div className="space-y-2.5">
                      <Field id="whyBuildingThis" label="Why are you building this startup?">
                        <textarea name="whyBuildingThis" value={form.whyBuildingThis} onChange={handleChange} disabled={isSubmitting} rows={2} className={`${inputCls()} resize-none`} />
                      </Field>
                      <Field id="fiveYearVision" label="Where do you see the company in 5 years?">
                        <textarea name="fiveYearVision" value={form.fiveYearVision} onChange={handleChange} disabled={isSubmitting} rows={2} className={`${inputCls()} resize-none`} />
                      </Field>
                      <Field id="whyInvestInYou" label="Why should an investor invest in you?">
                        <textarea name="whyInvestInYou" value={form.whyInvestInYou} onChange={handleChange} disabled={isSubmitting} rows={2} className={`${inputCls()} resize-none`} />
                      </Field>
                    </div>
                  )}

                  {/* Section 10: Documents */}
                  {step === 9 && (
                    <div className="space-y-2.5">
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        <FileInput label="One-Pager" file={files.onePager} onChange={(fl) => setFiles((p) => ({ ...p, onePager: fl?.[0] || null }))} />
                        <FileInput label="Financial Projection" file={files.financialProjection} onChange={(fl) => setFiles((p) => ({ ...p, financialProjection: fl?.[0] || null }))} />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        <Field id="demoVideoLink" label="Product Demo Video Link">
                          <input name="demoVideoLink" value={form.demoVideoLink} onChange={handleChange} disabled={isSubmitting} placeholder="Optional link" className={inputCls()} />
                        </Field>
                        <Field id="founderVideoLink" label="Founders Video Pitch Link">
                          <input name="founderVideoLink" value={form.founderVideoLink} onChange={handleChange} disabled={isSubmitting} placeholder="Optional link" className={inputCls()} />
                        </Field>
                      </div>
                      <FileInput label="Founder Resume" file={files.founderResume} onChange={(fl) => setFiles((p) => ({ ...p, founderResume: fl?.[0] || null }))} />
                    </div>
                  )}
                  </div>

                  <div className="pt-2 flex items-center gap-2.5">
                    {step > 0 && (
                      <button
                        type="button"
                        onClick={goBack}
                        disabled={isSubmitting}
                        className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-bold text-xs hover:bg-slate-800/60 hover:text-white transition-all duration-300 cursor-pointer"
                      >
                        <ArrowLeft size={14} /> Back
                      </button>
                    )}

                    {step < lastStep ? (
                      <button
                        type="button"
                        onClick={goNext}
                        disabled={isSubmitting}
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-extrabold text-xs shadow-xl hover:shadow-emerald-500/10 hover:opacity-95 transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Next: {SECTIONS[step + 1].title}</span> <ArrowRight size={14} />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-extrabold text-xs shadow-xl hover:shadow-emerald-500/10 hover:opacity-95 transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer ${isSubmitting ? 'opacity-85 pointer-events-none' : ''}`}
                      >
                        {isSubmitting ? (<><Loader2 size={14} className="animate-spin text-white" /><span>Submitting Evaluation...</span></>) : (<span>Submit for Evaluation</span>)}
                      </button>
                    )}
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
