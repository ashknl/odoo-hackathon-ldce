import React, { useState } from 'react';
import { 
  MapPin, 
  Compass, 
  ArrowUpRight, 
  Star, 
  Heart, 
  Calendar,
  Sparkles,
  TrendingUp,
  DollarSign,
  Tag,
  Eye,
  Plus
} from 'lucide-react';
import { motion } from 'motion/react';
import { Destination } from '../types/travel';

interface DestinationsGridProps {
  destinations: Destination[];
  onSelectDestination: (dest: Destination) => void;
  onBookDestination: (dest: Destination) => void;
  wishlist: string[];
  onToggleWishlist: (destId: string) => void;
  onAddToPlanner?: (dest: Destination) => void;
}

export const DestinationsGrid: React.FC<DestinationsGridProps> = ({
  destinations,
  onSelectDestination,
  onBookDestination,
  wishlist,
  onToggleWishlist,
  onAddToPlanner
}) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Multi-City', 'Cultural', 'Culinary', 'Nature & Scenic', 'Coastal & Island'];

  const filterByCategory = (dest: Destination) => {
    if (activeCategory === 'All') return true;
    return dest.categories.includes(activeCategory as any);
  };

  const filtered = destinations.filter(filterByCategory);

  const getCostBadge = (cost: string) => {
    switch (cost) {
      case 'Budget': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Moderate': return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'High': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Luxury': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <section id="destinations" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200/80 text-sky-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Destination Discovery</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Explore Global Cities & Destinations
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-1.5 max-w-xl">
            Compare average daily budgets, discover curated activities, and add top destinations to your customized multi-city travel plan.
          </p>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`cat-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Layout with strictly aligned cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((dest, idx) => {
          const isWishlisted = wishlist.includes(dest.id);

          return (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              {/* Card Image Area */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                <img
                  src={dest.image}
                  alt={dest.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Dark Vignette Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                {/* Top Badges: Tag & Wishlist */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-white text-[11px] font-bold border border-white/20">
                    {dest.tag}
                  </span>

                  <button
                    id={`wishlist-btn-${dest.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(dest.id);
                    }}
                    className="w-9 h-9 rounded-full bg-white/90 hover:bg-white backdrop-blur-md flex items-center justify-center text-slate-700 hover:text-rose-500 shadow-md transition-all active:scale-90 cursor-pointer"
                    title={isWishlisted ? 'Remove from saved' : 'Save to wishlist'}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'text-rose-500 fill-rose-500' : ''}`} />
                  </button>
                </div>

                {/* Bottom Overlay Info on Image */}
                <div className="absolute bottom-3 left-4 right-4 text-white z-10">
                  <div className="flex items-center gap-2 text-xs font-semibold text-sky-300 mb-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{dest.city}, {dest.country}</span>
                    <span className="text-white/40">•</span>
                    <span className="text-white/90">{dest.idealDuration}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-sky-200 transition-colors line-clamp-1">
                    {dest.title}
                  </h3>
                </div>
              </div>

              {/* Card Body Details */}
              <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                
                <div>
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {dest.description}
                  </p>

                  {/* Multi-City Stops or Top Activities */}
                  {dest.sampleMultiCityStops && dest.sampleMultiCityStops.length > 0 && (
                    <div className="mt-3 bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Sample Route Stops:</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {dest.sampleMultiCityStops.map((stop, i) => (
                          <span key={i} className="inline-flex items-center text-[11px] font-semibold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                            {stop}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Top Activities Badges */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {dest.topActivities.slice(0, 2).map((act) => (
                      <span key={act.id} className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {act.name} (${act.cost})
                      </span>
                    ))}
                  </div>
                </div>

                {/* Metadata Pill Bar (Cost Index, Avg Daily Cost, Rating) */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <span className={`px-2.5 py-0.5 rounded-full font-bold border text-[11px] ${getCostBadge(dest.costIndex)}`}>
                    {dest.costIndex} Cost
                  </span>

                  <span className="text-slate-600 font-semibold text-xs flex items-center gap-1">
                    <span>Avg</span>
                    <strong className="text-sky-700">${dest.avgDailyCost}/day</strong>
                  </span>

                  <div className="flex items-center gap-1 font-bold text-slate-800">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{dest.rating}</span>
                    <span className="text-slate-400 font-normal text-[11px]">({dest.reviewCount})</span>
                  </div>
                </div>

                {/* Pricing & Action Buttons */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">Total Trip Est.</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-black text-slate-950">${dest.priceFrom}</span>
                      <span className="text-xs text-slate-500 font-normal">/ person</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id={`view-itinerary-${dest.id}`}
                      onClick={() => onSelectDestination(dest)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-600" />
                      <span>Itinerary</span>
                    </button>
                    <button
                      id={`book-dest-${dest.id}`}
                      onClick={() => onBookDestination(dest)}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm hover:shadow transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Plan</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-sky-400" />
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          );
        })}
      </div>

    </section>
  );
};
