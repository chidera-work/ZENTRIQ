import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { ALL_LANGUAGES } from '../lib/languages';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLangNexus, setShowLangNexus] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLang, setCurrentLang] = useState('English');
  const [isTranslating, setIsTranslating] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  const location = useLocation();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const navLinks = [
    { name: 'Home', path: '/', icon: 'fa-house-chimney' },
    { name: 'Services', path: '/services', icon: 'fa-layer-group' },
    { name: 'About', path: '/about', icon: 'fa-shield-halved' },
    { name: 'Trucking', path: '/trucking', icon: 'fa-truck-shield' },
    { name: 'FAQ', path: '/faq', icon: 'fa-circle-question' },
    { name: 'Contact', path: '/contact', icon: 'fa-envelope' },
  ];

  const allLanguages = ALL_LANGUAGES.sort((a, b) => a.name.localeCompare(b.name));

  const filteredLanguages = allLanguages.filter(lang => 
    lang.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const savedTheme = localStorage.getItem('zentriq_theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme('dark');
    }

    const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
    if (match) {
      const lang = allLanguages.find(l => l.code === match[1]);
      if (lang) setCurrentLang(lang.name);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('zentriq_theme', newTheme);
    
    const root = window.document.documentElement;
    if (newTheme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
  };

  const changeLanguage = (lang: {name: string, code: string}) => {
    setIsTranslating(true);
    setCurrentLang(lang.name);
    
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `googtrans=/en/${lang.code}; expires=${expires.toUTCString()}; path=/;`;
    document.cookie = `googtrans=/en/${lang.code}; expires=${expires.toUTCString()}; path=/; domain=${window.location.hostname};`;

    setTimeout(() => {
      const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (combo) {
        combo.value = lang.code;
        combo.dispatchEvent(new Event('change', { bubbles: true }));
        setTimeout(() => {
          setIsTranslating(false);
          setShowLangNexus(false);
        }, 1000);
      } else {
        window.location.reload();
      }
    }, 500);
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ease-expo ${
          scrolled || isOpen
            ? 'h-16 md:h-20 bg-navy-dark/95 backdrop-blur-2xl border-b border-apexRed/20 shadow-elevated-dark dark:shadow-[0_20px_80px_-15px_rgba(0,0,0,0.7)]' 
            : 'h-20 md:h-24 lg:h-28 bg-navy-dark/40 backdrop-blur-md border-b border-main/5'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-full flex items-center justify-between">
          <Link to="/" className="relative z-[101] group/logo" onClick={() => setIsOpen(false)}>
            <div className={`absolute inset-0 bg-apexRed/20 blur-2xl rounded-full opacity-0 group-hover/logo:opacity-100 transition-opacity duration-700`}></div>
            <Logo 
              className={`transition-all duration-700 origin-left relative z-10 ${scrolled || isOpen ? 'h-8 md:h-11' : 'h-10 md:h-14'}`} 
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden xl:flex items-center gap-6">
            <div className="flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-500 relative group rounded-xl hover:bg-main/5 ${
                    location.pathname === link.path ? 'text-apexRed' : 'text-muted hover:text-main'
                  }`}
                >
                  <span className="relative z-10">{link.name}</span>
                  <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-[3px] bg-apexRed transition-all duration-500 rounded-full shadow-[0_0_10px_#A61A1A] ${
                    location.pathname === link.path ? 'w-4' : 'w-0 group-hover:w-2'
                  }`}></div>
                </Link>
              ))}
            </div>

            <div className="h-5 w-[1px] bg-main/10 mx-1"></div>

            <div className="flex items-center gap-3">
              <button 
                onClick={toggleTheme}
                className="relative overflow-hidden flex items-center justify-center bg-main/5 hover:bg-main/10 h-10 w-10 rounded-xl border border-main/10 transition-all group/theme"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                <div className="absolute inset-0 bg-apexRed/5 translate-y-full group-hover/theme:translate-y-0 transition-transform duration-500"></div>
                <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'} text-apexRed text-xs relative z-10`}></i>
              </button>

              <button 
                onClick={() => setShowLangNexus(true)}
                className="relative overflow-hidden flex items-center gap-2.5 bg-main/5 hover:bg-main/10 h-10 px-5 rounded-xl border border-main/10 transition-all group/lang"
              >
                <div className="absolute inset-0 bg-apexRed/5 translate-y-full group-hover/lang:translate-y-0 transition-transform duration-500"></div>
                <i className="fa-solid fa-earth-americas text-apexRed text-xs relative z-10"></i>
                <span className="text-[9px] font-black uppercase tracking-widest text-main relative z-10">
                  {allLanguages.find(l => l.name === currentLang)?.code.toUpperCase() || 'EN'}
                </span>
              </button>

              <Link
                to="/track"
                className="relative overflow-hidden group/btn bg-apexRed text-white h-10 px-8 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] transition-all hover:scale-105 active:scale-95 shadow-apex flex items-center gap-3"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
                <i className="fa-solid fa-satellite-dish text-xs animate-pulse"></i>
                <span className="relative z-10">Initialize Track</span>
              </Link>
            </div>
          </div>

          {/* Mobile HUD Controls */}
          <div className="xl:hidden flex items-center gap-3 relative z-[101]">
            <button 
              onClick={toggleTheme}
              className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl bg-main/5 border border-main/10 text-apexRed active:scale-90 transition-all"
            >
              <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'} text-base md:text-lg`}></i>
            </button>
            <button 
              onClick={() => setShowLangNexus(true)}
              className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl bg-main/5 border border-main/10 text-apexRed active:scale-90 transition-all"
            >
              <i className="fa-solid fa-earth-americas text-base md:text-lg"></i>
            </button>
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="w-9 h-9 md:w-10 md:h-10 flex flex-col items-center justify-center space-y-1 rounded-xl bg-main/5 border border-main/10 active:scale-90 transition-all"
              aria-label="Toggle Menu"
            >
              <span className={`w-4 md:w-5 h-[2px] bg-main transition-all duration-500 rounded-full ${isOpen ? 'rotate-45 translate-y-[6px] bg-apexRed' : ''}`}></span>
              <span className={`w-3 md:w-3.5 h-[2px] bg-main transition-all duration-500 rounded-full ${isOpen ? 'opacity-0 -translate-x-2' : ''}`}></span>
              <span className={`w-4 md:w-5 h-[2px] bg-main transition-all duration-500 rounded-full ${isOpen ? '-rotate-45 -translate-y-[6px] bg-apexRed' : ''}`}></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Language Hub (Tactical Modal) */}
      {showLangNexus && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy-dark/95 backdrop-blur-3xl" onClick={() => !isTranslating && setShowLangNexus(false)}></div>
          <div className="relative w-full max-w-4xl bg-navy-panel/98 backdrop-blur-3xl border border-main/10 rounded-[2.5rem] shadow-elevated-dark overflow-hidden animate-reveal flex flex-col max-h-[85vh]">
            <header className="p-6 md:p-10 border-b border-main/10 flex flex-col gap-6 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-apexRed flex items-center justify-center text-white shadow-apex">
                    <i className="fa-solid fa-globe"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-main tracking-tighter uppercase leading-none">Global Uplink</h3>
                    <p className="text-[7px] font-black uppercase tracking-[0.4em] text-apexRed mt-1.5">Satellite Protocol Selector</p>
                  </div>
                </div>
                {!isTranslating && (
                  <button onClick={() => setShowLangNexus(false)} className="w-10 h-10 rounded-xl bg-main/5 flex items-center justify-center text-muted hover:text-apexRed transition-colors">
                    <i className="fa-solid fa-xmark text-xl"></i>
                  </button>
                )}
              </div>
              <div className="relative">
                <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-muted text-xs"></i>
                <input 
                  autoFocus
                  type="text" 
                  placeholder="SEARCH SECTOR NODE..." 
                  className="w-full bg-navy-dark border border-main/10 focus:border-apexRed rounded-xl py-4 pl-14 pr-6 text-main text-[10px] outline-none transition-all placeholder:text-muted font-black tracking-widest uppercase"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={isTranslating}
                />
              </div>
            </header>

            <div className="flex-grow overflow-y-auto p-6 grid grid-cols-2 md:grid-cols-4 gap-3 custom-scrollbar">
              {isTranslating ? (
                <div className="col-span-full py-20 flex flex-col items-center justify-center gap-5">
                  <div className="w-12 h-12 border-4 border-main/5 border-t-apexRed rounded-full animate-spin"></div>
                  <p className="text-apexRed font-black uppercase tracking-[0.4em] text-[8px] animate-pulse">Synchronizing Crypto-Nodes...</p>
                </div>
              ) : (
                filteredLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang)}
                    className={`p-5 rounded-2xl border transition-all text-left group ${
                      currentLang === lang.name 
                        ? 'border-apexRed bg-apexRed/10 text-main shadow-apex' 
                        : 'border-main/5 bg-main/[0.02] text-muted hover:text-main hover:border-main/20'
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest block">{lang.name}</span>
                    <span className="text-[7px] opacity-20 uppercase font-mono mt-1">AX-NODE_{lang.code.toUpperCase()}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Command HUD Menu */}
      <div className={`xl:hidden fixed inset-0 z-[90] transition-all duration-1000 ease-expo ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'}`}>
        <div className="absolute inset-0 bg-navy-dark/98 backdrop-blur-3xl"></div>
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none"></div>
        
        {/* Animated HUD Scanline */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="h-[3px] w-full bg-apexRed shadow-[0_0_20px_#A61A1A] animate-scan"></div>
        </div>

        <div className="relative h-full flex flex-col pt-24 pb-10 px-8">
          <div className="flex-grow flex flex-col justify-center space-y-4 md:space-y-6">
            <p className="text-[8px] md:text-[9px] font-black text-apexRed uppercase tracking-[0.5em] mb-2 md:mb-4 border-b border-apexRed/20 pb-2 w-fit">Select Access Protocol</p>
            {navLinks.map((link, i) => (
              <Link 
                key={link.path} 
                to={link.path} 
                onClick={() => setIsOpen(false)} 
                className="flex items-center gap-4 md:gap-6 group transition-all duration-700"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                <div className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-2xl border transition-all duration-500 ${
                  location.pathname === link.path 
                    ? 'bg-apexRed border-apexRed text-white shadow-apex' 
                    : 'bg-main/5 border-main/10 text-muted group-hover:text-main'
                }`}>
                  <i className={`fa-solid ${link.icon} text-lg md:text-xl`}></i>
                </div>
                <div className="flex flex-col">
                  <span className={`text-3xl md:text-5xl font-black tracking-tighter uppercase italic transition-all duration-500 ${
                    location.pathname === link.path ? 'text-main' : 'text-muted group-hover:text-main'
                  }`}>
                    {link.name}
                  </span>
                  {location.pathname === link.path && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-apexRed text-[7px] md:text-[8px] font-black uppercase tracking-[0.3em]">Protocol Active</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom Command Interface */}
          <div className="mt-auto pt-10 border-t border-main/10 space-y-8">
            <Link
              to="/track"
              onClick={() => setIsOpen(false)}
              className="w-full bg-apexRed text-white py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-4 shadow-apex active:scale-95 transition-all"
            >
              <i className="fa-solid fa-satellite-dish text-base"></i>
              Initialize Track Portal
            </Link>

            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex items-center gap-3">
                <i className="fa-solid fa-lock text-[8px] text-green-500"></i>
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-muted">Secure Multi-Node Uplink Active</span>
              </div>
              <p className="text-muted/20 text-[7px] font-mono uppercase tracking-[0.5em]">256-BIT AES ENCRYPTED // MISSION STATUS: GO</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;