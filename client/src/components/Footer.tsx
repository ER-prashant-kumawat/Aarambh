import { Link } from 'react-router-dom';
import { SERVICES } from '../constants/data';
import { Rocket, AlertCircle, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-navy border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-xl grad-em flex items-center justify-center">
                <Rocket size={17} className="text-white" />
              </div>
              <span className="text-xl font-black text-white">Aarambhh<span className="text-emerald-400">.</span></span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">India's premier legal-tech platform for modern startups. Trusted by 5,000+ founders across 23 states.</p>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <div className="status-dot animate-pulse-slow"></div>Actively accepting new clients
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-bold text-sm mb-5 uppercase tracking-wide">Quick Links</h3>
            <ul className="space-y-2.5">
              <li><Link to="/" className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">About Us</Link></li>
              <li><Link to="/compliance" className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">Compliance Hub</Link></li>
              <li><Link to="/packages" className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">Premium Packages</Link></li>
              <li><Link to="/contact" className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-bold text-sm mb-5 uppercase tracking-wide">Our Services</h3>
            <ul className="space-y-2.5">
              {SERVICES.map(s => (
                <li key={s.id}>
                  <Link to={`/services/${s.id}`} className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & contact */}
          <div>
            <h3 className="text-white font-bold text-sm mb-5 uppercase tracking-wide">Legal & Contact</h3>
            <ul className="space-y-2.5 mb-5">
              {["Privacy Policy", "Terms of Service", "Refund Policy", "Sitemap"].map(item => (
                <li key={item}><button key={item} className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">{item}</button></li>
              ))}
            </ul>
            <div className="space-y-1.5 text-slate-400 text-xs">
              <p>📍 HSR Layout, Bangalore 560 102</p>
              <p>📞 +91 98765 43210</p>
              <p>✉️ hello@aarambhh.com</p>
            </div>
          </div>
        </div>

        {/* Regulatory Disclaimer */}
        <div className="bg-slate-800/55 border border-slate-700/45 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle size={17} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-400 font-bold text-xs uppercase tracking-wide mb-2">Regulatory Disclaimer</p>
              <p className="text-slate-400 text-xs leading-relaxed">
                Aarambhh.com is an independent, privately-owned legal-tech platform and is not affiliated with any government department. We act as professional consultants and facilitators to streamline your application process. However, all statutory approvals, licenses, and corporate registrations are exclusively granted by the respective government authorities.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800">
          <p className="text-slate-500 text-xs">© 2024 Aarambhh Legal-Tech Pvt. Ltd. All rights reserved. CIN: U74999KA2021PTC145XXX</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-600 text-xs">Made with ❤️ in Bangalore</span>
            <div className="flex items-center gap-1.5 text-emerald-500 text-xs"><Shield size={11} /><span>ISO 27001 Certified</span></div>
          </div>
        </div>
      </div>
    </footer>
  );
}
