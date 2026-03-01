import React, { useState } from 'react';
import { Shipment, ShipmentStatus } from '../types';
import { getServiceIcon } from '../constants';
import { supabase } from '../lib/supabase';

interface TrackingProps {
  shipments: Shipment[];
}

const Tracking: React.FC<TrackingProps> = ({ shipments }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<Shipment | null>(null);
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = query.trim().toUpperCase();
    if (!cleanQuery) return;
    
    setIsSearching(true);
    setScanProgress(0);
    setResult(null);
    setError('');

    const interval = setInterval(() => {
      setScanProgress(prev => Math.min(prev + Math.floor(Math.random() * 20), 95));
    }, 100);
    
    try {
      const { data, error: sbError } = await supabase
        .from('shipments')
        .select(`*, updates:shipment_updates(*)`)
        .eq('trackingNumber', cleanQuery)
        .single();

      if (sbError || !data) throw new Error('NOT_FOUND');

      setScanProgress(100);
      setTimeout(() => {
        setResult(data as Shipment);
        setIsSearching(false);
        clearInterval(interval);
      }, 500);

    } catch (err: any) {
      clearInterval(interval);
      setTimeout(() => {
        setError(err.message === 'NOT_FOUND' ? 'ZENTRIQ_ERROR :: MANIFEST_NOT_FOUND' : 'ZENTRIQ_ERROR :: UPLINK_TIMEOUT');
        setIsSearching(false);
      }, 800);
    }
  };

  const getStatusColor = (status: ShipmentStatus) => {
    switch (status) {
      case ShipmentStatus.DELIVERED: return 'bg-green-500';
      case ShipmentStatus.DELAYED: return 'bg-apexRed';
      case ShipmentStatus.PENDING: return 'bg-blue-500';
      default: return 'bg-yellow-500';
    }
  };

  return (
    <div className="pt-24 md:pt-32 pb-24 md:pb-32 min-h-screen bg-navy-dark relative overflow-hidden transition-colors duration-500">
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-full h-full bg-apexRed/[0.02] animate-pulse-slow"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-5xl">
        <div className="text-center mb-12 md:mb-20 animate-reveal">
          <h1 className="text-4xl sm:text-5xl md:text-8xl font-black mb-4 md:mb-6 tracking-tighter leading-none uppercase italic text-main">
            Asset <span className="text-apexRed">Telemetry.</span>
          </h1>
          <p className="text-muted text-sm md:text-lg font-medium tracking-[0.1em] uppercase">Real-time intelligence feed for global consignments.</p>
        </div>

        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-16 md:mb-24 animate-reveal">
          <div className="relative group">
            <div className="absolute -inset-1.5 bg-apexRed/10 rounded-[2rem] md:rounded-[2.5rem] blur-lg opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
            <div className="relative bg-navy-panel p-1.5 md:p-2 rounded-[2rem] md:rounded-[2.5rem] border border-main/10 shadow-elevated-light dark:shadow-elevated-dark flex items-center overflow-hidden">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="INPUT WAYBILL NUMBER..." 
                className="flex-grow bg-transparent border-none py-4 md:py-5 px-6 md:px-8 text-main font-mono text-base md:text-xl outline-none placeholder:text-muted/30 uppercase tracking-[0.1em]"
              />
              <button 
                type="submit"
                disabled={isSearching}
                className="bg-apexRed text-white w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-apex hover:scale-105 active:scale-95 transition-all flex-shrink-0"
              >
                {isSearching ? <i className="fa-solid fa-spinner fa-spin text-lg md:text-xl"></i> : <i className="fa-solid fa-satellite-dish text-lg md:text-xl"></i>}
              </button>
            </div>
          </div>
          {isSearching && (
            <div className="mt-6 md:mt-8 px-4 md:px-8 animate-reveal">
              <div className="h-1 w-full bg-main/5 rounded-full overflow-hidden">
                <div className="h-full bg-apexRed shadow-[0_0_10px_#A61A1A] transition-all duration-300" style={{ width: `${scanProgress}%` }}></div>
              </div>
              <p className="mt-3 text-[8px] md:text-[9px] font-mono text-apexRed uppercase tracking-[0.4em] text-center animate-pulse">Establishing Secure Uplink...</p>
            </div>
          )}
          {error && <p className="mt-6 md:mt-8 text-center text-apexRed font-black uppercase tracking-[0.3em] text-[9px] md:text-[10px] animate-shake italic">{error}</p>}
        </form>

        {result && (
          <div className="space-y-8 md:space-y-10 animate-reveal">
            {/* Primary Dashboard */}
            <div className="relative bg-navy-panel rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 border-l-[8px] md:border-l-[12px] border-l-apexRed overflow-hidden shadow-elevated-light dark:shadow-elevated-dark">
              <div className="absolute top-0 right-0 p-16 opacity-[0.03] pointer-events-none translate-x-1/4 hidden md:block">
                <i className="fa-solid fa-earth-americas text-[30rem] text-main"></i>
              </div>

              <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-10 md:gap-16">
                <div className="flex-grow">
                  <p className="text-[8px] md:text-[9px] font-black text-muted uppercase tracking-[0.5em] mb-2 md:mb-3">Waybill ID</p>
                  <h2 className="text-3xl md:text-6xl font-black tracking-tighter font-mono mb-6 md:mb-10 text-main">{result.trackingNumber}</h2>
                  
                  <div className="flex items-center gap-3 bg-main/5 border border-main/10 px-5 md:px-6 py-2 rounded-full w-fit mb-8 md:mb-12">
                    <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(result.status)} animate-pulse shadow-lg`}></div>
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-main">{result.status}</span>
                  </div>

                  <div className="max-w-lg">
                    <div className="flex justify-between items-end mb-3">
                       <span className="text-[8px] md:text-[9px] font-black text-muted uppercase tracking-widest">Protocol Integrity</span>
                       <span className="text-2xl md:text-3xl font-black text-main">{result.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-main/5 rounded-full overflow-hidden mb-5">
                      <div className="h-full bg-apexRed shadow-apex transition-all duration-1000" style={{ width: `${result.progress}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-apexRed">
                      <span>ORIGIN</span>
                      <span>DESTINATION</span>
                    </div>
                  </div>
                </div>

                <div className="text-left lg:text-right flex flex-col justify-end">
                  <p className="text-[8px] md:text-[9px] font-black text-muted uppercase tracking-[0.5em] mb-2 md:mb-3">Est. Deployment</p>
                  <h3 className="text-2xl md:text-5xl font-black tracking-tighter text-main">{result.estimatedDelivery}</h3>
                  <div className="mt-4 md:mt-6 flex items-center justify-start lg:justify-end gap-2.5 text-green-500">
                    <i className="fa-solid fa-lock text-xs"></i>
                    <span className="text-[8px] font-black uppercase tracking-widest">Encrypted Transmission</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Nodes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
               {[
                 { label: 'Carrier Mass', val: result.weight, icon: 'fa-weight-hanging', color: 'text-apexRed' },
                 { label: 'Transit Modality', val: result.serviceType, icon: getServiceIcon(result.serviceType), color: 'text-blue-500' },
                 { label: 'Current Sector', val: result.currentLocation, icon: 'fa-location-crosshairs', color: 'text-yellow-600 dark:text-yellow-400' }
               ].map((stat, i) => (
                 <div key={i} className="bg-navy-panel p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-main/5 flex items-center gap-4 md:gap-6 group hover:border-main/20 transition-all shadow-md md:shadow-xl">
                    <div className={`w-12 h-12 md:w-14 md:h-14 bg-main/5 rounded-xl md:rounded-2xl flex items-center justify-center text-lg md:text-xl ${stat.color} group-hover:scale-110 transition-transform flex-shrink-0`}>
                       <i className={`fa-solid ${stat.icon}`}></i>
                    </div>
                    <div className="min-w-0">
                       <p className="text-[7px] md:text-[8px] font-black text-muted uppercase tracking-[0.3em] mb-1">{stat.label}</p>
                       <p className="text-base md:text-lg font-black uppercase tracking-tight truncate text-main">{stat.val}</p>
                    </div>
                 </div>
               ))}
            </div>

            {/* Tactical Timeline */}
            <div className="mt-16 md:mt-24">
              <h4 className="text-[9px] md:text-[10px] font-black text-apexRed uppercase tracking-[0.6em] md:tracking-[0.8em] mb-12 md:mb-16 text-center">Intel Feed Log</h4>
              
              <div className="space-y-10 md:space-y-12 max-w-3xl mx-auto">
                {result.updates && result.updates.length > 0 ? (
                  result.updates.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((update, idx) => (
                    <div key={idx} className="flex gap-4 md:gap-8 group relative">
                      <div className="relative flex-shrink-0">
                         <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center text-white relative z-10 transition-all duration-700 ${idx === 0 ? 'bg-apexRed shadow-apex scale-110' : 'bg-navy-dark border border-main/10 opacity-40'}`}>
                           <i className={`fa-solid ${idx === 0 ? 'fa-satellite-dish' : 'fa-box-open'} text-base md:text-lg`}></i>
                         </div>
                         {idx === 0 && <div className="absolute inset-0 bg-apexRed rounded-lg md:rounded-xl animate-ping opacity-20"></div>}
                         {idx !== result.updates.length - 1 && (
                           <div className="absolute left-1/2 -translate-x-1/2 top-12 md:top-16 bottom-[-40px] md:bottom-[-48px] w-[1px] bg-gradient-to-b from-main/10 to-transparent"></div>
                         )}
                      </div>

                      <div className="flex-grow pb-8 md:pb-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 gap-2 md:gap-3">
                          <div>
                            <h6 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-main mb-1">{update.location}</h6>
                            <p className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest ${idx === 0 ? 'text-blue-600 dark:text-blue-400' : 'text-muted'}`}>
                               {update.status} {idx === 0 && '// LIVE_FEED'}
                            </p>
                          </div>
                          <p className="text-[8px] md:text-[9px] font-mono text-muted uppercase tracking-widest bg-main/[0.02] px-3 py-1.5 rounded-lg border border-main/5 self-start">{update.timestamp}</p>
                        </div>
                        
                        <div className="bg-navy-dark/40 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-main/5 relative group-hover:border-apexRed/20 transition-all shadow-inner italic">
                          <p className="text-muted text-base md:text-lg font-medium leading-relaxed">
                             "{update.description}"
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 opacity-10">
                     <i className="fa-solid fa-ghost text-5xl mb-5 text-main"></i>
                     <p className="text-[10px] font-black uppercase tracking-[0.8em] text-main">NO DATA PACKETS</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
        .animate-shake { animation: shake 0.5s var(--expo-out); }
        .shadow-apex { box-shadow: 0 0 25px rgba(166, 26, 26, 0.35); }
      `}</style>
    </div>
  );
};

export default Tracking;