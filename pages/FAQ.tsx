
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    { q: "How do I track my active consignment?", a: "Access the 'Track Telemetry' portal using your unique Protocol ID. This ID provides a direct telemetry link to our global security monitoring network." },
    { q: "What sectors of the globe do you cover?", a: "Our infrastructure spans over 190 countries, with elite security hubs operating in New York, London, Singapore, and Dubai." },
    { q: "Are you equipped for sensitive asset transport?", a: "Yes, our Secure Protocol division manages HazMat, pharmaceutical-grade refrigeration, and high-value asset protection with specialized armored fleet encryption." },
    { q: "What is the expected latency for Secure Air Freight?", a: "Global express air transit typically resolves within 2-5 business days, including priority security clearance and armored transfer." },
    { q: "Do you provide off-grid vaulting?", a: "Zentriq Logistics offers high-security, biometrically encrypted vaulting and fulfillment infrastructure across all major global transit sectors." }
  ];

  return (
    <div className="pt-24 md:pt-40 pb-20 bg-navy-dark transition-colors duration-500 min-h-screen relative overflow-hidden">
      {/* Tactical Background Elements */}
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16 md:mb-24 animate-fade-in-up">
          <div className="inline-block text-apexRed font-black uppercase tracking-[0.3em] text-[8px] md:text-[10px] mb-4 md:mb-6">Intelligence Repository</div>
          <h1 className="text-4xl md:text-7xl font-heading font-black text-main mb-6 md:mb-8 tracking-tighter leading-[0.9]">
            System <span className="text-apexRed italic">Intelligence.</span>
          </h1>
          <p className="text-muted text-lg md:text-xl font-light max-w-2xl mx-auto">Access the comprehensive knowledge base for global security and logistics protocols.</p>
        </div>

        <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto animate-fade-in-up">
          {faqs.map((faq, idx) => (
            <div key={idx} className={`glass rounded-3xl md:rounded-[2rem] overflow-hidden border border-main/5 transition-all duration-500 shadow-elevated-light dark:shadow-elevated-dark ${openIdx === idx ? 'border-apexRed/20' : ''}`}>
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className={`w-full px-6 md:px-10 py-6 md:py-8 flex justify-between items-center text-left transition-colors ${openIdx === idx ? 'bg-main/5' : 'hover:bg-main/5'}`}
              >
                <span className={`font-black text-lg md:text-xl tracking-tight transition-colors ${openIdx === idx ? 'text-apexRed' : 'text-main'}`}>{faq.q}</span>
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-500 shrink-0 ml-4 ${openIdx === idx ? 'bg-apexRed text-white rotate-180' : 'bg-main/10 text-muted'}`}>
                  <i className="fa-solid fa-chevron-down text-[10px] md:text-xs"></i>
                </div>
              </button>
              <div className={`px-6 md:px-10 overflow-hidden transition-all duration-500 ease-in-out ${openIdx === idx ? 'max-h-[500px] pb-8 md:pb-10 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="pt-4 md:pt-6 border-t border-main/5">
                  <p className="text-muted text-base md:text-lg leading-relaxed font-medium italic">"{faq.a}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 md:mt-32 glass p-10 md:p-24 rounded-[2.5rem] md:rounded-[4rem] text-center shadow-elevated-light dark:shadow-elevated-dark border border-main/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] rotate-12 pointer-events-none">
             <i className="fa-solid fa-headset text-[15rem] text-main"></i>
          </div>
          <h3 className="text-3xl md:text-4xl font-black text-main mb-4 md:mb-6 tracking-tighter">Direct Nexus Support</h3>
          <p className="text-muted text-lg md:text-xl mb-10 md:mb-12 font-light max-w-xl mx-auto leading-relaxed">Our strategic command team is available 24/7 for mission-critical inquiries.</p>
          <Link 
            to="/contact"
            className="inline-block bg-apexRed text-white px-10 md:px-16 py-5 md:py-6 rounded-xl md:rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-[10px] md:text-xs hover:scale-105 transition-all shadow-apex"
          >
            Establish Priority Connection
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
