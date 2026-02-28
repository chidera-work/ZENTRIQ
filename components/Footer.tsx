import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-ghost dark:bg-navy-light/30 pt-24 pb-12 border-t border-navy/5 dark:border-white/5 transition-colors duration-500">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Logo className="h-12 md:h-16 w-auto mb-10" />
            <p className="text-slate dark:text-slate/40 text-sm leading-relaxed mb-10 font-medium italic border-l-2 border-apexRed/20 pl-6">
              Architecting global security through precision-engineered logistics and real-time intelligence protocols.
            </p>
            <div className="flex gap-4">
              {['linkedin', 'twitter', 'instagram'].map(s => (
                <Link key={s} to="/" className="w-11 h-11 bg-white dark:bg-navy-dark border border-navy/10 dark:border-white/10 rounded-xl flex items-center justify-center text-slate hover:text-apexRed dark:hover:text-apexRed transition-all shadow-premium hover:scale-110">
                  <i className={`fa-brands fa-${s}`}></i>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-navy dark:text-white font-black mb-8 uppercase text-[10px] tracking-[0.3em]">Protocol</h4>
            <ul className="space-y-4 text-slate dark:text-slate/50 text-xs font-bold uppercase tracking-widest">
              <li><Link to="/services" className="hover:text-apexRed transition-colors">Services</Link></li>
              <li><Link to="/track" className="hover:text-apexRed transition-colors">Tracking Hub</Link></li>
              <li><Link to="/about" className="hover:text-apexRed transition-colors">Authority</Link></li>
              <li><Link to="/admin" className="hover:text-apexRed transition-colors">Admin Terminal</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-navy dark:text-white font-black mb-8 uppercase text-[10px] tracking-[0.3em]">Systems</h4>
            <ul className="space-y-4 text-slate dark:text-slate/50 text-xs font-bold uppercase tracking-widest">
              <li><Link to="/faq" className="hover:text-apexRed transition-colors">Intelligence FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-apexRed transition-colors">Direct Link</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-navy dark:text-white font-black mb-8 uppercase text-[10px] tracking-[0.3em]">Nexus</h4>
            <ul className="space-y-4 text-slate dark:text-slate/50 text-sm font-medium">
              <li className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-apexRed/10 flex items-center justify-center text-apexRed">
                  <i className="fa-solid fa-envelope text-xs"></i>
                </div>
                <a href="mailto:support@zentriq.com" className="hover:text-apexRed transition-colors">support@zentriq.com</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-12 border-t border-navy/5 dark:border-white/5 flex flex-col md:flex-row justify-between items-center text-slate dark:text-slate/60 text-[10px] font-black uppercase tracking-[0.2em]">
          <p>© 2026 ZENTRIQ LOGISTICS SECURITY COMPANY. ENCRYPTED NETWORK.</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <span className="hover:text-apexRed cursor-pointer transition-colors">Security</span>
            <span className="hover:text-apexRed cursor-pointer transition-colors">Encryption Docs</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;