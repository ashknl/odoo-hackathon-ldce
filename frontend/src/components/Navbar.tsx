import React, { useState, useEffect, useRef } from 'react';
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
  PieChart,
  Calendar,
  ChevronDown,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from './AuthModal';

type NavView = 'landing' | 'home' | 'create-trip' | 'itinerary-builder' | 'my-trips' | 'profile' | 'search' | 'budget-view' | 'community' | 'calendar';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenWishlist: () => void;
  wishlistCount: number;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  currentUser?: UserProfile | null;
  onLogout?: () => void;
  activeView?: NavView;
  onViewChange?: (view: NavView) => void;
}

const NAV_ITEMS: { view: NavView; label: string; icon: React.FC<{ className?: string }> }[] = [
  { view: 'home',              label: 'Home Dashboard',         icon: Compass },
  { view: 'create-trip',      label: 'Plan New Trip',           icon: Sparkles },
  { view: 'itinerary-builder',label: 'Build Itinerary',         icon: Ticket },
  { view: 'my-trips',         label: 'My Trips',                icon: MapPin },
  { view: 'search',           label: 'City / Activity Search',  icon: Search },
  { view: 'budget-view',      label: 'Budget View',             icon: PieChart },
  { view: 'community',        label: 'Community',               icon: Users },
  { view: 'calendar',         label: 'Calendar',                icon: Calendar },
];

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onOpenWishlist,
  wishlistCount,
  onOpenAuth,
  currentUser,
  onLogout,
  activeView = 'landing',
  onViewChange
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleNav = (view: NavView) => {
    onViewChange?.(view);
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };

  const activeItem = NAV_ITEMS.find((n) => n.view === activeView);

  return (
    <header
      id="main-navigation"
      className={`sticky top-0 z-50 transition-all duration-200 bg-white ${
        isScrolled
          ? 'shadow-[0_2px_15px_rgba(0,0,0,0.06)] border-b border-slate-100 py-2.5'
          : 'py-3 border-b border-slate-100/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">

          {/* ── Logo ── */}
          <a
            href="#"
            id="brand-logo"
            className="flex items-center gap-2 shrink-0"
            onClick={() => handleNav('home')}
          >
            <div className="w-7 h-7 rounded-xl bg-[#0284c7] flex items-center justify-center">
              <Compass className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-black tracking-tight text-slate-900 font-display">
              Globe<span className="text-[#0284c7]">Trotter</span>
            </span>
          </a>

          {/* ── Active Page Breadcrumb (desktop hint) ── */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            {activeItem && (
              <>
                <span className="text-slate-300">/</span>
                <span className="text-slate-600 font-bold">{activeItem.label}</span>
              </>
            )}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* ── Desktop Right Actions ── */}
          <div className="hidden md:flex items-center gap-2">

            {/* Wishlist */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 text-slate-500 hover:text-rose-500 transition-colors cursor-pointer rounded-xl hover:bg-rose-50"
              title="Saved Places"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Hamburger Nav Menu (desktop) */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  userMenuOpen
                    ? 'bg-[#0284c7] text-white border-[#0284c7]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Menu className="w-4 h-4" />
                <span>Navigate</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden"
                  >
                    <div className="px-3 pt-3 pb-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Navigation</p>
                    </div>
                    <div className="px-2 pb-2 space-y-0.5">
                      {NAV_ITEMS.map(({ view, label, icon: Icon }) => (
                        <button
                          key={view}
                          onClick={() => handleNav(view)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
                            activeView === view
                              ? 'bg-[#0284c7] text-white'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${activeView === view ? 'text-sky-200' : 'text-slate-400'}`} />
                          <span className="flex-1">{label}</span>
                        </button>
                      ))}
                    </div>

                    {/* User section */}
                    {currentUser ? (
                      <div className="border-t border-slate-100 p-2 space-y-0.5">
                        <div className="flex items-center gap-2.5 px-3 py-1.5">
                          <img
                            src={currentUser.photoUrl}
                            alt={currentUser.firstName}
                            className="w-7 h-7 rounded-full object-cover border-2 border-[#0284c7]"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {currentUser.firstName} {currentUser.lastName}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate">{currentUser.username}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleNav('profile')}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                        >
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          View Profile
                        </button>
                        {onLogout && (
                          <button
                            onClick={() => { setUserMenuOpen(false); onLogout(); }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            Sign Out
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="border-t border-slate-100 p-2 flex gap-2">
                        <button
                          onClick={() => { setUserMenuOpen(false); onOpenAuth('signin'); }}
                          className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                        >
                          Sign In
                        </button>
                        <button
                          onClick={() => { setUserMenuOpen(false); onOpenAuth('signup'); }}
                          className="flex-1 py-2 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs cursor-pointer"
                        >
                          Sign Up
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User avatar shortcut (if logged in) */}
            {currentUser && (
              <img
                src={currentUser.photoUrl}
                alt={currentUser.firstName}
                onClick={() => handleNav('profile')}
                className="w-8 h-8 rounded-full object-cover border-2 border-[#0284c7] cursor-pointer hover:opacity-80 transition-opacity"
                title={`${currentUser.firstName} — View Profile`}
              />
            )}

            {/* Sign In / Sign Up if not logged in */}
            {!currentUser && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('signin')}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth('signup')}
                  id="nav-signup-btn"
                  className="px-4 py-1.5 rounded-full bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold shadow-sm transition-all hover:shadow-md cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* ── Mobile: Wishlist + Hamburger ── */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenWishlist}
              className="relative p-2 text-slate-600 rounded-xl"
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
              className="p-2 text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* ── Mobile Full Dropdown ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-100 bg-white overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
              {NAV_ITEMS.map(({ view, label, icon: Icon }) => (
                <button
                  key={view}
                  onClick={() => handleNav(view)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-left transition-all cursor-pointer ${
                    activeView === view
                      ? 'bg-[#0284c7] text-white'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${activeView === view ? 'text-sky-200' : 'text-slate-400'}`} />
                  <span className="flex-1">{label}</span>
                </button>
              ))}

              {/* Auth row */}
              <div className="pt-2 border-t border-slate-100">
                {currentUser ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 px-4 py-2">
                      <img
                        src={currentUser.photoUrl}
                        alt={currentUser.firstName}
                        className="w-9 h-9 rounded-full object-cover border-2 border-[#0284c7]"
                      />
                      <div>
                        <p className="text-sm font-bold text-slate-900">{currentUser.firstName} {currentUser.lastName}</p>
                        <p className="text-xs text-slate-400">{currentUser.city}, {currentUser.country}</p>
                      </div>
                    </div>
                    {onLogout && (
                      <button
                        onClick={() => { setMobileMenuOpen(false); onLogout(); }}
                        className="w-full py-2.5 rounded-xl border border-rose-200 text-rose-600 font-bold text-sm flex items-center justify-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setMobileMenuOpen(false); onOpenAuth('signin'); }}
                      className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => { setMobileMenuOpen(false); onOpenAuth('signup'); }}
                      className="flex-1 py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-sm"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
