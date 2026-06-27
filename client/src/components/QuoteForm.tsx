import React, { useState } from 'react';
import axios from 'axios';
import { 
  User, Mail, Phone, MapPin, Building2, 
  MessageSquare, Loader2, CheckCircle2, AlertCircle, Star
} from 'lucide-react';

interface FormData {
  name: string;
  phone: string;
  email: string;
  cityState: string;
  startupName: string;
  businessStage: string;
  corporateStructure: string;
  servicesRequired: string[];
  timeline: string;
  notes: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  cityState?: string;
  servicesRequired?: string;
}

const COMMON_LOCATIONS = [
  'Bengaluru, Karnataka',
  'Delhi NCR (Delhi/Noida/Gurugram)',
  'Mumbai, Maharashtra',
  'Hyderabad, Telangana',
  'Pune, Maharashtra',
  'Chennai, Tamil Nadu',
  'Ahmedabad, Gujarat',
  'Kolkata, West Bengal',
  'Jaipur, Rajasthan',
  'Other / Outside India'
];

export default function QuoteForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    cityState: '',
    startupName: '',
    businessStage: 'Just an Idea (Pre-revenue)',
    corporateStructure: 'Pvt Ltd',
    servicesRequired: ['Complete Tech-Legal Launchpad (highly recommended)'],
    timeline: 'ASAP',
    notes: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Validate form fields
  const validateForm = (): boolean => {
    const tempErrors: FormErrors = {};
    let isValid = true;

    // Contact Person Name
    if (!formData.name.trim()) {
      tempErrors.name = 'Contact person name is required';
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      tempErrors.name = 'Name must be at least 2 characters';
      isValid = false;
    }

    // Email ID
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      tempErrors.email = 'Email address is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Mobile Number
    const phoneRegex = /^[+]?[0-9\s\-()]{10,18}$/;
    if (!formData.phone.trim()) {
      tempErrors.phone = 'Mobile number is required';
      isValid = false;
    } else if (!phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
      tempErrors.phone = 'Please enter a valid mobile number (at least 10 digits)';
      isValid = false;
    }

    // City & State
    if (!formData.cityState) {
      tempErrors.cityState = 'Please select your City & State';
      isValid = false;
    }

    // Services Required
    if (formData.servicesRequired.length === 0) {
      tempErrors.servicesRequired = 'Please select at least one required service';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleCheckboxChange = (serviceName: string) => {
    setFormData((prev) => {
      const alreadySelected = prev.servicesRequired.includes(serviceName);
      const updated = alreadySelected
        ? prev.servicesRequired.filter((s) => s !== serviceName)
        : [...prev.servicesRequired, serviceName];
      return {
        ...prev,
        servicesRequired: updated,
      };
    });

    if (errors.servicesRequired) {
      setErrors((prev) => ({
        ...prev,
        servicesRequired: undefined,
      }));
    }
  };

  const handleRadioChange = (fieldName: keyof FormData, val: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: val,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        document.getElementById(firstError)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    try {
      // POST the 10 fields directly to the Express backend endpoint
      await axios.post(`${apiUrl}/quote`, formData);

      setIsSubmitting(false);
      setSubmitStatus('success');
      resetForm();
    } catch (err: any) {
      console.error('Backend Quote API Submission Error:', err);
      setIsSubmitting(false);
      setSubmitStatus('error');
      setErrorMessage(
        err.response?.data?.msg || err.message || 'Failed to submit quote request. Please check your connection.'
      );
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      cityState: '',
      startupName: '',
      businessStage: 'Just an Idea (Pre-revenue)',
      corporateStructure: 'Pvt Ltd',
      servicesRequired: ['Complete Tech-Legal Launchpad (highly recommended)'],
      timeline: 'ASAP',
      notes: '',
    });
    setErrors({});
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur opacity-25 group-hover:opacity-35 transition duration-1000"></div>
        
        <div className="relative glass rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden bg-slate-900/80 border border-slate-800/80">
          
          {submitStatus === 'success' ? (
            <div className="text-center py-10 px-4 animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6 border border-emerald-500/25">
                <CheckCircle2 size={44} className="text-emerald-400" />
              </div>
              <h2 className="text-3xl font-extrabold text-white mb-3 tracking-tight">
                Quote Request Registered!
              </h2>
              <p className="text-emerald-400 text-sm font-bold tracking-wider uppercase mb-5">
                Quote request sent successfully!
              </p>
              <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-md mx-auto">
                All details have been compiled and sent directly to <strong>vishal.kvanta@gmail.com</strong> via our secure backend email server. Our consultants will evaluate your business profile and contact you soon.
              </p>
              <button
                type="button"
                onClick={() => setSubmitStatus('idle')}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-sm shadow-lg hover:opacity-95 transition-all duration-300 transform active:scale-95 cursor-pointer"
              >
                Send Another Form
              </button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-8 border-b border-slate-800/60 pb-6">
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Instant Onboarding & Quote
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm mt-2 font-medium">
                  Provide your project dimensions below to receive a secure corporate cost and timeline estimate.
                </p>
              </div>

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/25 text-red-400 text-sm rounded-2xl flex items-start gap-3">
                  <AlertCircle size={20} className="flex-shrink-0 mt-0.5 text-red-400" />
                  <div>
                    <span className="font-bold block text-sm">Submission Error</span>
                    <span className="text-xs leading-relaxed">{errorMessage}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* SECTION 1: CONTACT DETAILS */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest border-b border-slate-800/80 pb-1">
                    01. Contact Verification
                  </h3>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Contact Person Name */}
                    <div id="name">
                      <label htmlFor="name-input" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Contact Person Name <span className="text-emerald-400">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                          <User size={16} />
                        </span>
                        <input
                          type="text"
                          id="name-input"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          placeholder="E.g. Vishal Sharma"
                          className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-slate-955/40 text-white text-sm focus:outline-none focus:ring-2 transition-all duration-300 placeholder-slate-600 ${
                            errors.name
                              ? 'border-red-500/50 focus:ring-red-500/25'
                              : 'border-slate-800 focus:border-emerald-500/50 focus:ring-emerald-500/15'
                          }`}
                        />
                      </div>
                      {errors.name && (
                        <p className="text-red-400 text-[11px] font-bold mt-1.5 flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Mobile Number */}
                    <div id="phone">
                      <label htmlFor="phone-input" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Mobile Number <span className="text-slate-500 font-medium normal-case italic">(WhatsApp preferred)</span> <span className="text-emerald-400">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                          <Phone size={16} />
                        </span>
                        <input
                          type="tel"
                          id="phone-input"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          placeholder="10 digit number"
                          className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-slate-955/40 text-white text-sm focus:outline-none focus:ring-2 transition-all duration-300 placeholder-slate-600 ${
                            errors.phone
                              ? 'border-red-500/50 focus:ring-red-500/25'
                              : 'border-slate-800 focus:border-emerald-500/50 focus:ring-emerald-500/15'
                          }`}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-400 text-[11px] font-bold mt-1.5 flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Email ID */}
                    <div id="email">
                      <label htmlFor="email-input" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Email ID <span className="text-emerald-400">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                          <Mail size={16} />
                        </span>
                        <input
                          type="email"
                          id="email-input"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          placeholder="e.g. name@company.com"
                          className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-slate-955/40 text-white text-sm focus:outline-none focus:ring-2 transition-all duration-300 placeholder-slate-600 ${
                            errors.email
                              ? 'border-red-500/50 focus:ring-red-500/25'
                              : 'border-slate-800 focus:border-emerald-500/50 focus:ring-emerald-500/15'
                          }`}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-400 text-[11px] font-bold mt-1.5 flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.email}
                        </p>
                      )}
                    </div>

                    {/* City & State Dropdown */}
                    <div id="cityState">
                      <label htmlFor="cityState-input" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        City & State <span className="text-emerald-400">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                          <MapPin size={16} />
                        </span>
                        <select
                          id="cityState-input"
                          name="cityState"
                          value={formData.cityState}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-slate-900/80 text-white text-sm focus:outline-none focus:ring-2 transition-all duration-300 appearance-none ${
                            errors.cityState
                              ? 'border-red-500/50 focus:ring-red-500/25'
                              : 'border-slate-800 focus:border-emerald-500/50 focus:ring-emerald-500/15'
                          }`}
                        >
                          <option value="" disabled>Select your location</option>
                          {COMMON_LOCATIONS.map((loc) => (
                            <option key={loc} value={loc} className="bg-slate-900 text-slate-200">
                              {loc}
                            </option>
                          ))}
                        </select>
                        <span className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500">
                          ▼
                        </span>
                      </div>
                      {errors.cityState && (
                        <p className="text-red-400 text-[11px] font-bold mt-1.5 flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.cityState}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* SECTION 2: BUSINESS STRUCTURE & STAGE */}
                <div className="space-y-5 pt-4">
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest border-b border-slate-800/80 pb-1">
                    02. Corporate Profile & Stage
                  </h3>

                  {/* Proposed Startup Name */}
                  <div>
                    <label htmlFor="startupName" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Proposed Startup Name <span className="text-slate-500 font-medium normal-case italic">(optional)</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Building2 size={16} />
                      </span>
                      <input
                        type="text"
                        id="startupName"
                        name="startupName"
                        value={formData.startupName}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        placeholder="E.g. Aarambhh Legaltech Solutions"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-955/40 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/15 transition-all duration-300 placeholder-slate-600"
                      />
                    </div>
                  </div>

                  {/* Current Business Stage */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                      Current Business Stage <span className="text-emerald-400">*</span>
                    </label>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        'Just an Idea (Pre-revenue)',
                        'Bootstrapping & Building MVP',
                        'Generating Revenue',
                        'Preparing to raise funding (Seed/VC)'
                      ].map((stage) => (
                        <button
                          type="button"
                          key={stage}
                          onClick={() => handleRadioChange('businessStage', stage)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                            formData.businessStage === stage
                              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-500/5'
                              : 'bg-slate-950/20 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                            formData.businessStage === stage ? 'border-emerald-400 bg-emerald-500/20' : 'border-slate-600'
                          }`}>
                            {formData.businessStage === stage && (
                              <div className="w-2 h-2 rounded-full bg-emerald-400" />
                            )}
                          </div>
                          <span className="text-xs font-semibold">{stage}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Desired Corporate Structure */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                      Desired Corporate Structure <span className="text-emerald-400">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { id: 'LLP', label: 'LLP' },
                        { id: 'Pvt Ltd', label: 'Pvt Ltd' },
                        { id: 'OPC', label: 'OPC' },
                        { id: 'Not Sure', label: 'Not Sure' }
                      ].map((struct) => (
                        <button
                          type="button"
                          key={struct.id}
                          onClick={() => handleRadioChange('corporateStructure', struct.id)}
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                            formData.corporateStructure === struct.id
                              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-md'
                              : 'bg-slate-950/20 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <span className="text-sm font-black tracking-tight">{struct.id}</span>
                          <span className="text-[10px] text-slate-500 font-bold mt-1">{struct.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SECTION 3: SERVICES & TIMELINE */}
                <div className="space-y-5 pt-4">
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest border-b border-slate-800/80 pb-1">
                    03. Scope & Timelines
                  </h3>

                  {/* Services Required */}
                  <div id="servicesRequired">
                    <div className="flex items-center gap-2 mb-3">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Services Required <span className="text-emerald-400">*</span>
                      </label>
                      {errors.servicesRequired && (
                        <span className="text-red-400 text-[10px] font-bold flex items-center gap-1 animate-pulse">
                          ⚠️ Required
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-2.5">
                      {[
                        { id: 'infra', label: 'Tech Infrastructure' },
                        { id: 'legal', label: 'Corporate Legal Setup' },
                        { 
                          id: 'launchpad', 
                          label: 'Complete Tech-Legal Launchpad (highly recommended)', 
                          featured: true 
                        }
                      ].map((service) => {
                        const isSelected = formData.servicesRequired.includes(service.label);
                        return (
                          <button
                            type="button"
                            key={service.id}
                            onClick={() => handleCheckboxChange(service.label)}
                            className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? service.featured 
                                  ? 'bg-gradient-to-r from-emerald-500/15 to-teal-500/10 border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-500/5'
                                  : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-md'
                                : 'bg-slate-950/20 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-3.5 pr-2">
                              <div className={`w-5 h-5 rounded-lg border flex items-center justify-center flex-shrink-0 transition-colors ${
                                isSelected ? 'bg-emerald-500 border-emerald-500 text-slate-955' : 'border-slate-700 bg-slate-955/40'
                              }`}>
                                {isSelected && (
                                  <svg className="w-3.5 h-3.5 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                                  {service.label.split(' (')[0]}
                                  {service.featured && (
                                    <span className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-400/20">
                                      <Star size={8} className="fill-emerald-400" /> Recommended
                                    </span>
                                  )}
                                </span>
                                {service.label.includes('(') && (
                                  <span className="text-[10px] text-emerald-400/80 font-semibold mt-0.5">
                                    ({service.label.split(' (')[1]}
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                      Launch Timeline <span className="text-emerald-400">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        'ASAP',
                        '2-4 Weeks',
                        'Still structuring it'
                      ].map((time) => (
                        <button
                          type="button"
                          key={time}
                          onClick={() => handleRadioChange('timeline', time)}
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                            formData.timeline === time
                              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-md'
                              : 'bg-slate-950/20 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <span className="text-xs font-black tracking-wide">{time}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes / Pain Points */}
                  <div>
                    <label htmlFor="notes" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Specific Notes / Pain Points <span className="text-slate-500 font-medium normal-case italic">(optional)</span>
                    </label>
                    <div className="relative">
                      <span className="absolute top-3.5 left-4 pointer-events-none text-slate-500">
                        <MessageSquare size={16} />
                      </span>
                      <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        rows={4}
                        placeholder="We would love to hear your ideas or thoughts"
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-800 bg-slate-955/40 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/15 transition-all duration-300 placeholder-slate-600 resize-none"
                      ></textarea>
                    </div>
                  </div>

                </div>

                {/* Submit button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-sm shadow-xl hover:shadow-emerald-500/10 hover:opacity-95 transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer ${
                      isSubmitting ? 'opacity-85 pointer-events-none' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin text-white" />
                        <span>Compiling Quote Request...</span>
                      </>
                    ) : (
                      <span>Submit & Generate Estimate</span>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
