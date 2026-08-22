import React from 'react';
import { 
  X, 
  Heart, 
  Trash2, 
  ArrowRight, 
  MapPin, 
  Star,
  Compass 
} from 'lucide-react';
import { motion } from 'motion/react';
import { DESTINATIONS, POPULAR_PLACES, EXPLORE_MORE_PLACES, ADVENTURE_STAMPS } from '../data/travelData';
import { SelectedPlaceData } from './PlaceDetailModal';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: string[];
  onRemoveWishlist: (id: string) => void;
  onSelectPlace: (place: SelectedPlaceData) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlist,
  onRemoveWishlist,
  onSelectPlace
}) => {
  if (!isOpen) return null;

  // Build unified list of saved items
  const savedItems: SelectedPlaceData[] = [];

  // Check Popular Places
  POPULAR_PLACES.forEach(p => {
    if (wishlist.includes(p.id)) {
      savedItems.push({
        id: p.id,
        name: p.name,
        location: p.location,
        image: p.image,
        price: p.price,
        rating: p.rating,
        discount: p.discount,
        description: p.description
      });
    }
  });

  // Check Explore Places
  EXPLORE_MORE_PLACES.forEach(p => {
    if (wishlist.includes(p.id) && !savedItems.some(i => i.id === p.id)) {
      savedItems.push({
        id: p.id,
        name: p.name,
        location: p.location,
        image: p.image,
        price: p.pricePerPax,
        rating: p.rating,
        description: p.description
      });
    }
  });

  // Check Adventure Stamps
  ADVENTURE_STAMPS.forEach(p => {
    if (wishlist.includes(p.id) && !savedItems.some(i => i.id === p.id)) {
      savedItems.push({
        id: p.id,
        name: p.city,
        location: `${p.landmark}, ${p.country}`,
        image: p.image,
        description: p.description
      });
    }
  });

  // Check Destinations
  DESTINATIONS.forEach(d => {
    if (wishlist.includes(d.id) && !savedItems.some(i => i.id === d.id)) {
      savedItems.push({
        id: d.id,
        name: d.title,
        location: `${d.city}, ${d.country}`,
        image: d.image,
        price: d.priceFrom,
        rating: d.rating,
        description: d.description
      });
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 flex flex-col justify-between"
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center">
                <Heart className="w-4 h-4 fill-rose-500" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Saved Places</h3>
                <p className="text-xs text-slate-400">{savedItems.length} places in your wishlist</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          {savedItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-3">
              <Compass className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-bold text-slate-700">No places saved yet</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Click the heart icon on any card across the page to curate your personal bucket list.
              </p>
            </div>
          ) : (
            <div className="space-y-3 divide-y divide-slate-100">
              {savedItems.map(item => (
                <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3.5 group">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-2xl object-cover bg-slate-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-[#0284c7] transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </p>
                    {item.price && (
                      <div className="text-xs font-black text-slate-900 mt-1">
                        ${item.price} <span className="font-normal text-slate-400 text-[10px]">/person</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        onClose();
                        onSelectPlace(item);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-[#0284c7] text-white text-xs font-bold hover:bg-[#0369a1] transition-all cursor-pointer"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onRemoveWishlist(item.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 cursor-pointer"
          >
            Close
          </button>
        </div>

      </motion.div>
    </div>
  );
};
