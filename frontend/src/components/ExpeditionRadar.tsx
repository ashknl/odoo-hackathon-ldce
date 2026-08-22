import React, { useState } from 'react';
import { 
  MapPin, 
  Compass, 
  ArrowUpRight,
  Sun,
  Eye,
  TrendingUp,
  DollarSign,
  Train,
  Calendar,
  Globe2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Destination } from '../types/travel';
import { DESTINATIONS } from '../data/travelData';

interface ExpeditionRadarProps {
  onSelectDestination: (dest: Destination) => void;
  onBookDestination: (dest: Destination) => void;
}

const CITY_HUBS = [
  {
    id: 'japan-golden-route',
    name: 'Tokyo & Kyoto',
    country: 'Japan',
    x: '84%',
    y: '42%',
    costIndex: 'Moderate',
    avgCost: '$165/day',
    topActivity: 'JR Shinkansen & Fushimi Inari',
    bestSeason: 'Spring & Autumn',
    destId: 'japan-golden-route'
  },
  {
    id: 'italy-classic-voyage',
    name: 'Rome, Florence & Amalfi',
    country: 'Italy',
    x: '51%',
    y: '41%',
    costIndex: 'Moderate',
    avgCost: '$155/day',
    topActivity: 'Colosseum & Tuscan High-Speed Rail',
    bestSeason: 'April — October',
    destId: 'italy-classic-voyage'
  },
  {
    id: 'france-switzerland-alpine',
    name: 'Paris & Swiss Alps',
    country: 'France & Switzerland',
    x: '48%',
    y: '36%',
    costIndex: 'High',
    avgCost: '$210/day',
    topActivity: 'Louvre & Jungfrau Railway',
    bestSeason: 'May — October',
    destId: 'france-switzerland-alpine'
  },
  {
    id: 'bali-ubud-island',
    name: 'Bali & Ubud',
    country: 'Indonesia',
    x: '78%',
    y: '68%',
    costIndex: 'Budget',
    avgCost: '$85/day',
    topActivity: 'Rice Terraces & Nusa Penida Manta',
    bestSeason: 'April — October',
    destId: 'bali-ubud-island'
  },
  {
    id: 'spain-barcelona-costa',
    name: 'Barcelona & Costa Brava',
    country: 'Spain',
    x: '46%',
    y: '43%',
    costIndex: 'Moderate',
    avgCost: '$140/day',
    topActivity: 'Sagrada Família & Tapas Crawl',
    bestSeason: 'May — October',
    destId: 'spain-barcelona-costa'
  },
  {
    id: 'usa-canada-crossborder',
    name: 'New York, Boston & Montreal',
    country: 'USA & Canada',
    x: '24%',
    y: '37%',
    costIndex: 'High',
    avgCost: '$225/day',
    topActivity: 'Summit One & Old Montreal Food',
    bestSeason: 'June — October',
    destId: 'usa-canada-crossborder'
  }
];

export const ExpeditionRadar: React.FC<ExpeditionRadarProps> = ({
  onSelectDestination,
  onBookDestination
}) => {
  const [activePinId, setActivePinId] = useState(CITY_HUBS[0].id);

  const currentHub = CITY_HUBS.find(p => p.id === activePinId) || CITY_HUBS[0];
  const linkedDest = DESTINATIONS.find(d => d.id === currentHub.destId) || DESTINATIONS[0];

  return (
    <section id="radar" className="py-16 bg-[#090f20] text-white relative overflow-hidden">
      
      {/* Background World Network Radial */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.08)_0,transparent_70%)]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Globe2 className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '24s' }} />
              <span>Interactive Route Network</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Global Multi-City Corridors & City Hubs
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-1 max-w-xl">
              Click any global travel hub to inspect estimated daily costs, top activities, and connected multi-city transit paths.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-sky-300 bg-sky-950/60 px-3.5 py-1.5 rounded-full border border-sky-800">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
              <span>450+ Cities in Planning Database</span>
            </span>
          </div>
        </div>

        {/* Map Stage & City Details Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* World Map Container */}
          <div className="lg:col-span-8 bg-slate-900/80 rounded-3xl p-4 sm:p-8 border border-slate-800 relative min-h-[380px] sm:min-h-[460px] flex items-center justify-center overflow-hidden shadow-2xl">
            
            {/* World Grid Lines Overlay */}
            <div 
              className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" 
            />

            {/* Stylized Simplified Continents Outline */}
            <svg 
              viewBox="0 0 1000 500" 
              className="w-full h-full object-contain opacity-40 select-none pointer-events-none"
              fill="none" 
              stroke="currentColor"
            >
              {/* North America */}
              <path d="M120,80 Q200,60 260,100 Q300,160 240,240 Q180,220 130,170 Z" className="stroke-slate-600 fill-slate-800/40" strokeWidth="1.5" />
              {/* South America */}
              <path d="M240,260 Q320,290 300,380 Q260,460 220,400 Q210,320 240,260 Z" className="stroke-slate-600 fill-slate-800/40" strokeWidth="1.5" />
              {/* Europe */}
              <path d="M460,80 Q540,70 560,130 Q510,180 450,150 Z" className="stroke-slate-600 fill-slate-800/40" strokeWidth="1.5" />
              {/* Africa */}
              <path d="M460,190 Q560,190 550,300 Q510,380 470,330 Q440,250 460,190 Z" className="stroke-slate-600 fill-slate-800/40" strokeWidth="1.5" />
              {/* Asia */}
              <path d="M580,70 Q820,60 860,180 Q780,280 640,220 Q570,140 580,70 Z" className="stroke-slate-600 fill-slate-800/40" strokeWidth="1.5" />
              {/* Australia / Oceania */}
              <path d="M760,340 Q860,330 850,420 Q770,430 760,340 Z" className="stroke-slate-600 fill-slate-800/40" strokeWidth="1.5" />

              {/* Transit Flight/Rail Connecting Arcs */}
              <path d="M240,160 Q350,90 480,140" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="4 4" className="opacity-60" />
              <path d="M480,140 Q650,90 820,180" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="4 4" className="opacity-60" />
              <path d="M820,180 Q800,280 770,360" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="4 4" className="opacity-60" />
            </svg>

            {/* Interactive City Hub Pins */}
            {CITY_HUBS.map((pin) => {
              const isActive = pin.id === activePinId;
              return (
                <div
                  key={pin.id}
                  style={{ left: pin.x, top: pin.y }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                >
                  <button
                    id={`map-pin-${pin.id}`}
                    onClick={() => setActivePinId(pin.id)}
                    className={`relative group flex items-center justify-center transition-all cursor-pointer ${
                      isActive ? 'scale-125 z-30' : 'hover:scale-110'
                    }`}
                  >
                    {/* Ripple Ping on Active Pin */}
                    {isActive && (
                      <span className="absolute w-8 h-8 rounded-full bg-sky-400/40 animate-ping" />
                    )}

                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shadow-lg border transition-all ${
                      isActive 
                        ? 'bg-sky-400 text-slate-950 border-white ring-4 ring-sky-400/30' 
                        : 'bg-slate-900 text-sky-400 border-sky-400/50 hover:border-white'
                    }`}>
                      <MapPin className="w-3.5 h-3.5" />
                    </div>

                    {/* Tooltip Label */}
                    <div className={`absolute top-full mt-1.5 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md text-[10px] font-bold whitespace-nowrap shadow-lg transition-all ${
                      isActive 
                        ? 'bg-white text-slate-950 opacity-100' 
                        : 'bg-slate-900/90 text-slate-300 opacity-80 group-hover:opacity-100 border border-slate-700'
                    }`}>
                      {pin.name}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Right Column: Live Hub Telemetry Card */}
          <div className="lg:col-span-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentHub.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                      Destination Profile
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[11px] font-bold border border-sky-400/30">
                      {currentHub.costIndex} Cost
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-white mt-4">
                    {currentHub.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {currentHub.country}
                  </p>

                  {/* Key Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 mt-5">
                    <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Avg Daily Cost</span>
                      <span className="text-base font-black text-white">{currentHub.avgCost}</span>
                    </div>

                    <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Ideal Season</span>
                      <span className="text-xs font-bold text-emerald-400">{currentHub.bestSeason}</span>
                    </div>
                  </div>

                  {/* Top Activity Highlight */}
                  <div className="mt-4 bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Must-Do Activity Highlight
                    </span>
                    <div className="text-xs text-slate-200 font-semibold">
                      {currentHub.topActivity}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 pt-5 border-t border-slate-800 flex items-center gap-3">
                  <button
                    onClick={() => onSelectDestination(linkedDest)}
                    className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-sky-400" />
                    <span>View Itinerary</span>
                  </button>

                  <button
                    onClick={() => onBookDestination(linkedDest)}
                    className="flex-1 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Plan City</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-950" />
                  </button>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
};
