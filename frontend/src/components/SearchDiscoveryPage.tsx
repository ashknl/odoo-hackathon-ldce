import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Building2,
  Sparkles,
  MapPin,
  DollarSign,
  Star,
  Plus,
  Compass,
  Tag,
  Clock,
  ExternalLink,
  Eye,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { City, OpenTripMapPOI } from '../types/schema';
import { citiesApi, activitiesApi } from '../services/api';
import { POPULAR_CITIES } from '../data/homeData';

interface SearchDiscoveryPageProps {
  onOpenCreateTrip: () => void;
  onSelectCity: (city: City) => void;
  showToast?: (message: string) => void;
}

export const SearchDiscoveryPage: React.FC<SearchDiscoveryPageProps> = ({
  onOpenCreateTrip,
  onSelectCity,
  showToast
}) => {
  // Search Mode: 'cities' (Activity Search / City Search Screen 8) vs 'activities'
  const [searchMode, setSearchMode] = useState<'cities' | 'activities'>('cities');

  // Search Bar dock state (Screen 8 wireframe mockup: Search query | Group by | Filter | Sort by)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [selectedSortBy, setSelectedSortBy] = useState<'popularity' | 'name' | 'cost_asc' | 'cost_desc'>('popularity');
  const [selectedGroupBy, setSelectedGroupBy] = useState<'region' | 'flat'>('region');

  // Cities & Activities Data State
  const [cities, setCities] = useState<City[]>(POPULAR_CITIES);
  const [activities, setActivities] = useState<OpenTripMapPOI[]>([]);
  const [loading, setLoading] = useState(false);

  // Selected Activity for Detail Modal
  const [selectedActivityDetail, setSelectedActivityDetail] = useState<OpenTripMapPOI | null>(null);

  // 1. Fetch Cities on load
  useEffect(() => {
    async function loadCities() {
      try {
        const cList = await citiesApi.getCities();
        if (cList && cList.length > 0) setCities(cList);
      } catch (err) {
        console.error('Failed to load cities:', err);
      }
    }
    loadCities();
  }, []);

  // 2. Fetch OpenTripMap Activities on activity mode or search change
  useEffect(() => {
    if (searchMode !== 'activities') return;

    async function searchPOIs() {
      setLoading(true);
      try {
        const results = await activitiesApi.searchActivities({
          q: searchQuery || 'paragliding',
          type: selectedCategoryFilter === 'all' ? undefined : selectedCategoryFilter,
        });
        setActivities(Array.isArray(results) ? results : []);
      } catch (err) {
        console.error('Failed to search activities:', err);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(searchPOIs, 300);
    return () => clearTimeout(timer);
  }, [searchMode, searchQuery, selectedCategoryFilter]);

  // Filter Cities
  const filteredCities = cities.filter((city) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = city.name.toLowerCase().includes(q);
      const matchCountry = city.country.toLowerCase().includes(q);
      const matchRegion = city.region.toLowerCase().includes(q);
      if (!matchName && !matchCountry && !matchRegion) return false;
    }
    if (selectedRegionFilter !== 'all' && city.region !== selectedRegionFilter) {
      return false;
    }
    return true;
  });

  // Sort Cities
  const sortedCities = [...filteredCities].sort((a, b) => {
    if (selectedSortBy === 'name') return a.name.localeCompare(b.name);
    if (selectedSortBy === 'cost_asc') return a.cost_index - b.cost_index;
    if (selectedSortBy === 'cost_desc') return b.cost_index - a.cost_index;
    return (b.rating || 4.5) - (a.rating || 4.5); // Default popularity rank
  });

  // Filter & Sort Activities (with defensive null-checks)
  const filteredActivities = (activities || []).filter((act) => {
    if (!act) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = (act.name || '').toLowerCase().includes(q);
      const matchKind = (act.kinds || '').toLowerCase().includes(q);
      if (!matchName && !matchKind) return false;
    }
    return true;
  });

  // Group Cities by Region
  const regionsList = Array.from(new Set(cities.map((c) => c.region)));

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 pb-24 pt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-[#0284c7] text-xs font-bold border border-sky-100 mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Screen 8: Activity & City Search</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
            Explore Destinations & Experiences
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Search cities with country meta & cost indices or discover OpenTripMap sightseeing, adventure, and dining activities.
          </p>
        </div>

        {/* Dual Mode Switcher: City Search vs Activity Search */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200/80 self-start sm:self-auto">
          <button
            onClick={() => setSearchMode('cities')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              searchMode === 'cities'
                ? 'bg-[#0284c7] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>City Search</span>
          </button>

          <button
            onClick={() => setSearchMode('activities')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              searchMode === 'activities'
                ? 'bg-[#0284c7] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Activity Search</span>
          </button>
        </div>
      </div>

      {/* Screen 8 Wireframe Dock: Search Bar ("Paragliding"...) | Group by | Filter | Sort by */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-center gap-3">
        
        {/* Search Bar (Screen 8 Wireframe mockup input) */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder={
              searchMode === 'cities'
                ? 'Search cities by name, country (e.g. Paris, France)...'
                : 'Search activities (e.g. Paragliding, Museums, Waterfalls)...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200/80 bg-slate-50/50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
          />
        </div>

        {/* Controls Dock */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          
          {/* Group By Control */}
          {searchMode === 'cities' && (
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl shrink-0">
              <span className="text-[11px] font-bold text-slate-500 pl-2">Group by:</span>
              <button
                onClick={() => setSelectedGroupBy('region')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedGroupBy === 'region' ? 'bg-white text-[#0284c7] shadow-xs' : 'text-slate-600'
                }`}
              >
                Region
              </button>
              <button
                onClick={() => setSelectedGroupBy('flat')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedGroupBy === 'flat' ? 'bg-white text-[#0284c7] shadow-xs' : 'text-slate-600'
                }`}
              >
                Flat
              </button>
            </div>
          )}

          {/* Filter Dropdown */}
          <div className="relative shrink-0">
            {searchMode === 'cities' ? (
              <select
                value={selectedRegionFilter}
                onChange={(e) => setSelectedRegionFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white cursor-pointer"
              >
                <option value="all">Filter: All Regions</option>
                {regionsList.map((r) => (
                  <option key={r} value={r}>
                    Region: {r}
                  </option>
                ))}
              </select>
            ) : (
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white cursor-pointer"
              >
                <option value="all">Category: All Types</option>
                <option value="historic">Historic & Forts</option>
                <option value="museums">Museums & Culture</option>
                <option value="natural">Nature & Hiking</option>
                <option value="foods">Dining & Foods</option>
              </select>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="relative shrink-0">
            <select
              value={selectedSortBy}
              onChange={(e) => setSelectedSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white cursor-pointer"
            >
              <option value="popularity">Sort by: Popularity Rank</option>
              <option value="name">Sort by: Name (A-Z)</option>
              <option value="cost_asc">Sort by: Cost (Low to High)</option>
              <option value="cost_desc">Sort by: Cost (High to Low)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Screen 8 Wireframe List Results Area */}
      <div className="space-y-6">
        
        <h2 className="text-xl font-black text-slate-900 font-display flex items-center justify-between">
          <span>Results Options & Details</span>
          <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
            {searchMode === 'cities' ? `${sortedCities.length} Cities` : `${filteredActivities.length} Activities`}
          </span>
        </h2>

        {/* 1. CITY SEARCH RESULTS MODE */}
        {searchMode === 'cities' && (
          selectedGroupBy === 'flat' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedCities.map((city) => (
                <div
                  key={city.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group justify-between"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                    <img
                      src={city.image}
                      alt={city.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                    <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-400" />
                      {city.country}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-xl font-black text-white leading-tight font-display">
                        {city.name}
                      </h3>
                      <span className="text-xs text-sky-200 font-medium">{city.region}</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Cost Index</span>
                        <span className="font-extrabold text-emerald-600 text-xs">
                          ₹{city.cost_index.toLocaleString()}/day
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Popularity</span>
                        <span className="font-extrabold text-amber-500 text-xs flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {city.rating || 4.8} / 5
                        </span>
                      </div>
                    </div>

                    {/* "Add to Trip" Action (Problem Statement requirement) */}
                    <button
                      onClick={() => {
                        onSelectCity(city);
                        if (showToast) showToast(`Selected "${city.name}" for your trip!`);
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Add to Trip</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Grouped by Region view */
            <div className="space-y-8">
              {regionsList.map((region) => {
                const regionCities = sortedCities.filter((c) => c.region === region);
                if (regionCities.length === 0) return null;

                return (
                  <div key={region} className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2">
                      <Building2 className="w-4 h-4 text-[#0284c7]" />
                      <h3 className="text-lg font-black text-slate-900 font-display">{region}</h3>
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        {regionCities.length}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {regionCities.map((city) => (
                        <div
                          key={city.id}
                          className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group justify-between"
                        >
                          <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                            <img
                              src={city.image}
                              alt={city.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                            <div className="absolute bottom-3 left-3 right-3">
                              <h4 className="text-lg font-black text-white leading-tight font-display">
                                {city.name}
                              </h4>
                              <span className="text-xs text-slate-300">{city.country}</span>
                            </div>
                          </div>

                          <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                            <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                              <span className="text-slate-500 font-medium">Cost Index</span>
                              <span className="font-bold text-emerald-600">₹{city.cost_index}/day</span>
                            </div>

                            <button
                              onClick={() => {
                                onSelectCity(city);
                                if (showToast) showToast(`Selected "${city.name}" for your trip!`);
                              }}
                              className="w-full py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Plus className="w-4 h-4" />
                              <span>+ Add to Trip</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* 2. ACTIVITY SEARCH RESULTS MODE (OpenTripMap POIs) */}
        {searchMode === 'activities' && (
          loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-8 h-8 border-3 border-[#0284c7] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-500">Searching OpenTripMap live POIs...</p>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
              <Sparkles className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No OpenTripMap activities found</h3>
              <p className="text-xs text-slate-500">Try searching for terms like "paragliding", "forts", "waterfall", or "museum".</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredActivities.map((act) => (
                <div
                  key={act.otmPlaceId}
                  className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4"
                >
                  <img
                    src={act.previewUrl || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'}
                    alt={act.name}
                    className="w-24 h-24 rounded-2xl object-cover border border-slate-200 shrink-0"
                  />

                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-black text-slate-900 leading-snug">{act.name}</h4>
                      <span className="text-xs font-extrabold text-emerald-600 shrink-0">
                        ₹{act.plannedCost || 500}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 capitalize line-clamp-1">
                      {(act.kinds || 'attractions').split(',').slice(0, 3).join(' • ')}
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => setSelectedActivityDetail(act)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Quick View</span>
                      </button>

                      <button
                        onClick={() => {
                          onOpenCreateTrip();
                          if (showToast) showToast(`Added activity "${act.name}" to trip itinerary`);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Add to Stop</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

      </div>

      {/* Activity Quick View Modal */}
      <AnimatePresence>
        {selectedActivityDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900">{selectedActivityDetail.name}</h3>
                <button
                  onClick={() => setSelectedActivityDetail(null)}
                  className="text-slate-400 hover:text-slate-700 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <img
                src={selectedActivityDetail.previewUrl || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'}
                alt={selectedActivityDetail.name}
                className="w-full h-48 rounded-2xl object-cover"
              />

              <div className="space-y-2 text-xs text-slate-600">
                <p>
                  <strong className="text-slate-900">Categories:</strong> {selectedActivityDetail.kinds}
                </p>
                <p>
                  <strong className="text-slate-900">Estimated Cost:</strong> ₹{selectedActivityDetail.plannedCost || 500}
                </p>
                {selectedActivityDetail.otmPlaceId && (
                  <p className="font-mono text-[10px] text-slate-400">
                    OpenTripMap Ref ID: {selectedActivityDetail.otmPlaceId}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => setSelectedActivityDetail(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedActivityDetail(null);
                    onOpenCreateTrip();
                    if (showToast) showToast(`Added "${selectedActivityDetail.name}" to trip itinerary`);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#0284c7] text-white text-xs font-bold hover:bg-[#0369a1]"
                >
                  + Add to Trip Stop
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
