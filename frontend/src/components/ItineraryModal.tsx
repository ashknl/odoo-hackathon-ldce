import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  DollarSign, 
  ArrowRight,
  Layers,
  Sparkles,
  Ticket,
  Building2,
  Train
} from 'lucide-react';
import { motion } from 'motion/react';
import { Destination, TravelPackage } from '../types/travel';

interface ItineraryModalProps {
  item: Destination | TravelPackage | null;
  onClose: () => void;
  onBook: (item: Destination | TravelPackage) => void;
}

export const ItineraryModal: React.FC<ItineraryModalProps> = ({
  item,
  onClose,
  onBook
}) => {
  const [activeDay, setActiveDay] = useState<number>(1);

  if (!item) return null;

  const isPackage = 'inclusions' in item;
  const itinerary = item.itinerary || [];
  const activeDayData = itinerary.find(d => d.day === activeDay) || itinerary[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 relative my-auto flex flex-col justify-between"
      >
        
        {/* Modal Header & Hero Banner */}
        <div className="relative aspect-[16/7] sm:aspect-[16/6] w-full bg-slate-950 shrink-0">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/60 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20 transition-colors z-10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 text-xs text-sky-300 font-semibold mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{'city' in item ? `${item.city}, ${item.country}` : `${(item as TravelPackage).cities?.join(' · ') || item.title}`}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {item.title}
            </h3>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-1">
          
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-slate-400 block uppercase font-bold text-[10px]">Cost Index</span>
              <span className="font-bold text-slate-800">
                {'costIndex' in item ? `${item.costIndex} Cost` : 'Curated'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block uppercase font-bold text-[10px]">Daily Average</span>
              <span className="font-bold text-sky-600">
                {'avgDailyCost' in item ? `$${item.avgDailyCost}/day` : `$${(item as TravelPackage).avgCostPerDay}/day`}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block uppercase font-bold text-[10px]">Ideal Duration</span>
              <span className="font-bold text-slate-800">
                {'idealDuration' in item ? item.idealDuration : `${(item as TravelPackage).days} Days`}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block uppercase font-bold text-[10px]">Traveler Rating</span>
              <span className="font-bold text-amber-600">★ {item.rating} ({item.reviewCount})</span>
            </div>
          </div>

          {/* Day-by-Day Selector Tabs */}
          {itinerary.length > 0 && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Day-by-Day Visual Timeline ({itinerary.length} Days)
              </label>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {itinerary.map((dayItem) => (
                  <button
                    key={dayItem.day}
                    onClick={() => setActiveDay(dayItem.day)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeDay === dayItem.day
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Day {dayItem.day} {dayItem.city ? `· ${dayItem.city}` : ''}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Active Day Detail Card */}
          {activeDayData && (
            <div className="bg-sky-50/60 rounded-2xl p-5 border border-sky-100 space-y-3">
              <div className="flex items-center justify-between border-b border-sky-100 pb-2">
                <h4 className="text-sm sm:text-base font-bold text-slate-900">
                  Day {activeDayData.day}: {activeDayData.title}
                </h4>
                {activeDayData.city && (
                  <span className="text-xs font-semibold text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-full">
                    {activeDayData.city}
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {activeDayData.description}
              </p>

              {/* Day Highlights */}
              <div className="space-y-1 pt-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Scheduled Activities:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeDayData.highlights.map((hl, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Inclusions or Destination Highlights */}
          {isPackage && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Included Logistics & Passes
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                {(item as TravelPackage).inclusions.map((inc, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer / Action Bar */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-3xl flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-slate-400 block uppercase font-bold">Estimated Trip Price</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-950">
                ${'priceFrom' in item ? item.priceFrom : item.price}
              </span>
              <span className="text-xs text-slate-500">/ traveler</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-all cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBook(item);
              }}
              className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Plan This Journey</span>
              <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
};
