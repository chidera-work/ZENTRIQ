import React from 'react';

interface LogoProps {
  className?: string;
  hideText?: boolean;
  iconOnly?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "h-10 md:h-12", hideText = false, iconOnly = false }) => {
  const logoSrc = "https://lh3.googleusercontent.com/d/1mp3165kMMH_LnTLGyTonDHcV-UB7VsXo";

  return (
    <div className={`flex items-center gap-4 md:gap-6 select-none group transition-all duration-700 ${className}`}>
      {/* TACTICAL ICON SHIELD CONTAINER */}
      <div className="relative h-full aspect-square flex items-center justify-center">
        {/* Outer HUD Rings */}
        <div className="absolute inset-[-20%] border border-dashed border-apexRed/10 rounded-full animate-[spin_40s_linear_infinite] opacity-20 group-hover:opacity-40 transition-opacity"></div>
        <div className="absolute inset-[-10%] border border-apexRed/5 rounded-full animate-[spin_20s_linear_infinite_reverse] opacity-10 group-hover:opacity-30 transition-opacity"></div>
        
        {/* Targeting Corners - More defined */}
        <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-apexRed/60 transition-all group-hover:scale-125 group-hover:-translate-x-1 group-hover:-translate-y-1"></div>
        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-apexRed/60 transition-all group-hover:scale-125 group-hover:translate-x-1 group-hover:translate-y-1"></div>
        
        {/* Advanced Glow Layer */}
        <div className="absolute inset-0 bg-apexRed/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1000 scale-150"></div>
        <div className="absolute inset-0 bg-white/10 blur-sm rounded-full opacity-0 group-hover:opacity-50 transition-all duration-500"></div>

        {/* The Shield Asset */}
        <div className="relative z-10 h-full w-full flex items-center justify-center animate-[float_5s_ease-in-out_infinite] overflow-hidden rounded-full">
          <img 
            src={logoSrc} 
            alt="Zentriq Logistics Shield" 
            className="h-[90%] w-auto object-contain drop-shadow-[0_0_10px_rgba(166,26,26,0.4)] group-hover:drop-shadow-[0_0_25px_rgba(166,26,26,0.7)] group-hover:scale-110 transition-all duration-700 brightness-110 group-hover:brightness-125"
            onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
          />
          {/* Icon Scanline */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent h-1/2 w-full -translate-y-full group-hover:animate-[scan_1.5s_linear_infinite] pointer-events-none opacity-0 group-hover:opacity-100"></div>
        </div>
      </div>
      
      {!hideText && !iconOnly && (
        <div className="flex flex-col justify-center leading-none">
          <div className="relative">
             <div className="flex items-baseline gap-1">
               <span className="text-main font-black text-2xl md:text-4xl lg:text-5xl tracking-[-0.05em] uppercase font-heading italic group-hover:text-apexRed transition-all duration-500 block relative z-10 group-hover:skew-x-[-2deg] group-hover:scale-[1.02] group-hover:animate-[glitch_0.3s_ease-in-out_infinite]">
                 ZENTRIQ
               </span>
               <span className="text-apexRed font-black text-[8px] md:text-[10px] tracking-[0.5em] uppercase opacity-40 group-hover:opacity-100 transition-all duration-700 mb-1">
                 CORE
               </span>
             </div>
             
             {/* HUD Scanline Effect on Text */}
             <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity">
               <div className="w-full h-[1px] bg-white animate-[scan_2s_linear_infinite]"></div>
             </div>
          </div>
          
          <div className="flex items-center gap-3 mt-1">
            <div className="h-[1px] flex-grow bg-gradient-to-r from-apexRed/60 to-transparent"></div>
            <span className="text-apexRed font-black text-[10px] md:text-xs lg:text-sm tracking-[0.4em] uppercase font-heading group-hover:text-white group-hover:tracking-[0.5em] transition-all duration-700 whitespace-nowrap">
              LOGISTICS
            </span>
            <div className="flex gap-1">
              <div className="h-1 w-1 rounded-full bg-apexRed animate-pulse shadow-[0_0_8px_rgba(166,26,26,0.8)]"></div>
              <div className="h-1 w-1 rounded-full bg-green-500 animate-pulse delay-75 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(1deg); }
        }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
      `}</style>
    </div>
  );
};

export default Logo;