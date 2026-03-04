import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Shipment, ShipmentStatus, ShipmentUpdate } from '../types';
import { getServiceIcon, SERVICES } from '../constants';
import Logo from '../components/Logo';
import { GoogleGenAI } from "@google/genai";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface AdminProps {
  shipments: Shipment[];
  onSave: (shipment: Shipment) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const Admin: React.FC<AdminProps> = ({ shipments, onSave, onDelete }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginView, setLoginView] = useState<'LOGIN' | 'FORGOT' | 'VERIFY' | 'RESET' | 'SENT' | 'SETUP'>('LOGIN');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUpdateDeleteConfirm, setShowUpdateDeleteConfirm] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [updateIndexToDelete, setUpdateIndexToDelete] = useState<number | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  
  const [activeTerminalShipment, setActiveTerminalShipment] = useState<Shipment | null>(null);
  const [terminalTab, setTerminalTab] = useState<'TELEMETRY' | 'MANIFEST' | 'INVOICE'>('TELEMETRY');
  const [telemetrySubTab, setTelemetrySubTab] = useState<'CONSOLE' | 'LIVE FEED'>('CONSOLE');

  const intelInputRef = useRef<HTMLTextAreaElement>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);

  // Form states
  const [formData, setFormData] = useState({
    senderName: '', senderPhone: '', receiverName: '', receiverPhone: '', origin: '', destination: '',
    weight: '', dimensions: '', serviceType: 'Secure Air Freight',
    estimatedDelivery: '', progress: 0
  });

  const [historyForm, setHistoryForm] = useState({
    location: '', description: '', status: ShipmentStatus.IN_TRANSIT, progress: 0 
  });

  const [manifestEdit, setManifestEdit] = useState({
    senderName: '', senderPhone: '', receiverName: '', receiverPhone: '', origin: '', destination: '',
    weight: '', dimensions: '', serviceType: 'Secure Air Freight',
    estimatedDelivery: ''
  });

  const [editingUpdateIndex, setEditingUpdateIndex] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (activeTerminalShipment) {
      const refreshed = shipments.find(s => s.id === activeTerminalShipment.id);
      if (refreshed && editingUpdateIndex === null) {
        setActiveTerminalShipment(refreshed);
      }
    }
  }, [shipments]);

  useEffect(() => {
    // Diagnostic check for environment variables
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || supabaseUrl.includes('placeholder') || !supabaseKey || supabaseKey === 'placeholder') {
      console.warn("DIAGNOSTIC_ALERT :: Supabase environment variables are missing or using placeholders.");
    }
  }, []);

  const filteredShipments = useMemo(() => {
    return shipments.filter(s => {
      const matchesSearch = s.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            s.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            s.receiverName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'ALL' || s.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [shipments, searchTerm, filterStatus]);

  const stats = useMemo(() => ({
    total: shipments.length,
    active: shipments.filter(s => s.status !== ShipmentStatus.DELIVERED && s.status !== ShipmentStatus.CANCELLED).length,
    delayed: shipments.filter(s => s.status === ShipmentStatus.DELAYED).length,
    delivered: shipments.filter(s => s.status === ShipmentStatus.DELIVERED).length
  }), [shipments]);

  const generateAiIntel = async () => {
    if (!activeTerminalShipment) return;
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `You are a high-level logistics intelligence analyst for Zentriq Logistics. 
      Analyze the following shipment data and generate a 2-sentence "Tactical Summary" for the mission log.
      Shipment: ${activeTerminalShipment.trackingNumber}
      Status: ${activeTerminalShipment.status}
      History: ${activeTerminalShipment.updates.map(u => u.description).join('; ')}
      Target: ${activeTerminalShipment.destination}
      Format: Professional, tactical, slightly futuristic security tone.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const summary = response.text || "PROTOCOL_ANALYSIS_UNAVAILABLE";
      setHistoryForm(prev => ({
        ...prev,
        description: `[AI_ANALYSIS]: ${summary.trim()}`
      }));
    } catch (error) {
      console.error("AI Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadInvoice = async () => {
    if (!invoiceRef.current || !activeTerminalShipment) return;
    
    setIsProcessing(true);
    try {
      // Temporarily hide elements with print:hidden for the canvas capture
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        ignoreElements: (element) => {
          return element.classList.contains('print:hidden');
        }
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; 
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`ZENTRIQ_INVOICE_${activeTerminalShipment.trackingNumber}.pdf`);
    } catch (error) {
      console.error("Export failed:", error);
      alert("EXPORT_PROTOCOL_FAILURE :: SYSTEM_ERROR");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase(), password }),
      });
      
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          if (data.error === 'NO_ADMINS_FOUND') {
            alert("SYSTEM_NOT_INITIALIZED :: No administrator accounts found. Redirecting to setup protocol.");
            setLoginView('SETUP');
          } else {
            alert(data.message || data.error || "ACCESS_DENIED :: CREDENTIAL_MISMATCH");
          }
        } else {
          alert(`SERVER_ERROR :: UNEXPECTED_RESPONSE (${response.status})`);
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("CONNECTION_FAILED :: The API endpoint could not be reached. Ensure your Cloudflare Functions are deployed and VITE_ environment variables are correctly set.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase() }),
      });

      const contentType = response.headers.get("content-type");
      if (response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          if (data.simulated && data.code) {
            console.log("SIMULATED_CODE:", data.code);
            alert(`SIMULATION_MODE: Code is ${data.code} (Check console for real apps)`);
          }
        }
        setLoginView('VERIFY');
      } else {
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          alert(`TRANSMISSION_FAILED :: ${data.error || 'UNKNOWN_ERROR'}`);
        } else {
          alert(`TRANSMISSION_FAILED :: SERVER_ERROR (${response.status})`);
        }
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      alert("TRANSMISSION_FAILED :: NETWORK_ERROR");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase(), code: verificationCode }),
      });

      if (response.ok) {
        setLoginView('RESET');
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          alert(`VERIFICATION_FAILED :: ${data.error || 'INVALID_CODE'}`);
        } else {
          alert(`VERIFICATION_FAILED :: SERVER_ERROR (${response.status})`);
        }
      }
    } catch (error) {
      alert("VERIFICATION_FAILED :: NETWORK_ERROR");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("PROTOCOL_ERROR :: PASSWORDS_DO_NOT_MATCH");
      return;
    }
    setIsProcessing(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email.toLowerCase(), 
          code: verificationCode,
          newPassword 
        }),
      });

      if (response.ok) {
        setLoginView('SENT');
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          alert(`RESET_FAILED :: ${data.error || 'UNKNOWN_ERROR'}`);
        } else {
          alert(`RESET_FAILED :: SERVER_ERROR (${response.status})`);
        }
      }
    } catch (error) {
      alert("RESET_FAILED :: NETWORK_ERROR");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("PROTOCOL_ERROR :: PASSWORDS_DO_NOT_MATCH");
      return;
    }
    setIsProcessing(true);
    try {
      const response = await fetch('/api/auth/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase(), password }),
      });

      if (response.ok) {
        alert("ADMIN_NODE_ESTABLISHED :: You may now login.");
        setLoginView('LOGIN');
        setPassword('');
        setConfirmPassword('');
      } else {
        const data = await response.json();
        alert(`SETUP_FAILED :: ${data.error || 'UNKNOWN_ERROR'}`);
      }
    } catch (error) {
      alert("SETUP_FAILED :: NETWORK_ERROR");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    const trackingNumber = Math.random().toString(36).substring(2, 12).toUpperCase();
    const newShipment: Shipment = {
      id: Date.now().toString(),
      ...formData,
      trackingNumber,
      currentLocation: formData.origin,
      status: ShipmentStatus.PENDING,
      createdAt: new Date().toUTCString(),
      updates: [{
        timestamp: new Date().toUTCString(),
        location: formData.origin,
        description: 'Initial Protocol Entry Established.',
        status: ShipmentStatus.PENDING
      }]
    };
    await onSave(newShipment);
    setIsProcessing(false);
    setShowAddModal(false);
    resetForm();
  };

  const executePurge = async () => {
    if (!idToDelete) return;
    setIsProcessing(true);
    await onDelete(idToDelete);
    setActiveTerminalShipment(null);
    setShowDeleteConfirm(false);
    setIdToDelete(null);
    setIsProcessing(false);
  };

  const resetForm = () => {
    setFormData({ senderName: '', senderPhone: '', receiverName: '', receiverPhone: '', origin: '', destination: '', weight: '', dimensions: '', serviceType: 'Secure Air Freight', estimatedDelivery: '', progress: 0 });
  };

  const openTerminal = (shipment: Shipment) => {
    setActiveTerminalShipment(shipment);
    setHistoryForm({ 
      location: shipment.currentLocation, 
      description: '', 
      status: shipment.status, 
      progress: shipment.progress 
    });
    setManifestEdit({
      senderName: shipment.senderName,
      senderPhone: shipment.senderPhone || '',
      receiverName: shipment.receiverName,
      receiverPhone: shipment.receiverPhone || '',
      origin: shipment.origin,
      destination: shipment.destination,
      weight: shipment.weight || '',
      dimensions: shipment.dimensions || '',
      serviceType: shipment.serviceType || 'Secure Air Freight',
      estimatedDelivery: shipment.estimatedDelivery || ''
    });
    setTerminalTab('TELEMETRY');
    setTelemetrySubTab('CONSOLE');
    setEditingUpdateIndex(null);
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTerminalShipment) return;
    setIsProcessing(true);

    const newUpdate: ShipmentUpdate = {
      timestamp: editingUpdateIndex !== null 
        ? activeTerminalShipment.updates[editingUpdateIndex].timestamp 
        : new Date().toUTCString(),
      location: historyForm.location,
      description: historyForm.description,
      status: historyForm.status
    };

    let updatedUpdates = [...activeTerminalShipment.updates];
    if (editingUpdateIndex !== null) {
      updatedUpdates[editingUpdateIndex] = newUpdate;
    } else {
      updatedUpdates = [newUpdate, ...updatedUpdates];
    }

    const topUpdate = updatedUpdates[0];
    const updatedShipment: Shipment = {
      ...activeTerminalShipment,
      updates: updatedUpdates,
      status: topUpdate.status,
      currentLocation: topUpdate.location,
      progress: Number(historyForm.progress) || activeTerminalShipment.progress
    };

    setActiveTerminalShipment(updatedShipment);
    setEditingUpdateIndex(null);
    setTelemetrySubTab('LIVE FEED');
    setHistoryForm({ ...historyForm, description: '' });

    await onSave(updatedShipment);
    setIsProcessing(false);
  };

  const executeUpdatePurge = async () => {
    if (!activeTerminalShipment || updateIndexToDelete === null) return;
    setIsProcessing(true);
    
    const updatedUpdates = activeTerminalShipment.updates.filter((_, i) => i !== updateIndexToDelete);
    const topUpdate = updatedUpdates.length > 0 ? updatedUpdates[0] : null;
    
    const updatedShipment: Shipment = { 
      ...activeTerminalShipment, 
      updates: updatedUpdates,
      status: topUpdate ? topUpdate.status : ShipmentStatus.PENDING,
      currentLocation: topUpdate ? topUpdate.location : activeTerminalShipment.origin
    };
    
    setActiveTerminalShipment(updatedShipment);
    await onSave(updatedShipment);
    
    setShowUpdateDeleteConfirm(false);
    setUpdateIndexToDelete(null);
    setIsProcessing(false);
  };

  const handleManifestSync = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTerminalShipment) return;
    setIsProcessing(true);
    const updated = { ...activeTerminalShipment, ...manifestEdit };
    setActiveTerminalShipment(updated);
    await onSave(updated);
    setIsProcessing(false);
    alert("MANIFEST_SYNCHRONIZED");
  };

  const initiateModification = (upd: ShipmentUpdate, index: number) => {
    setEditingUpdateIndex(index);
    setHistoryForm({ 
      location: upd.location, 
      status: upd.status, 
      description: upd.description, 
      progress: activeTerminalShipment?.progress || 0 
    });
    setTelemetrySubTab('CONSOLE');
    setTimeout(() => intelInputRef.current?.focus(), 150);
  };

  const shipmentToDelete = shipments.find(s => s.id === idToDelete);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-navy-dark flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none"></div>
        
        {/* Ambient Glows */}
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-apexRed/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="w-full max-w-md relative z-10 animate-reveal">
          <Link to="/" className="flex items-center gap-3 text-muted hover:text-main transition-all uppercase font-black tracking-widest text-[8px] md:text-[9px] mb-6 md:mb-10 group mx-auto w-fit bg-main/5 px-4 py-2 rounded-full border border-main/5">
            <i className="fa-solid fa-arrow-left group-hover:-translate-x-2 transition-transform text-apexRed"></i>
            Return to Zentriq Nexus
          </Link>
          
          <div className="glass p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] text-center border border-main/5 shadow-elevated-light dark:shadow-elevated-dark relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-apexRed to-transparent opacity-50"></div>
            
            <div className="mb-6 md:mb-10 relative">
              <Logo iconOnly className="h-10 md:h-16 mx-auto animate-pulse" />
              <div className="absolute -inset-4 bg-apexRed/5 blur-xl rounded-full -z-10"></div>
            </div>
            
            {loginView === 'LOGIN' ? (
              <div className="animate-fade-in">
                <h2 className="text-main font-black uppercase tracking-[0.4em] text-[9px] md:text-xs mb-6 md:mb-8">Authorization Required</h2>
                <form onSubmit={handleLogin} className="space-y-4 md:space-y-6">
                  <div className="relative group">
                     <i className="fa-solid fa-user-secret absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-main/20 group-focus-within:text-apexRed transition-colors"></i>
                     <input required type="email" placeholder="ADMIN_ID" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-navy-dark border border-main/10 rounded-xl md:rounded-2xl py-4 md:py-5 pl-14 md:pl-16 pr-6 text-main outline-none uppercase font-black text-[10px] md:text-xs tracking-widest focus:border-apexRed transition-all" />
                  </div>
                  <div className="relative group">
                     <i className="fa-solid fa-key absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-main/20 group-focus-within:text-apexRed transition-colors"></i>
                     <input required type="password" placeholder="ACCESS_KEY" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-navy-dark border border-main/10 rounded-xl md:rounded-2xl py-4 md:py-5 pl-14 md:pl-16 pr-6 text-main outline-none font-black text-[10px] md:text-xs tracking-widest focus:border-apexRed transition-all" />
                  </div>
                  <div className="flex justify-end">
                    <button 
                      type="button"
                      onClick={() => setLoginView('FORGOT')}
                      className="text-[8px] md:text-[9px] font-black text-muted hover:text-apexRed uppercase tracking-widest transition-colors"
                    >
                      Forgot Access Key?
                    </button>
                  </div>
                  <button disabled={isProcessing} className="w-full bg-apexRed text-white py-5 md:py-6 rounded-xl md:rounded-2xl font-black uppercase tracking-[0.4em] text-[9px] md:text-[10px] shadow-apex hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                    {isProcessing ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-bolt-lightning"></i>}
                    Establish Link
                  </button>
                </form>
              </div>
            ) : loginView === 'FORGOT' ? (
              <div className="animate-fade-in">
                <h2 className="text-main font-black uppercase tracking-[0.4em] text-[9px] md:text-xs mb-6 md:mb-8">Reset Protocol</h2>
                <p className="text-muted text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-6 md:mb-8 leading-relaxed px-2">Enter your ADMIN_ID to receive a secure recovery uplink.</p>
                <form onSubmit={handleForgotPassword} className="space-y-4 md:space-y-6">
                  <div className="relative group">
                     <i className="fa-solid fa-envelope absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-main/20 group-focus-within:text-apexRed transition-colors"></i>
                     <input required type="email" placeholder="ADMIN_ID" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-navy-dark border border-main/10 rounded-xl md:rounded-2xl py-4 md:py-5 pl-14 md:pl-16 pr-6 text-main outline-none uppercase font-black text-[10px] md:text-xs tracking-widest focus:border-apexRed transition-all" />
                  </div>
                  <button 
                    disabled={isProcessing}
                    className="w-full bg-apexRed text-white py-5 md:py-6 rounded-xl md:rounded-2xl font-black uppercase tracking-[0.4em] text-[9px] md:text-[10px] shadow-apex hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    {isProcessing ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-satellite-dish"></i>}
                    {isProcessing ? 'Transmitting...' : 'Request Uplink'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setLoginView('LOGIN')}
                    className="w-full text-[8px] md:text-[9px] font-black text-muted hover:text-main uppercase tracking-widest transition-colors mt-2"
                  >
                    Return to Login
                  </button>
                </form>
              </div>
            ) : loginView === 'VERIFY' ? (
              <div className="animate-fade-in">
                <h2 className="text-main font-black uppercase tracking-[0.4em] text-[9px] md:text-xs mb-6 md:mb-8">Verification Protocol</h2>
                <p className="text-muted text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-6 md:mb-8 leading-relaxed px-2">Enter the 6-digit tactical code dispatched to your inbox.</p>
                <form onSubmit={handleVerifyCode} className="space-y-4 md:space-y-6">
                  <div className="relative group">
                     <i className="fa-solid fa-shield-halved absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-main/20 group-focus-within:text-apexRed transition-colors"></i>
                     <input required maxLength={6} type="text" placeholder="VERIFICATION_CODE" value={verificationCode} onChange={e => setVerificationCode(e.target.value)} className="w-full bg-navy-dark border border-main/10 rounded-xl md:rounded-2xl py-4 md:py-5 pl-14 md:pl-16 pr-6 text-main outline-none uppercase font-black text-[10px] md:text-xs tracking-widest focus:border-apexRed transition-all text-center" />
                  </div>
                  <button 
                    disabled={isProcessing}
                    className="w-full bg-apexRed text-white py-5 md:py-6 rounded-xl md:rounded-2xl font-black uppercase tracking-[0.4em] text-[9px] md:text-[10px] shadow-apex hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    {isProcessing ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-check-double"></i>}
                    {isProcessing ? 'Verifying...' : 'Verify Code'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setLoginView('FORGOT')}
                    className="w-full text-[8px] md:text-[9px] font-black text-muted hover:text-main uppercase tracking-widest transition-colors mt-2"
                  >
                    Resend Code
                  </button>
                </form>
              </div>
            ) : loginView === 'RESET' ? (
              <div className="animate-fade-in">
                <h2 className="text-main font-black uppercase tracking-[0.4em] text-[9px] md:text-xs mb-6 md:mb-8">New Access Key</h2>
                <p className="text-muted text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-6 md:mb-8 leading-relaxed px-2">Establish a new secure access key for your terminal.</p>
                <form onSubmit={handleResetPassword} className="space-y-4 md:space-y-6">
                  <div className="relative group">
                     <i className="fa-solid fa-lock absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-main/20 group-focus-within:text-apexRed transition-colors"></i>
                     <input required type="password" placeholder="NEW_ACCESS_KEY" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-navy-dark border border-main/10 rounded-xl md:rounded-2xl py-4 md:py-5 pl-14 md:pl-16 pr-6 text-main outline-none font-black text-[10px] md:text-xs tracking-widest focus:border-apexRed transition-all" />
                  </div>
                  <div className="relative group">
                     <i className="fa-solid fa-lock-open absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-main/20 group-focus-within:text-apexRed transition-colors"></i>
                     <input required type="password" placeholder="CONFIRM_ACCESS_KEY" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full bg-navy-dark border border-main/10 rounded-xl md:rounded-2xl py-4 md:py-5 pl-14 md:pl-16 pr-6 text-main outline-none font-black text-[10px] md:text-xs tracking-widest focus:border-apexRed transition-all" />
                  </div>
                  <button 
                    disabled={isProcessing}
                    className="w-full bg-apexRed text-white py-5 md:py-6 rounded-xl md:rounded-2xl font-black uppercase tracking-[0.4em] text-[9px] md:text-[10px] shadow-apex hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    {isProcessing ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-vault"></i>}
                    {isProcessing ? 'Resetting...' : 'Commit New Key'}
                  </button>
                </form>
              </div>
            ) : loginView === 'SETUP' ? (
              <div className="animate-fade-in">
                <h2 className="text-main font-black uppercase tracking-[0.4em] text-[9px] md:text-xs mb-6 md:mb-8">System Initialization</h2>
                <p className="text-muted text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-6 md:mb-8 leading-relaxed px-2">No administrator found. Establish the primary command node.</p>
                <form onSubmit={handleSetup} className="space-y-4 md:space-y-6">
                  <div className="relative group">
                     <i className="fa-solid fa-envelope absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-main/20 group-focus-within:text-apexRed transition-colors"></i>
                     <input required type="email" placeholder="PRIMARY_ADMIN_ID" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-navy-dark border border-main/10 rounded-xl md:rounded-2xl py-4 md:py-5 pl-14 md:pl-16 pr-6 text-main outline-none uppercase font-black text-[10px] md:text-xs tracking-widest focus:border-apexRed transition-all" />
                  </div>
                  <div className="relative group">
                     <i className="fa-solid fa-lock absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-main/20 group-focus-within:text-apexRed transition-colors"></i>
                     <input required type="password" placeholder="NEW_ACCESS_KEY" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-navy-dark border border-main/10 rounded-xl md:rounded-2xl py-4 md:py-5 pl-14 md:pl-16 pr-6 text-main outline-none font-black text-[10px] md:text-xs tracking-widest focus:border-apexRed transition-all" />
                  </div>
                  <div className="relative group">
                     <i className="fa-solid fa-lock-open absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-main/20 group-focus-within:text-apexRed transition-colors"></i>
                     <input required type="password" placeholder="CONFIRM_ACCESS_KEY" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full bg-navy-dark border border-main/10 rounded-xl md:rounded-2xl py-4 md:py-5 pl-14 md:pl-16 pr-6 text-main outline-none font-black text-[10px] md:text-xs tracking-widest focus:border-apexRed transition-all" />
                  </div>
                  <button 
                    disabled={isProcessing}
                    className="w-full bg-apexRed text-white py-5 md:py-6 rounded-xl md:rounded-2xl font-black uppercase tracking-[0.4em] text-[9px] md:text-[10px] shadow-apex hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    {isProcessing ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-rocket"></i>}
                    {isProcessing ? 'Initializing...' : 'Initialize System'}
                  </button>
                </form>
              </div>
            ) : loginView === 'SENT' ? (
              <div className="animate-reveal">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 border border-green-500/30">
                  <i className="fa-solid fa-shield-check text-green-500"></i>
                </div>
                <h2 className="text-main font-black uppercase tracking-[0.4em] text-[9px] md:text-xs mb-4">Protocol Updated</h2>
                <p className="text-muted text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-8 md:mb-10 leading-relaxed px-2">Your access key has been successfully reset. You may now establish a secure link.</p>
                <button 
                  onClick={() => setLoginView('LOGIN')}
                  className="w-full bg-main/5 text-muted py-4 md:py-5 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[8px] md:text-[9px] border border-main/10 hover:bg-main/10 transition-all"
                >
                  Back to Terminal
                </button>
              </div>
            ) : null}
            <p className="mt-8 text-[7px] md:text-[8px] font-mono text-muted/20 uppercase tracking-widest">Secured by Zentriq Cipher-8</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-dark text-main relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none"></div>

      <header className="h-20 md:h-28 border-b border-main/5 flex items-center justify-between px-4 md:px-12 relative z-20 bg-navy-dark/80 backdrop-blur-xl">
         <div className="flex items-center gap-3 md:gap-6">
            <Logo iconOnly className="h-8 md:h-12" />
            <div className="h-6 md:h-8 w-px bg-main/10 hidden sm:block"></div>
            <div className="hidden sm:block">
               <p className="text-[8px] md:text-[10px] font-black text-main uppercase tracking-widest leading-none">Command Hub</p>
               <p className="text-apexRed text-[7px] md:text-[8px] font-black uppercase tracking-[0.4em] mt-1 md:mt-1.5">Uplink: Live / {currentTime}</p>
            </div>
         </div>
         <div className="flex items-center gap-2 md:gap-4">
            <button onClick={() => { resetForm(); setShowAddModal(true); }} className="bg-apexRed w-10 h-10 md:w-auto md:px-6 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center gap-3 shadow-apex hover:scale-105 active:scale-95 transition-all text-white">
               <i className="fa-solid fa-plus text-xs md:text-sm"></i>
               <span className="hidden md:block text-[9px] font-black uppercase tracking-widest">New Node</span>
            </button>
            <button onClick={() => setIsAuthenticated(false)} className="w-10 h-10 md:h-12 md:w-12 bg-main/5 rounded-xl md:rounded-2xl flex items-center justify-center text-main/20 hover:text-apexRed transition-colors border border-main/5">
               <i className="fa-solid fa-power-off text-sm md:text-base"></i>
            </button>
         </div>
      </header>

      <main className="flex-grow overflow-y-auto p-4 md:p-12 relative z-10 custom-scrollbar">
         <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 md:mb-12">
               {[
                 { label: 'Network Payloads', val: stats.total, icon: 'fa-box', color: 'text-muted' },
                 { label: 'Active Missions', val: stats.active, icon: 'fa-person-military-to-point', color: 'text-blue-400' },
                 { label: 'Critical Alerts', val: stats.delayed, icon: 'fa-triangle-exclamation', color: 'text-apexRed' },
                 { label: 'Success Nodes', val: stats.delivered, icon: 'fa-circle-check', color: 'text-green-400' }
               ].map((stat, i) => (
                 <div key={i} className="glass p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border-main/5 flex flex-col justify-between group hover:border-main/10 transition-all shadow-elevated-light dark:shadow-elevated-dark">
                    <div className="flex justify-between items-start mb-4">
                       <span className="text-[8px] font-black uppercase tracking-[0.3em] text-muted">{stat.label}</span>
                       <i className="fa-solid fa-bolt text-apexRed text-[8px] opacity-20"></i>
                    </div>
                    <span className="text-2xl md:text-4xl font-black tracking-tighter text-main">{stat.val}</span>
                 </div>
               ))}
            </div>

            <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
               <div>
                  <h1 className="text-3xl md:text-7xl font-black text-main tracking-tighter uppercase leading-none italic">Command <span className="text-apexRed">Deck.</span></h1>
                  <p className="text-[9px] font-black text-muted uppercase tracking-[0.8em] mt-3 md:mt-4 ml-1">Asset Control Center // Active Manifests</p>
               </div>
               
               <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                     <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-main/20 text-xs"></i>
                     <input 
                        type="text" 
                        placeholder="Search Identity..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-main/5 border border-main/10 rounded-xl py-3 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest text-main outline-none focus:border-apexRed transition-all w-full sm:w-64"
                     />
                  </div>
                  <select 
                     value={filterStatus}
                     onChange={(e) => setFilterStatus(e.target.value)}
                     className="bg-main/5 border border-main/10 rounded-xl py-3 px-4 text-[10px] font-black uppercase tracking-widest text-main outline-none focus:border-apexRed transition-all"
                  >
                     <option value="ALL">All Statuses</option>
                     {Object.values(ShipmentStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
               {filteredShipments.map(s => (
                 <div key={s.id} className={`glass rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border transition-all group relative overflow-hidden ${s.status === 'Delayed' ? 'border-apexRed/40 shadow-apex scale-[1.02]' : 'border-main/5'}`}>
                    <div className="absolute -right-4 -bottom-4 text-6xl md:text-7xl font-black text-main/[0.02] uppercase italic select-none pointer-events-none group-hover:text-main/[0.04] transition-colors">{s.status.split(' ')[0]}</div>
                    <div className="flex justify-between items-start mb-6 md:mb-8 relative z-10">
                       <div className="flex items-center gap-4 md:gap-5">
                          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-navy-dark border border-main/10 flex items-center justify-center text-lg md:text-xl shadow-lg ${s.status === 'Delayed' ? 'text-apexRed' : 'text-blue-400'}`}>
                             <i className={`fa-solid ${getServiceIcon(s.serviceType)}`}></i>
                          </div>
                          <div>
                             <h3 className="text-lg md:text-2xl font-black font-mono tracking-tighter text-main">{s.trackingNumber}</h3>
                             <p className="text-[8px] md:text-[9px] font-black text-muted uppercase tracking-widest mt-1">{s.serviceType}</p>
                          </div>
                       </div>
                       <span className={`text-[7px] md:text-[8px] font-black uppercase tracking-widest px-2 md:px-3 py-1 rounded-lg border border-main/5 bg-main/[0.02] ${s.status === 'Delayed' ? 'text-apexRed border-apexRed/20' : 'text-green-400'}`}>{s.status}</span>
                    </div>
                    <div className="space-y-4 md:space-y-6 mb-8 md:mb-10 relative z-10">
                       <div className="flex flex-col gap-1 md:gap-2">
                          <span className="text-[8px] font-black text-muted uppercase tracking-[0.4em]">Vector Corridor</span>
                          <p className="text-[10px] md:text-xs font-black text-main/60 uppercase tracking-widest truncate">{s.origin.split(',')[0]} → {s.destination.split(',')[0]}</p>
                       </div>
                       <div className="flex items-end justify-between">
                          <div className="flex flex-col gap-1 md:gap-2">
                             <span className="text-[8px] font-black text-muted uppercase tracking-[0.4em]">Integrity</span>
                             <p className="text-xl md:text-3xl font-black text-main">{s.progress}%</p>
                          </div>
                          <div className="h-1.5 w-24 md:w-32 bg-main/5 rounded-full overflow-hidden">
                             <div className={`h-full transition-all duration-1000 ${s.status === 'Delayed' ? 'bg-apexRed shadow-[0_0_10px_#A61A1A]' : 'bg-blue-500'}`} style={{ width: `${s.progress}%` }}></div>
                          </div>
                       </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 md:gap-3 relative z-10">
                       <button onClick={() => openTerminal(s)} title="Diagnostics" className="h-12 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center bg-main/5 text-muted hover:bg-main/10 hover:text-main transition-all"><i className="fa-solid fa-gauge-high"></i></button>
                       <button onClick={() => openTerminal(s)} title="Telemetry" className="h-12 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center bg-main/5 text-muted hover:bg-main/10 hover:text-main transition-all"><i className="fa-solid fa-satellite-dish"></i></button>
                       <button onClick={() => openTerminal(s)} title="Manifest" className="h-12 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center bg-main/5 text-muted hover:bg-main/10 hover:text-main transition-all"><i className="fa-solid fa-file-invoice"></i></button>
                       <button onClick={() => { setIdToDelete(s.id); setShowDeleteConfirm(true); }} title="Purge Node" className="h-12 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center bg-apexRed/5 text-apexRed hover:bg-apexRed hover:text-white transition-all"><i className="fa-solid fa-trash-can"></i></button>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </main>

      {/* NODE TERMINAL */}
      {activeTerminalShipment && (
        <div className="fixed inset-0 z-[1000] flex items-stretch md:items-center justify-center p-0 md:p-12 animate-[revealScale_0.5s_var(--expo-out)_forwards]">
           <div className="absolute inset-0 bg-navy-dark/95 backdrop-blur-3xl" onClick={() => setActiveTerminalShipment(null)}></div>
           <div className="relative w-full max-w-6xl bg-navy-panel border-l md:border border-main/10 md:rounded-[4rem] shadow-2xl overflow-hidden flex flex-col h-full md:h-[90vh]">
              <header className="h-24 md:h-32 border-b border-main/5 flex items-center justify-between px-8 md:px-12 bg-navy-dark/50 flex-shrink-0">
                 <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-xl bg-apexRed flex items-center justify-center text-white shadow-apex"><i className="fa-solid fa-microchip"></i></div>
                    <div>
                       <h3 className="text-xl md:text-3xl font-black font-mono text-main tracking-tighter uppercase">{`NODE_${activeTerminalShipment.trackingNumber}`}</h3>
                       <p className="text-[9px] font-black text-apexRed uppercase tracking-[0.4em] mt-1.5">Telemetry Control Center</p>
                    </div>
                 </div>
                 <button onClick={() => setActiveTerminalShipment(null)} className="w-14 h-14 bg-main/5 rounded-2xl flex items-center justify-center text-main/20 hover:text-apexRed transition-colors"><i className="fa-solid fa-xmark text-2xl"></i></button>
              </header>

              <div className="flex border-b border-main/5 px-4 md:px-12 py-4 md:py-6 gap-2 md:gap-6 flex-shrink-0 overflow-x-auto no-scrollbar">
                 {['TELEMETRY', 'MANIFEST', 'INVOICE'].map((tab) => (
                   <button key={tab} onClick={() => setTerminalTab(tab as any)} className={`px-6 md:px-12 py-3 md:py-4 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${terminalTab === tab ? 'bg-apexRed text-white shadow-apex' : 'bg-main/5 text-main/20 hover:text-main hover:bg-main/10'}`}>{tab}</button>
                 ))}
              </div>

              <div className="flex-grow overflow-y-auto p-6 md:p-12 custom-scrollbar">
                 {terminalTab === 'TELEMETRY' && activeTerminalShipment.id && (
                   <div className="h-full flex flex-col gap-10">
                      <div className="flex gap-3 md:gap-4 border-b border-main/5 pb-6 md:pb-8 overflow-x-auto no-scrollbar">
                         {['CONSOLE', 'LIVE FEED'].map((sub) => (
                           <button key={sub} onClick={() => setTelemetrySubTab(sub as any)} className={`px-6 md:px-10 py-3 md:py-4 rounded-lg md:rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all shrink-0 ${telemetrySubTab === sub ? 'bg-main/10 text-main' : 'text-main/20 hover:text-main'}`}>{sub}</button>
                         ))}
                      </div>

                      {telemetrySubTab === 'CONSOLE' && (
                        <div className="max-w-3xl mx-auto w-full">
                           <div className="bg-main/5 p-10 rounded-[3rem] border border-main/5">
                              {editingUpdateIndex !== null && (
                                <div className="mb-8 p-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-between animate-pulse">
                                  <div className="flex items-center gap-4">
                                    <i className="fa-solid fa-pen-to-square text-blue-400 text-xs"></i>
                                    <span className="text-[8px] md:text-[10px] font-black text-blue-400 uppercase tracking-widest">MOD_MODE: ACTIVE (LOG_{editingUpdateIndex})</span>
                                  </div>
                                  <button onClick={() => {setEditingUpdateIndex(null); setHistoryForm({ ...historyForm, description: '' });}} className="text-[7px] md:text-[8px] font-black text-main/40 hover:text-main uppercase tracking-widest">Cancel</button>
                                </div>
                              )}
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 md:mb-12 gap-4">
                                 <h4 className="text-[9px] md:text-[10px] font-black text-apexRed uppercase tracking-[0.4em] flex items-center gap-3 md:gap-4">
                                    <i className="fa-solid fa-satellite-dish animate-pulse"></i>
                                    {editingUpdateIndex !== null ? 'UPDATE INTELLIGENCE' : 'ESTABLISH SECURE NODE'}
                                 </h4>
                                 <button onClick={generateAiIntel} disabled={isAnalyzing} className="px-5 md:px-6 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-full text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2 md:gap-3">
                                    {isAnalyzing ? <i className="fa-solid fa-atom fa-spin"></i> : <i className="fa-solid fa-robot"></i>}
                                    {isAnalyzing ? 'Analyzing...' : 'Generate AI Intel'}
                                 </button>
                              </div>
                              <form onSubmit={handleBroadcast} className="space-y-10">
                                 <div className="space-y-4">
                                    <label className="text-[9px] font-black text-main/20 uppercase tracking-widest ml-2">Current Vector</label>
                                    <input required value={historyForm.location} onChange={e => setHistoryForm({...historyForm, location: e.target.value})} className="w-full bg-navy-dark border border-main/10 p-6 rounded-2xl text-main outline-none focus:border-apexRed font-bold uppercase tracking-widest" />
                                 </div>
                                 <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                       <label className="text-[9px] font-black text-main/20 uppercase tracking-widest ml-2">Integrity (%)</label>
                                       <input type="number" required value={historyForm.progress} onChange={e => setHistoryForm({...historyForm, progress: parseInt(e.target.value) || 0})} className="w-full bg-navy-dark border border-main/10 p-6 rounded-2xl text-main outline-none focus:border-apexRed font-bold" />
                                    </div>
                                    <div className="space-y-4">
                                       <label className="text-[9px] font-black text-main/20 uppercase tracking-widest ml-2">Protocol State</label>
                                       <select value={historyForm.status} onChange={e => setHistoryForm({...historyForm, status: e.target.value as ShipmentStatus})} className="w-full bg-navy-dark border border-main/10 p-6 rounded-2xl text-main outline-none focus:border-apexRed font-black uppercase text-xs">
                                          {Object.values(ShipmentStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                       </select>
                                    </div>
                                 </div>
                                 <div className="space-y-4">
                                    <label className="text-[9px] font-black text-main/20 uppercase tracking-widest ml-2">Tactical Log Entry</label>
                                    <textarea ref={intelInputRef} required value={historyForm.description} onChange={e => setHistoryForm({...historyForm, description: e.target.value})} className="w-full bg-navy-dark border border-main/10 p-6 rounded-2xl text-main outline-none focus:border-apexRed font-medium italic min-h-[120px]" placeholder="Mission intel update..." />
                                 </div>
                                 <div className="flex gap-4">
                                    <button type="submit" disabled={isProcessing} className={`flex-grow ${editingUpdateIndex !== null ? 'bg-blue-600' : 'bg-apexRed'} text-white py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-[10px] shadow-apex hover:scale-105 transition-all flex items-center justify-center gap-4`}>
                                       {isProcessing ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-cloud-arrow-up"></i>}
                                       {editingUpdateIndex !== null ? 'COMMIT MODIFICATION' : 'BROADCAST INTEL'}
                                    </button>
                                 </div>
                              </form>
                           </div>
                        </div>
                      )}

                       {telemetrySubTab === 'LIVE FEED' && activeTerminalShipment.id && (
                        <div className="space-y-8 max-w-4xl mx-auto w-full pb-12">
                           {activeTerminalShipment.updates?.length === 0 ? (
                             <div className="py-24 text-center glass rounded-[3rem] border-main/5">
                               <i className="fa-solid fa-satellite-dish text-6xl text-main/5 mb-8 block"></i>
                               <p className="text-main/20 font-black uppercase tracking-widest text-xs">No intelligence packets discovered on node.</p>
                             </div>
                           ) : (
                             activeTerminalShipment.updates?.map((upd, i) => (
                               <div key={i} className={`glass p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border relative group transition-all hover:border-main/20 hover:shadow-2xl animate-fade-in-up ${editingUpdateIndex === i ? 'border-blue-500/50 bg-blue-600/5' : 'border-main/5'}`} style={{animationDelay: `${i * 100}ms`}}>
                                  <div className={`absolute left-0 top-6 md:top-10 bottom-6 md:bottom-10 w-1.5 md:w-2 rounded-r-lg ${upd.status === 'Delayed' ? 'bg-apexRed shadow-[0_0_10px_#A61A1A]' : 'bg-blue-400'}`}></div>
                                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
                                     <div className="flex items-center gap-4 md:gap-6">
                                        <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white text-xs md:text-base ${upd.status === 'Delayed' ? 'bg-apexRed shadow-apex' : 'bg-blue-600 shadow-lg'}`}><i className={`fa-solid ${upd.status === 'Delayed' ? 'fa-triangle-exclamation' : 'fa-check'}`}></i></div>
                                        <div>
                                          <h5 className="text-lg md:text-xl font-black uppercase tracking-tight text-main">{upd.location}</h5>
                                          <p className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-main/20 mt-1">{upd.status} // VERIFIED_LOG</p>
                                        </div>
                                     </div>
                                     <p className="text-[8px] md:text-[10px] font-mono text-main/20 uppercase tracking-widest bg-navy-dark/60 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-main/5">{upd.timestamp}</p>
                                  </div>
                                  <p className="text-main/50 italic text-xs md:text-sm font-medium leading-relaxed mb-8 md:mb-10 font-mono px-5 md:px-6 py-6 md:py-8 bg-navy-dark/40 rounded-xl md:rounded-2xl border border-main/5 shadow-inner">
                                     {upd.description}
                                  </p>
                                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                                     <button onClick={() => initiateModification(upd, i)} className="bg-main/5 py-3 md:py-4 rounded-lg md:rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest hover:bg-main/10 text-main/30 hover:text-main flex items-center justify-center gap-2 md:gap-3 transition-all border border-main/5"><i className="fa-solid fa-pen-to-square"></i> Modify</button>
                                     <button onClick={() => { setUpdateIndexToDelete(i); setShowUpdateDeleteConfirm(true); }} className="bg-apexRed/10 text-apexRed py-3 md:py-4 rounded-lg md:rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest hover:bg-apexRed hover:text-white flex items-center justify-center gap-2 md:gap-3 transition-all border border-apexRed/10"><i className="fa-solid fa-trash-can"></i> Purge</button>
                                  </div>
                               </div>
                             ))
                           )}
                        </div>
                       )}
                   </div>
                 )}

                 {terminalTab === 'MANIFEST' && activeTerminalShipment.id && (
                   <div className="max-w-3xl mx-auto space-y-12 w-full">
                      <div className="bg-main/5 p-10 rounded-[3rem] border border-main/5">
                         <h4 className="text-[9px] md:text-[10px] font-black text-apexRed uppercase tracking-[0.4em] mb-8 md:mb-12 flex items-center gap-3 md:gap-4"><i className="fa-solid fa-fingerprint"></i> EDIT NODE MANIFEST</h4>
                         <form className="space-y-10" onSubmit={handleManifestSync}>
                            <div className="space-y-6">
                               <h4 className="text-apexRed/60 font-black text-[9px] uppercase tracking-[0.4em] border-b border-main/5 pb-2">I. Personnel Assignment</h4>
                               <div className="space-y-4">
                                  <div className="space-y-2">
                                     <label className="text-[8px] font-black text-main/40 uppercase tracking-widest ml-1">Authorized Consignor</label>
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input required value={manifestEdit.senderName} onChange={e => setManifestEdit({...manifestEdit, senderName: e.target.value})} placeholder="Consignor Name" className="w-full bg-navy-dark border border-main/10 p-5 rounded-xl text-main outline-none focus:border-apexRed font-black uppercase text-[10px]" />
                                        <input required value={manifestEdit.senderPhone} onChange={e => setManifestEdit({...manifestEdit, senderPhone: e.target.value})} placeholder="Consignor Phone" className="w-full bg-navy-dark border border-main/10 p-5 rounded-xl text-main outline-none focus:border-apexRed font-black uppercase text-[10px]" />
                                     </div>
                                  </div>
                                  <div className="space-y-2">
                                     <label className="text-[8px] font-black text-main/40 uppercase tracking-widest ml-1">Target Consignee</label>
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input required value={manifestEdit.receiverName} onChange={e => setManifestEdit({...manifestEdit, receiverName: e.target.value})} placeholder="Consignee Name" className="w-full bg-navy-dark border border-main/10 p-5 rounded-xl text-main outline-none focus:border-apexRed font-black uppercase text-[10px]" />
                                        <input required value={manifestEdit.receiverPhone} onChange={e => setManifestEdit({...manifestEdit, receiverPhone: e.target.value})} placeholder="Consignee Phone" className="w-full bg-navy-dark border border-main/10 p-5 rounded-xl text-main outline-none focus:border-apexRed font-black uppercase text-[10px]" />
                                     </div>
                                  </div>
                               </div>
                            </div>

                            <div className="space-y-6">
                               <h4 className="text-apexRed/60 font-black text-[9px] uppercase tracking-[0.4em] border-b border-main/5 pb-2">II. Logistics Vectors</h4>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                     <label className="text-[8px] font-black text-main/40 uppercase tracking-widest ml-1">Departure Point</label>
                                     <input required value={manifestEdit.origin} onChange={e => setManifestEdit({...manifestEdit, origin: e.target.value})} placeholder="Origin Hub/Nexus" className="w-full bg-navy-dark border border-main/10 p-5 rounded-xl text-main outline-none focus:border-apexRed font-black uppercase text-[10px]" />
                                  </div>
                                  <div className="space-y-2">
                                     <label className="text-[8px] font-black text-main/40 uppercase tracking-widest ml-1">Termination Point</label>
                                     <input required value={manifestEdit.destination} onChange={e => setManifestEdit({...manifestEdit, destination: e.target.value})} placeholder="Target Destination" className="w-full bg-navy-dark border border-main/10 p-5 rounded-xl text-main outline-none focus:border-apexRed font-black uppercase text-[10px]" />
                                  </div>
                               </div>
                            </div>

                            <div className="space-y-6">
                               <h4 className="text-apexRed/60 font-black text-[9px] uppercase tracking-[0.4em] border-b border-main/5 pb-2">III. Tactical Specifications</h4>
                               <div className="space-y-4">
                                  <div className="space-y-2">
                                     <label className="text-[8px] font-black text-main/40 uppercase tracking-widest ml-1">Service Protocol</label>
                                     <select value={manifestEdit.serviceType} onChange={e => setManifestEdit({...manifestEdit, serviceType: e.target.value})} className="w-full bg-navy-dark border border-main/10 p-5 rounded-xl text-main outline-none focus:border-apexRed font-black uppercase text-[10px]">
                                        <option value="Secure Air Freight">Secure Air Freight</option>
                                        <option value="Armored Ground">Armored Ground</option>
                                        <option value="Maritime Shield">Maritime Shield</option>
                                        <option value="Express Courier">Express Courier</option>
                                     </select>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <div className="space-y-2">
                                        <label className="text-[8px] font-black text-main/40 uppercase tracking-widest ml-1">Payload Mass (KG)</label>
                                        <input required value={manifestEdit.weight} onChange={e => setManifestEdit({...manifestEdit, weight: e.target.value})} placeholder="e.g. 25.5 kg" className="w-full bg-navy-dark border border-main/10 p-5 rounded-xl text-main outline-none focus:border-apexRed font-black uppercase text-[10px]" />
                                     </div>
                                     <div className="space-y-2">
                                        <label className="text-[8px] font-black text-main/40 uppercase tracking-widest ml-1">Dimensions (CM)</label>
                                        <input value={manifestEdit.dimensions} onChange={e => setManifestEdit({...manifestEdit, dimensions: e.target.value})} placeholder="L x W x H" className="w-full bg-navy-dark border border-main/10 p-5 rounded-xl text-main outline-none focus:border-apexRed font-black uppercase text-[10px]" />
                                     </div>
                                  </div>
                                  <div className="space-y-2">
                                     <label className="text-[8px] font-black text-main/40 uppercase tracking-widest ml-1">Target Delivery Target</label>
                                     <input required type="date" value={manifestEdit.estimatedDelivery} onChange={e => setManifestEdit({...manifestEdit, estimatedDelivery: e.target.value})} className="w-full bg-navy-dark border border-main/10 p-5 rounded-xl text-main outline-none focus:border-apexRed font-black uppercase text-[10px]" />
                                  </div>
                               </div>
                            </div>
                            <button type="submit" disabled={isProcessing} className="w-full bg-apexRed text-white py-6 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-apex hover:scale-105 transition-all">Sync Manifest Node</button>
                         </form>
                      </div>
                   </div>
                 )}

                 {terminalTab === 'INVOICE' && activeTerminalShipment.id && (
                    <div className="max-w-5xl mx-auto w-full pb-20">
                       <div ref={invoiceRef} className="bg-white p-10 md:p-14 rounded-lg text-black shadow-2xl relative overflow-hidden font-sans border border-gray-200 print:shadow-none print:border-none print:p-0">
                          {/* Header */}
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 border-b-4 border-black pb-8">
                             <div className="flex items-center gap-4">
                                <Logo iconOnly className="h-16" />
                                <div>
                                   <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">Zentriq Logistics</h2>
                                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mt-1">Global Secure Assets Protocol</p>
                                </div>
                             </div>
                             <div className="text-right">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Node Tracking ID:</p>
                                <h3 className="text-2xl font-black font-mono tracking-tighter">{activeTerminalShipment.trackingNumber}</h3>
                                <p className="text-[9px] font-bold text-gray-500 mt-1 uppercase">Issued: {new Date(activeTerminalShipment.createdAt).toLocaleDateString()}</p>
                             </div>
                          </div>

                          {/* Hero Image / Banner */}
                          <div className="w-full h-32 md:h-40 mb-12 rounded-xl overflow-hidden relative print:hidden">
                             <img src="https://picsum.photos/seed/zentriq/1200/400?grayscale" className="w-full h-full object-cover opacity-90" alt="Logistics Banner" referrerPolicy="no-referrer" />
                             <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20"></div>
                          </div>

                          {/* Addresses */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                             <div className="space-y-6">
                                <h5 className="text-[11px] font-black uppercase tracking-[0.2em] bg-black text-white px-3 py-1 inline-block">Authorized Consignor</h5>
                                <div className="space-y-2 border-l-4 border-black pl-4">
                                   <p className="text-2xl font-black tracking-tight uppercase">{activeTerminalShipment.senderName}</p>
                                   <p className="text-[12px] font-bold text-gray-600 uppercase">{activeTerminalShipment.origin}</p>
                                   <p className="text-[11px] font-mono text-gray-500">TEL: {activeTerminalShipment.senderPhone}</p>
                                </div>
                             </div>
                             <div className="space-y-6">
                                <h5 className="text-[11px] font-black uppercase tracking-[0.2em] bg-black text-white px-3 py-1 inline-block">Target Consignee</h5>
                                <div className="space-y-2 border-l-4 border-black pl-4">
                                   <p className="text-2xl font-black tracking-tight uppercase">{activeTerminalShipment.receiverName}</p>
                                   <p className="text-[12px] font-bold text-gray-600 uppercase">{activeTerminalShipment.destination}</p>
                                   <p className="text-[11px] font-mono text-gray-500">TEL: {activeTerminalShipment.receiverPhone}</p>
                                </div>
                             </div>
                          </div>

                          {/* Tactical Specifications Table */}
                          <div className="mb-16">
                             <h5 className="text-[11px] font-black uppercase tracking-[0.2em] mb-6 border-b-2 border-black pb-2">Tactical Specifications</h5>
                             <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                <div className="space-y-1">
                                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Service Protocol</p>
                                   <p className="text-[13px] font-black uppercase">{activeTerminalShipment.serviceType}</p>
                                </div>
                                <div className="space-y-1">
                                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Payload Mass</p>
                                   <p className="text-[13px] font-black uppercase">{activeTerminalShipment.weight} KG</p>
                                </div>
                                <div className="space-y-1">
                                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Dimensions</p>
                                   <p className="text-[13px] font-black uppercase">{activeTerminalShipment.dimensions || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Est. Delivery</p>
                                   <p className="text-[13px] font-black uppercase">{new Date(activeTerminalShipment.estimatedDelivery).toLocaleDateString()}</p>
                                </div>
                             </div>
                          </div>

                          {/* Footer / Authentication */}
                          <div className="flex flex-col md:flex-row justify-between items-end pt-10 border-t-2 border-gray-200 mt-auto gap-8">
                             <div className="space-y-4">
                                <div className="space-y-1">
                                   <p className="text-[8px] font-mono text-gray-400 uppercase">System Node ID: {activeTerminalShipment.id}</p>
                                   <p className="text-[8px] font-mono text-gray-400 uppercase">Verification Hash: {btoa(activeTerminalShipment.id).substring(0, 16)}</p>
                                </div>
                                <div className="pt-4">
                                   <p className="text-[10px] font-black uppercase tracking-widest mb-4">Authorized Signature</p>
                                   <div className="w-64 border-b border-black h-12 flex items-end pb-2 italic font-serif text-xl">
                                      {activeTerminalShipment.senderName}
                                   </div>
                                </div>
                             </div>
                             <div className="flex items-center gap-6">
                                <div className="text-right hidden md:block">
                                   <p className="text-[10px] font-black uppercase tracking-widest">Secure Node</p>
                                   <p className="text-[8px] text-gray-400 font-mono">AUTHENTICATED_DOCUMENT</p>
                                </div>
                                <div className="w-24 h-24 border-2 border-black flex items-center justify-center p-2 bg-white">
                                   <i className="fa-solid fa-qrcode text-6xl"></i>
                                </div>
                             </div>
                          </div>

                          {/* Print Button */}
                          <div className="absolute top-6 right-6 print:hidden">
                             <button 
                               onClick={handleDownloadInvoice} 
                               disabled={isProcessing}
                               className="bg-black text-white px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-apexRed transition-all shadow-xl flex items-center gap-3 group disabled:opacity-50"
                             >
                                {isProcessing ? (
                                  <i className="fa-solid fa-circle-notch fa-spin"></i>
                                ) : (
                                  <i className="fa-solid fa-file-pdf group-hover:animate-pulse"></i>
                                )}
                                Deploy Export Protocol
                             </button>
                          </div>

                          {/* Watermark for print */}
                          <div className="hidden print:block absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center rotate-45">
                             <p className="text-[120px] font-black uppercase tracking-[0.5em]">ZENTRIQ</p>
                          </div>
                       </div>
                    </div>
                  )}


              </div>
           </div>
        </div>
      )}

      {/* MODALS REMAINDER (HIDDEN FOR BREVITY BUT FUNCTIONAL) */}
      {showAddModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-6 animate-reveal">
           <div className="absolute inset-0 bg-navy-dark/95 backdrop-blur-3xl" onClick={() => setShowAddModal(false)}></div>
           <div className="relative w-full max-w-2xl bg-navy-panel rounded-[2rem] border border-main/10 shadow-elevated overflow-hidden flex flex-col max-h-[90vh]">
              <header className="p-8 border-b border-main/5 flex items-center justify-between flex-shrink-0">
                 <div>
                    <h3 className="text-main font-black text-2xl tracking-tighter uppercase leading-none">Establish Secure Node</h3>
                    <p className="text-main/20 font-black text-[9px] uppercase tracking-[0.4em] mt-2">Tactical Asset Log Initialization</p>
                 </div>
                 <button onClick={() => setShowAddModal(false)} className="w-10 h-10 rounded-xl bg-main/5 flex items-center justify-center text-main/20 hover:text-apexRed transition-colors"><i className="fa-solid fa-xmark text-xl"></i></button>
              </header>
              <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
                 <form onSubmit={handleCreate} className="space-y-12">
                    <div className="space-y-6">
                       <h4 className="text-apexRed/60 font-black text-[9px] uppercase tracking-[0.4em] border-b border-main/5 pb-2">I. Personnel Assignment</h4>
                       <div className="space-y-4">
                          <div className="space-y-2">
                             <label className="text-[8px] font-black text-main/40 uppercase tracking-widest ml-1">Authorized Consignor</label>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input required value={formData.senderName} onChange={e => setFormData({...formData, senderName: e.target.value})} placeholder="Consignor Name" className="w-full bg-navy-dark border border-main/10 p-5 rounded-xl text-main outline-none focus:border-apexRed font-black uppercase text-[10px]" />
                                <input required value={formData.senderPhone} onChange={e => setFormData({...formData, senderPhone: e.target.value})} placeholder="Consignor Phone" className="w-full bg-navy-dark border border-main/10 p-5 rounded-xl text-main outline-none focus:border-apexRed font-black uppercase text-[10px]" />
                             </div>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[8px] font-black text-main/40 uppercase tracking-widest ml-1">Target Consignee</label>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input required value={formData.receiverName} onChange={e => setFormData({...formData, receiverName: e.target.value})} placeholder="Consignee Name" className="w-full bg-navy-dark border border-main/10 p-5 rounded-xl text-main outline-none focus:border-apexRed font-black uppercase text-[10px]" />
                                <input required value={formData.receiverPhone} onChange={e => setFormData({...formData, receiverPhone: e.target.value})} placeholder="Consignee Phone" className="w-full bg-navy-dark border border-main/10 p-5 rounded-xl text-main outline-none focus:border-apexRed font-black uppercase text-[10px]" />
                             </div>
                          </div>
                       </div>
                    </div>
                    <div className="space-y-6">
                       <h4 className="text-apexRed/60 font-black text-[9px] uppercase tracking-[0.4em] border-b border-main/5 pb-2">II. Logistics Vectors</h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <label className="text-[8px] font-black text-main/40 uppercase tracking-widest ml-1">Departure Point</label>
                             <input required value={formData.origin} onChange={e => setFormData({...formData, origin: e.target.value})} placeholder="Origin Hub/Nexus" className="w-full bg-navy-dark border border-main/10 p-5 rounded-xl text-main outline-none focus:border-apexRed font-black uppercase text-[10px]" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[8px] font-black text-main/40 uppercase tracking-widest ml-1">Termination Point</label>
                             <input required value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} placeholder="Target Destination" className="w-full bg-navy-dark border border-main/10 p-5 rounded-xl text-main outline-none focus:border-apexRed font-black uppercase text-[10px]" />
                          </div>
                       </div>
                    </div>
                    <div className="space-y-6">
                       <h4 className="text-apexRed/60 font-black text-[9px] uppercase tracking-[0.4em] border-b border-main/5 pb-2">III. Tactical Specifications</h4>
                       <div className="space-y-4">
                          <div className="space-y-2">
                             <label className="text-[8px] font-black text-main/40 uppercase tracking-widest ml-1">Service Protocol</label>
                             <select value={formData.serviceType} onChange={e => setFormData({...formData, serviceType: e.target.value})} className="w-full bg-navy-dark border border-main/10 p-5 rounded-xl text-main outline-none focus:border-apexRed font-black uppercase text-[10px]">
                                <option value="Secure Air Freight">Secure Air Freight</option>
                                <option value="Armored Ground">Armored Ground</option>
                                <option value="Maritime Shield">Maritime Shield</option>
                                <option value="Express Courier">Express Courier</option>
                             </select>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <label className="text-[8px] font-black text-main/40 uppercase tracking-widest ml-1">Payload Mass (KG)</label>
                                <input required value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} placeholder="e.g. 25.5 kg" className="w-full bg-navy-dark border border-main/10 p-5 rounded-xl text-main outline-none focus:border-apexRed font-black uppercase text-[10px]" />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[8px] font-black text-main/40 uppercase tracking-widest ml-1">Dimensions (CM)</label>
                                <input value={formData.dimensions} onChange={e => setFormData({...formData, dimensions: e.target.value})} placeholder="L x W x H" className="w-full bg-navy-dark border border-main/10 p-5 rounded-xl text-main outline-none focus:border-apexRed font-black uppercase text-[10px]" />
                             </div>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[8px] font-black text-main/40 uppercase tracking-widest ml-1">Target Delivery Target</label>
                             <input required type="date" value={formData.estimatedDelivery} onChange={e => setFormData({...formData, estimatedDelivery: e.target.value})} className="w-full bg-navy-dark border border-main/10 p-5 rounded-xl text-main outline-none focus:border-apexRed font-black uppercase text-[10px]" />
                          </div>
                       </div>
                    </div>
                    <button disabled={isProcessing} className="w-full bg-apexRed text-white py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] shadow-apex hover:scale-[1.02] active:scale-95 transition-all">
                       {isProcessing ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-lock"></i>}
                       Authorize Node Deployment
                    </button>
                 </form>
              </div>
           </div>
        </div>
      )}

      {showUpdateDeleteConfirm && (
        <div className="fixed inset-0 z-[4000] flex items-center justify-center p-6 animate-reveal">
           <div className="absolute inset-0 bg-navy-dark/95 backdrop-blur-xl" onClick={() => setShowUpdateDeleteConfirm(false)}></div>
           <div className="relative w-full max-sm bg-navy-panel p-10 rounded-[3rem] border border-apexRed/30 shadow-apex text-center">
              <h3 className="text-xl font-black uppercase tracking-tighter mb-4 italic text-main">INTEL_PURGE_REQUEST</h3>
              <p className="text-main/40 text-[10px] font-bold uppercase tracking-widest mb-10 leading-relaxed">Confirm erasure of intelligence packet from timeline?</p>
              <div className="flex gap-4">
                 <button onClick={() => setShowUpdateDeleteConfirm(false)} className="flex-1 bg-main/5 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-main/10 transition-all text-main">Abort</button>
                 <button onClick={executeUpdatePurge} disabled={isProcessing} className="flex-1 bg-apexRed text-white py-4 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-apex">Confirm Purge</button>
              </div>
           </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6 animate-reveal">
           <div className="absolute inset-0 bg-navy-dark/90 backdrop-blur-md" onClick={() => setShowDeleteConfirm(false)}></div>
           <div className="relative w-full max-w-md bg-navy-panel p-10 rounded-[3rem] border border-apexRed/30 shadow-apex text-center">
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 italic text-main">CRITICAL_NODE_PURGE</h3>
              <p className="text-main/40 text-xs font-bold uppercase tracking-widest mb-10">Warning: Permanent deletion of asset node {shipmentToDelete?.trackingNumber}.</p>
              <div className="flex gap-4">
                 <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 bg-main/5 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-main/5 text-main">Abort</button>
                 <button onClick={executePurge} disabled={isProcessing} className="flex-1 bg-apexRed text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-apex">Confirm Purge</button>
              </div>
           </div>
        </div>
      )}

      <style>{`
        @keyframes revealScale { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @media print {
          body * { visibility: hidden; }
          .max-w-5xl, .max-w-5xl * { visibility: visible; }
          .max-w-5xl { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Admin;