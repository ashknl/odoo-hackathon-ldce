import React from 'react';
import { 
  X, 
  MapPin, 
  Star, 
  Calendar, 
  Users, 
  DollarSign, 
  Heart, 
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface SelectedPlaceData {
  id: string;
  name: string;
  location: string;
  image: string;
  price?: number;
  rating?: number;
  discount?: string;
  description: string;
}

interface PlaceDetailModalProps {
  place: SelectedPlaceData | null;
  isOpen: boolean;
  onClose: () => void;
  onBook: (place: SelectedPlaceData) => void;
  isSaved: boolean;
  onToggleWishlist: (id: string) => void;
}

export const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({
  place,
  isOpen,
  onClose,
  onBook,
  isSaved,
  onToggleWishlist
}) => {
  if (!isOpen || !place) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative bg-white rounded-[28px] sm:rounded-[36px] overflow-hidden max-w-2xl w-full shadow-2xl z-10 border border-slate-100 max-h-[90vh] flex flex-col"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors z-20 cursor-pointer backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Hero Image */}
          <div className="relative aspect-[16/9] w-full bg-slate-100 shrink-0">
            <img
              src={place.image}
              alt={place.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
            
            {/* Top Badges */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              {place.discount && (
                <span className="bg-[#48cae4] text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-md">
                  {place.discount}
                </span>
              )}
              {place.rating && (
                <span className="bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 text-xs font-bold text-slate-800">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{place.rating}</span>
                </span>
              )}
            </div>

            {/* Bottom Title overlay */}
            <div className="absolute bottom-4 left-6 right-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading drop-shadow">
                {place.name}
              </h2>
              <p className="text-xs sm:text-sm text-white/90 flex items-center gap-1.5 mt-1 drop-shadow">
                <MapPin className="w-3.5 h-3.5 text-[#0284c7]" />
                <span>{place.location}</span>
              </p>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                About this Experience
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {place.description}
              </p>
            </div>

            {/* Features Highlight */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Recommended Stay</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5 block">3 - 5 Days</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Free Cancellation</span>
                <span className="text-xs sm:text-sm font-bold text-emerald-600 mt-0.5 block">Up to 48h prior</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Tour Guide</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5 block">English / Multilingual</span>
              </div>
            </div>
          </div>

          {/* Modal Footer Strip */}
          <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4 shrink-0">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Starting from</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-black text-slate-900">
                  ${place.price || 148}
                </span>
                <span className="text-xs text-slate-400 font-normal">/person</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onToggleWishlist(place.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-rose-50 border-rose-200 text-rose-500'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
                title="Save Place"
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBook(place);
                }}
                className="px-6 sm:px-8 py-3 rounded-2xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Book This Trip</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
