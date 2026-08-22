import React, { useState } from 'react';
import { 
  Sliders, 
  Sparkles, 
  MapPin, 
  Plus, 
  Trash2, 
  Calendar, 
  Users, 
  DollarSign, 
  ArrowRight,
  Share2,
  CheckCircle2,
  Building2,
  Train,
  UtensilsCrossed,
  Ticket,
  Clock,
  Layers,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StopItem {
  id: string;
  city: string;
  country: string;
  days: number;
  avgDailyStay: number;
}

interface InteractivePlannerProps {
  onPlanSubmit: (planData: {
    tripTitle: string;
    stops: StopItem[];
    travelers: number;
    lodgingTier: string;
    totalEstimate: number;
  }) => void;
  onOpenBooking: () => void;
}

export const InteractivePlanner: React.FC<InteractivePlannerProps> = ({ onPlanSubmit, onOpenBooking }) => {
  const [tripTitle, setTripTitle] = useState('My Dream Multi-City Journey');
  const [stops, setStops] = useState<StopItem[]>([
    { id: '1', city: 'Tokyo', country: 'Japan', days: 3, avgDailyStay: 120 },
    { id: '2', city: 'Kyoto', country: 'Japan', days: 3, avgDailyStay: 110 },
    { id: '3', city: 'Osaka', country: 'Japan', days: 2, avgDailyStay: 95 }
  ]);
  const [travelers, setTravelers] = useState(2);
  const [lodgingTier, setLodgingTier] = useState<'budget' | 'comfort' | 'luxury'>('comfort');
  const [transitStyle, setTransitStyle] = useState<'high-speed-rail' | 'economy-rail' | 'private-car'>('high-speed-rail');
  const [diningStyle, setDiningStyle] = useState<'street-food' | 'casual-bistros' | 'fine-dining'>('casual-bistros');
  const [includeActivityPasses, setIncludeActivityPasses] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  // Available cities to add
  const availableCities = [
    { city: 'Paris', country: 'France', avgDailyStay: 150 },
    { city: 'Rome', country: 'Italy', avgDailyStay: 130 },
    { city: 'Florence', country: 'Italy', avgDailyStay: 120 },
    { city: 'Lucerne', country: 'Switzerland', avgDailyStay: 190 },
    { city: 'Barcelona', country: 'Spain', avgDailyStay: 115 },
    { city: 'Bali / Ubud', country: 'Indonesia', avgDailyStay: 60 },
    { city: 'New York', country: 'USA', avgDailyStay: 220 },
    { city: 'Montreal', country: 'Canada', avgDailyStay: 135 }
  ];

  // Calculate totals
  const totalDays = stops.reduce((sum, s) => sum + s.days, 0);

  const getLodgingMultiplier = () => {
    if (lodgingTier === 'budget') return 0.65;
    if (lodgingTier === 'comfort') return 1.0;
    return 2.1; // luxury
  };

  const getTransitDailyCost = () => {
    if (transitStyle === 'economy-rail') return 25;
    if (transitStyle === 'high-speed-rail') return 45;
    return 110; // private-car
  };

  const getDiningDailyCost = () => {
    if (diningStyle === 'street-food') return 30;
    if (diningStyle === 'casual-bistros') return 60;
    return 125; // fine-dining
  };

  const stayEstimate = Math.round(
    stops.reduce((acc, stop) => acc + (stop.days * stop.avgDailyStay * getLodgingMultiplier()), 0)
  );

  const transportEstimate = Math.round(totalDays * getTransitDailyCost());
  const diningEstimate = Math.round(totalDays * getDiningDailyCost());
  const activitiesEstimate = includeActivityPasses ? Math.round(totalDays * 35) : 0;

  const totalPerPerson = stayEstimate + transportEstimate + diningEstimate + activitiesEstimate;
  const grandTotal = totalPerPerson * travelers;
  const dailyAverage = totalDays > 0 ? Math.round(totalPerPerson / totalDays) : 0;

  // Add stop
  const handleAddStop = (selectedCity: typeof availableCities[0]) => {
    if (stops.some(s => s.city === selectedCity.city)) return;
    const newStop: StopItem = {
      id: Date.now().toString(),
      city: selectedCity.city,
      country: selectedCity.country,
      days: 2,
      avgDailyStay: selectedCity.avgDailyStay
    };
    setStops([...stops, newStop]);
  };

  // Remove stop
  const handleRemoveStop = (id: string) => {
    if (stops.length <= 1) return;
    setStops(stops.filter(s => s.id !== id));
  };

  // Update days for a stop
  const handleUpdateDays = (id: string, delta: number) => {
    setStops(stops.map(s => {
      if (s.id === id) {
        const newDays = Math.max(1, Math.min(14, s.days + delta));
        return { ...s, days: newDays };
      }
      return s;
    }));
  };

  const handleShare = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <section id="planner" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold uppercase tracking-wider mb-2">
          <Layers className="w-3.5 h-3.5" />
          <span>Interactive Itinerary Builder</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
          Design Multi-City Itineraries & Estimate Budgets
        </h2>
        <p className="text-slate-500 text-sm sm:text-base mt-2">
          Add travel stops, adjust city durations, customize accommodation and transit tiers, and get an instant automated cost breakdown.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Multi-City Stop Builder & Preferences */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          
          {/* Step 1: Manage Travel Stops */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                1. Multi-City Stops ({stops.length} Cities · {totalDays} Days)
              </label>
              <span className="text-xs font-semibold text-sky-600">Reorder & Adjust Durations</span>
            </div>

            {/* Stops List */}
            <div className="space-y-2.5">
              <AnimatePresence>
                {stops.map((stop, idx) => (
                  <motion.div
                    key={stop.id}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>
                      <div className="truncate">
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {stop.city}
                        </h4>
                        <span className="text-xs text-slate-500">
                          {stop.country} · Base stay ~${Math.round(stop.avgDailyStay * getLodgingMultiplier())}/nt
                        </span>
                      </div>
                    </div>

                    {/* Day Controls */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                        <button
                          onClick={() => handleUpdateDays(stop.id, -1)}
                          disabled={stop.days <= 1}
                          className="w-7 h-7 rounded-lg text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold text-sm disabled:opacity-30 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-12 text-center text-xs font-bold text-slate-900">
                          {stop.days} {stop.days === 1 ? 'day' : 'days'}
                        </span>
                        <button
                          onClick={() => handleUpdateDays(stop.id, 1)}
                          disabled={stop.days >= 14}
                          className="w-7 h-7 rounded-lg text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold text-sm disabled:opacity-30 cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      {stops.length > 1 && (
                        <button
                          onClick={() => handleRemoveStop(stop.id)}
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                          title="Remove Stop"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Quick Add City Buttons */}
            <div className="mt-3.5">
              <span className="text-[11px] font-bold uppercase text-slate-400 block mb-2">
                + Add another city to itinerary:
              </span>
              <div className="flex flex-wrap gap-2">
                {availableCities.filter(ac => !stops.some(s => s.city === ac.city)).slice(0, 5).map((ac) => (
                  <button
                    key={ac.city}
                    onClick={() => handleAddStop(ac)}
                    className="px-3 py-1.5 rounded-full bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-xs font-semibold text-slate-700 hover:text-sky-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{ac.city}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 2: Accommodation Tier */}
          <div className="pt-4 border-t border-slate-100">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
              2. Accommodation Standard
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'budget', title: 'Budget Hostels / B&B', desc: 'Central shared/private rooms', cost: '~$55/night' },
                { id: 'comfort', title: 'Comfort Boutique', desc: '4-Star boutique city hotels', cost: '~$120/night' },
                { id: 'luxury', title: 'Luxury 5-Star', desc: 'Premium suites & historic villas', cost: '~$280/night' }
              ].map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setLodgingTier(tier.id as any)}
                  className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                    lodgingTier === tier.id
                      ? 'border-sky-500 bg-sky-50/60 ring-2 ring-sky-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900">{tier.title}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{tier.desc}</div>
                  <div className="text-xs font-bold text-sky-600 mt-2">{tier.cost}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Transit & Travelers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Travelers
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    onClick={() => setTravelers(num)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      travelers === num
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {num} {num === 1 ? 'Solo' : `${num} Pax`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Transit Preference
              </label>
              <select
                value={transitStyle}
                onChange={(e) => setTransitStyle(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 cursor-pointer"
              >
                <option value="high-speed-rail">High-Speed Bullet Train (JR/TGV/Freccia)</option>
                <option value="economy-rail">Standard Regional Rail & Metro</option>
                <option value="private-car">Private Driver & Car Transfers</option>
              </select>
            </div>
          </div>

          {/* Activity Passes Checkbox */}
          <div className="pt-3 flex items-center justify-between bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-2.5">
              <Ticket className="w-4 h-4 text-sky-600" />
              <div>
                <span className="text-xs font-bold text-slate-900 block">Include Top Curated Activity Passes</span>
                <span className="text-[11px] text-slate-500">Skip-the-line museum admissions & historic walking tours</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={includeActivityPasses}
              onChange={(e) => setIncludeActivityPasses(e.target.checked)}
              className="w-4 h-4 accent-slate-900 cursor-pointer rounded"
            />
          </div>

        </div>

        {/* Right Column: Automated Budget Breakdown Card */}
        <div className="lg:col-span-5 bg-[#0f172a] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between space-y-6">
          
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-sky-400" />
                <h3 className="text-lg font-bold">Automated Budget Breakdown</h3>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                Live Forecast
              </span>
            </div>

            {/* Trip Specs Summary */}
            <div className="mt-4 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 text-xs flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[11px]">Route Summary:</span>
                <span className="font-bold text-white">{stops.map(s => s.city).join(' → ')}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[11px]">Duration:</span>
                <span className="font-bold text-sky-300">{totalDays} Days · {travelers} Traveler{travelers > 1 ? 's' : ''}</span>
              </div>
            </div>

            {/* Financial Category Breakdown Bars */}
            <div className="mt-5 space-y-3 text-xs">
              
              {/* Stay */}
              <div>
                <div className="flex justify-between font-semibold text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-sky-400" />
                    <span>Lodging & Stays ({totalDays} Nights)</span>
                  </span>
                  <span className="font-bold text-white">${stayEstimate}</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-sky-400 rounded-full" 
                    style={{ width: `${Math.min(100, (stayEstimate / totalPerPerson) * 100)}%` }} 
                  />
                </div>
              </div>

              {/* Transit */}
              <div>
                <div className="flex justify-between font-semibold text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Train className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Inter-City Transport & Passes</span>
                  </span>
                  <span className="font-bold text-white">${transportEstimate}</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-400 rounded-full" 
                    style={{ width: `${Math.min(100, (transportEstimate / totalPerPerson) * 100)}%` }} 
                  />
                </div>
              </div>

              {/* Dining */}
              <div>
                <div className="flex justify-between font-semibold text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5">
                    <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400" />
                    <span>Daily Dining & Culinary Experiences</span>
                  </span>
                  <span className="font-bold text-white">${diningEstimate}</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-400 rounded-full" 
                    style={{ width: `${Math.min(100, (diningEstimate / totalPerPerson) * 100)}%` }} 
                  />
                </div>
              </div>

              {/* Activities */}
              {includeActivityPasses && (
                <div>
                  <div className="flex justify-between font-semibold text-slate-300 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Ticket className="w-3.5 h-3.5 text-purple-400" />
                      <span>Curated Attractions & Sightseeing</span>
                    </span>
                    <span className="font-bold text-white">${activitiesEstimate}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-400 rounded-full" 
                      style={{ width: `${Math.min(100, (activitiesEstimate / totalPerPerson) * 100)}%` }} 
                    />
                  </div>
                </div>
              )}

            </div>

            {/* Total Highlight */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-slate-400 text-xs uppercase font-bold block">Estimated Total / Person</span>
                  <span className="text-3xl sm:text-4xl font-black text-white">${totalPerPerson}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-xs font-semibold block">Daily Average</span>
                  <span className="text-lg font-bold text-sky-400">${dailyAverage}/day</span>
                </div>
              </div>

              {travelers > 1 && (
                <div className="mt-2 text-xs text-slate-400 text-right">
                  Grand Total ({travelers} Travelers): <strong className="text-white font-bold">${grandTotal}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <button
              id="planner-save-trip-btn"
              onClick={() => {
                onPlanSubmit({
                  tripTitle,
                  stops,
                  travelers,
                  lodgingTier,
                  totalEstimate: totalPerPerson
                });
              }}
              className="w-full py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Save & View Detailed Timeline</span>
              <ArrowRight className="w-4 h-4 text-slate-900" />
            </button>

            <button
              id="planner-share-btn"
              onClick={handleShare}
              className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs border border-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-sky-400" />
              <span>{copiedLink ? 'Shareable Link Copied to Clipboard!' : 'Share Public Itinerary Link'}</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
