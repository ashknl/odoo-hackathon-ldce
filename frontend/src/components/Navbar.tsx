import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Heart, 
  Compass,
  Ticket,
  MapPin,
  Sparkles,
  User,
  Search,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from './AuthModal';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenWishlist: () => void;
  wishlistCount: number;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  currentUser?: UserProfile | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onOpenWishlist,
  wishlistCount,
  onOpenAuth,
  currentUser,
  onLogout
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      id="main-navigation"
      className={`sticky top-0 z-50 transition-all duration-200 bg-white ${
        isScrolled 
          ? 'shadow-[0_2px_15px_rgba(0,0,0,0.04)] border-b border-slate-100 py-2.5' 
          : 'py-3 sm:py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo on Left - GlobeTrotter */}
          <a 
            href="#" 
            id="brand-logo"
            className="flex items-center gap-2 group"
          >
            <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-display">
              Globe<span className="text-[#0284c7]">Trotter</span>
            </span>
          </a>

          {/* Centered Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            <a 
              href="#" 
              className="text-sm font-semibold text-[#0284c7] transition-colors"
            >
              Home
            </a>
            <a 
              href="#tickets" 
              className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              Ticket
            </a>
            <a 
              href="#explore" 
              className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              Explore
            </a>
            <a 
              href="#activity" 
              className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              Activity
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-4 sm:gap-5">
            {/* Wishlist Saved Icon */}
            <button
              onClick={onOpenWishlist}
              className="relative p-1.5 text-slate-500 hover:text-rose-500 transition-colors cursor-pointer"
              title="Saved Places"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all cursor-pointer"
                >
                  <img
                    src={currentUser.photoUrl}
                    alt={currentUser.firstName}
                    className="w-7 h-7 rounded-full object-cover border border-[#0284c7]"
                  />
                  <span className="text-xs font-bold text-slate-800">
                    {currentUser.firstName}
                  </span>
                </button>

                {/* User Dropdown */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl p-3 shadow-xl border border-slate-100 z-50 space-y-2"
                    >
                      <div className="px-2 py-1.5 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {currentUser.firstName} {currentUser.lastName}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {currentUser.username}
                        </p>
                        <p className="text-[10px] text-[#0284c7] font-semibold flex items-center gap-1 mt-0.5">
                          <MapPin className="w-2.5 h-2.5" />
                          {currentUser.city}, {currentUser.country}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onOpenAuth('signup');
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Edit Profile</span>
                      </button>

                      {onLogout && (
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            onLogout();
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer border-t border-slate-50 pt-2"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                {/* Sign in Text */}
                <button
                  onClick={() => onOpenAuth('signin')}
                  className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Sign In
                </button>

                {/* Sign Up Blue Button */}
                <button
                  onClick={() => onOpenAuth('signup')}
                  id="nav-signup-btn"
                  className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs sm:text-sm font-bold shadow-sm transition-all hover:shadow-md cursor-pointer"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={onOpenWishlist}
              className="relative p-2 text-slate-600"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pt-4 pb-6 border-t border-slate-100 mt-3 space-y-3"
            >
              <div className="flex flex-col space-y-2">
                <a
                  href="#"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-bold text-slate-900 bg-slate-50"
                >
                  Home
                </a>
                <a
                  href="#tickets"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Ticket
                </a>
                <a
                  href="#explore"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Explore
                </a>
                <a
                  href="#activity"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Activity
                </a>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                {currentUser ? (
                  <div className="w-full space-y-2">
                    <div className="flex items-center gap-3 px-2 py-1">
                      <img
                        src={currentUser.photoUrl}
                        alt={currentUser.firstName}
                        className="w-9 h-9 rounded-full object-cover border border-[#0284c7]"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          {currentUser.firstName} {currentUser.lastName}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {currentUser.city}, {currentUser.country}
                        </p>
                      </div>
                    </div>
                    {onLogout && (
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full py-2.5 rounded-xl border border-rose-200 text-rose-600 font-bold text-xs flex items-center justify-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenAuth('signin');
                      }}
                      className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenAuth('signup');
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </header>
  );
};
