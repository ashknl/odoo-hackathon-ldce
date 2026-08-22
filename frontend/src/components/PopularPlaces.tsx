import React from 'react';
import { MapPin, Sparkles, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { POPULAR_PLACES } from '../data/travelData';
import { PopularPlace } from '../types/travel';

interface PopularPlacesProps {
  onSelectPlace: (place: PopularPlace) => void;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
}

export const PopularPlaces: React.FC<PopularPlacesProps> = ({
  onSelectPlace,
  wishlist,
  onToggleWishlist
}) => {
  return (
    <section id="popular-places" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      
      {/* Section Header Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            Popular Place
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
            Let's enjoy this heaven on earth
          </p>
        </div>

        <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
          Many places are very famous, beautiful, clean, and will give a very deep impression to visitors and will make them come back.
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        {POPULAR_PLACES.map((place, idx) => {
          const isSaved = wishlist.includes(place.id);

          return (
            <motion.div
              key={place.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="group cursor-pointer flex flex-col"
              onClick={() => onSelectPlace(place)}
            >
              {/* Image Box */}
              <div className="relative aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-100 shadow-sm group-hover:shadow-md transition-all">
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* 20% OFF Cyan Badge in top right (exact match to reference) */}
                <div className="absolute top-3 right-3 bg-[#48cae4] text-slate-950 font-black text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full shadow-sm">
                  {place.discount}
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
                  title="Save Place"
                >
                  <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`} />
                </button>
              </div>

              {/* Text Info Below Image */}
              <div className="pt-3">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-[#0284c7] transition-colors">
                  {place.name}
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{place.location}</span>
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

    </section>
  );
};
