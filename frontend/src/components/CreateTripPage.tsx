import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  DollarSign,
  FileText,
  Image as ImageIcon,
  Compass,
  Plus,
  Check,
  ArrowLeft,
  Sparkles,
  Star,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { POPULAR_CITIES } from '../data/homeData';
import { City, Trip } from '../types/schema';
import { tripsApi, stopsApi } from '../services/api';

interface CreateTripPageProps {
  onBackToHome: () => void;
  onTripCreated?: (newTrip: Trip) => void;
  showToast?: (message: string) => void;
}

export const CreateTripPage: React.FC<CreateTripPageProps> = ({
  onBackToHome,
  onTripCreated,
  showToast,
}) => {
  // Form State
  const [tripName, setTripName] = useState('');
  const [selectedCityId, setSelectedCityId] = useState(POPULAR_CITIES[0].id);
  const [startDate, setStartDate] = useState('2026-12-25');
  const [endDate, setEndDate] = useState('2026-12-30');
  const [budget, setBudget] = useState<number>(35000);
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState(POPULAR_CITIES[0].image);

  // Selected Suggestions for places/activities to visit
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([
    POPULAR_CITIES[0].id,
    POPULAR_CITIES[1].id,
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Preset cover image options
  const coverPresets = [
    'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
  ];

  const toggleSuggestion = (cityId: string) => {
    setSelectedSuggestions((prev) =>
      prev.includes(cityId) ? prev.filter((id) => id !== cityId) : [...prev, cityId]
    );
  };

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tripName.trim()) {
      if (showToast) showToast('Please enter a name for your trip');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Invoke tripsApi.createTrip — pass cover_image matching trips.cover_image schema column
      const createdTrip = await tripsApi.createTrip({
        name: tripName,
        description: description || `Personalized multi-stop itinerary`,
        start_date: startDate,    // trips.start_date (DATE)
        end_date: endDate,        // trips.end_date (DATE)
        startDate,                // API alias
        endDate,                  // API alias
        budget: Number(budget),
        cover_image: coverUrl,    // trips.cover_image (TEXT)
      });

      // Ensure cover is reflected client-side
      createdTrip.coverUrl = createdTrip.coverUrl || coverUrl;
      createdTrip.cover_image = createdTrip.cover_image || coverUrl;

      // 2. Add selected suggested cities as trip stops
      if (selectedSuggestions.length > 0) {
        for (const cityId of selectedSuggestions) {
          try {
            await stopsApi.addStop(createdTrip.id, {
              cityId,
              startDate,
              endDate,
              budget: Math.round(budget / selectedSuggestions.length),
            });
          } catch {
            // fallback ignore if offline
          }
        }
      }

      setIsSuccess(true);
      if (showToast) showToast(`Trip "${tripName}" created successfully!`);

      setTimeout(() => {
        if (onTripCreated) onTripCreated(createdTrip);
        onBackToHome();
      }, 1500);
    } catch (err: any) {
      console.error(err);
      if (showToast) showToast(err.message || 'Failed to create trip');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPrimaryCity =
    POPULAR_CITIES.find((c) => c.id === selectedCityId) || POPULAR_CITIES[0];

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 pb-20 pt-6 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto font-sans">
      
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200/80">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm hover:bg-slate-50 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-sky-600" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-sky-600 bg-sky-50 px-3.5 py-1.5 rounded-full border border-sky-100">
          <Sparkles className="w-3.5 h-3.5 text-sky-500" />
          <span>Screen 4: Create a New Trip</span>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        
        {/* Banner Section */}
        <div className="relative h-48 sm:h-56 bg-slate-900 overflow-hidden">
          <img
            src={coverUrl}
            alt="Trip Cover"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-sky-300 uppercase tracking-wider block mb-1">
                Multi-City Itinerary Creator
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Plan a New Trip
              </h1>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-2xl text-white text-xs font-medium inline-flex items-center gap-2">
              <Compass className="w-4 h-4 text-sky-400" />
              <span>{selectedSuggestions.length} Cities Selected</span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleCreateTrip} className="p-6 sm:p-8 space-y-8">
          
          {/* Section 1: Form Fields (Screen 4 Layout) */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Compass className="w-5 h-5 text-sky-600" />
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Trip Details & Schedule
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Trip Name Input */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Trip Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Goa Coastal Roadtrip 2026"
                    value={tripName}
                    onChange={(e) => setTripName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm font-medium transition-all"
                  />
                </div>
              </div>

              {/* Select a Place Dropdown */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select Primary Destination
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <select
                    value={selectedCityId}
                    onChange={(e) => {
                      setSelectedCityId(e.target.value);
                      const city = POPULAR_CITIES.find((c) => c.id === e.target.value);
                      if (city) setCoverUrl(city.image);
                    }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm font-medium bg-white transition-all appearance-none"
                  >
                    {POPULAR_CITIES.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name} ({city.region}, {city.country})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Estimated Budget Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Estimated Budget (₹)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm font-medium transition-all"
                  />
                </div>
              </div>

              {/* Start Date */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Start Date <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm font-medium bg-white transition-all"
                  />
                </div>
              </div>

              {/* End Date */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  End Date <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm font-medium bg-white transition-all"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Trip Description & Vision
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your trip plans, preferences, or goals..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm font-medium transition-all"
                />
              </div>

              {/* Cover Photo Preset Picker */}
              <div className="space-y-2 sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select Cover Photo
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {coverPresets.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCoverUrl(img)}
                      className={`relative h-20 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                        coverUrl === img
                          ? 'border-[#0284c7] ring-4 ring-sky-100 scale-95'
                          : 'border-transparent hover:opacity-80'
                      }`}
                    >
                      <img src={img} alt="Preset" className="w-full h-full object-cover" />
                      {coverUrl === img && (
                        <span className="absolute top-1 right-1 bg-[#0284c7] text-white p-0.5 rounded-full shadow-sm">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Section 2: Suggestions for Places to Visit / Activities to perform (Screen 4 Layout) */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                  Suggestions for Places to Visit / Activities to perform
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Select places and activities to automatically add to your trip stops
                </p>
              </div>

              <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
                {selectedSuggestions.length} Selected
              </span>
            </div>

            {/* Grid of 6 Suggestions Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
              {POPULAR_CITIES.slice(0, 6).map((city) => {
                const isSelected = selectedSuggestions.includes(city.id);
                return (
                  <div
                    key={city.id}
                    onClick={() => toggleSuggestion(city.id)}
                    className={`relative rounded-3xl overflow-hidden border transition-all duration-300 cursor-pointer flex flex-col justify-between p-4 h-64 ${
                      isSelected
                        ? 'border-[#0284c7] ring-4 ring-sky-100 shadow-md scale-[0.99]'
                        : 'border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-md'
                    }`}
                  >
                    {/* Background Image */}
                    <img
                      src={city.image}
                      alt={city.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20" />

                    {/* Top Badges */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {city.rating ?? 4.8}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSuggestion(city.id);
                        }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md ${
                          isSelected
                            ? 'bg-[#0284c7] text-white'
                            : 'bg-white/80 text-slate-700 hover:bg-white'
                        }`}
                      >
                        {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Bottom Content */}
                    <div className="relative z-10 text-white space-y-1">
                      <span className="text-[10px] font-bold text-sky-200 uppercase tracking-wider block">
                        ₹{city.cost_index.toLocaleString('en-IN')}/day • {city.region}
                      </span>
                      <h3 className="text-base font-bold leading-tight">{city.name}</h3>
                      <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed opacity-90">
                        {city.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Info className="w-4 h-4 text-sky-600 flex-shrink-0" />
              <span>
                Your trip will be saved to your account and accessible under <strong>My Trips</strong>.
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onBackToHome}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || isSuccess}
                className={`w-full sm:w-auto px-8 py-3 rounded-2xl text-xs font-extrabold text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isSuccess
                    ? 'bg-emerald-600 shadow-emerald-600/20'
                    : 'bg-gradient-to-r from-[#0284c7] to-blue-600 hover:from-[#0369a1] hover:to-blue-700 shadow-sky-600/25 active:scale-[0.98]'
                }`}
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving Trip...
                  </span>
                ) : isSuccess ? (
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Trip Created! Redirecting...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    Create Trip & Build Itinerary
                  </span>
                )}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
