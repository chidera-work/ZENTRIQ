
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

const Trucking: React.FC = () => {
  return (
    <div className="pt-24 pb-20 bg-navy-dark transition-colors duration-500 min-h-screen relative overflow-hidden">
      {/* Tactical Background Elements */}
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        {/* Hero Section with Branded Fleet Overlay */}
        <div className="relative rounded-[2.5rem] md:rounded-[4rem] overflow-hidden min-h-[500px] md:min-h-[600px] flex items-center mb-20 md:mb-32 shadow-elevated-light dark:shadow-elevated-dark group">
           {/* Main Hero Image */}
           <img 
             src="https://lh3.googleusercontent.com/d/1sItrXuiw9rxhr3c_80kC5BuSk9NxMtnh" 
             className="absolute inset-0 w-full h-full object-cover brightness-50 dark:brightness-[0.4] group-hover:scale-110 transition-transform duration-[10s]" 
             alt="Zentriq Armored Fleet" 
           />
           
           {/* Fleet Branded Decal Overlay */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 pointer-events-none group-hover:opacity-70 transition-opacity duration-1000">
              <div className="flex flex-col items-center">
                 <div className="p-6 md:p-10 glass rounded-[2rem] md:rounded-[3rem] border-white/20 backdrop-blur-sm scale-75 md:scale-100">
                    <Logo iconOnly className="h-24 md:h-56 drop-shadow-2xl" />
                 </div>
                 <h2 className="text-white font-black text-xl md:text-5xl tracking-tighter uppercase mt-4 md:mt-8 drop-shadow-lg text-center">ZENTRIQ LOGISTICS FLEET</h2>
                 <p className="text-apexRed font-black text-[8px] md:text-xs tracking-[0.6em] uppercase mt-2">Mobile Defense Unit // Active</p>
              </div>
           </div>

           <div className="absolute inset-0 bg-gradient-to-r from-navy-dark via-transparent to-transparent opacity-80"></div>
           <div className="relative z-10 px-8 md:px-24 max-w-3xl animate-fade-in-up">
              <div className="inline-block text-apexRed font-black uppercase tracking-[0.3em] text-[8px] md:text-[10px] mb-6 md:mb-8 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-apexRed animate-pulse"></span>
                Ground Logistics Division
              </div>
              <h1 className="text-4xl md:text-8xl font-heading font-black text-white mb-6 md:mb-8 leading-[0.9] tracking-tighter">Armored <br /><span className="text-apexRed italic">Haulage.</span></h1>
              <p className="text-white/60 text-lg md:text-xl leading-relaxed font-light mb-10 md:mb-12">
                Our high-performance armored fleet deploys advanced telematics and route-synthesis to provide unbreakable ground logistics infrastructure for high-value assets.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/track" className="bg-apexRed text-white px-8 py-4 md:py-5 rounded-xl font-black uppercase tracking-widest text-[9px] md:text-[10px] shadow-apex hover:scale-105 transition-all text-center">
                  Track Fleet Unit
                </Link>
                <Link to="/contact" className="glass text-white px-8 py-4 md:py-5 rounded-xl font-black uppercase tracking-widest text-[9px] md:text-[10px] border border-white/10 hover:bg-white/5 transition-all text-center">
                  Request Armored Escort
                </Link>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 mb-20 md:mb-40">
           {[
             { title: 'Secure FTL Protocol', icon: 'fa-truck-field', desc: 'Exclusive armored payload capacity for high-volume enterprise transit requirements.' },
             { title: 'Protected LTL Matrix', icon: 'fa-truck-moving', desc: 'Consolidated secure payload scaling for optimized cost-efficiency in sub-capacity loads.' },
             { title: 'Thermal-Transit', icon: 'fa-snowflake', desc: 'High-fidelity climate control for pharmaceutical and sensitive biological payloads within secure chassis.' }
           ].map((t, i) => (
             <div key={i} className="glass p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] border border-main/5 transition-all duration-500 shadow-elevated-light dark:shadow-elevated-dark group">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-main/5 flex items-center justify-center rounded-2xl md:rounded-[2rem] text-apexRed text-2xl md:text-3xl mb-8 md:mb-10 group-hover:bg-apexRed group-hover:text-white transition-all shadow-elevated-light dark:shadow-elevated-dark">
                  <i className={`fa-solid ${t.icon}`}></i>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-main mb-4 md:mb-6 tracking-tight uppercase">{t.title}</h3>
                <p className="text-muted text-xs md:text-sm font-medium leading-relaxed">{t.desc}</p>
                <Link to="/contact" className="inline-block mt-6 md:mt-8 text-apexRed font-black text-[8px] md:text-[9px] uppercase tracking-widest hover:gap-4 transition-all">
                  Inquire Protocol <i className="fa-solid fa-arrow-right ml-2"></i>
                </Link>
             </div>
           ))}
        </div>

        {/* Updated Section Without Image */}
        <div className="glass p-10 md:p-24 rounded-[2.5rem] md:rounded-[4rem] shadow-elevated-light dark:shadow-elevated-dark border border-main/5 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
              <Logo iconOnly className="h-[300px] md:h-[400px]" />
           </div>
           
           <div className="max-w-4xl mx-auto relative z-10 text-center">
              <h2 className="text-3xl md:text-7xl font-black text-main mb-8 md:mb-10 tracking-tighter leading-none italic uppercase">Network <span className="text-apexRed">Intelligence.</span></h2>
              <p className="text-muted mb-12 md:mb-16 leading-relaxed text-lg md:text-xl font-light">
                Every unit in the Zentriq Logistics fleet is equipped with advanced sensor arrays monitoring vector data, braking patterns, and atmospheric integrity. Our command hub maintains a 24/7 kinetic uplink to ensure total mission success.
              </p>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                 {[
                   { label: '24/7 Command Center', icon: 'fa-headset' },
                   { label: 'Real-time GPS Stream', icon: 'fa-satellite' },
                   { label: 'ELD Cloud Sync', icon: 'fa-cloud-arrow-up' },
                   { label: 'Tier-1 Armed Escorts', icon: 'fa-user-shield' }
                 ].map((point, i) => (
                   <div key={i} className="flex flex-col items-center gap-4 bg-main/5 p-6 md:p-8 rounded-2xl md:rounded-[2rem] border border-main/5 hover:border-apexRed/20 transition-all group">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-apexRed/10 flex items-center justify-center text-apexRed group-hover:bg-apexRed group-hover:text-white transition-all shadow-inner">
                        <i className={`fa-solid ${point.icon}`}></i>
                      </div>
                      <span className="text-main font-black text-[8px] md:text-[9px] uppercase tracking-widest leading-tight">{point.label}</span>
                   </div>
                 ))}
              </div>

              <div className="mt-16 md:mt-20">
                 <Link 
                   to="/contact" 
                   className="inline-block bg-apexRed text-white px-10 md:px-12 py-5 md:py-6 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-xs shadow-apex hover:scale-105 transition-all"
                 >
                   Establish Direct Command Link
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Trucking;
