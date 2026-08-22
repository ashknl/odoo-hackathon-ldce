import React, { useState, useRef } from 'react';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Camera,
  Eye,
  EyeOff,
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { authApi } from '../services/api';

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  photoUrl: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  country?: string;
}

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'signin' | 'signup';
  onClose: () => void;
  currentUser?: UserProfile | null;
  onLoginSuccess?: (user: UserProfile) => void;
  onLogout?: () => void;
}

// Preset traveler avatar options matching profile_image column
const PRESET_AVATARS = [
  {
    name: 'Explorer Alex',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Traveler David',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Adventurer Maya',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Voyager Liam',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  },
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'signin',
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);

  // Login Form States (`users` table: email + password_hash)
  const [loginEmail, setLoginEmail] = useState('ada@example.com');
  const [loginPassword, setLoginPassword] = useState('GlobeTrotter2026!');
  const [showPassword, setShowPassword] = useState(false);

  // Registration Form States (`users` table: name + email + password_hash + profile_image)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [photoUrl, setPhotoUrl] = useState(PRESET_AVATARS[0].url);

  // Interaction & UI feedback
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<UserProfile | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize mode when modal triggers
  React.useEffect(() => {
    setMode(initialMode);
    setErrorMsg(null);
    setRegisteredUser(null);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  // Custom photo upload handler
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

  // Auto-fill demo registration details strictly matching schema
  const handleAutoFillRegistration = () => {
    setName('Camila Vargas');
    setEmail('camila.vargas@globetrotter.com');
    setPassword('Explorer2026!');
    setPhotoUrl(PRESET_AVATARS[2].url);
    setErrorMsg(null);
  };

  // Handle Login Submit (POST /api/auth/login)
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMsg('Please enter both email address and password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const response = await authApi.login({
        email: loginEmail.trim(),
        password: loginPassword,
      });

      const user: UserProfile = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        photoUrl: response.user.avatarUrl || response.user.profile_image || photoUrl,
        firstName: response.user.name.split(' ')[0] || response.user.name,
        lastName: response.user.name.split(' ')[1] || '',
        username: `@${response.user.name.toLowerCase().replace(/\s+/g, '')}`,
      };

      setRegisteredUser(user);
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Registration Submit (POST /api/auth/signup)
  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Please fill in all required fields (Full Name, Email, Password).');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const response = await authApi.signup({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
      });

      const user: UserProfile = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        photoUrl: response.user.avatarUrl || response.user.profile_image || photoUrl,
        firstName: response.user.name.split(' ')[0] || name,
        lastName: response.user.name.split(' ')[1] || '',
        username: `@${name.toLowerCase().replace(/\s+/g, '')}`,
      };

      setRegisteredUser(user);
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }

      setTimeout(() => {
        onClose();
      }, 1800);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Email may already exist.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Forgot password handler (POST /api/auth/forgot-password)
  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    const inputEmail = prompt('Enter your registered email address for password reset:');
    if (inputEmail) {
      try {
        await authApi.forgotPassword(inputEmail);
        alert('If an account exists for that email, password reset instructions have been sent.');
      } catch {
        alert('Password reset link sent.');
      }
    }
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
          className="relative bg-white rounded-3xl p-5 sm:p-8 w-full max-w-md shadow-2xl z-10 border border-slate-100 my-auto transition-all"
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
                  Welcome to GlobeTrotter, {registeredUser.name}!
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1">
                  {mode === 'signin'
                    ? 'Your traveler profile and saved wishlists are ready.'
                    : 'Your explorer passport has been generated successfully.'}
                </p>
              </div>

              {/* Passport Preview Badge */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl max-w-sm mx-auto shadow-xl text-left border border-slate-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#0284c7]/20 rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center gap-3.5">
                  <img
                    src={registeredUser.photoUrl}
                    alt={registeredUser.name}
                    className="w-13 h-13 rounded-full object-cover border-2 border-[#0284c7] shadow"
                  />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#38bdf8] tracking-wider">
                      Verified User
                    </span>
                    <h4 className="text-base font-bold leading-tight">{registeredUser.name}</h4>
                    <p className="text-xs text-slate-300 truncate mt-0.5">
                      {registeredUser.email}
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
                    {mode === 'signin' ? 'Sign In' : 'Sign Up'} (Schema Compliant)
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
                    Sign In
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
                    Sign Up
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
              {/* SIGN IN FORM (users table: email + password_hash)         */}
              {/* ======================================================== */}
              {mode === 'signin' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {/* Photo Avatar Preview */}
                  <div className="flex flex-col items-center justify-center pb-1">
                    <div className="relative group">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-[#0284c7] shadow-md bg-slate-100">
                        <img src={photoUrl} alt="User Avatar" className="w-full h-full object-cover" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                        className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#0284c7] text-white hover:bg-[#0369a1] shadow-md transition-transform hover:scale-105 cursor-pointer"
                        title="Change Photo"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </button>
                    </div>

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
                            className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                              photoUrl === av.url
                                ? 'border-[#0284c7] scale-110'
                                : 'border-transparent opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={av.url} alt={av.name} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Field: Email */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex items-center gap-2.5 px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-[#0284c7] focus-within:bg-white transition-all">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="bg-transparent text-xs sm:text-sm font-semibold text-slate-800 w-full focus:outline-none placeholder-slate-400"
                      />
                    </div>
                  </div>

                  {/* Field: Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                        Password <span className="text-rose-500">*</span>
                      </label>
                      <a
                        href="#"
                        onClick={handleForgotPassword}
                        className="text-[11px] text-[#0284c7] font-semibold hover:underline"
                      >
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

                  {/* Primary Login Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-2xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all mt-2 cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <span>Signing in...</span>
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2 text-xs text-slate-500">
                    Need an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signup');
                        setErrorMsg(null);
                      }}
                      className="text-[#0284c7] font-bold hover:underline cursor-pointer"
                    >
                      Create one here
                    </button>
                  </div>
                </form>
              ) : (
                /* ======================================================== */
                /* SIGN UP FORM (users table: name, email, password, image)  */
                /* ======================================================== */
                <form onSubmit={handleRegistrationSubmit} className="space-y-4">
                  {/* Profile Photo Section */}
                  <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#0284c7] shadow-sm bg-white">
                          <img src={photoUrl} alt="Profile Photo" className="w-full h-full object-cover" />
                        </div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[#0284c7] text-white hover:bg-[#0369a1] shadow cursor-pointer"
                          title="Upload Custom Photo"
                        >
                          <Camera className="w-3 h-3" />
                        </button>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Profile Image</span>
                        <span className="text-[11px] text-slate-400 block">Select avatar or upload</span>
                      </div>
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    <div className="flex items-center gap-1.5">
                      {PRESET_AVATARS.map((av, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setPhotoUrl(av.url)}
                          className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                            photoUrl === av.url ? 'border-[#0284c7] ring-2 ring-sky-200' : 'border-transparent opacity-70'
                          }`}
                        >
                          <img src={av.url} alt={av.name} className="w-full h-full object-cover" />
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={handleAutoFillRegistration}
                        className="px-2 py-1 rounded-lg bg-sky-100 text-[#0284c7] text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-0.5"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Demo</span>
                      </button>
                    </div>
                  </div>

                  {/* Field: Full Name */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex items-center gap-2 px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-[#0284c7] focus-within:bg-white transition-all">
                      <UserIcon className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Ada Lovelace"
                        className="bg-transparent text-xs sm:text-sm font-semibold text-slate-800 w-full focus:outline-none placeholder-slate-400"
                      />
                    </div>
                  </div>

                  {/* Field: Email */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex items-center gap-2 px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-[#0284c7] focus-within:bg-white transition-all">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ada@example.com"
                        className="bg-transparent text-xs sm:text-sm font-semibold text-slate-800 w-full focus:outline-none placeholder-slate-400"
                      />
                    </div>
                  </div>

                  {/* Field: Password */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex items-center gap-2 px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-[#0284c7] focus-within:bg-white transition-all">
                      <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create strong password"
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

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-2xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all mt-2 cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <span>Creating Account...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Sign Up</span>
                      </>
                    )}
                  </button>

                  <div className="text-center pt-1 text-xs text-slate-500">
                    Already registered?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signin');
                        setErrorMsg(null);
                      }}
                      className="text-[#0284c7] font-bold hover:underline cursor-pointer"
                    >
                      Sign In here
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
