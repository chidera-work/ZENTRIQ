
import React, { useState } from 'react';
import Logo from '../components/Logo';

const Contact: React.FC = () => {
  const [status, setStatus] = useState<'IDLE' | 'TRANSMITTING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    protocol: 'Air Freight Intelligence',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('TRANSMITTING');
    
    try {
      const response = await fetch('https://formspree.io/f/xojnaqpa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus('SUCCESS');
        setFormData({
          name: '',
          email: '',
          phone: '',
          protocol: 'Air Freight Intelligence',
          message: ''
        });
      } else {
        throw new Error('UPLINK_FAILURE');
      }
    } catch (error) {
      console.error('Transmission Error:', error);
      setStatus('ERROR');
      setTimeout(() => setStatus('IDLE'), 3000);
    }
  };

  return (
    <div className="pt-32 md:pt-40 pb-20 max-w-7xl mx-auto px-4 md:px-6 bg-navy-dark transition-colors duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">
        <div className="animate-fade-in-up">
          <div className="inline-block text-apexRed font-black uppercase tracking-[0.3em] text-[9px] md:text-[10px] mb-6 md:mb-8">Secure Communication Channel</div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-heading font-black text-main mb-8 md:mb-10 tracking-tighter leading-[0.9]">
            Authorize <br /><span className="text-apexRed italic">Direct Link.</span>
          </h1>
          <p className="text-muted text-lg md:text-xl font-light mb-12 md:mb-16 leading-relaxed max-w-xl">
            Our strategic command team is standing by to architect your global security requirements. Mission-critical response is our standard protocol.
          </p>

          <div className="relative mb-12 md:mb-16 group">
            <div className="absolute -inset-4 border border-main/5 rounded-[2rem] md:rounded-[3rem] pointer-events-none group-hover:border-apexRed/20 transition-all duration-700"></div>
            
            <div className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-elevated-light dark:shadow-elevated-dark border border-main/10 group-hover:shadow-apex transition-all duration-700 aspect-[4/3] sm:aspect-video lg:aspect-square xl:aspect-video">
              <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-transparent to-transparent z-10 opacity-70"></div>
              
              <div className="absolute top-6 md:top-8 left-6 md:left-8 z-20">
                 <div className="glass px-4 md:px-5 py-2 md:py-3 rounded-xl border-main/20 shadow-2xl flex items-center gap-2 md:gap-3 backdrop-blur-md">
                    <Logo iconOnly className="h-5 md:h-6" />
                    <span className="text-main font-black text-[9px] md:text-[10px] uppercase tracking-widest">Official Liaison</span>
                 </div>
              </div>

              <img 
                src="https://lh3.googleusercontent.com/d/1Ftnfkk-pxwR0vuRXVAWuVY4w_SF6nDXx" 
                className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" 
                alt="Zentriq Security Field Agent" 
              />
              
              <div className="absolute bottom-6 md:bottom-8 right-6 md:right-8 z-20 text-right animate-reveal">
                 <p className="text-white font-black text-[9px] md:text-[10px] uppercase tracking-[0.4em]">Agent ID: 88-ALPHA</p>
                 <div className="flex items-center justify-end gap-2 mt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    <p className="text-green-500 text-[8px] font-black uppercase tracking-widest">Uplink: Live</p>
                 </div>
              </div>
            </div>
          </div>

          <div className="space-y-8 md:space-y-10 mb-12 md:mb-16">
            <div className="flex items-start gap-6 md:gap-8 group">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-main/5 flex items-center justify-center rounded-2xl md:rounded-[1.5rem] text-apexRed text-xl md:text-2xl transition-all group-hover:bg-apexRed group-hover:text-white shadow-premium">
                <i className="fa-solid fa-envelope"></i>
              </div>
              <div>
                <h4 className="text-main font-black text-lg md:text-xl mb-1 tracking-tight">Digital Command Nexus</h4>
                <p className="text-muted text-xs md:text-sm font-medium">Direct tactical uplink for all mission inquiries.</p>
                <a href="mailto:support@zentriq.com" className="text-apexRed font-black mt-2 tracking-widest text-xs md:text-sm hover:underline">support@zentriq.com</a>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-40">
          <div className="glass p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] shadow-elevated-light dark:shadow-elevated-dark border border-main/10 animate-fade-in-up relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
              <Logo iconOnly className="h-64" />
            </div>
            
            {status === 'SUCCESS' ? (
              <div className="relative z-10 py-16 md:py-24 text-center animate-reveal">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 md:mb-10 border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                  <i className="fa-solid fa-check-double text-3xl md:text-4xl text-green-500"></i>
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-main mb-4 md:mb-6 tracking-tighter">Dispatch Successful</h3>
                <p className="text-muted text-base md:text-lg font-medium max-w-sm mx-auto mb-10 md:mb-12">
                  Your mission parameters have been encrypted and routed to Command HQ via Formspree Uplink. A tactical liaison will establish contact shortly.
                </p>
                <button 
                  onClick={() => setStatus('IDLE')}
                  className="bg-main/5 text-muted px-8 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[10px] hover:bg-main/10 transition-all border border-main/10"
                >
                  Return to Interface
                </button>
              </div>
            ) : status === 'ERROR' ? (
              <div className="relative z-10 py-16 md:py-24 text-center animate-shake">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-apexRed/10 rounded-full flex items-center justify-center mx-auto mb-8 md:mb-10 border border-apexRed/30 shadow-apex">
                  <i className="fa-solid fa-triangle-exclamation text-3xl md:text-4xl text-apexRed"></i>
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-main mb-4 md:mb-6 tracking-tighter uppercase">Uplink Failed</h3>
                <p className="text-muted text-base md:text-lg font-medium max-w-sm mx-auto mb-10 md:mb-12 uppercase tracking-widest">
                  Transmission protocol disrupted. Please check your network connection and retry.
                </p>
                <button 
                  onClick={() => setStatus('IDLE')}
                  className="bg-apexRed text-white px-8 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[10px] shadow-apex transition-all"
                >
                  Restart Protocol
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl md:text-3xl font-black text-main mb-8 md:mb-12 tracking-tighter">Secure Data Transmission</h3>
                <form className="space-y-6 md:space-y-8 relative z-10" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-2 md:space-y-3">
                      <label className="text-muted text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] ml-2">Full Identity</label>
                      <input 
                        required
                        name="name"
                        type="text" 
                        placeholder="Authorized Personnel" 
                        className="w-full bg-navy-dark border-2 border-main/5 rounded-xl md:rounded-[1.5rem] px-6 md:px-8 py-4 md:py-5 text-main focus:border-apexRed outline-none transition-all font-bold placeholder:opacity-30 text-sm md:text-base"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2 md:space-y-3">
                      <label className="text-muted text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] ml-2">Digital Link (Email)</label>
                      <input 
                        required
                        name="email"
                        type="email" 
                        placeholder="agent@company.nexus" 
                        className="w-full bg-navy-dark border-2 border-main/5 rounded-xl md:rounded-[1.5rem] px-6 md:px-8 py-4 md:py-5 text-main focus:border-apexRed outline-none transition-all font-bold placeholder:opacity-30 text-sm md:text-base" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-2 md:space-y-3">
                      <label className="text-muted text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] ml-2">Comms Frequency (Phone)</label>
                      <div className="relative">
                        <i className="fa-solid fa-phone-volume absolute left-6 top-1/2 -translate-y-1/2 text-main/10"></i>
                        <input 
                          required
                          name="phone"
                          type="tel" 
                          placeholder="+X (XXX) XXX-XXXX" 
                          className="w-full bg-navy-dark border-2 border-main/5 rounded-xl md:rounded-[1.5rem] pl-14 pr-6 md:pr-8 py-4 md:py-5 text-main focus:border-apexRed outline-none transition-all font-bold placeholder:opacity-30 text-sm md:text-base" 
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2 md:space-y-3">
                      <label className="text-muted text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] ml-2">Protocol Selection</label>
                      <select 
                        name="protocol"
                        className="w-full bg-navy-dark border-2 border-main/5 rounded-xl md:rounded-[1.5rem] px-6 md:px-8 py-4 md:py-5 text-main focus:border-apexRed outline-none transition-all appearance-none font-bold text-sm md:text-base"
                        value={formData.protocol}
                        onChange={(e) => setFormData({...formData, protocol: e.target.value})}
                      >
                        <option>Air Freight Intelligence</option>
                        <option>Ocean Cargo Operations</option>
                        <option>Ground Logistics Protocol</option>
                        <option>Warehousing Infrastructure</option>
                        <option>Ghost Protocol (Sensitive)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2 md:space-y-3">
                    <label className="text-muted text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] ml-2">Mission Parameters</label>
                    <textarea 
                      required
                      name="message"
                      rows={4} 
                      placeholder="Detail your operational requirements..." 
                      className="w-full bg-navy-dark border-2 border-main/5 rounded-[1.5rem] md:rounded-[2rem] px-6 md:px-8 py-4 md:py-5 text-main focus:border-apexRed outline-none transition-all resize-none font-bold placeholder:opacity-30 text-sm md:text-base"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                  </div>
                  <button 
                    disabled={status !== 'IDLE'}
                    className={`w-full ${status === 'TRANSMITTING' ? 'bg-main/10' : 'bg-apexRed'} text-white py-5 md:py-6 rounded-[2rem] md:rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-[10px] md:text-xs hover:scale-105 transition-all shadow-apex mt-4 flex items-center justify-center gap-4`}
                  >
                    {status === 'TRANSMITTING' ? (
                      <>
                        <i className="fa-solid fa-circle-notch fa-spin"></i>
                        Encrypting Dispatch...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-paper-plane"></i>
                        Authorize Submission
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
