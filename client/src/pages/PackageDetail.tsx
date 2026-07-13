import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { PACKAGES } from '../constants/data';
import { API_URL } from '../utils/api';
import { useToast } from '../context/ToastContext';
import {
  ChevronRight, CheckCircle, CheckCircle2, AlertCircle, Loader2,
  User, Phone, Mail, Building2, MapPin, Home, FileText, MessageSquare, ShoppingCart
} from 'lucide-react';

const COMMON_LOCATIONS = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
  'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi (NCR)', 'Jammu and Kashmir', 'Ladakh',
  'Lakshadweep', 'Puducherry', 'Other / Outside India'
];

interface OrderFormData {
  name: string;
  phone: string;
  email: string;
  companyName: string;
  address: string;
  cityState: string;
  pincode: string;
  gstin: string;
  notes: string;
}

interface OrderFormErrors {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  cityState?: string;
  pincode?: string;
}

const EMPTY_FORM: OrderFormData = {
  name: '',
  phone: '',
  email: '',
  companyName: '',
  address: '',
  cityState: '',
  pincode: '',
  gstin: '',
  notes: '',
};

export default function PackageDetail() {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();

  const pkg = PACKAGES.find((p) => p.id === id);

  const [formData, setFormData] = useState<OrderFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<OrderFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [orderId, setOrderId] = useState('');

  if (!pkg) {
    return (
      <div className="pt-32 pb-20 text-center">
        <h2 className="text-2xl font-bold text-white">Package not found</h2>
        <Link to="/packages" className="text-emerald-400 hover:underline mt-4 inline-block font-semibold">
          ← View All Premium Packages
        </Link>
      </div>
    );
  }

  const validateForm = (): { isValid: boolean; tempErrors: OrderFormErrors } => {
    const tempErrors: OrderFormErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      tempErrors.name = 'Full name is required';
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      tempErrors.name = 'Name must be at least 2 characters';
      isValid = false;
    }

    const phoneRegex = /^[+]?[0-9\s\-()]{10,18}$/;
    if (!formData.phone.trim()) {
      tempErrors.phone = 'Mobile number is required';
      isValid = false;
    } else if (!phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
      tempErrors.phone = 'Please enter a valid mobile number (at least 10 digits)';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      tempErrors.email = 'Email address is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.address.trim()) {
      tempErrors.address = 'Complete address is required';
      isValid = false;
    } else if (formData.address.trim().length < 10) {
      tempErrors.address = 'Please enter your complete address';
      isValid = false;
    }

    if (!formData.cityState) {
      tempErrors.cityState = 'Please select your City & State';
      isValid = false;
    }

    if (formData.pincode.trim() && !/^[0-9]{6}$/.test(formData.pincode.trim())) {
      tempErrors.pincode = 'Pincode must be 6 digits';
      isValid = false;
    }

    setErrors(tempErrors);
    return { isValid, tempErrors };
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof OrderFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { isValid, tempErrors } = validateForm();
    if (!isValid) {
      showToast('Please resolve the errors in the form before submitting.', 'error');
      const firstError = Object.keys(tempErrors)[0];
      if (firstError) {
        document.getElementById(`order-${firstError}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const res = await axios.post(`${API_URL}/orders`, {
        ...formData,
        packageId: pkg.id,
        packageName: pkg.name,
        packagePrice: pkg.price,
      });
      setOrderId(res.data.orderId || '');
      setSubmitStatus('success');
      showToast('Order placed successfully! Our team will contact you shortly.', 'success');
      setFormData(EMPTY_FORM);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Order Submission Error:', err);
      setSubmitStatus('error');
      const msg = err.response?.data?.msg || 'Could not reach the server. Please check your internet connection and try again in a moment.';
      setErrorMessage(msg);
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (hasError?: string) =>
    `w-full pl-10 pr-4 py-3 rounded-xl border bg-slate-955/40 text-white text-sm focus:outline-none focus:ring-2 transition-all duration-300 placeholder-slate-600 ${
      hasError
        ? 'border-red-500/50 focus:ring-red-500/25'
        : 'border-slate-800 focus:border-emerald-500/50 focus:ring-emerald-500/15'
    }`;

  const fieldError = (msg?: string) =>
    msg ? (
      <p className="text-red-400 text-[11px] font-bold mt-1.5 flex items-center gap-1">
        <AlertCircle size={12} /> {msg}
      </p>
    ) : null;

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="grad-hero py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute top-10 right-1/4 w-64 h-64 bg-emerald-400/8 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/packages" onClick={() => window.scrollTo(0, 0)}
            className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-400 text-sm mb-6 transition-colors w-fit">
            <ChevronRight size={14} className="rotate-180" />
            Back to Premium Packages
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-5">
            <span className="text-emerald-400 text-xs font-semibold">Premium Package</span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-black text-white mb-4 max-w-3xl">{pkg.name}</h1>
          <p className="text-slate-300 text-base lg:text-lg max-w-2xl font-medium mb-6">{pkg.subtitle}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-white tracking-tight">{pkg.price}</span>
            <span className="text-slate-400 text-sm font-medium">one-time · Govt. fees & professional service included</span>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#0a0f1d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {submitStatus === 'success' ? (
            /* ── Order success screen ── */
            <div className="max-w-xl mx-auto text-center py-10 animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6 border border-emerald-500/25">
                <CheckCircle2 size={44} className="text-emerald-400" />
              </div>
              <h2 className="text-3xl font-extrabold text-white mb-3 tracking-tight">Order Placed Successfully!</h2>
              <p className="text-emerald-400 text-sm font-bold tracking-wider uppercase mb-5">
                {pkg.name}
              </p>
              {orderId && (
                <p className="text-slate-400 text-xs font-semibold mb-4">
                  Order ID: <span className="text-slate-200 font-mono">{orderId}</span>
                </p>
              )}
              <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-md mx-auto">
                Your order details have been registered and sent to our team. Our consultants will contact you
                shortly on your mobile/email to confirm the order and guide you through the payment & onboarding process.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button type="button" onClick={() => setSubmitStatus('idle')}
                  className="px-8 py-3 rounded-xl border border-slate-700 text-slate-300 font-bold text-sm hover:bg-slate-800 transition-all">
                  Place Another Order
                </button>
                <Link to="/packages" onClick={() => window.scrollTo(0, 0)}
                  className="px-8 py-3 rounded-xl grad-em text-white font-extrabold text-sm shadow-lg hover:opacity-95 transition-all">
                  Explore More Packages
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8 items-start">

              {/* Left: What's included */}
              <div className="glass rounded-3xl p-8 border border-slate-800/80">
                <h2 className="text-xl font-black text-white mb-6">What's Included</h2>
                <div className="space-y-3">
                  {pkg.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle size={15} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300 text-sm font-semibold leading-relaxed">{f}</span>
                    </div>
                  ))}
                </div>

                {pkg.not.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-slate-800/60">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Not Included</p>
                    <div className="space-y-2">
                      {pkg.not.map((n, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <AlertCircle size={14} className="text-slate-600 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-500 text-sm font-medium">{n}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8 bg-emerald-500/10 rounded-2xl p-5 border border-emerald-500/20">
                  <p className="text-emerald-300 text-xs leading-relaxed font-semibold">
                    ✅ Expert-supervised · ✅ Secure Architecture · ✅ Zero hidden fees — transparent pricing and
                    statutory execution exactly as scoped.
                  </p>
                </div>
              </div>

              {/* Right: Order form */}
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur opacity-20"></div>
                <div className="relative glass rounded-3xl p-8 border border-slate-800/80 bg-slate-900/80">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <ShoppingCart size={18} className="text-emerald-400" />
                    </div>
                    <h2 className="text-xl font-black text-white">Get This Package</h2>
                  </div>
                  <p className="text-slate-400 text-xs font-medium mb-6">
                    Fill in your details below — our team will contact you to confirm your order and start onboarding.
                  </p>

                  {submitStatus === 'error' && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/25 text-red-400 text-sm rounded-2xl flex items-start gap-3">
                      <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block text-sm">Order Error</span>
                        <span className="text-xs leading-relaxed">{errorMessage}</span>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Full Name */}
                    <div id="order-name">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Full Name <span className="text-emerald-400">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500"><User size={16} /></span>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                          disabled={isSubmitting} placeholder="E.g. Vishal Sharma" className={inputClass(errors.name)} />
                      </div>
                      {fieldError(errors.name)}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Mobile */}
                      <div id="order-phone">
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                          Mobile Number <span className="text-emerald-400">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500"><Phone size={16} /></span>
                          <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                            disabled={isSubmitting} placeholder="10 digit number" className={inputClass(errors.phone)} />
                        </div>
                        {fieldError(errors.phone)}
                      </div>

                      {/* Email */}
                      <div id="order-email">
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                          Email ID <span className="text-emerald-400">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500"><Mail size={16} /></span>
                          <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                            disabled={isSubmitting} placeholder="name@company.com" className={inputClass(errors.email)} />
                        </div>
                        {fieldError(errors.email)}
                      </div>
                    </div>

                    {/* Company Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Company / Startup Name <span className="text-slate-500 font-medium normal-case italic">(optional)</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500"><Building2 size={16} /></span>
                        <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange}
                          disabled={isSubmitting} placeholder="E.g. Aarambhh Legaltech Solutions" className={inputClass()} />
                      </div>
                    </div>

                    {/* Address */}
                    <div id="order-address">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Complete Address <span className="text-emerald-400">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute top-3.5 left-3.5 pointer-events-none text-slate-500"><Home size={16} /></span>
                        <textarea name="address" value={formData.address} onChange={handleInputChange}
                          disabled={isSubmitting} rows={2} placeholder="House / Building, Street, Area, City"
                          className={`${inputClass(errors.address)} resize-none`} />
                      </div>
                      {fieldError(errors.address)}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* City & State */}
                      <div id="order-cityState">
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                          City & State <span className="text-emerald-400">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500"><MapPin size={16} /></span>
                          <select name="cityState" value={formData.cityState} onChange={handleInputChange}
                            disabled={isSubmitting}
                            className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-slate-900/80 text-white text-sm focus:outline-none focus:ring-2 transition-all duration-300 appearance-none ${
                              errors.cityState
                                ? 'border-red-500/50 focus:ring-red-500/25'
                                : 'border-slate-800 focus:border-emerald-500/50 focus:ring-emerald-500/15'
                            }`}>
                            <option value="" disabled>Select your location</option>
                            {COMMON_LOCATIONS.map((loc) => (
                              <option key={loc} value={loc} className="bg-slate-900 text-slate-200">{loc}</option>
                            ))}
                          </select>
                          <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500">▼</span>
                        </div>
                        {fieldError(errors.cityState)}
                      </div>

                      {/* Pincode */}
                      <div id="order-pincode">
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                          Pincode <span className="text-slate-500 font-medium normal-case italic">(optional)</span>
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500"><MapPin size={16} /></span>
                          <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange}
                            disabled={isSubmitting} placeholder="6 digit pincode" maxLength={6} className={inputClass(errors.pincode)} />
                        </div>
                        {fieldError(errors.pincode)}
                      </div>
                    </div>

                    {/* GSTIN */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        GSTIN <span className="text-slate-500 font-medium normal-case italic">(optional — for GST invoice)</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500"><FileText size={16} /></span>
                        <input type="text" name="gstin" value={formData.gstin} onChange={handleInputChange}
                          disabled={isSubmitting} placeholder="E.g. 22AAAAA0000A1Z5" className={inputClass()} />
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Notes / Special Requirements <span className="text-slate-500 font-medium normal-case italic">(optional)</span>
                      </label>
                      <div className="relative">
                        <span className="absolute top-3.5 left-3.5 pointer-events-none text-slate-500"><MessageSquare size={16} /></span>
                        <textarea name="notes" value={formData.notes} onChange={handleInputChange}
                          disabled={isSubmitting} rows={3} placeholder="Anything specific we should know about your order?"
                          className={`${inputClass()} resize-none`} />
                      </div>
                    </div>

                    {/* Order summary strip */}
                    <div className="flex items-center justify-between bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3">
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">You're ordering</span>
                      <span className="text-white text-sm font-black">{pkg.price}</span>
                    </div>

                    {/* Submit */}
                    <button type="submit" disabled={isSubmitting}
                      className={`w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-sm shadow-xl hover:shadow-emerald-500/10 hover:opacity-95 transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer ${
                        isSubmitting ? 'opacity-85 pointer-events-none' : ''
                      }`}>
                      {isSubmitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin text-white" />
                          <span>Placing Your Order...</span>
                        </>
                      ) : (
                        <span>Place Order — {pkg.price}</span>
                      )}
                    </button>
                    <p className="text-center text-slate-500 text-[11px] font-semibold">
                      No advance payment required — our team confirms your order before any payment.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
