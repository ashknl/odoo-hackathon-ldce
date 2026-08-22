import React, { useState } from 'react';
import { MapPin, Star, SlidersHorizontal, Heart, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EXPLORE_MORE_PLACES } from '../data/travelData';
import { ExplorePlace } from '../types/travel';

interface ExploreMoreProps {
  onSelectPlace: (place: ExplorePlace) => void;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
}

export const ExploreMore: React.FC<ExploreMoreProps> = ({
  onSelectPlace,
  wishlist,
  onToggleWishlist
}) => {
  const [selectedCategory, setSelectedCategory] = useState('Popular destination');
  const [showAll, setShowAll] = useState(false);

  const categories = [
    'Popular destination',
    'Islands',
    'Surfing',
    'Nation parks',
    'Lake',
    'Beach',
    'Camp'
  ];

  // Filter items
  const filteredPlaces = EXPLORE_MORE_PLACES.filter(item => {
    if (selectedCategory === 'Popular destination') return true;
    return item.category === selectedCategory;
  });

  const displayedPlaces = showAll ? filteredPlaces : filteredPlaces.slice(0, 6);

  return (
    <section id="explore" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      
      {/* Section Header Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            Explore more
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
            Let's go on an adventure
          </p>
        </div>

        <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
          All-inclusive vacations and flights to the Caribbean, Indonesian, and more than 1,300 destinations worldwide. Let's explore now.
        </p>
      </div>

      {/* Filter Category Tabs Row + Filters Button */}
      <div className="flex items-center justify-between gap-3 mb-8 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-2 sm:gap-2.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setShowAll(false);
              }}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setSelectedCategory('Popular destination')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors shrink-0 cursor-pointer ml-auto"
        >
          <span>Filters</span>
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
        </button>
      </div>

      {/* 6 Cards Grid (3x2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {displayedPlaces.map((place, idx) => {
            const isSaved = wishlist.includes(place.id);

            return (
              <motion.div
                key={place.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                onClick={() => onSelectPlace(place)}
                className="group cursor-pointer flex flex-col"
              >
                {/* Image Frame */}
                <div className="relative aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-100 shadow-sm group-hover:shadow-md transition-all">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Rating Badge in Top Right */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 text-[11px] font-bold text-slate-800">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{place.rating}</span>
                  </div>

                  {/* Bookmark Heart Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(place.id);
                    }}
                    className={`absolute top-3 left-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                      isSaved
                        ? 'bg-rose-500 text-white'
                        : 'bg-black/30 text-white hover:bg-black/50'
                    }`}
                    title="Save Destination"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`} />
                  </button>
                </div>

                {/* Info Row: Title & Location on Left, Price on Right */}
                <div className="pt-3.5 flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-[#0284c7] transition-colors">
                      {place.name}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{place.location}</span>
                    </p>
                  </div>

                  <div className="text-right whitespace-nowrap">
                    <span className="font-black text-slate-950 text-sm sm:text-base">
                      ${place.pricePerPax}
                    </span>
                    <span className="text-xs text-slate-400 font-normal">/Pax</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Show More Button Centered Below */}
      {filteredPlaces.length > 6 && (
        <div className="text-center mt-10">
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            id="explore-show-more-btn"
            className="px-8 py-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>{showAll ? 'Show less' : 'Show more'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAll ? 'rotate-180' : ''}`} />
          </button>
        </div>
      )}

    </section>
  );
};
