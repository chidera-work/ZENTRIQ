import React from 'react';
import { Link } from 'react-router-dom';
import { SERVICES } from '../constants';
import Logo from '../components/Logo';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Premium Enterprise Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-navy-dark via-navy-dark/80 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-transparent to-transparent z-10"></div>
          <img 
            src="https://lh3.googleusercontent.com/d/1wN1XjBl5adlrvSSdsc--MXEWmk3mtWV8" 
            alt="Elite Logistics"
            className="w-full h-full object-cover brightness-[0.5] contrast-[1.1] scale-105 animate-[pan_60s_linear_infinite]"
          />
        </div>

        {/* HUD Elements */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-10 w-px h-64 bg-gradient-to-b from-transparent via-apexRed/20 to-transparent"></div>
          <div className="absolute top-1/2 right-10 w-px h-64 bg-gradient-to-b from-transparent via-apexRed/20 to-transparent"></div>
          
          {/* Scanning Line */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-apexRed/5 to-transparent h-1/2 w-full -translate-y-full animate-[scan_8s_linear_infinite] opacity-30"></div>
        </div>

        <div className="absolute inset-0 bg-grid opacity-5 z-10 pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-20">
          <div className="max-w-6xl relative">
            {/* Tactical Corner HUD */}
            <div className="absolute -top-10 -left-10 w-20 h-20 border-t-2 border-l-2 border-apexRed/30 rounded-tl-3xl hidden xl:block"></div>
            <div className="absolute -bottom-10 -right-10 w-20 h-20 border-b-2 border-r-2 border-apexRed/30 rounded-br-3xl hidden xl:block"></div>

            <div className="flex items-center gap-6 mb-8 animate-reveal" style={{ animationDelay: '0.1s' }}>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-apexRed animate-pulse shadow-[0_0_8px_#A61A1A]"></div>
                <div className="w-2 h-2 rounded-full bg-white/10"></div>
                <div className="w-2 h-2 rounded-full bg-white/5"></div>
              </div>
            </div>

            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[12vw] font-heading font-black leading-[0.85] md:leading-[0.75] tracking-[-0.06em] mb-8 md:mb-12 animate-reveal uppercase relative" style={{ animationDelay: '0.2s' }}>
              <span className="text-main block drop-shadow-2xl">Elite</span>
              <span className="relative block">
                <span className="text-transparent block italic opacity-20 skew-x-[-12deg] tracking-[-0.02em]" style={{ WebkitTextStroke: '1.5px var(--text-main)' }}>Logistics.</span>
                <span className="absolute top-1/2 left-0 w-full h-[1px] bg-main/10 -translate-y-1/2"></span>
              </span>
              <span className="text-apexRed italic block drop-shadow-[0_0_60px_rgba(166,26,26,0.7)] animate-[pulse_3s_ease-in-out_infinite] tracking-[-0.04em]">Defended.</span>
            </h1>

            <div className="max-w-2xl mb-12 md:mb-16 animate-reveal" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-start gap-4 md:gap-8">
                <div className="w-px h-16 md:h-24 bg-apexRed/30 hidden md:block"></div>
                <p className="text-muted text-lg md:text-2xl font-light leading-relaxed italic">
                  Architecting unbreachable supply chain nexus protocols for the world's most critical assets. Where precision tracking meets military-grade security.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 animate-reveal" style={{ animationDelay: '0.6s' }}>
              <Link to="/track" className="relative overflow-hidden group/btn bg-apexRed text-white px-8 md:px-12 py-5 md:py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] md:text-[11px] transition-all hover:scale-105 active:scale-95 shadow-apex flex items-center justify-center gap-4">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_2s_infinite]"></div>
                <i className="fa-solid fa-satellite-dish text-base animate-pulse"></i> 
                <span className="relative z-10">Initialize Track Portal</span>
              </Link>
              <Link to="/contact" className="relative overflow-hidden glass text-main px-8 md:px-12 py-5 md:py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] md:text-[11px] hover:bg-main/5 transition-all flex items-center justify-center gap-4 border border-main/10 active:scale-95 group/uplink">
                <div className="absolute inset-0 bg-main/5 translate-y-full group-hover/uplink:translate-y-0 transition-transform duration-500"></div>
                <i className="fa-solid fa-shield-halved text-base group-hover/uplink:text-apexRed transition-colors relative z-10"></i> 
                <span className="relative z-10">Establish Secure Uplink</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Tactical Scroll Hint */}
        <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-4 md:gap-6 opacity-30 group/scroll cursor-pointer">
           <span className="text-[8px] font-black uppercase tracking-[0.8em] text-main group-hover:text-apexRed transition-colors">Initialize Scroll</span>
           <div className="relative w-px h-12 md:h-16 bg-main/10 overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-apexRed to-transparent animate-[scan_2s_linear_infinite]"></div>
           </div>
        </div>
      </section>

      {/* Brand Authority Marquee */}
      <section className="py-12 md:py-16 bg-navy-dark/80 border-y border-main/5 overflow-hidden relative">
        <div className="absolute inset-0 bg-grid opacity-5"></div>
        <div className="flex whitespace-nowrap gap-8 md:gap-16 animate-marquee items-center opacity-30 hover:opacity-100 transition-opacity duration-700 relative z-10">
           {['Global Defense', 'Tech Logistics', 'Secure Transit', 'Zentriq Shield', 'Nordic Freight', 'Pacific Secured', 'Atlantic Armor', 'Global Defense', 'Tech Logistics', 'Secure Transit', 'Zentriq Shield'].map((brand, i) => (
             <div key={i} className="flex items-center gap-4 md:gap-6 px-8 md:px-16 border-r border-main/5 last:border-0">
                <Logo iconOnly className="h-6 md:h-8 opacity-50 group-hover:opacity-100" />
                <span className="text-main font-black uppercase tracking-[0.5em] text-[10px] md:text-xs italic">{brand}</span>
             </div>
           ))}
        </div>
      </section>

      {/* Authority Metrics Section */}
      <section className="py-20 md:py-32 relative border-b border-main/5 bg-navy-dark/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-main/10 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-elevated-light dark:shadow-elevated-dark bg-navy-panel/50 backdrop-blur-sm">
            {[
              { label: 'Asset Nodes', val: '452', icon: 'fa-earth-americas', sub: 'GLOBAL_NETWORK' },
              { label: 'Armored Units', val: '8.2k', icon: 'fa-truck-shield', sub: 'TACTICAL_FLEET' },
              { label: 'Mission Integrity', val: '99.9%', icon: 'fa-shield-check', sub: 'SUCCESS_RATE' },
              { label: 'Active Capital', val: '$12B+', icon: 'fa-vault', sub: 'MANAGED_ASSETS' }
            ].map((stat, i) => (
              <div key={i} className="group p-8 md:p-12 border-main/10 border-b sm:border-b-0 sm:border-r last:border-0 relative overflow-hidden transition-all hover:bg-main/[0.02]">
                <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-all duration-700 -rotate-12 translate-x-4">
                   <i className={`fa-solid ${stat.icon} text-6xl md:text-8xl text-main`}></i>
                </div>
                
                <div className="flex justify-between items-start mb-8 md:mb-12">
                   <span className="text-[10px] font-mono text-apexRed font-black tracking-[0.4em]">0{i+1}</span>
                   <div className="w-1.5 h-1.5 rounded-full bg-apexRed animate-pulse shadow-[0_0_8px_#A61A1A]"></div>
                </div>

                <div className="relative z-10">
                   <h3 className="text-4xl md:text-6xl font-black text-main tracking-tighter mb-2 group-hover:text-apexRed transition-colors duration-500 font-mono">
                     {stat.val}
                   </h3>
                   <div className="flex flex-col gap-1">
                      <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-main">{stat.label}</span>
                      <span className="text-[7px] md:text-[8px] font-mono font-bold text-muted uppercase tracking-[0.5em]">{stat.sub}</span>
                   </div>
                </div>
                
                {/* Tactical HUD line */}
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-apexRed transition-all duration-700 group-hover:w-full shadow-apex"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tactical Process Section (WordPress Enterprise Block Style) */}
      <section className="py-24 md:py-48 bg-navy-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-5"></div>
        <div className="container mx-auto px-4 md:px-6">
           <div className="max-w-4xl mb-16 md:mb-24 relative">
              <div className="absolute -top-10 md:-top-12 left-0 text-[9px] md:text-[10px] font-mono text-apexRed tracking-[0.8em] uppercase opacity-40">Operational_Workflow</div>
              <h2 className="text-4xl sm:text-5xl md:text-9xl font-black text-main tracking-tighter uppercase leading-[0.85] italic mb-6 md:mb-8">Protocol <br /><span className="text-apexRed drop-shadow-[0_0_30px_rgba(166,26,26,0.3)]">Execution.</span></h2>
              <p className="text-muted text-lg md:text-2xl font-light leading-relaxed max-w-xl">Three distinct phases of unbreakable asset movement and secure handoff.</p>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
              {[
                { title: 'Initialization', icon: 'fa-fingerprint', desc: 'Every mission begins with a deep manifest sync and biometric consignor verification.' },
                { title: 'Deployment', icon: 'fa-satellite-dish', desc: 'Continuous telemetry uplink ensures your asset is monitored across every supply nexus.' },
                { title: 'Completion', icon: 'fa-shield-halved', desc: 'Secure termination protocol with signature crypto-stamping and verified handoff.' }
              ].map((step, i) => (
                <div key={i} className="relative group">
                   <div className="glass p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border-main/5 h-full transition-all duration-700 group-hover:border-apexRed/30 group-hover:-translate-y-4">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-main/5 flex items-center justify-center text-apexRed text-xl md:text-2xl mb-8 md:mb-10 group-hover:bg-apexRed group-hover:text-white transition-all shadow-hud">
                        <i className={`fa-solid ${step.icon}`}></i>
                      </div>
                      <h3 className="text-xl md:text-2xl font-black text-main uppercase tracking-tight mb-4">{step.title}</h3>
                      <p className="text-muted text-xs md:text-sm leading-relaxed font-medium">{step.desc}</p>
                   </div>
                   <div className="absolute -bottom-4 -right-4 text-6xl md:text-8xl font-black text-main/[0.01] italic select-none pointer-events-none">{i+1}</div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Strategic Capabilities Hub */}
      <section className="py-24 md:py-48 container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 md:mb-24 gap-8 md:gap-12">
          <div className="max-w-3xl">
            <h2 className="text-4xl sm:text-5xl md:text-9xl font-heading font-black text-main tracking-tighter mb-6 md:mb-8 leading-[0.85] uppercase">
              Strategic <br /><span className="text-apexRed italic opacity-90 drop-shadow-[0_0_30px_rgba(166,26,26,0.3)]">Capabilities.</span>
            </h2>
            <div className="flex items-center gap-4">
              <div className="h-[2px] w-16 md:w-24 bg-apexRed shadow-apex rounded-full"></div>
              <span className="text-[9px] md:text-[10px] font-mono text-muted tracking-[0.5em] uppercase">Protocol_v4.0</span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
             <p className="text-muted text-lg md:text-xl font-light italic max-w-sm">
               "We dont just move assets. We defend the global supply matrix through tactical logic."
             </p>
             <Link to="/services" className="text-apexRed font-black uppercase tracking-[0.3em] text-[9px] md:text-[10px] hover:gap-6 transition-all flex items-center gap-3">
               EXPLORE FULL STACK <i className="fa-solid fa-arrow-right-long"></i>
             </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {SERVICES.map((service, idx) => (
            <Link key={idx} to={`/services/${service.slug}`} className="glass p-8 md:p-10 lg:p-12 rounded-[2rem] md:rounded-[2.5rem] border-main/5 group hover:border-apexRed/50 transition-all duration-700 shadow-xl flex flex-col h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-all duration-700 -rotate-12 translate-x-4">
                 <i className={`fa-solid ${service.icon} text-6xl md:text-8xl text-main`}></i>
              </div>
              <div className="w-12 h-12 md:w-14 md:h-14 bg-main/5 rounded-xl md:rounded-2xl flex items-center justify-center text-apexRed text-lg md:text-xl mb-8 md:mb-10 group-hover:bg-apexRed group-hover:text-white transition-all">
                <i className={`fa-solid ${service.icon}`}></i>
              </div>
              <h3 className="text-lg md:text-2xl font-black text-main mb-3 md:mb-4 tracking-tighter uppercase leading-tight">{service.title}</h3>
              <p className="text-muted text-[11px] md:text-xs leading-relaxed mb-8 md:mb-10 flex-grow font-medium">
                {service.description}
              </p>
              <div className="flex items-center text-apexRed font-black uppercase tracking-[0.3em] text-[8px] group-hover:translate-x-2 transition-transform">
                VIEW SPECS <i className="fa-solid fa-chevron-right ml-2"></i>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Social Proof Field Reports (WordPress Style Testimonials) */}
      <section className="py-24 md:py-48 bg-navy-dark/50 border-y border-main/5 relative">
         <div className="absolute inset-0 bg-grid opacity-5"></div>
         <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center mb-16 md:mb-24">
               <h4 className="text-[9px] md:text-[10px] font-black text-apexRed uppercase tracking-[0.8em] md:tracking-[1em] mb-6">Verified Field Reports</h4>
               <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-apexRed to-transparent"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
               {[
                 { user: 'S. Knight', role: 'Security Ops, Global Corp', text: 'Zentriq Logistics is the only carrier we trust with Tier-1 classified assets. Their telemetry logic is years ahead.' },
                 { user: 'H. Tanaka', role: 'Logistics Director, NEXUS', text: 'The transition from standard freight to Zentriq Protocol reduced our asset loss to literal zero. Incomparable service.' },
                 { user: 'M. Dubois', role: 'COO, Euro-Defense', text: 'When mission-critical cargo needs to clear 4 continents in 48 hours with armed escort, there is no second choice.' }
               ].map((review, i) => (
                 <div key={i} className="glass p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border-main/5 flex flex-col justify-between group hover:border-apexRed/30 transition-all duration-700 hover:-translate-y-2">
                    <div className="mb-8 md:mb-12">
                       <div className="flex gap-1 mb-6 md:mb-8 opacity-40 group-hover:opacity-100 transition-opacity">
                          {[1,2,3,4,5].map(star => <i key={star} className="fa-solid fa-shield text-[8px] text-apexRed"></i>)}
                       </div>
                       <p className="text-main/70 text-lg md:text-xl font-medium italic leading-relaxed">"{review.text}"</p>
                    </div>
                    <div className="flex items-center gap-4 md:gap-6">
                       <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-apexRed/10 border border-apexRed/20 flex items-center justify-center text-apexRed group-hover:bg-apexRed group-hover:text-white transition-all">
                          <i className="fa-solid fa-user-shield text-lg md:text-xl"></i>
                       </div>
                       <div>
                          <p className="text-main font-black uppercase text-xs md:text-sm tracking-widest">{review.user}</p>
                          <p className="text-apexRed/40 text-[8px] md:text-[10px] font-black uppercase tracking-widest mt-1 group-hover:text-apexRed/80 transition-colors">{review.role}</p>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Final Tactical CTA */}
      <section className="py-24 md:py-48 container mx-auto px-4 md:px-6">
        <div className="relative rounded-[2.5rem] md:rounded-[4rem] overflow-hidden bg-navy-panel border border-main/10 p-12 md:p-32 text-center shadow-elevated-light dark:shadow-elevated-dark group">
          <div className="absolute inset-0 bg-grid opacity-10"></div>
          <div className="absolute top-0 right-0 p-16 opacity-[0.03] transition-all duration-1000 group-hover:scale-110 group-hover:rotate-12 hidden md:block">
            <i className="fa-solid fa-shield-halved text-[20rem] text-main"></i>
          </div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl md:text-9xl font-heading font-black text-main mb-8 md:mb-12 tracking-tighter leading-[0.85] italic uppercase">
              Authorize <br /><span className="text-apexRed drop-shadow-[0_0_40px_rgba(166,26,26,0.5)]">Uplink?</span>
            </h2>
            <p className="text-muted text-lg md:text-2xl mb-12 md:mb-16 font-light leading-relaxed max-w-2xl mx-auto">
               Secure your high-value assets within the world's most elite logistics infrastructure. Protocol initialization ready.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 md:gap-8">
              <Link to="/contact" className="relative overflow-hidden group/final bg-main text-navy-dark px-12 md:px-16 py-6 md:py-8 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] md:text-[12px] hover:bg-apexRed hover:text-white transition-all duration-700 shadow-2xl active:scale-95">
                <div className="absolute inset-0 bg-apexRed translate-y-full group-hover/final:translate-y-0 transition-transform duration-500"></div>
                <span className="relative z-10">Establish Protocol</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes pan {
          0% { transform: scale(1.05) translateX(0%); }
          50% { transform: scale(1.05) translateX(-2%); }
          100% { transform: scale(1.05) translateX(0%); }
        }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        @keyframes reveal {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-reveal { animation: reveal 1s var(--expo-out) forwards; }
      `}</style>
    </div>
  );
};

export default Home;