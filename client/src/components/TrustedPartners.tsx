import React from 'react';
import { Cpu, Layers, Activity, Compass, Scale } from 'lucide-react';

interface Partner {
  name: string;
  sub: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  glow: string;
}

const PARTNERS: Partner[] = [
  { 
    name: "KvantaLabs", 
    sub: "Technology Partner", 
    icon: Cpu, 
    color: "text-emerald-400 group-hover:text-emerald-350", 
    glow: "hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:border-emerald-500/30" 
  },
  { 
    name: "VGroup", 
    sub: "Venture Partners", 
    icon: Layers, 
    color: "text-blue-400 group-hover:text-blue-350", 
    glow: "hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:border-blue-500/30" 
  },
  { 
    name: "MetaFitWellness", 
    sub: "Corporate Wellness", 
    icon: Activity, 
    color: "text-teal-400 group-hover:text-teal-350", 
    glow: "hover:shadow-[0_0_30px_rgba(20,184,166,0.15)] hover:border-teal-500/30" 
  },
  { 
    name: "BookMyAdventure", 
    sub: "Travel & Leisure", 
    icon: Compass, 
    color: "text-amber-400 group-hover:text-amber-350", 
    glow: "hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] hover:border-amber-500/30" 
  },
  { 
    name: "Jayam Law Chambers", 
    sub: "Legal Advisors", 
    icon: Scale, 
    color: "text-purple-400 group-hover:text-purple-350", 
    glow: "hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:border-purple-500/30" 
  }
];

export default function TrustedPartners() {
  return (
    <section className="py-16 bg-[#0a0f1d] border-t border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 mb-3 uppercase tracking-wider">
            Collaboration
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
            Our Trusted Partners
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto font-medium">
            We collaborate with industry leaders to provide streamlined growth, modern tech setups, and compliant Legal-Tech operations.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {PARTNERS.map((partner, index) => {
            const Icon = partner.icon;
            return (
              <div
                key={index}
                className={`group flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 shadow-md transition-all duration-300 ease-out hover:-translate-y-1.5 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 ${partner.glow} ${
                  // On mobile, let the 5th item take full width on 2-column layout
                  index === 4 ? "col-span-2 md:col-span-1" : ""
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-slate-850/50 flex items-center justify-center mb-3 border border-slate-800/60 group-hover:bg-slate-800/55 transition-colors duration-300">
                  <Icon size={22} className={`${partner.color} transition-colors duration-300`} />
                </div>
                
                <h3 className="font-extrabold text-white text-sm tracking-tight text-center group-hover:text-slate-100 transition-colors">
                  {partner.name}
                </h3>
                <p className="text-[10px] text-slate-500 font-bold mt-0.5 text-center tracking-wide uppercase">
                  {partner.sub}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
