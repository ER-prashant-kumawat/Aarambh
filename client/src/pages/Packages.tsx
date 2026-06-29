import { useState, useEffect, useRef } from 'react';
import JoinSection from '../components/JoinSection';
import { PACKAGES, GOOGLE_FORM_URL } from '../constants/data';
import { CheckCircle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Packages() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
      
      // Calculate active slide index
      const cardWidth = 380; // approximate width of card including gap
      const index = Math.min(Math.round(scrollLeft / cardWidth), PACKAGES.length);
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      // Wait a moment for rendering and then check
      setTimeout(checkScroll, 100);
    }
    return () => {
      if (el) {
        el.removeEventListener('scroll', checkScroll);
      }
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollToSlide = (index: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: index * 380, behavior: 'smooth' });
    }
  };

  return (
    <div className="pt-16">
      <section className="grad-hero py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute top-10 right-1/4 w-64 h-64 bg-emerald-400/8 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-5">
            <span className="text-emerald-400 text-xs font-semibold">Transparent Pricing</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-5">Premium Packages</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto font-medium">One flat price. Zero hidden fees. Everything your startup needs legally — bundled intelligently.</p>
        </div>
      </section>

      <section className="py-20 bg-[#0a0f1d] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="relative group/slider">
            {/* Slider navigation controls */}
            {canScrollLeft && (
              <button 
                onClick={() => handleScroll('left')} 
                className="absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-slate-900/90 border border-slate-800 text-white flex items-center justify-center hover:bg-emerald-500 hover:text-slate-950 transition-all hover:scale-110 shadow-2xl backdrop-blur cursor-pointer"
                aria-label="Previous Package"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            
            {canScrollRight && (
              <button 
                onClick={() => handleScroll('right')} 
                className="absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-slate-900/90 border border-slate-800 text-white flex items-center justify-center hover:bg-emerald-500 hover:text-slate-950 transition-all hover:scale-110 shadow-2xl backdrop-blur cursor-pointer"
                aria-label="Next Package"
              >
                <ChevronRight size={20} />
              </button>
            )}

            {/* Carousel container */}
            <div 
              ref={scrollRef}
              className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-6 lg:gap-8 pb-10 scrollbar-none items-stretch px-1"
            >
              {PACKAGES.map((pkg, i) => {
                const baseHover = "transition-all duration-300 ease-out hover:-translate-y-2";
                let cardGlow = "hover:shadow-[0_0_40px_rgba(16,185,129,0.06)] border-slate-800/80 hover:border-slate-700/80";
                let cardBg = "bg-gradient-to-b from-slate-900/85 to-slate-950/95";
                
                if (pkg.name === "Hyper Growth Scale") {
                  cardGlow = "hover:shadow-[0_0_40px_rgba(52,211,153,0.25)] border-emerald-500/35 ring-2 ring-emerald-500/10";
                  cardBg = "bg-gradient-to-b from-slate-900/90 to-emerald-950/15";
                } else if (pkg.name === "Enterprise Custom") {
                  cardGlow = "hover:shadow-[0_0_40px_rgba(168,85,247,0.25)] border-purple-500/35 ring-2 ring-purple-500/10";
                  cardBg = "bg-gradient-to-b from-slate-900/90 to-purple-950/15";
                }

                return (
                  <div 
                    key={i} 
                    className={`price-card min-w-[290px] sm:min-w-[350px] max-w-[360px] flex-shrink-0 snap-center rounded-3xl p-8 border shadow-xl relative overflow-hidden flex flex-col justify-between h-full ${cardBg} ${baseHover} ${cardGlow}`}
                  >
                    <div>
                      {pkg.badge && (
                        <div className="absolute top-4 right-4">
                          <span className={`text-[10px] font-black px-3 py-1 rounded-full shadow-lg text-white uppercase tracking-wider ${
                            pkg.name === 'Hyper Growth Scale' ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-purple-600'
                          }`}>
                            {pkg.badge}
                          </span>
                        </div>
                      )}
                      
                      <div className="mb-6">
                        <h3 className="font-black text-white text-xl mb-1">{pkg.name}</h3>
                        <p className="text-slate-400 text-xs font-medium leading-relaxed">{pkg.subtitle}</p>
                        
                        <div className="mt-4 flex items-baseline">
                          <span className="text-4xl font-extrabold text-white tracking-tight">{pkg.price}</span>
                          <span className="text-slate-500 text-xs ml-2 font-medium">one-time</span>
                        </div>
                        <p className="text-emerald-400/90 text-[10px] font-bold mt-1.5 flex items-center gap-1">
                          ✨ Govt. fees & professional service included
                        </p>
                      </div>

                      <a href={GOOGLE_FORM_URL} target="_blank" rel="noopener noreferrer"
                        className={`w-full py-3 rounded-xl font-bold text-sm mb-6 transition-all duration-300 text-center block ${
                          pkg.name === 'Hyper Growth Scale' 
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:opacity-95 shadow-lg shadow-emerald-500/10 shadow-md'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-100'
                        }`}
                      >
                        Get Started →
                      </a>

                      <div className="space-y-2 pt-2 border-t border-slate-800/40">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">What's Included</p>
                        {pkg.features.map((f, j) => (
                          <div key={j} className="flex items-start gap-2.5">
                            <CheckCircle size={12} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span className="text-slate-350 text-xs font-semibold leading-relaxed">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Custom Quote Card */}
              <div className="price-card min-w-[290px] sm:min-w-[350px] max-w-[360px] flex-shrink-0 snap-center rounded-3xl p-8 border border-slate-800/80 bg-gradient-to-b from-slate-900/85 to-slate-950/95 shadow-xl relative overflow-hidden flex flex-col justify-between h-full transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(16,185,129,0.06)] hover:border-slate-700/80">
                <div>
                  <div className="mb-6">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                      <AlertCircle size={20} className="text-emerald-400" />
                    </div>
                    <h3 className="font-black text-white text-xl mb-1">Custom Quote</h3>
                    <p className="text-slate-400 text-xs font-medium leading-relaxed">For complex or custom structures</p>
                    
                    <div className="mt-4 flex items-baseline">
                      <span className="text-3xl font-extrabold text-white tracking-tight">Custom Pricing</span>
                    </div>
                    <p className="text-emerald-400/90 text-[10px] font-bold mt-1.5">
                      💼 Tailored CS/CA retainer plans
                    </p>
                  </div>
                  
                  <p className="text-slate-400 text-xs leading-relaxed mb-6 font-medium">
                    Multi-entity structures, sector-specific licenses (FSSAI, NBFC, SEBI), or a full-year outsourced compliance retainer. We build custom engagement models to protect your operation.
                  </p>
                </div>
                
                <a href={GOOGLE_FORM_URL} target="_blank" rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 text-center block grad-em text-white hover:opacity-95 shadow-lg">
                  Request Custom Package →
                </a>
              </div>

            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: PACKAGES.length + 1 }).map((_, idx) => (
                <button 
                  key={idx} 
                  onClick={() => scrollToSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${activeIndex === idx ? 'w-6 bg-emerald-400' : 'w-2 bg-slate-700'}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

          </div>

        </div>
      </section>

      <JoinSection />
    </div>
  );
}
