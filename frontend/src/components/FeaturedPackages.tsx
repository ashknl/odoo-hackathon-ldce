import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Calendar, 
  Users, 
  Star, 
  Clock, 
  ArrowRight, 
  Compass, 
  Copy,
  Building2,
  Train,
  Ticket,
  UtensilsCrossed,
  Share2,
  Layers,
  DollarSign
} from 'lucide-react';
import { motion } from 'motion/react';
import { TravelPackage } from '../types/travel';

interface FeaturedPackagesProps {
  packages: TravelPackage[];
  onSelectPackage: (pkg: TravelPackage) => void;
  onBookPackage: (pkg: TravelPackage) => void;
}

export const FeaturedPackages: React.FC<FeaturedPackagesProps> = ({
  packages,
  onSelectPackage,
  onBookPackage
}) => {
  const [selectedTab, setSelectedTab] = useState<string>(packages[0]?.id || '');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activePkg = packages.find(p => p.id === selectedTab) || packages[0];

  const handleCopyTrip = (pkg: TravelPackage) => {
    setCopiedId(pkg.id);
    setTimeout(() => setCopiedId(null), 2500);
    onBookPackage(pkg);
  };

  return (
    <section id="packages" className="py-16 bg-[#0b1329] text-white relative overflow-hidden">
      
      {/* Background Subtle Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.12),rgba(255,255,255,0))]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Community & Curated Itineraries</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Pre-Built Multi-City Trips
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-1.5 max-w-xl">
              Inspect vetted day-wise routes, view complete budget breakdowns, or 1-click copy and customize any itinerary for your travel dates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-sky-300 font-semibold flex items-center gap-1.5 bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-700">
              <Copy className="w-3.5 h-3.5 text-sky-400" />
              <span>1-Click Copy & Tailor Trips</span>
            </span>
          </div>
        </div>

        {/* Itinerary Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none border-b border-slate-800">
          {packages.map((pkg) => (
            <button
              key={pkg.id}
              id={`tab-pkg-${pkg.id}`}
              onClick={() => setSelectedTab(pkg.id)}
              className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2.5 cursor-pointer ${
                selectedTab === pkg.id
                  ? 'bg-white text-slate-950 shadow-xl scale-105'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
              }`}
            >
              <Compass className="w-4 h-4 text-sky-500" />
              <span>{pkg.title}</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                selectedTab === pkg.id ? 'bg-slate-900 text-sky-400' : 'bg-slate-700 text-slate-300'
              }`}>
                {pkg.days}D
              </span>
            </button>
          ))}
        </div>

        {/* Active Package Showcase */}
        {activePkg && (
          <motion.div
            key={activePkg.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-slate-800/60 rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-700/80 backdrop-blur-xl shadow-2xl"
          >
            {/* Left Column: Itinerary Image & Multi-City Stops */}
            <div className="lg:col-span-6 flex flex-col justify-between gap-6">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-lg border border-slate-700/50">
                <img
                  src={activePkg.image}
                  alt={activePkg.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent" />

                {/* Popularity & Clones Tag */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                    <Copy className="w-3 h-3 text-sky-400" />
                    <span>Copied {activePkg.copiedCount} times</span>
                  </span>
                </div>

                {/* Cities Route Overlay */}
                <div className="absolute bottom-4 left-4 right-4 text-xs text-white">
                  <span className="text-[11px] text-sky-300 font-bold block uppercase mb-0.5">Route Pathway</span>
                  <h4 className="text-base font-bold text-white tracking-wide">
                    {activePkg.cities.join('  →  ')}
                  </h4>
                </div>
              </div>

              {/* Budget Breakdown Summary for this Itinerary */}
              <div className="bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-700 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300 pb-2 border-b border-slate-800">
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-sky-400" />
                    <span>Estimated Cost Breakdown</span>
                  </span>
                  <span className="text-sky-300 font-bold">Avg ${activePkg.avgCostPerDay}/day</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 block font-medium">🏨 Lodging</span>
                    <span className="text-sm font-bold text-white">${activePkg.budgetBreakdown.stay}</span>
                  </div>
                  <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 block font-medium">🚆 Transit</span>
                    <span className="text-sm font-bold text-white">${activePkg.budgetBreakdown.transport}</span>
                  </div>
                  <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 block font-medium">🎟️ Activities</span>
                    <span className="text-sm font-bold text-white">${activePkg.budgetBreakdown.activities}</span>
                  </div>
                  <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 block font-medium">🍽️ Dining</span>
                    <span className="text-sm font-bold text-white">${activePkg.budgetBreakdown.meals}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Title, Inclusions, Day Highlights, and Action Buttons */}
            <div className="lg:col-span-6 flex flex-col justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>{activePkg.rating}</span>
                  </div>
                  <span className="text-slate-400 text-xs">• {activePkg.reviewCount} Verified Reviews</span>
                  <span className="text-slate-400 text-xs">• {activePkg.stopsCount} Stops ({activePkg.days} Days)</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  {activePkg.title}
                </h3>
                <p className="text-slate-300 text-sm mt-2">
                  {activePkg.subtitle}
                </p>

                {/* Included Key Logistics Checklist */}
                <div className="mt-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-3">
                    What Makes This Route Seamless
                  </h4>
                  <div className="space-y-2">
                    {activePkg.inclusions.map((inc, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Day-by-Day Timeline Teaser */}
                <div className="mt-5 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-700/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Timeline Highlight
                  </span>
                  <div className="text-xs text-slate-200">
                    <strong className="text-sky-300">Day 1 ({activePkg.itinerary[0]?.city}):</strong> {activePkg.itinerary[0]?.title} — {activePkg.itinerary[0]?.description}
                  </div>
                </div>
              </div>

              {/* Pricing & Copy/Customize Action */}
              <div className="pt-5 border-t border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] text-slate-400 font-semibold block uppercase">Total Trip Estimate</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-white">${activePkg.price}</span>
                    {activePkg.originalPrice && (
                      <span className="text-xs text-slate-400 line-through">${activePkg.originalPrice}</span>
                    )}
                    <span className="text-xs text-slate-400">/ traveler</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    id={`package-details-btn-${activePkg.id}`}
                    onClick={() => onSelectPackage(activePkg)}
                    className="px-4 py-3 rounded-full bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    View Day Timeline
                  </button>

                  <button
                    id={`package-book-btn-${activePkg.id}`}
                    onClick={() => handleCopyTrip(activePkg)}
                    className="px-5 py-3 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg hover:shadow-sky-500/25 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
                  >
                    <Copy className="w-4 h-4 text-slate-950" />
                    <span>{copiedId === activePkg.id ? 'Trip Cloned!' : 'Copy & Plan Trip'}</span>
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
};
