
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

const About: React.FC = () => {
  return (
    <div className="pt-24 md:pt-48 pb-20 bg-navy-dark transition-colors duration-500 min-h-screen relative overflow-hidden">
      {/* Tactical Background Elements */}
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-apexRed/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-24 items-center mb-20 md:mb-40 animate-fade-in-up">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-4 mb-6 md:mb-8">
              <div className="h-px w-8 md:w-12 bg-apexRed shadow-apex"></div>
              <span className="text-apexRed font-black uppercase tracking-[0.4em] text-[8px] md:text-[10px]">Establishment Authority // ZENTRIQ_CORE_INTEL</span>
            </div>
            
            <h1 className="text-4xl md:text-9xl font-heading font-black text-main mb-8 md:mb-10 leading-[0.85] tracking-tighter">
              Zentriq <br /><span className="text-apexRed italic">Protocol.</span>
            </h1>
            
            <div className="space-y-6 md:space-y-8 max-w-2xl">
              <p className="text-main/80 text-lg md:text-2xl leading-relaxed font-light">
                Zentriq Logistics Security Company was forged with a singular directive: to provide unbreakable protection for global asset movement.
              </p>
              <p className="text-main/40 text-base md:text-lg leading-relaxed font-medium border-l-2 border-apexRed/30 pl-6 md:pl-8 italic">
                We deploy elite security logic and Tier-1 response units to ensure zero-latency protection across any supply nexus. Our infrastructure is the backbone of secure global trade.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-10 mt-12 md:mt-16">
               {[
                 { val: '22+', label: 'Years Authority', icon: 'fa-timeline' },
                 { val: '$12B+', label: 'Protected Assets', icon: 'fa-shield-halved' },
                 { val: '190+', label: 'Global Sectors', icon: 'fa-earth-americas' }
               ].map((stat, i) => (
                 <div key={i} className="group">
                    <div className="flex items-center gap-3 mb-2">
                       <i className={`fa-solid ${stat.icon} text-apexRed text-[10px] opacity-50 group-hover:opacity-100 transition-opacity`}></i>
                       <h4 className="text-3xl md:text-4xl font-black text-main tracking-tighter group-hover:text-apexRed transition-colors">{stat.val}</h4>
                    </div>
                    <p className="text-main/20 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em]">{stat.label}</p>
                 </div>
               ))}
            </div>
          </div>

          <div className="lg:col-span-5 relative">
             <div className="relative group">
                {/* Tactical Frame Elements */}
                <div className="absolute -inset-4 border border-main/5 rounded-[2.5rem] md:rounded-[3rem] pointer-events-none group-hover:border-apexRed/20 transition-all duration-700"></div>
                <div className="absolute top-0 right-0 w-10 h-10 md:w-12 md:h-12 border-t-2 border-r-2 border-apexRed/40 -mr-2 -mt-2 rounded-tr-2xl md:rounded-tr-3xl"></div>
                <div className="absolute bottom-0 left-0 w-10 h-10 md:w-12 md:h-12 border-b-2 border-l-2 border-apexRed/40 -ml-2 -mb-2 rounded-bl-2xl md:rounded-bl-3xl"></div>

                {/* Main Content Image */}
                <div className="relative rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-elevated-light dark:shadow-elevated-dark border border-main/10 group-hover:shadow-apex transition-all duration-700">
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/80 via-transparent to-transparent z-10 opacity-60"></div>
                  
                  {/* Building Branding Overlay */}
                  <div className="absolute top-8 md:top-10 left-1/2 -translate-x-1/2 z-20 w-[85%] md:w-[80%] opacity-100 transition-all duration-700 transform group-hover:scale-105">
                    <div className="glass px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl border-main/20 shadow-2xl backdrop-blur-md bg-navy-dark/40 border border-main/10">
                      <Logo className="h-6 md:h-10 mx-auto" />
                    </div>
                  </div>

                  <img 
                    src="https://lh3.googleusercontent.com/d/1MgLQ761SY8Bq3uYr-DX1TzemlIPslleM" 
                    className="w-full h-[450px] md:h-[650px] object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" 
                    alt="Zentriq Elite Global Terminal" 
                  />
                  
                  {/* Digital Overlay Details */}
                  <div className="absolute bottom-8 md:bottom-10 left-8 md:left-10 z-20 animate-reveal">
                     <p className="text-white font-black text-[10px] md:text-xs tracking-widest uppercase">Protocol Access Point: G-01</p>
                     <p className="text-apexRed text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] mt-1">Classification: Secure Asset Nexus</p>
                  </div>
                </div>
             </div>

             {/* Background Floating Logo */}
             <div className="absolute -bottom-10 -right-10 w-32 h-32 md:w-48 md:h-48 opacity-[0.03] rotate-12 pointer-events-none">
                <Logo iconOnly className="w-full h-full" />
             </div>
          </div>
        </div>

        <div className="text-center mb-20 md:mb-32">
           <div className="inline-block px-6 md:px-8 py-2 md:py-3 bg-main/5 border border-main/10 rounded-full mb-8 md:mb-10">
              <h2 className="text-[9px] md:text-[10px] font-black text-main/60 uppercase tracking-[0.5em]">Operational Mandates & Directives</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                { title: 'Armored Integrity', icon: 'fa-shield-halved', desc: 'Guaranteed asset safety with physical encryption and Tier-1 escort teams deployed in every sector.' },
                { title: 'Global Intel', icon: 'fa-tower-observation', desc: 'Continuous network monitoring and threat synthesis for every transit node via encrypted satellite uplink.' },
                { title: 'Vault Logic', icon: 'fa-vault', desc: 'Zero-compromise storage infrastructure for critical enterprise assets, biometrically secured underground.' }
              ].map((val, i) => (
                <div key={i} className="glass p-8 md:p-14 rounded-[2.5rem] md:rounded-[3rem] border border-main/5 shadow-elevated-light dark:shadow-elevated-dark text-center group hover:border-apexRed/20 transition-all duration-500">
                   <div className="w-16 h-16 md:w-20 md:h-20 bg-main/5 mx-auto flex items-center justify-center rounded-2xl md:rounded-[2rem] text-apexRed text-2xl md:text-3xl mb-8 md:mb-10 group-hover:bg-apexRed group-hover:text-white group-hover:shadow-apex transition-all duration-500">
                      <i className={`fa-solid ${val.icon}`}></i>
                   </div>
                   <h3 className="text-xl md:text-2xl font-black text-main mb-4 md:mb-6 tracking-tight uppercase">{val.title}</h3>
                   <p className="text-main/40 font-medium leading-relaxed text-xs md:text-sm">{val.desc}</p>
                   
                   <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-main/5 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                      <span className="text-apexRed font-black text-[8px] md:text-[9px] uppercase tracking-widest">Protocol Active // VX-{i + 500}</span>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* New CTA Footer Section */}
        <div className="relative rounded-[2.5rem] md:rounded-[3rem] overflow-hidden bg-main/5 border border-main/10 p-10 md:p-24 text-center group shadow-elevated-light dark:shadow-elevated-dark">
          <div className="absolute inset-0 bg-grid opacity-5"></div>
          <div className="relative z-10">
             <h2 className="text-3xl md:text-6xl font-heading font-black text-main mb-6 md:mb-8 tracking-tighter">Ready to <span className="text-apexRed italic">Secure?</span></h2>
             <p className="text-main/40 text-base md:text-lg mb-10 md:mb-12 max-w-2xl mx-auto font-light leading-relaxed">Join the global network of high-integrity enterprises protected by Zentriq Protocol.</p>
             <Link 
               to="/contact"
               className="inline-block bg-apexRed text-white px-10 md:px-12 py-5 md:py-6 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs hover:scale-105 transition-all shadow-apex"
             >
               Initiate Direct Link
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
