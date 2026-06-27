import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { SERVICES, GOOGLE_FORM_URL } from '../constants/data';
import { Rocket, ChevronDown, Monitor, LogOut, FileText, Award, Briefcase } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  building: Briefcase,
  fileText: FileText,
  award: Award,
  briefcase: Briefcase,
  rocket: Rocket
};

export default function Navbar() {
  const auth = useContext(AuthContext);
  const [dropOpen, setDropOpen] = useState(false);
  const [mobOpen, setMobOpen] = useState(false);
  const [mobSvc, setMobSvc] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const user = auth ? auth.user : null;
  const logout = auth ? auth.logout : () => {};

  useEffect(() => {
    const s = () => setScrolled(window.scrollY > 18);
    window.addEventListener("scroll", s);
    return () => window.removeEventListener("scroll", s);
  }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    setMobOpen(false);
    setDropOpen(false);
  }, [location]);

  const navLinks = [
    { id: "/", label: "Home" },
    { id: "/about", label: "About Us" },
    { id: "/compliance", label: "Compliance Hub" },
    { id: "/packages", label: "Premium Packages" },
    { id: "/contact", label: "Contact Us" },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isSvcActive = location.pathname.startsWith('/services/');
  const currentPath = location.pathname;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass-dark shadow-2xl" : "bg-brand-navy/96"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl grad-em flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Rocket size={17} className="text-white" />
            </div>
            <span className="text-xl font-black text-white tracking-tight">
              Aarambhh<span className="text-emerald-400">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-5">
            {navLinks.map(l => (
              <Link key={l.id} to={l.id}
                className={`nav-link text-sm font-medium transition-colors ${currentPath === l.id ? "text-emerald-400" : "text-slate-300 hover:text-white"}`}>
                {l.label}
              </Link>
            ))}

            {/* Services dropdown */}
            <div className="relative" ref={dropRef}>
              <button onClick={() => setDropOpen(!dropOpen)}
                className={`nav-link flex items-center gap-1 text-sm font-medium transition-colors ${isSvcActive ? "text-emerald-400" : "text-slate-300 hover:text-white"}`}>
                Our Services
                <ChevronDown size={13} className={`transition-transform ${dropOpen ? "rotate-180" : ""}`} />
              </button>
              {dropOpen && (
                <div className="drop-menu absolute top-full right-0 mt-3 w-72 rounded-2xl overflow-hidden shadow-2xl border border-slate-700/40"
                  style={{ background: "rgba(15,23,42,0.97)", backdropFilter: "blur(20px)" }}>
                  <div className="p-2">
                    {SERVICES.map(s => {
                      const Icon = iconMap[s.icon] || Rocket;
                      return (
                        <Link key={s.id} to={`/services/${s.id}`}
                          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-emerald-500/10 text-left group transition-colors">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                            <Icon size={14} className="text-emerald-400" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-white">{s.label}</div>
                            <div className="text-xs text-slate-400">{s.tagline}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard"
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${location.pathname.startsWith('/dashboard') ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}>
                  <div className="status-dot flex-shrink-0 animate-pulse-slow"></div>
                  {user.companyName.split(" ").slice(0, 2).join(" ")}
                </Link>
                <button onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Log Out">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link to="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-500/40 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/10 transition-all">
                <Monitor size={15} />
                Client Dashboard
              </Link>
            )}
            <a href={GOOGLE_FORM_URL} target="_blank" rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl grad-em text-white text-sm font-bold shadow-lg hover:opacity-90 hover:scale-105 transition-all">
              Get Free Quote
            </a>
          </div>

          {/* Mobile hamburger */}
          <button className="lg:hidden text-white p-2 flex flex-col gap-1.5" onClick={() => setMobOpen(!mobOpen)}>
            <span className={`block w-6 h-0.5 bg-white transition-all ${mobOpen ? "rotate-45 translate-y-2" : ""}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all ${mobOpen ? "opacity-0" : ""}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all ${mobOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobOpen && (
        <div className="lg:hidden border-t border-slate-700/40" style={{ background: "rgba(15,23,42,0.98)" }}>
          <div className="px-4 py-4 space-y-1">
            {navLinks.map(l => (
              <Link key={l.id} to={l.id}
                className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-medium ${currentPath === l.id ? "bg-emerald-500/10 text-emerald-400" : "text-slate-300 hover:bg-slate-800"}`}>
                {l.label}
              </Link>
            ))}
            <div>
              <button onClick={() => setMobSvc(!mobSvc)}
                className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 flex items-center justify-between">
                Our Services <ChevronDown size={13} className={`transition-transform ${mobSvc ? "rotate-180" : ""}`} />
              </button>
              {mobSvc && (
                <div className="ml-4 space-y-1 mt-1">
                  {SERVICES.map(s => {
                    const Icon = iconMap[s.icon] || Rocket;
                    return (
                      <Link key={s.id} to={`/services/${s.id}`}
                        className="w-full text-left px-4 py-2.5 rounded-xl text-sm text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/5 flex items-center gap-2">
                        <Icon size={13} className="text-emerald-400 flex-shrink-0" /> {s.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="pt-2 space-y-2 border-t border-slate-800 mt-2">
              {user ? (
                <>
                  <Link to="/dashboard" className="block w-full text-center py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-sm">
                    My Dashboard
                  </Link>
                  <button onClick={handleLogout} className="w-full py-3 rounded-xl border border-red-500/30 text-red-400 font-semibold text-sm">
                    Log Out
                  </button>
                </>
              ) : (
                <Link to="/login" className="block w-full text-center py-3 rounded-xl border border-emerald-500/30 text-emerald-400 font-semibold text-sm">
                  Client Dashboard →
                </Link>
              )}
              <a href={GOOGLE_FORM_URL} target="_blank" rel="noopener noreferrer" className="block w-full text-center py-3 rounded-xl grad-em text-white font-bold text-sm">
                Get Free Quote Now
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
