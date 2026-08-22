import React, { useState, useEffect } from 'react';
import {
  Calendar,
  DollarSign,
  Plus,
  Trash2,
  MapPin,
  Clock,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  Share2,
  CheckCircle2,
  Compass,
  Search,
  Tag,
  Building2,
  Utensils,
  Landmark,
  Trees,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Trip, TripStop, PlannedActivity, City, OpenTripMapPOI } from '../types/schema';
import { tripsApi, stopsApi, activitiesApi, citiesApi } from '../services/api';
import { POPULAR_CITIES, USER_PREVIOUS_TRIPS } from '../data/homeData';

interface ItineraryBuilderPageProps {
  tripId?: string;
  onBack: () => void;
  showToast?: (message: string) => void;
}

export const ItineraryBuilderPage: React.FC<ItineraryBuilderPageProps> = ({
  tripId,
  onBack,
  showToast
}) => {
  // Active Trip State
  const [trip, setTrip] = useState<Trip | null>(null);
  const [stops, setStops] = useState<TripStop[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals & Drawers
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [activeStopForActivity, setActiveStopForActivity] = useState<string | null>(null);
  const [isActivitySearchOpen, setIsActivitySearchOpen] = useState(false);

  // New Section (Stop) Form State
  const [selectedCityId, setSelectedCityId] = useState('');
  const [sectionStartDate, setSectionStartDate] = useState('');
  const [sectionEndDate, setSectionEndDate] = useState('');
  const [sectionBudget, setSectionBudget] = useState('8000');
  const [sectionNotes, setSectionNotes] = useState('');

  // Activity Search Drawer State
  const [availableCities, setAvailableCities] = useState<City[]>(POPULAR_CITIES);
  const [activitySearchQuery, setActivitySearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchResults, setSearchResults] = useState<OpenTripMapPOI[]>([]);
  const [searchingActivities, setSearchingActivities] = useState(false);

  // Custom Manual Activity State
  const [manualTitle, setManualTitle] = useState('');
  const [manualCost, setManualCost] = useState('500');
  const [manualTime, setManualTime] = useState('10:00 AM');
  const [manualNotes, setManualNotes] = useState('');

  // 1. Fetch Trip & Stops Data on Load
  useEffect(() => {
    async function loadItinerary() {
      setLoading(true);
      try {
        const idToFetch = tripId || USER_PREVIOUS_TRIPS[0].id;
        const res = await tripsApi.getItinerary(idToFetch);
        setTrip(res.trip);
        setStops(res.stops || []);
      } catch (err) {
        console.error('Failed to load itinerary:', err);
      } finally {
        setLoading(false);
      }

      try {
        const cList = await citiesApi.getCities();
        if (cList && cList.length > 0) setAvailableCities(cList);
      } catch (err) {
        console.error(err);
      }
    }
    loadItinerary();
  }, [tripId]);

  // 2. Fetch OpenTripMap Activities when search drawer opens
  useEffect(() => {
    if (!isActivitySearchOpen) return;

    async function fetchActivities() {
      setSearchingActivities(true);
      try {
        const pois = await activitiesApi.searchActivities({
          q: activitySearchQuery,
          type: selectedCategory === 'all' ? undefined : selectedCategory,
        });
        setSearchResults(pois);
      } catch (err) {
        console.error(err);
      } finally {
        setSearchingActivities(false);
      }
    }
    fetchActivities();
  }, [isActivitySearchOpen, activitySearchQuery, selectedCategory]);

  // Handle Add New Section (Trip Stop)
  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCityId || !trip) return;

    const chosenCity = availableCities.find((c) => c.id === selectedCityId) || availableCities[0];

    try {
      const newStop = await stopsApi.addStop(trip.id, {
        cityId: selectedCityId,
        startDate: sectionStartDate || trip.start_date || trip.startDate || '2026-09-01',
        endDate: sectionEndDate || trip.end_date || trip.endDate || '2026-09-05',
        budget: Number(sectionBudget),
      });

      // Ensure city object is attached
      newStop.city = chosenCity;
      newStop.activities = [];

      setStops((prev) => [...prev, newStop]);
      setIsAddSectionOpen(false);
      setSelectedCityId('');
      if (showToast) showToast(`Added Section: ${chosenCity.name}`);
    } catch (err) {
      console.error(err);
      if (showToast) showToast('Section added to local itinerary');
    }
  };

  // Handle Remove Section (Stop)
  const handleRemoveSection = (stopId: string) => {
    setStops((prev) => prev.filter((s) => s.id !== stopId));
    if (showToast) showToast('Section removed from itinerary');
  };

  // Handle Add Activity (From OpenTripMap search or manual input)
  const handleAddActivityToStop = (poi?: OpenTripMapPOI) => {
    if (!activeStopForActivity) return;

    const activityTitle = poi ? poi.name : manualTitle || 'Explore Landmark';
    const activityCost = poi ? poi.plannedCost || 400 : Number(manualCost) || 500;
    const activityCategory = poi ? poi.kinds.split(',')[0] : 'sightseeing';

    const newActivity: PlannedActivity = {
      id: `act-${Date.now()}`,
      stop_id: activeStopForActivity,
      title: activityTitle,
      category: activityCategory,
      planned_cost: activityCost,
      scheduled_time: manualTime || '10:00 AM',
      notes: poi ? `POI ID: ${poi.otmPlaceId}` : manualNotes || 'Recommended spot',
      preview_url: poi?.previewUrl,
    };

    setStops((prevStops) =>
      prevStops.map((st) => {
        if (st.id === activeStopForActivity) {
          return {
            ...st,
            activities: [...(st.activities || []), newActivity],
          };
        }
        return st;
      })
    );

    setIsActivitySearchOpen(false);
    setManualTitle('');
    setManualNotes('');
    if (showToast) showToast(`Added "${activityTitle}" to section`);
  };

  // Calculate totals
  const totalSectionBudget = stops.reduce((acc, s) => acc + (s.budget || 0), 0);
  const totalPlannedActivitiesCost = stops.reduce(
    (acc, s) => acc + (s.activities?.reduce((a, act) => a + (act.planned_cost || 0), 0) || 0),
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#0284c7] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-slate-500">Loading Itinerary Builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 pb-24 pt-6 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 font-sans">
      
      {/* Navigation Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#0284c7] transition-colors cursor-pointer bg-white px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Screen 5: Itinerary Builder</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              if (showToast) showToast('Share link copied to clipboard!');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 text-[#0284c7] text-xs font-bold border border-sky-100 hover:bg-sky-100 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Itinerary</span>
          </button>
        </div>
      </div>

      {/* Trip Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute inset-0 opacity-40 bg-cover bg-center" style={{ backgroundImage: `url(${trip?.cover_image || trip?.coverUrl || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0284c7]/90 text-white text-xs font-bold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Itinerary Builder</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight font-display">
            {trip?.name || 'My Custom Trip Itinerary'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            {trip?.description || 'Organize your trip stops, hotel stays, travel sections, and activities into clear date-ranged sections.'}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-white/10 text-xs">
            <div className="flex items-center gap-1.5 text-sky-200">
              <Calendar className="w-4 h-4 text-[#0284c7]" />
              <span className="font-semibold">
                {trip?.start_date || trip?.startDate || '2026-09-01'} to {trip?.end_date || trip?.endDate || '2026-09-10'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-emerald-300 font-bold bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
              <DollarSign className="w-4 h-4" />
              <span>Total Trip Budget: ₹{(trip?.budget || 45000).toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-1.5 text-sky-200 bg-sky-950/60 px-3 py-1 rounded-full border border-sky-500/30">
              <span>Section Budget Sum: ₹{totalSectionBudget.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Wireframe Sections List (Screen 5 Mockup) */}
      <div className="space-y-6">
        
        {stops.map((stop, index) => {
          const stopActivitiesCost = stop.activities?.reduce((acc, act) => acc + (act.planned_cost || 0), 0) || 0;

          return (
            <div
              key={stop.id || `stop-${index}`}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6 hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              {/* Top Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-[#0284c7] bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100">
                      Section {index + 1}
                    </span>
                    <h2 className="text-xl font-black text-slate-900 font-display">
                      {stop.city?.name || `Destination Stop ${index + 1}`}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500">
                    All the necessary information about this section (Travel, Hotel, or Activities in {stop.city?.country || 'Destination'})
                  </p>
                </div>

                <button
                  onClick={() => handleRemoveSection(stop.id)}
                  className="text-slate-400 hover:text-rose-500 p-2 rounded-xl hover:bg-rose-50 transition-colors self-start sm:self-center cursor-pointer"
                  title="Delete section"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Wireframe Badges Row: Date Range Box & Budget of this Section Box */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Date Range Box (Screen 5 Wireframe) */}
                <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/80 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-[#0284c7] flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                      Date Range
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {stop.start_date || stop.startDate || 'Sep 1, 2026'} to {stop.end_date || stop.endDate || 'Sep 5, 2026'}
                    </span>
                  </div>
                </div>

                {/* 2. Budget of this Section Box (Screen 5 Wireframe) */}
                <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                        Budget of this section
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        ₹{(stop.budget || 8000).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200/80">
                    Used: ₹{stopActivitiesCost.toLocaleString()}
                  </span>
                </div>

              </div>

              {/* Planned Activities List within Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#0284c7]" />
                    <span>Activities & Bookings in this section</span>
                  </h4>

                  <button
                    onClick={() => {
                      setActiveStopForActivity(stop.id);
                      setIsActivitySearchOpen(true);
                    }}
                    className="text-xs font-bold text-[#0284c7] hover:text-[#0369a1] bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-xl border border-sky-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Activity</span>
                  </button>
                </div>

                {(!stop.activities || stop.activities.length === 0) ? (
                  <div className="border border-dashed border-slate-200 rounded-2xl p-4 text-center bg-slate-50/50">
                    <p className="text-xs font-semibold text-slate-400">No activities added yet for this section.</p>
                    <button
                      onClick={() => {
                        setActiveStopForActivity(stop.id);
                        setIsActivitySearchOpen(true);
                      }}
                      className="mt-2 text-xs font-bold text-[#0284c7] hover:underline cursor-pointer"
                    >
                      Browse OpenTripMap activities or add manually
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {stop.activities.map((act) => (
                      <div
                        key={act.id}
                        className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 flex items-start gap-3 hover:border-sky-300 transition-colors"
                      >
                        {act.preview_url ? (
                          <img
                            src={act.preview_url}
                            alt={act.title}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-sky-100 text-[#0284c7] flex items-center justify-center shrink-0">
                            <Compass className="w-6 h-6" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h5 className="text-xs font-bold text-slate-900 truncate">{act.title}</h5>
                            <span className="text-[11px] font-bold text-emerald-600 shrink-0">
                              ₹{act.planned_cost}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {act.scheduled_time || 'Flexible'}
                            </span>
                            <span>•</span>
                            <span className="capitalize text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded font-semibold text-[10px]">
                              {act.category || 'Sightseeing'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          );
        })}

        {/* Wireframe Bottom Action: "+ Add another Section" Button (Screen 5 Mockup) */}
        <div className="pt-4 flex justify-center">
          <button
            onClick={() => setIsAddSectionOpen(true)}
            id="add-section-btn"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-[#0284c7] font-black text-base border-2 border-dashed border-[#0284c7]/40 hover:border-[#0284c7] shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-sky-100 group-hover:bg-[#0284c7] group-hover:text-white text-[#0284c7] flex items-center justify-center transition-colors">
              <Plus className="w-5 h-5" />
            </div>
            <span>+ Add another Section</span>
          </button>
        </div>

      </div>

      {/* Modal 1: Add New Section (Trip Stop) */}
      <AnimatePresence>
        {isAddSectionOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Add New Section to Itinerary</h3>
                  <p className="text-xs text-slate-500">Configure a destination stop with date range and budget.</p>
                </div>
                <button
                  onClick={() => setIsAddSectionOpen(false)}
                  className="text-slate-400 hover:text-slate-700 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddSection} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Select Destination City</label>
                  <select
                    value={selectedCityId}
                    onChange={(e) => setSelectedCityId(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                  >
                    <option value="">-- Select Destination --</option>
                    {availableCities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}, {c.country} ({c.region})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={sectionStartDate}
                      onChange={(e) => setSectionStartDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={sectionEndDate}
                      onChange={(e) => setSectionEndDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section Budget (₹)</label>
                  <input
                    type="number"
                    value={sectionBudget}
                    onChange={(e) => setSectionBudget(e.target.value)}
                    placeholder="e.g. 10000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddSectionOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold shadow-sm"
                  >
                    Save Section
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal 2: Activity Search & Selection Drawer (OpenTripMap Integration) */}
      <AnimatePresence>
        {isActivitySearchOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Add Activity to Section</h3>
                  <p className="text-xs text-slate-500">Search OpenTripMap POIs or add custom activity details.</p>
                </div>
                <button
                  onClick={() => setIsActivitySearchOpen(false)}
                  className="text-slate-400 hover:text-slate-700 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Activity Search Input */}
              <div className="relative shrink-0">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search live activities, waterfalls, forts, museums..."
                  value={activitySearchQuery}
                  onChange={(e) => setActivitySearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                />
              </div>

              {/* POI Search Results */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                <h4 className="text-xs font-bold text-slate-700">OpenTripMap Suggested POIs</h4>

                {searchingActivities ? (
                  <p className="text-xs text-slate-400 italic">Searching OpenTripMap POIs...</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {searchResults.map((poi, idx) => (
                      <div
                        key={poi.otmPlaceId || idx}
                        className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 flex flex-col justify-between space-y-3 hover:border-sky-300 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={poi.previewUrl}
                            alt={poi.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <h5 className="text-xs font-bold text-slate-900 leading-tight">{poi.name}</h5>
                            <span className="text-[10px] text-slate-500 capitalize">{poi.kinds.split(',')[0]}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                          <span className="text-xs font-extrabold text-emerald-600">₹{poi.plannedCost}</span>
                          <button
                            onClick={() => handleAddActivityToStop(poi)}
                            className="px-2.5 py-1 rounded-lg bg-[#0284c7] text-white text-[11px] font-bold hover:bg-[#0369a1] cursor-pointer"
                          >
                            + Select
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Or Custom Manual Input */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <h4 className="text-xs font-bold text-slate-700">Or Add Custom Activity</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Activity title (e.g. Hotel Check-in)"
                      value={manualTitle}
                      onChange={(e) => setManualTitle(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                    <input
                      type="number"
                      placeholder="Planned Cost (₹)"
                      value={manualCost}
                      onChange={(e) => setManualCost(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                    <button
                      onClick={() => handleAddActivityToStop()}
                      className="py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
                    >
                      Add Custom
                    </button>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
