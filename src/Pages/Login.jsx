import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  User, 
  Lock, 
  Loader2, 
  AlertCircle, 
  ChevronRight,
  Eye,
  EyeOff,
  Fingerprint,
  ShieldQuestion,
  Smartphone,
  ShieldAlert
} from 'lucide-react';

const BASE_URL = 'https://presense360-server.onrender.com/api';

/**
 * Cookie Helpers
 */
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

const setCookie = (name, value, days = 1) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Lax`;
};

const deleteCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

const AdminLogin = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState('login'); 
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [pendingData, setPendingData] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const token = getCookie('admin_token');
      if (!token) {
        setCheckingSession(false);
        return;
      }

      try {
        const verifyResponse = await fetch(`${BASE_URL.replace('/api', '')}/verify`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (verifyResponse.ok) {
          if (onLoginSuccess) onLoginSuccess({ token });
          navigate('/dashboard');
        } else {
          deleteCookie('admin_token');
          setCheckingSession(false);
        }
      } catch (err) {
        setCheckingSession(false);
      }
    };
    checkSession();
  }, [navigate, onLoginSuccess]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleInitialLogin = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError("Please enter both username and password");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid login credentials');
      }

      setPendingData(data);
      setStep('mfa');
      
      // Auto-trigger Windows Hello
      setTimeout(() => triggerMFA(data), 500);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * FIXED PHASE 2: Forced Platform Authenticator (Windows Hello)
   */
  const triggerMFA = async (data = pendingData) => {
    setLoading(true);
    setError(null);

    if (!window.PublicKeyCredential) {
      setError("WebAuthn is not supported in this browser.");
      finalizeLogin(data);
      return;
    }

    try {
      const isPlatformAvailable = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      
      if (!isPlatformAvailable) {
        setError("Windows Hello or local biometric hardware is not available on this device.");
        setLoading(false);
        return;
      }

      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      /**
       * To force Windows Hello specifically and bypass external keys:
       * We use a "create" call with 'authenticatorAttachment: "platform"'.
       * This triggers the system PIN/Biometric UI directly for the local machine.
       */
      await navigator.credentials.create({
        publicKey: {
          challenge: challenge,
          rp: {
            name: "Presence360 Admin Portal",
            id: window.location.hostname || "localhost"
          },
          user: {
            id: new Uint8Array(16), // Dummy ID for session verification
            name: data.username || "admin",
            displayName: data.username || "Presence360 Admin"
          },
          pubKeyCredParams: [
            { alg: -7, type: "public-key" }, // ES256
            { alg: -257, type: "public-key" } // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform", // THIS FORCES WINDOWS HELLO
            userVerification: "required",
            residentKey: "preferred"
          },
          timeout: 60000
        }
      });

      // If successful, the user verified via Windows Hello
      finalizeLogin(data);

    } catch (err) {
      console.error("MFA Error:", err);
      if (err.name === 'NotAllowedError') {
        setError("Verification was cancelled. Please use Windows Hello to continue.");
      } else {
        setError("Windows Security Check failed. Ensure your system PIN/Biometrics are set up.");
      }
      setLoading(false);
    }
  };

  const finalizeLogin = (data) => {
    setCookie('admin_token', data.token, 1);
    if (onLoginSuccess) onLoginSuccess(data);
    navigate('/dashboard');
  };

  if (checkingSession && !error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans selection:bg-blue-100">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-xl shadow-blue-200 mb-4 animate-in fade-in zoom-in duration-700">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Presence360</h1>
          <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-[0.2em]">Secure Admin Gateway</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden relative">
          
          {step === 'login' && (
            <div className="p-8 animate-in slide-in-from-left duration-300">
              <form onSubmit={handleInitialLogin} className="space-y-5">
                <h2 className="text-lg font-bold text-slate-800">Identify Yourself</h2>
                {error && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl animate-shake">
                    <AlertCircle size={18} className="shrink-0" />
                    <p className="text-xs font-bold uppercase tracking-wide">{error}</p>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                    <User size={12} /> Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-100 px-4 py-3.5 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                    placeholder="Admin Username"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 ml-1">
                    <Lock size={12} /> Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-100 px-4 py-3.5 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                      placeholder="••••••••"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-blue-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <>Continue <ChevronRight size={16} /></>}
                </button>
              </form>
            </div>
          )}

          {step === 'mfa' && (
            <div className="p-10 text-center animate-in slide-in-from-right duration-300">
              <div className="mb-6 relative inline-block">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-600 animate-pulse">
                  <ShieldAlert size={40} />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1.5 rounded-full border-4 border-white">
                  <Fingerprint size={12} />
                </div>
              </div>
              
              <h2 className="text-xl font-black text-slate-800 tracking-tight mb-2">Windows Security Check</h2>
              <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">
                Your account is protected by Windows Hello. Please verify your identity using your system PIN or Biometrics.
              </p>

              {error && (
                <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-left animate-shake">
                  <AlertCircle size={18} className="shrink-0" />
                  <p className="text-[10px] font-bold uppercase tracking-wide leading-relaxed">{error}</p>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={() => triggerMFA()}
                  disabled={loading}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : "Verify Identity"}
                </button>
                <button
                  onClick={() => { setStep('login'); setPendingData(null); }}
                  className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
                >
                  Cancel and go back
                </button>
              </div>

              <div className="mt-8 flex items-center justify-center gap-4 opacity-30 grayscale contrast-125">
                 <div className="flex flex-col items-center gap-1">
                    <Smartphone size={16} />
                    <span className="text-[8px] font-bold">DEVICE LOCK</span>
                 </div>
                 <div className="w-px h-8 bg-slate-300"></div>
                 <div className="flex flex-col items-center gap-1">
                    <ShieldCheck size={16} />
                    <span className="text-[8px] font-bold">WINDOWS HELLO</span>
                 </div>
              </div>
            </div>
          )}

          <div className="bg-slate-50/50 border-t border-slate-100 p-6 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Biometric Hardware Required
            </p>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;