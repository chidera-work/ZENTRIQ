
import React, { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { SERVICES } from '../constants';
import Logo from '../components/Logo';

const ServiceDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = SERVICES.find(s => s.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!service) {
    return <Navigate to="/services" />;
  }

  return (
    <div className="pt-24 md:pt-40 pb-20 bg-navy-dark min-h-screen relative overflow-hidden">
      {/* Blueprint Grid Background */}
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <Link to="/services" className="inline-flex items-center gap-4 text-muted hover:text-apexRed transition-all uppercase font-black tracking-widest text-[9px] md:text-[10px] mb-8 md:mb-12 group">
          <i className="fa-solid fa-arrow-left group-hover:-translate-x-2 transition-transform"></i>
          Return to Matrix
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-24 items-start">
          
          {/* Main Content Column */}
          <div className="lg:col-span-7 animate-reveal">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 md:gap-8 mb-8 md:mb-12">
               <div className="w-16 h-16 md:w-20 md:h-20 bg-apexRed rounded-2xl flex items-center justify-center text-white shadow-apex shrink-0">
                 <i className={`fa-solid ${service.icon} text-2xl md:text-3xl`}></i>
               </div>
               <div>
                 <span className="text-apexRed font-black uppercase tracking-[0.4em] text-[8px] md:text-[9px]">Technical Specification // ZENTRIQ-{service.slug.toUpperCase()}</span>
                 <h1 className="text-4xl md:text-8xl font-heading font-black text-main tracking-tighter leading-none mt-2">
                   {service.title.split(' ')[0]} <br />
                   <span className="text-apexRed italic">{service.title.split(' ').slice(1).join(' ')}</span>
                 </h1>
               </div>
            </div>

            <p className="text-muted text-lg md:text-2xl font-light leading-relaxed mb-12 md:mb-16 max-w-2xl border-l-4 border-apexRed/20 pl-6 md:pl-10 italic">
              "{service.description} Engineered for zero-compromise asset delivery within global supply nexus vectors."
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16">
               {service.features?.map((feat, idx) => (
                 <div key={idx} className="glass p-6 md:p-8 rounded-3xl border-main/5 group hover:border-apexRed/30 transition-all shadow-elevated-light dark:shadow-elevated-dark">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-main/5 rounded-xl flex items-center justify-center text-apexRed mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                      <i className={`fa-solid ${feat.icon} text-base md:text-lg`}></i>
                    </div>
                    <h4 className="text-main font-black text-base md:text-lg mb-2 tracking-tight uppercase">{feat.text}</h4>
                    <p className="text-muted text-[9px] md:text-[10px] font-medium uppercase tracking-widest">Protocol ID: VX-{idx + 100}</p>
                 </div>
               ))}
            </div>

            <div className="glass p-8 md:p-12 rounded-[2.5rem] md:rounded-[3rem] border-main/5 bg-navy-panel/20 relative overflow-hidden shadow-elevated-light dark:shadow-elevated-dark">
               <div className="absolute top-0 right-0 p-10 opacity-[0.03] rotate-12 pointer-events-none">
                 <Logo iconOnly className="h-48 md:h-64" />
               </div>
               <h3 className="text-xl md:text-2xl font-black text-main mb-6 md:mb-8 tracking-tighter flex items-center gap-4">
                 <i className="fa-solid fa-list-check text-apexRed opacity-40"></i>
                 Operational Directive
               </h3>
               <p className="text-muted text-xs md:text-sm leading-relaxed mb-8 relative z-10">
                 All deployments under the {service.title} protocol are managed by our Global Command Center. Every node in the transit chain is verified against the SHA-256 integrity matrix before asset release.
               </p>
               <Link to="/contact" className="inline-flex bg-apexRed text-white px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[10px] shadow-apex hover:scale-105 active:scale-95 transition-all">
                  Initiate Secure Quote
               </Link>
            </div>
          </div>

          {/* Technical Specs Sidebar */}
          <div className="lg:col-span-5 animate-reveal delay-300">
             <div className="glass rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-14 border-main/10 shadow-elevated-light dark:shadow-elevated-dark lg:sticky lg:top-40 bg-navy-dark/60">
                <div className="flex items-center justify-between mb-8 md:mb-12 border-b border-main/5 pb-6 md:pb-8">
                   <h2 className="text-xl md:text-2xl font-black text-main tracking-tighter uppercase">Tactical Specs</h2>
                   <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      <span className="text-[8px] md:text-[9px] font-black text-green-500 uppercase tracking-widest">Verified</span>
                   </div>
                </div>

                <div className="space-y-8 md:space-y-10">
                   {Object.entries(service.technicalSpecs).map(([key, val], i) => (
                     <div key={i} className="flex flex-col gap-1 md:gap-2">
                        <span className="text-muted text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em]">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <div className="flex items-baseline justify-between group">
                           <span className="text-lg md:text-xl font-mono font-black text-main group-hover:text-apexRed transition-colors uppercase tracking-tight">{val as string}</span>
                           <div className="flex-grow mx-3 md:mx-4 h-px bg-main/5 group-hover:bg-apexRed/20 transition-all"></div>
                           <i className="fa-solid fa-microchip text-[9px] md:text-[10px] text-main/10 group-hover:text-apexRed/40"></i>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="mt-12 md:mt-16 pt-8 md:pt-10 border-t border-main/5">
                   <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-main/5 flex items-center justify-center text-apexRed">
                         <i className="fa-solid fa-shield-virus"></i>
                      </div>
                      <div>
                         <p className="text-main font-black text-xs uppercase tracking-tight">Encryption Active</p>
                         <p className="text-muted text-[8px] md:text-[9px] font-bold uppercase">End-to-End Integrity</p>
                      </div>
                   </div>
                   <div className="h-2 w-full bg-navy-dark rounded-full overflow-hidden">
                      <div className="h-full bg-apexRed w-[92%] animate-[scan_2s_linear_infinite]"></div>
                   </div>
                </div>
             </div>

             <div className="mt-8 glass p-6 md:p-8 rounded-[2rem] border-main/5 text-center shadow-elevated-light dark:shadow-elevated-dark">
                <p className="text-muted text-[7px] md:text-[8px] font-black uppercase tracking-[0.5em] mb-4 leading-relaxed">
                   Authorized Document // ZENTRIQ GLOBAL SECURITY NETWORK <br />
                   UUID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                </p>
                <div className="flex justify-center gap-4 opacity-20 text-main">
                   <i className="fa-solid fa-barcode text-3xl md:text-4xl"></i>
                   <i className="fa-solid fa-qrcode text-3xl md:text-4xl"></i>
                </div>
             </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
};

export default ServiceDetail;
