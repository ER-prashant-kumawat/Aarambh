import React, { useMemo, useState } from 'react';
import axios from 'axios';
import { KeyRound, Loader2, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { API_URL } from '../utils/api';

interface ConfigState {
  certificateClass: string;
  certificateType: string;
  validity: string;
  applicantType: string;
  isIndianCitizen: string;
  usbToken: string;
  personalAssistance: string;
}

interface ApplicantState {
  fullName: string;
  email: string;
  mobileNumber: string;
  panNumber: string;
  aadhaarNumber: string;
  shippingAddress: string;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  confirmAccountNumber: string;
  ifscCode: string;
  branchName: string;
}

const initialConfig: ConfigState = {
  certificateClass: 'Class 3',
  certificateType: 'Signature',
  validity: '1 year',
  applicantType: 'Individual',
  isIndianCitizen: 'Yes',
  usbToken: 'With Shipping',
  personalAssistance: 'Bronze'
};

const initialApplicant: ApplicantState = {
  fullName: '', email: '', mobileNumber: '', panNumber: '', aadhaarNumber: '', shippingAddress: '',
  accountHolderName: '', bankName: '', accountNumber: '', confirmAccountNumber: '', ifscCode: '', branchName: ''
};

const CLASS_BASE: Record<string, number> = { 'Class 3': 400 };
const TYPE_ADD: Record<string, number> = { 'Signature': 0, 'Encryption': 150, 'Combo': 300 };
const VALIDITY_ADD: Record<string, number> = { '1 year': 0, '2 year': 350 };
const APPLICANT_ADD: Record<string, number> = { 'Individual': 0, 'Organisation': 200 };
const TOKEN_ADD: Record<string, number> = { 'With Shipping': 300, 'Without Shipping': 150, 'Not Required': 0 };
const ASSISTANCE_ADD: Record<string, number> = { 'Bronze': 0, 'Silver': 400, 'Gold': 800, 'Platinum': 1200, 'Not Required': 0 };

const ASSISTANCE_TIERS = [
  { name: 'Bronze', desc: 'One Time Technical Assistance for DSC Downloading' },
  { name: 'Silver', desc: 'Unlimited Assistance for using Digital Signatures on Online Tenders and other Portals' },
  { name: 'Gold', desc: 'Re-Issuance of Digital Signature free of Cost within the Validity period.' },
  { name: 'Platinum', desc: 'Unlimited Online Signing of PDF Online - Worth Rs. 1000' }
];

function computePrice(config: ConfigState): number {
  const base = CLASS_BASE[config.certificateClass] || 0;
  const total =
    base +
    (TYPE_ADD[config.certificateType] || 0) +
    (VALIDITY_ADD[config.validity] || 0) +
    (APPLICANT_ADD[config.applicantType] || 0) +
    (TOKEN_ADD[config.usbToken] || 0) +
    (ASSISTANCE_ADD[config.personalAssistance] || 0);
  return Math.round(total * 1.18) + 1000;
}

const labelCls = 'text-xs font-bold text-slate-300 uppercase tracking-wider';
const inputCls = (hasError?: boolean) =>
  `w-full px-3.5 py-2.5 rounded-lg border bg-slate-955/40 text-white text-sm focus:outline-none focus:ring-2 transition-all duration-300 placeholder-slate-600 ${
    hasError ? 'border-red-500/50 focus:ring-red-500/25' : 'border-slate-800 focus:border-emerald-500/50 focus:ring-emerald-500/15'
  }`;

function Pill({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-full border text-xs font-semibold transition-all duration-200 cursor-pointer ${
        selected ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-slate-950/20 border-slate-700 text-slate-300 hover:border-emerald-500/40'
      }`}
    >
      {label}
    </button>
  );
}

function PillRow({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <Pill key={opt} label={opt} selected={value === opt} onClick={() => onChange(opt)} />
      ))}
    </div>
  );
}

function ConfigRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-2.5 border-b border-slate-800/60">
      <span className={`${labelCls} sm:w-48 shrink-0`}>{label}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function Field({ id, label, required, error, children }: { id: string; label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div id={id}>
      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
        {label} {required && <span className="text-emerald-400">*</span>}
      </label>
      {children}
      {error && <p className="text-red-400 text-[10px] font-bold mt-1">{error}</p>}
    </div>
  );
}

export default function DscApplication() {
  const { showToast } = useToast();
  const [step, setStep] = useState<0 | 1>(0);
  const [config, setConfig] = useState<ConfigState>(initialConfig);
  const [applicant, setApplicant] = useState<ApplicantState>(initialApplicant);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const price = useMemo(() => computePrice(config), [config]);

  const setConfigField = (field: keyof ConfigState) => (value: string) => setConfig((p) => ({ ...p, [field]: value }));
  const toggleConfigField = (field: keyof ConfigState) => (value: string) => setConfig((p) => ({ ...p, [field]: p[field] === value ? '' : value }));

  const handleApplicantChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setApplicant((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const goNext = () => {
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    setStep(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!applicant.fullName.trim()) e.fullName = 'Full name is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!applicant.email.trim()) e.email = 'Email is required';
    else if (!emailRegex.test(applicant.email)) e.email = 'Enter a valid email';
    const phoneRegex = /^[+]?[0-9\s\-()]{10,18}$/;
    if (!applicant.mobileNumber.trim()) e.mobileNumber = 'Mobile number is required';
    else if (!phoneRegex.test(applicant.mobileNumber.replace(/\s+/g, ''))) e.mobileNumber = 'Enter a valid mobile number';
    if (!applicant.accountHolderName.trim()) e.accountHolderName = 'Account holder name is required';
    if (!applicant.bankName.trim()) e.bankName = 'Bank name is required';
    if (!applicant.accountNumber.trim()) e.accountNumber = 'Account number is required';
    if (applicant.accountNumber.trim() !== applicant.confirmAccountNumber.trim()) e.confirmAccountNumber = 'Account numbers do not match';
    const ifscRegex = /^[A-Za-z]{4}0[A-Z0-9a-z]{6}$/;
    if (!applicant.ifscCode.trim()) e.ifscCode = 'IFSC code is required';
    else if (!ifscRegex.test(applicant.ifscCode.trim())) e.ifscCode = 'Enter a valid IFSC code';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const resetForm = () => {
    setConfig(initialConfig);
    setApplicant(initialApplicant);
    setErrors({});
    setStep(0);
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) {
      showToast('Please complete the required fields before submitting.', 'error');
      const firstError = Object.keys(errors)[0];
      if (firstError) document.getElementById(firstError)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      await axios.post(`${API_URL}/dsc`, { ...config, ...applicant, price });
      setSubmitStatus('success');
      showToast('DSC application submitted successfully!', 'success');
      resetForm();
    } catch (err: any) {
      console.error('DSC application submission error:', err);
      setSubmitStatus('error');
      const msg = err.response?.data?.msg || err.message || 'Failed to submit your application. Please try again.';
      setErrorMessage(msg);
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-20 min-h-screen bg-[#0a0f1d]">
      <div className="w-full max-w-3xl mx-auto px-4">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000" />

          <div className="relative glass rounded-2xl p-4 sm:p-6 shadow-2xl overflow-hidden bg-slate-900/80 border border-slate-800/80">
            {submitStatus === 'success' ? (
              <div className="text-center py-8 px-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 border border-emerald-500/25">
                  <CheckCircle2 size={36} className="text-emerald-400" />
                </div>
                <h2 className="text-2xl font-extrabold text-white mb-2 tracking-tight">Application Submitted</h2>
                <p className="text-emerald-400 text-xs font-bold tracking-wider uppercase mb-4">Our DSC team will process your certificate</p>
                <p className="text-slate-400 text-xs leading-relaxed mb-6 max-w-md mx-auto">
                  Thank you. Our team will verify your details and reach out with the next steps for document verification and payment.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitStatus('idle')}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-extrabold text-xs shadow-lg hover:opacity-95 transition-all duration-300 transform active:scale-95 cursor-pointer"
                >
                  Submit Another Application
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4 border-b border-slate-800/60 pb-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <KeyRound size={14} className="text-emerald-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400">Digital Signature Certificate</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">DSC Application</h2>
                  <div className="mt-3 flex items-center gap-2">
                    <div className={`flex-1 h-1.5 rounded-full ${step >= 0 ? 'bg-emerald-500' : 'bg-slate-800'}`} />
                    <div className={`flex-1 h-1.5 rounded-full ${step >= 1 ? 'bg-emerald-500' : 'bg-slate-800'}`} />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5 font-semibold uppercase tracking-wider">
                    {step === 0 ? 'Step 1 of 2 — Configure Certificate' : 'Step 2 of 2 — Applicant & Bank Details'}
                  </p>
                </div>

                {submitStatus === 'error' && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/25 text-red-400 text-xs rounded-xl flex items-start gap-2.5">
                    <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-red-400" />
                    <div>
                      <span className="font-bold block text-xs">Submission Error</span>
                      <span className="text-[11px] leading-relaxed">{errorMessage}</span>
                    </div>
                  </div>
                )}

                {step === 0 ? (
                  <div className="space-y-1">
                    <ConfigRow label="Certificate Class">
                      <PillRow options={['Class 3']} value={config.certificateClass} onChange={toggleConfigField('certificateClass')} />
                    </ConfigRow>
                    <ConfigRow label="Certificate Type">
                      <PillRow options={['Signature', 'Encryption', 'Combo']} value={config.certificateType} onChange={toggleConfigField('certificateType')} />
                    </ConfigRow>
                    <ConfigRow label="Validity">
                      <PillRow options={['1 year', '2 year']} value={config.validity} onChange={toggleConfigField('validity')} />
                    </ConfigRow>
                    <ConfigRow label="Type">
                      <PillRow options={['Individual', 'Organisation']} value={config.applicantType} onChange={toggleConfigField('applicantType')} />
                    </ConfigRow>
                    <ConfigRow label="Are you an Indian Citizen">
                      <PillRow options={['Yes', 'No']} value={config.isIndianCitizen} onChange={toggleConfigField('isIndianCitizen')} />
                    </ConfigRow>
                    <ConfigRow label="USB Token">
                      <div className="flex rounded-lg border border-slate-700 overflow-hidden w-fit">
                        {['With Shipping', 'Without Shipping', 'Not Required'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setConfigField('usbToken')(opt)}
                            className={`px-4 py-2 text-xs font-bold transition-all duration-200 cursor-pointer ${
                              config.usbToken === opt ? 'bg-emerald-500 text-white' : 'bg-slate-950/20 text-slate-400 hover:text-emerald-300'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </ConfigRow>
                    <ConfigRow label="Personal Assistance">
                      <select
                        value={config.personalAssistance}
                        onChange={(e) => setConfigField('personalAssistance')(e.target.value)}
                        className="px-3.5 py-2 rounded-lg border border-slate-700 bg-slate-950/40 text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50"
                      >
                        {['Bronze', 'Silver', 'Gold', 'Platinum', 'Not Required'].map((opt) => (
                          <option key={opt} value={opt} className="bg-slate-900">{opt}</option>
                        ))}
                      </select>
                    </ConfigRow>

                    <p className="text-slate-500 text-[11px] italic pt-3">Keep your PAN No & Aadhaar No handy for further process</p>

                    <div className="pt-3 flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <span className="text-white font-black text-xl">Starts at ₹{price}</span>
                        <span className="text-slate-500 text-xs ml-2">(Includes 18% GST)</span>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/60 mt-3">
                      {ASSISTANCE_TIERS.map((tier) => (
                        <div key={tier.name} className={`rounded-xl p-3 border ${config.personalAssistance === tier.name ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-slate-800 bg-slate-950/20'}`}>
                          <p className="text-white font-bold text-sm mb-1">{tier.name}</p>
                          <p className="text-slate-400 text-[11px] leading-relaxed">{tier.desc}</p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={goNext}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-extrabold text-sm shadow-xl hover:opacity-95 transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Next: Applicant & Bank Details</span> <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest border-b border-slate-800/80 pb-1">Applicant Details</h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <Field id="fullName" label="Full Name" required error={errors.fullName}>
                          <input name="fullName" value={applicant.fullName} onChange={handleApplicantChange} disabled={isSubmitting} placeholder="Your full name" className={inputCls(!!errors.fullName)} />
                        </Field>
                        <Field id="email" label="Email" required error={errors.email}>
                          <input type="email" name="email" value={applicant.email} onChange={handleApplicantChange} disabled={isSubmitting} placeholder="you@example.com" className={inputCls(!!errors.email)} />
                        </Field>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <Field id="mobileNumber" label="Mobile Number" required error={errors.mobileNumber}>
                          <input type="tel" name="mobileNumber" value={applicant.mobileNumber} onChange={handleApplicantChange} disabled={isSubmitting} placeholder="10 digit number" className={inputCls(!!errors.mobileNumber)} />
                        </Field>
                        <Field id="panNumber" label="PAN Number">
                          <input name="panNumber" value={applicant.panNumber} onChange={handleApplicantChange} disabled={isSubmitting} placeholder="ABCDE1234F" className={inputCls()} />
                        </Field>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <Field id="aadhaarNumber" label="Aadhaar Number">
                          <input name="aadhaarNumber" value={applicant.aadhaarNumber} onChange={handleApplicantChange} disabled={isSubmitting} placeholder="12 digit Aadhaar number" className={inputCls()} />
                        </Field>
                        {config.usbToken === 'With Shipping' && (
                          <Field id="shippingAddress" label="USB Token Shipping Address">
                            <input name="shippingAddress" value={applicant.shippingAddress} onChange={handleApplicantChange} disabled={isSubmitting} placeholder="Full delivery address" className={inputCls()} />
                          </Field>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest border-b border-slate-800/80 pb-1">Bank Details (for payment/refund)</h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <Field id="accountHolderName" label="Account Holder Name" required error={errors.accountHolderName}>
                          <input name="accountHolderName" value={applicant.accountHolderName} onChange={handleApplicantChange} disabled={isSubmitting} placeholder="As per bank records" className={inputCls(!!errors.accountHolderName)} />
                        </Field>
                        <Field id="bankName" label="Bank Name" required error={errors.bankName}>
                          <input name="bankName" value={applicant.bankName} onChange={handleApplicantChange} disabled={isSubmitting} placeholder="e.g. HDFC Bank" className={inputCls(!!errors.bankName)} />
                        </Field>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <Field id="accountNumber" label="Account Number" required error={errors.accountNumber}>
                          <input name="accountNumber" value={applicant.accountNumber} onChange={handleApplicantChange} disabled={isSubmitting} placeholder="Bank account number" className={inputCls(!!errors.accountNumber)} />
                        </Field>
                        <Field id="confirmAccountNumber" label="Confirm Account Number" required error={errors.confirmAccountNumber}>
                          <input name="confirmAccountNumber" value={applicant.confirmAccountNumber} onChange={handleApplicantChange} disabled={isSubmitting} placeholder="Re-enter account number" className={inputCls(!!errors.confirmAccountNumber)} />
                        </Field>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <Field id="ifscCode" label="IFSC Code" required error={errors.ifscCode}>
                          <input name="ifscCode" value={applicant.ifscCode} onChange={handleApplicantChange} disabled={isSubmitting} placeholder="e.g. HDFC0001234" className={inputCls(!!errors.ifscCode)} style={{ textTransform: 'uppercase' }} />
                        </Field>
                        <Field id="branchName" label="Branch Name">
                          <input name="branchName" value={applicant.branchName} onChange={handleApplicantChange} disabled={isSubmitting} placeholder="Branch (optional)" className={inputCls()} />
                        </Field>
                      </div>
                      <p className="flex items-center gap-1.5 text-slate-500 text-[11px] italic pt-1"><ShieldCheck size={12} className="text-emerald-400" /> Your bank details are encrypted and used only for DSC payment verification.</p>
                    </div>

                    <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-800/60">
                      <span className="text-white font-black text-lg pt-3">₹{price} <span className="text-slate-500 text-xs font-medium">incl. GST</span></span>
                    </div>

                    <div className="pt-2 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={goBack}
                        disabled={isSubmitting}
                        className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-bold text-xs hover:bg-slate-800/60 hover:text-white transition-all duration-300 cursor-pointer"
                      >
                        <ArrowLeft size={14} /> Back
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 text-white font-extrabold text-xs shadow-xl hover:opacity-95 transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer ${isSubmitting ? 'opacity-85 pointer-events-none' : ''}`}
                      >
                        {isSubmitting ? (<><Loader2 size={14} className="animate-spin text-white" /><span>Submitting...</span></>) : (<span>Submit Application</span>)}
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
