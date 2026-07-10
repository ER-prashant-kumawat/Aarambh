import { Link } from 'react-router-dom';
import { SERVICES } from '../constants/data';
import { Rocket, AlertCircle, Shield, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  const coreServiceIds = ['pvt-ltd', 'trademark', 'llp', 'startup-india', 'opc'];
  const toolLinks = [
    { label: 'NIC Code', to: '/services/nic-code' },
    { label: 'Trademark Search', to: '/services/tm-search' },
    { label: 'Company Name Check', to: '/services/name-check' },
    { label: 'Company Details', to: '/services/company-details' },
    { label: 'Trademark Class Search', to: '/services/tm-class-search' },
  ];

  const linkBase = 'inline-flex items-center rounded-lg px-3 py-2 text-[13px] tracking-wide font-medium transition-colors hover:bg-slate-800/60 hover:text-amber-300';

  return (
    <footer className="bg-brand-navy border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        <div className="border-b border-slate-800/80 pb-4 mb-5 space-y-4">
          <div>
            <h3 className="text-amber-400 font-bold text-[11px] uppercase tracking-[0.25em] mb-2.5">
              Agreement and Contracts
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-2 gap-x-5">
              <li>
                <Link to="/services/mou" onClick={() => window.scrollTo(0, 0)} className={linkBase}>
                  Memorandum of Understanding MoU
                </Link>
              </li>
              <li>
                <Link to="/services/jv-agreement" onClick={() => window.scrollTo(0, 0)} className={linkBase}>
                  Joint Venture Agreement
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-amber-400 font-bold text-[11px] uppercase tracking-[0.25em] mb-2.5">Tools</h3>
            <div className="flex flex-wrap gap-2.5">
              {toolLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => window.scrollTo(0, 0)}
                  className={`${linkBase} border border-slate-800/70 bg-slate-950/20`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-5">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-7 h-7 rounded-xl grad-em flex items-center justify-center">
                <Rocket size={15} className="text-white" />
              </div>
              <span className="text-base font-black text-white">Aarambhh<span className="text-emerald-400">.</span></span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed mb-2.5 max-w-xs">
              India's premier legal-tech platform for modern startups. Trusted by 5,000+ founders across 23 states.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-semibold">
              <div className="status-dot animate-pulse-slow" />
              Actively accepting new clients
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold text-[11px] mb-2.5 uppercase tracking-[0.18em]">Quick Links</h3>
            <ul className="space-y-1.5">
              <li><Link to="/" onClick={() => window.scrollTo(0, 0)} className="text-slate-400 hover:text-emerald-400 text-[13px] transition-colors">Home</Link></li>
              <li><Link to="/about" onClick={() => window.scrollTo(0, 0)} className="text-slate-400 hover:text-emerald-400 text-[13px] transition-colors">About Us</Link></li>
              <li><Link to="/compliance" onClick={() => window.scrollTo(0, 0)} className="text-slate-400 hover:text-emerald-400 text-[13px] transition-colors">Compliance Hub</Link></li>
              <li><Link to="/packages" onClick={() => window.scrollTo(0, 0)} className="text-slate-400 hover:text-emerald-400 text-[13px] transition-colors">Premium Packages</Link></li>
              <li><Link to="/contact" onClick={() => window.scrollTo(0, 0)} className="text-slate-400 hover:text-emerald-400 text-[13px] transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-[11px] mb-2.5 uppercase tracking-[0.18em]">Our Services</h3>
            <ul className="space-y-1.5">
              {SERVICES.filter((service) => coreServiceIds.includes(service.id)).map((service) => (
                <li key={service.id}>
                  <Link to={`/services/${service.id}`} onClick={() => window.scrollTo(0, 0)} className="text-slate-400 hover:text-emerald-400 text-[13px] transition-colors">
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-[11px] mb-2.5 uppercase tracking-[0.18em]">Legal & Contact</h3>
            <ul className="space-y-1.5 mb-2.5">
              {['Privacy Policy', 'Terms of Service', 'Refund Policy', 'Sitemap'].map((item) => (
                <li key={item}>
                  <button type="button" className="text-slate-400 hover:text-emerald-400 text-[13px] transition-colors">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
            <div className="space-y-1.5 text-slate-400 text-[11px]">
              <p className="flex items-center gap-2"><MapPin size={11} className="text-emerald-400" /> HSR Layout, Bangalore 560 102</p>
              <p className="flex items-center gap-2"><Phone size={11} className="text-emerald-400" /> +91 98765 43210</p>
              <p className="flex items-center gap-2"><Mail size={11} className="text-emerald-400" /> hello@aarambhh.com</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/55 border border-slate-700/45 rounded-xl px-4 py-3 mb-4">
          <div className="flex items-start gap-2.5">
            <AlertCircle size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-400 font-bold text-[11px] uppercase tracking-wide mb-1.5">Regulatory Disclaimer</p>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Aarambhh.com is an independent, privately-owned legal-tech platform and is not affiliated with any government department. We act as professional consultants and facilitators to streamline your application process. However, all statutory approvals, licenses, and corporate registrations are exclusively granted by the respective government authorities.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3 border-t border-slate-800">
          <p className="text-slate-500 text-[11px]">&copy; 2024 Aarambhh Legal-Tech Pvt. Ltd. All rights reserved. CIN: U74999KA2021PTC145XXX</p>
          <div className="flex items-center gap-1.5 text-emerald-500 text-[11px]">
            <Shield size={10} />
            <span>ISO 27001 Certified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
