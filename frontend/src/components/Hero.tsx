import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  User, 
  Search, 
  ChevronRight,
  Plane,
  Building2,
  Bus,
  Car
} from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onSearch: (params: {
    destination: string;
    checkIn: string;
    checkOut: string;
    guests: string;
    tab: string;
  }) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSearch }) => {
  const [activeTab, setActiveTab] = useState<'Hostelry' | 'Flights' | 'Bus & Shuttle' | 'Cars'>('Hostelry');
  const [destination, setDestination] = useState('Bali, Indonesia');
  const [checkIn, setCheckIn] = useState('Sat, 2 Dec 2026');
  const [checkOut, setCheckOut] = useState('Sun, 3 Dec 2026');
  const [guests, setGuests] = useState('1 Room, 2 Guest');

  const handleSearchClick = () => {
    onSearch({
      destination,
      checkIn,
      checkOut,
      guests,
      tab: activeTab
    });
  };

  const handleQuickDestination = (dest: string) => {
    setDestination(dest);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-12 sm:pb-16">
      
      {/* Outer Rounded Hero Container with the requested image background */}
      <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden min-h-[480px] sm:min-h-[540px] flex flex-col justify-end p-4 sm:p-8 pb-3 sm:pb-5 shadow-sm border border-slate-100">
        
        {/* User's specified background image with enhanced brightness */}
        <img
          src="https://res.cloudinary.com/dia6lwiki/image/upload/v1787374005/Gemini_Generated_Image_umlq25umlq25umlq_zyv5qu.png"
          alt="Tropical paradise destination"
          className="absolute inset-0 w-full h-full object-cover z-0 brightness-115 contrast-[1.03]"
        />

        {/* Soft subtle tint for smooth blending */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/15 via-transparent to-transparent z-0 pointer-events-none" />

        {/* Playful Dotted Flight Paths with tiny Airplanes (matching reference) */}
        <div className="absolute inset-0 pointer-events-none z-1 overflow-hidden">
          <svg className="w-full h-full opacity-80" viewBox="0 0 1000 500" fill="none">
            {/* Left curved flight path */}
            <path
              d="M 120 180 Q 240 60 380 90"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeDasharray="6 6"
            />
            {/* Right curved flight path */}
            <path
              d="M 640 90 Q 780 60 900 150"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeDasharray="6 6"
            />
          </svg>
          
          {/* Left Airplane Icon */}
          <div className="absolute top-[16%] left-[24%] sm:left-[26%] text-white rotate-45 transform drop-shadow-md">
            <Plane className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
          </div>

          {/* Right Airplane Icon */}
          <div className="absolute top-[16%] right-[24%] sm:right-[26%] text-white rotate-12 transform drop-shadow-md">
            <Plane className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
          </div>
        </div>

        {/* Floating Search Dock positioned lower with generous scenery above */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative z-10 max-w-5xl mx-auto w-full pt-16 sm:pt-24"
        >
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/80 backdrop-blur-md">
            
            {/* Top Categories Tab Strip */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto scrollbar-none">
                {(['Hostelry', 'Flights', 'Bus & Shuttle', 'Cars'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-xs sm:text-sm font-bold transition-all relative pb-2 whitespace-nowrap cursor-pointer ${
                      activeTab === tab
                        ? 'text-slate-900 border-b-2 border-[#0284c7]'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Last Searching Link on Right */}
              <button
                onClick={() => setDestination('SC. Mindanou')}
                className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 flex items-center gap-0.5 cursor-pointer ml-auto"
              >
                <span>Last Searching</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Input Fields Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-center">
              
              {/* Field 1: Destination */}
              <div className="lg:col-span-3 bg-slate-50/80 hover:bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-100 transition-colors">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-0.5">
                  Destination
                </span>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#0284c7] shrink-0" />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Where to?"
                    className="bg-transparent text-xs sm:text-sm font-bold text-slate-800 focus:outline-none w-full truncate placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Field 2: Check-in */}
              <div className="lg:col-span-2 bg-slate-50/80 hover:bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-100 transition-colors">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-0.5">
                  Check-in
                </span>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#0284c7] shrink-0" />
                  <input
                    type="text"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="bg-transparent text-xs sm:text-sm font-bold text-slate-800 focus:outline-none w-full truncate"
                  />
                </div>
              </div>

              {/* Field 3: Check-out */}
              <div className="lg:col-span-2 bg-slate-50/80 hover:bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-100 transition-colors">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-0.5">
                  Check-out
                </span>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#0284c7] shrink-0" />
                  <input
                    type="text"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="bg-transparent text-xs sm:text-sm font-bold text-slate-800 focus:outline-none w-full truncate"
                  />
                </div>
              </div>

              {/* Field 4: Room & Guest */}
              <div className="lg:col-span-3 bg-slate-50/80 hover:bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-100 transition-colors">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-0.5">
                  Room & Guest
                </span>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#0284c7] shrink-0" />
                  <input
                    type="text"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="bg-transparent text-xs sm:text-sm font-bold text-slate-800 focus:outline-none w-full truncate"
                  />
                </div>
              </div>

              {/* Field 5: Search Button (Blue filled) */}
              <div className="lg:col-span-2">
                <button
                  type="button"
                  id="hero-search-btn"
                  onClick={handleSearchClick}
                  className="w-full py-3.5 sm:py-4 px-5 rounded-2xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </div>

            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};
