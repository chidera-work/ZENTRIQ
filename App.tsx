import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Trucking from './pages/Trucking';
import Contact from './pages/Contact';
import Tracking from './pages/Tracking';
import Admin from './pages/Admin';
import { Shipment } from './types';
import { INITIAL_SHIPMENTS } from './constants';
import { supabase } from './lib/supabase';

const STORAGE_KEY = 'zentriq_logistics_shipments_mirror';

const LayoutWrapper: React.FC<{ children: React.ReactNode, shipments: Shipment[] }> = ({ children, shipments }) => {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  return (
    <div className="app-container min-h-screen bg-navy-dark transition-colors duration-500">
      {!isAdmin && <Navbar />}
      
      <main className="relative">
        {children}
      </main>

      {!isAdmin && <Footer />}
      
      {!isAdmin && (
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 w-14 h-14 glass rounded-full flex items-center justify-center cursor-pointer text-white hover:text-apexRed transition-all z-[100] shadow-elevated-dark border border-white/10"
        >
          <i className="fa-solid fa-chevron-up"></i>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchShipments = async () => {
    let finalShipments: Shipment[] = [];
    
    try {
      // 1. Attempt Supabase Fetch
      const { data, error } = await supabase
        .from('shipments')
        .select(`*, updates:shipment_updates(*)`)
        .order('createdAt', { ascending: false });

      if (!error && data && data.length > 0) {
        finalShipments = data as Shipment[];
      } else {
        // 2. Fallback to LocalStorage if DB is empty or fails
        const local = localStorage.getItem(STORAGE_KEY);
        if (local) {
          finalShipments = JSON.parse(local);
        } else {
          // 3. Last resort: Initial Constants
          finalShipments = INITIAL_SHIPMENTS;
        }
      }
    } catch (e) {
      console.warn("Sync Error: Falling back to LocalStorage/Defaults", e);
      const local = localStorage.getItem(STORAGE_KEY);
      finalShipments = local ? JSON.parse(local) : INITIAL_SHIPMENTS;
    }

    setShipments(finalShipments);
    setIsLoaded(true);
    // Keep local mirror updated
    localStorage.setItem(STORAGE_KEY, JSON.stringify(finalShipments));
  };

  useEffect(() => {
    const root = window.document.documentElement;
    const savedTheme = localStorage.getItem('zentriq_theme');
    
    if (savedTheme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
    
    fetchShipments();
  }, []);

  const handleSaveShipment = async (updatedShipment: Shipment) => {
    // 1. Update UI and Local Mirror Immediately (Optimistic)
    setShipments(prev => {
      const exists = prev.find(s => s.id === updatedShipment.id);
      const newState = exists 
        ? prev.map(s => s.id === updatedShipment.id ? updatedShipment : s)
        : [updatedShipment, ...prev];
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    });

    // 2. Persist to Supabase
    try {
      const { updates, ...shipmentData } = updatedShipment;
      
      // Upsert the main shipment record
      const { data: shipment, error: sError } = await supabase
        .from('shipments')
        .upsert(shipmentData)
        .select()
        .single();

      if (sError) throw sError;

      // Sync the relational updates
      if (updates) {
        // Delete existing to replace with fresh set (simplest sync)
        await supabase
          .from('shipment_updates')
          .delete()
          .eq('shipment_id', updatedShipment.id);

        if (updates.length > 0) {
          const updatesToInsert = updates.map(u => ({
            shipment_id: updatedShipment.id,
            timestamp: u.timestamp,
            location: u.location,
            description: u.description,
            status: u.status
          }));

          const { error: uError } = await supabase
            .from('shipment_updates')
            .insert(updatesToInsert);

          if (uError) throw uError;
        }
      }
    } catch (e) {
      console.error("Database Save Failed (Changes saved locally):", e);
    }
  };

  const handleDeleteShipment = async (id: string) => {
    // 1. Update UI and Local Mirror Immediately
    setShipments(prev => {
      const newState = prev.filter(s => s.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    });

    // 2. Persist to Supabase
    try {
      const { error } = await supabase
        .from('shipments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (e) {
      console.error("Database Delete Failed (Removed locally):", e);
    }
  };

  return (
    <Router>
      <LayoutWrapper shipments={shipments}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/trucking" element={<Trucking />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/track" element={<Tracking shipments={shipments} />} />
          <Route path="/admin" element={<Admin 
            shipments={shipments} 
            onSave={handleSaveShipment} 
            onDelete={handleDeleteShipment} 
          />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
};

export default App;