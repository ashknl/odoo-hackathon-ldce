import React, { useState, useRef } from 'react';
import { 
  X, Mail, Lock, User, Phone, MapPin, Globe, FileText, 
  Camera, Eye, EyeOff, Check, Sparkles, ArrowRight, Upload,
  ShieldCheck, LogOut, Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface UserProfile {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  additionalInfo: string;
  photoUrl: string;
}

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'signin' | 'signup';
  onClose: () => void;
  currentUser?: UserProfile | null;
  onLoginSuccess?: (user: UserProfile) => void;
  onLogout?: () => void;
}

// Preset traveler avatar options for fast interactive selection
const PRESET_AVATARS = [
  {
    name: 'Explorer Alex',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  },
  {
    name: 'Traveler David',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
  },
  {
    name: 'Adventurer Maya',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80'
  },
  {
    name: 'Voyager Liam',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
  }
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'signin',
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  
  // Login Form States (Screen 1)
  const [loginUsername, setLoginUsername] = useState('alex.wanderer');
  const [loginPassword, setLoginPassword] = useState('GlobeTrotter2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Registration Form States (Screen 2)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [photoUrl, setPhotoUrl] = useState(PRESET_AVATARS[0].url);

  // Interaction & UI feedback
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<UserProfile | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize initial mode when modal triggers
  React.useEffect(() => {
    setMode(initialMode);
    setErrorMsg(null);
    setRegisteredUser(null);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  // Custom photo upload handler (FileReader)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Image size should be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
        setShowAvatarPicker(false);
        setErrorMsg(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Auto-fill demo registration details
  const handleAutoFillRegistration = () => {
    setFirstName('Camila');
    setLastName('Vargas');
    setEmail('camila.vargas@globetrotter.com');
    setPhone('+1 (555) 382-9012');
    setCity('Barcelona');
    setCountry('Spain');
    setAdditionalInfo('Passionate mountain trekker & photographer. Looking for secluded coastal villas and scenic hiking trails across Europe and Asia.');
    setPhotoUrl(PRESET_AVATARS[2].url);
    setErrorMsg(null);
  };

  // Handle Login Submit (Screen 1)
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUsername.trim() || !loginPassword.trim()) {
      setErrorMsg('Please enter both username and password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    setTimeout(() => {
      setIsSubmitting(false);
      const user: UserProfile = {
        username: loginUsername.startsWith('@') ? loginUsername : `@${loginUsername}`,
        firstName: loginUsername.split('.')[0] || 'Alex',
        lastName: 'Morgan',
        email: `${loginUsername.replace('@', '')}@example.com`,
        phone: '+1 (555) 789-0123',
        city: 'San Francisco',
        country: 'United States',
        additionalInfo: 'GlobeTrotter member since 2026. Frequent traveler.',
        photoUrl: photoUrl || PRESET_AVATARS[0].url
      };

      setRegisteredUser(user);
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }

      setTimeout(() => {
        onClose();
      }, 1500);
    }, 600);
  };

  // Handle Registration Submit (Screen 2)
  const handleRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setErrorMsg('Please fill in required fields (First Name, Last Name, Email).');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    setTimeout(() => {
      setIsSubmitting(false);
      const user: UserProfile = {
        username: `@${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
        firstName,
        lastName,
        email,
        phone: phone || '+1 (555) 000-0000',
        city: city || 'Kyoto',
        country: country || 'Japan',
        additionalInfo: additionalInfo || 'Excited to embark on new GlobeTrotter journeys.',
        photoUrl: photoUrl || PRESET_AVATARS[0].url
      };

      setRegisteredUser(user);
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }

      setTimeout(() => {
        onClose();
      }, 1800);
    }, 700);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm"
        />

        {/* Modal Dialog Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className={`relative bg-white rounded-3xl p-5 sm:p-8 w-full shadow-2xl z-10 border border-slate-100 my-auto transition-all ${
            mode === 'signup' ? 'max-w-2xl' : 'max-w-md'
          }`}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer z-20"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Success State / Digital Passport Card */}
          {registeredUser ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6 sm:py-8 space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-blue-50 text-[#0284c7] border-2 border-blue-200 flex items-center justify-center mx-auto shadow-inner">
                <Check className="w-8 h-8 stroke-[2.5]" />
              </div>

              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-[#0284c7] block">
                  {mode === 'signin' ? 'Session Authenticated' : 'Registration Complete'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  Welcome to GlobeTrotter, {registeredUser.firstName}!
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1">
                  {mode === 'signin' 
                    ? 'Your traveler profile and saved wishlists are ready.' 
                    : 'Your explorer passport has been generated successfully.'}
                </p>
              </div>

              {/* Passport Preview Badge */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 sm:p-5 rounded-2xl max-w-sm mx-auto shadow-xl text-left border border-slate-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#0284c7]/20 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center gap-3.5">
                  <img
                    src={registeredUser.photoUrl}
                    alt={registeredUser.firstName}
                    className="w-13 h-13 rounded-full object-cover border-2 border-[#0284c7] shadow"
                  />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#38bdf8] tracking-wider">
                      Verified Traveler
                    </span>
                    <h4 className="text-base font-bold leading-tight">
                      {registeredUser.firstName} {registeredUser.lastName}
                    </h4>
                    <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#38bdf8]" />
                      {registeredUser.city}, {registeredUser.country}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-400 animate-pulse pt-2">
                Redirecting to your travel dashboard...
              </p>
            </motion.div>
          ) : (
            <div>
              {/* Header Mode Navigation Tabs */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                <div>
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-display">
                    Globe<span className="text-[#0284c7]">Trotter</span>
                  </span>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {mode === 'signin' ? 'Login Screen (Screen 1)' : 'Registration Screen (Screen 2)'}
                  </p>
                </div>

                {/* Tab Switcher */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setErrorMsg(null);
                    }}
                    className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      mode === 'signin'
                        ? 'bg-white text-[#0284c7] shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setErrorMsg(null);
                    }}
                    className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      mode === 'signup'
                        ? 'bg-white text-[#0284c7] shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Register
                  </button>
                </div>
              </div>

              {/* Error Notification banner */}
              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                  <span>⚠️ {errorMsg}</span>
                </div>
              )}

              {/* ======================================================== */}
              {/* SCREEN 1: LOGIN SCREEN                                   */}
              {/* ======================================================== */}
              {mode === 'signin' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  
                  {/* Photo Container */}
                  <div className="flex flex-col items-center justify-center pb-2">
                    <div className="relative group">
                      <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden border-3 border-[#0284c7] shadow-md bg-slate-100 relative">
                        <img
                          src={photoUrl}
                          alt="User Photo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Avatar Picker trigger */}
                      <button
                        type="button"
                        onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                        className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#0284c7] text-white hover:bg-[#0369a1] shadow-md transition-transform hover:scale-105 cursor-pointer"
                        title="Change Photo"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-[11px] font-bold text-slate-500 mt-2 uppercase tracking-wider">
                      Photo
                    </span>

                    {/* Interactive Avatar Preset Dropdown */}
                    {showAvatarPicker && (
                      <div className="mt-2 p-2 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-2 shadow-sm">
                        {PRESET_AVATARS.map((av, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              setPhotoUrl(av.url);
                              setShowAvatarPicker(false);
                            }}
                            className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                              photoUrl === av.url ? 'border-[#0284c7] scale-110' : 'border-transparent opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={av.url} alt={av.name} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Field: Username */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                      Username
                    </label>
                    <div className="flex items-center gap-2.5 px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-[#0284c7] focus-within:bg-white transition-all">
                      <User className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        required
                        value={loginUsername}
                        onChange={(e) => setLoginUsername(e.target.value)}
                        placeholder="Username (e.g. alex.wanderer)"
                        className="bg-transparent text-xs sm:text-sm font-semibold text-slate-800 w-full focus:outline-none placeholder-slate-400"
                      />
                    </div>
                  </div>

                  {/* Field: Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Password
                      </label>
                      <a href="#" onClick={(e) => { e.preventDefault(); alert('Reset link sent to registered email.'); }} className="text-[11px] text-[#0284c7] font-semibold hover:underline">
                        Forgot password?
                      </a>
                    </div>
                    <div className="flex items-center gap-2.5 px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-[#0284c7] focus-within:bg-white transition-all">
                      <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter password"
                        className="bg-transparent text-xs sm:text-sm font-semibold text-slate-800 w-full focus:outline-none placeholder-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember me option */}
                  <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded text-[#0284c7] focus:ring-[#0284c7] border-slate-300"
                      />
                      <span className="font-medium text-slate-700">Remember me</span>
                    </label>
                  </div>

                  {/* Primary Login Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    id="auth-login-btn"
                    className="w-full py-3.5 rounded-2xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all mt-2 cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <span>Verifying credentials...</span>
                    ) : (
                      <>
                        <span>Login Button</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Bottom switch to Registration */}
                  <div className="text-center pt-2 text-xs text-slate-500">
                    Don't have an account yet?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signup');
                        setErrorMsg(null);
                      }}
                      className="text-[#0284c7] font-bold hover:underline cursor-pointer"
                    >
                      Register Users
                    </button>
                  </div>
                </form>
              ) : (
                
                /* ======================================================== */
                /* SCREEN 2: REGISTRATION SCREEN (REGISTER USERS)           */
                /* ======================================================== */
                <form onSubmit={handleRegistrationSubmit} className="space-y-4">
                  
                  {/* Photo Section (Matching Screen 2 wireframe content) */}
                  <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80 gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#0284c7] shadow-sm bg-white">
                          <img
                            src={photoUrl}
                            alt="Profile Photo"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-[#0284c7] text-white hover:bg-[#0369a1] shadow cursor-pointer"
                          title="Upload Custom Photo"
                        >
                          <Camera className="w-3 h-3" />
                        </button>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">
                          Profile Photo
                        </span>
                        <span className="text-[11px] text-slate-400 block">
                          Select an avatar or upload your picture
                        </span>
                      </div>
                    </div>

                    {/* Hidden file input for custom uploads */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    {/* Avatar Preset Chips & Auto-fill button */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        {PRESET_AVATARS.map((av, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setPhotoUrl(av.url)}
                            className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                              photoUrl === av.url ? 'border-[#0284c7] ring-2 ring-blue-200' : 'border-transparent opacity-70 hover:opacity-100'
                            }`}
                            title={av.name}
                          >
                            <img src={av.url} alt={av.name} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={handleAutoFillRegistration}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-100/80 hover:bg-blue-200 text-[#0284c7] text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        title="Auto-fill example explorer data"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span className="hidden sm:inline">Demo Fill</span>
                      </button>
                    </div>
                  </div>

                  {/* Two-Column Grid matching the wireframe: First Name | Last Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                        First Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-[#0284c7] focus-within:bg-white transition-all">
                        <User className="w-4 h-4 text-slate-400 shrink-0" />
                        <input
                          type="text"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="First Name"
                          className="bg-transparent text-xs sm:text-sm font-semibold text-slate-800 w-full focus:outline-none placeholder-slate-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                        Last Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-[#0284c7] focus-within:bg-white transition-all">
                        <User className="w-4 h-4 text-slate-400 shrink-0" />
                        <input
                          type="text"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Last Name"
                          className="bg-transparent text-xs sm:text-sm font-semibold text-slate-800 w-full focus:outline-none placeholder-slate-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Two-Column Grid: Email Address | Phone Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-[#0284c7] focus-within:bg-white transition-all">
                        <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email Address"
                          className="bg-transparent text-xs sm:text-sm font-semibold text-slate-800 w-full focus:outline-none placeholder-slate-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                        Phone Number
                      </label>
                      <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-[#0284c7] focus-within:bg-white transition-all">
                        <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="bg-transparent text-xs sm:text-sm font-semibold text-slate-800 w-full focus:outline-none placeholder-slate-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Two-Column Grid: City | Country */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                        City
                      </label>
                      <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-[#0284c7] focus-within:bg-white transition-all">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. Kyoto, Rome, New York"
                          className="bg-transparent text-xs sm:text-sm font-semibold text-slate-800 w-full focus:outline-none placeholder-slate-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                        Country
                      </label>
                      <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-[#0284c7] focus-within:bg-white transition-all">
                        <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                        <input
                          type="text"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          placeholder="e.g. Japan, Italy, Spain"
                          className="bg-transparent text-xs sm:text-sm font-semibold text-slate-800 w-full focus:outline-none placeholder-slate-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Full Width: Additional Information .... */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Additional Information ....
                      </label>
                      <span className="text-[10px] text-slate-400">
                        {additionalInfo.length}/300 chars
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-[#0284c7] focus-within:bg-white transition-all">
                      <textarea
                        rows={3}
                        maxLength={300}
                        value={additionalInfo}
                        onChange={(e) => setAdditionalInfo(e.target.value)}
                        placeholder="Write about your travel preferences, passport nationality, dietary notes, or dream bucket list places..."
                        className="bg-transparent text-xs sm:text-sm font-medium text-slate-800 w-full focus:outline-none placeholder-slate-400 resize-none"
                      />
                    </div>
                  </div>

                  {/* Primary Action Button: Register Users */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    id="auth-register-btn"
                    className="w-full py-3.5 rounded-2xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all mt-2 cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <span>Creating Explorer Profile...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Register Users</span>
                      </>
                    )}
                  </button>

                  {/* Bottom switch to Login Screen */}
                  <div className="text-center pt-1 text-xs text-slate-500">
                    Already registered an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signin');
                        setErrorMsg(null);
                      }}
                      className="text-[#0284c7] font-bold hover:underline cursor-pointer"
                    >
                      Login Screen
                    </button>
                  </div>

                </form>
              )}

            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
