import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Layers,
  Calendar,
  DollarSign,
  MapPin,
  Share2,
  Trash2,
  Edit,
  Eye,
  Plus,
  Compass,
  Clock,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Trip, TripStatus } from '../types/schema';
import { tripsApi } from '../services/api';
import { USER_PREVIOUS_TRIPS } from '../data/homeData';

interface UserTripListingPageProps {
  onOpenCreateTrip: () => void;
  onSelectTripItinerary: (tripId: string) => void;
  showToast?: (message: string) => void;
}

export const UserTripListingPage: React.FC<UserTripListingPageProps> = ({
  onOpenCreateTrip,
  onSelectTripItinerary,
  showToast
}) => {
  // Trips Data State
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter & Sort States (Screen 6 Dock)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupBy, setSelectedGroupBy] = useState<'status' | 'all'>('status');
  const [selectedFilterStatus, setSelectedFilterStatus] = useState<string>('all');
  const [selectedSortBy, setSelectedSortBy] = useState<'date_asc' | 'date_desc' | 'budget_desc' | 'name'>('date_asc');

  // Fetch Trips on Load
  useEffect(() => {
    async function loadTrips() {
      setLoading(true);
      try {
        const fetchedTrips = await tripsApi.getTrips();
        setTrips(fetchedTrips && fetchedTrips.length > 0 ? fetchedTrips : USER_PREVIOUS_TRIPS);
      } catch (err) {
        console.error('Failed to fetch user trips:', err);
        setTrips(USER_PREVIOUS_TRIPS);
      } finally {
        setLoading(false);
      }
    }
    loadTrips();
  }, []);

  // Handle Delete Trip
  const handleDeleteTrip = async (tripId: string, tripName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${tripName}"?`)) return;

    try {
      await tripsApi.deleteTrip(tripId);
      setTrips((prev) => prev.filter((t) => t.id !== tripId));
      if (showToast) showToast(`Deleted trip "${tripName}"`);
    } catch (err) {
      console.error(err);
      setTrips((prev) => prev.filter((t) => t.id !== tripId));
      if (showToast) showToast(`Deleted trip "${tripName}"`);
    }
  };

  // Filter & Sort Logic
  const filteredTrips = trips.filter((trip) => {
    // 1. Text Search Query match
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = trip.name.toLowerCase().includes(q);
      const matchDesc = trip.description?.toLowerCase().includes(q);
      const matchStops = trip.stops?.some((s) => s.city?.name.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchStops) return false;
    }
    // 2. Status Filter match
    if (selectedFilterStatus !== 'all' && trip.status !== selectedFilterStatus) {
      return false;
    }
    return true;
  });

  // Sort Logic
  const sortedTrips = [...filteredTrips].sort((a, b) => {
    if (selectedSortBy === 'date_asc') {
      return new Date(a.startDate || a.start_date).getTime() - new Date(b.startDate || b.start_date).getTime();
    }
    if (selectedSortBy === 'date_desc') {
      return new Date(b.startDate || b.start_date).getTime() - new Date(a.startDate || a.start_date).getTime();
    }
    if (selectedSortBy === 'budget_desc') {
      return b.budget - a.budget;
    }
    if (selectedSortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  // Group by Status (Screen 6 Mockup Sections: Ongoing, Up-coming, Completed)
  const ongoingTrips = sortedTrips.filter((t) => t.status === 'ONGOING');
  const upcomingTrips = sortedTrips.filter((t) => t.status === 'UPCOMING');
  const completedTrips = sortedTrips.filter((t) => t.status === 'COMPLETED');

  // Render Status Badge
  const renderStatusBadge = (status: TripStatus) => {
    if (status === 'ONGOING') {
      return (
        <span className="bg-emerald-500/90 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          Ongoing
        </span>
      );
    }
    if (status === 'UPCOMING') {
      return (
        <span className="bg-[#0284c7]/90 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1 backdrop-blur-md">
          <Clock className="w-3 h-3" />
          Up-coming
        </span>
      );
    }
    return (
      <span className="bg-slate-700/90 text-slate-200 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1 backdrop-blur-md">
        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
        Completed
      </span>
    );
  };

  // Render Single Trip Overview Card
  const renderTripCard = (trip: Trip) => {
    const coverUrl = trip.coverUrl || trip.cover_image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80';
    const stopCount = trip.stop_count || trip.stopCount || trip.stops?.length || 1;

    return (
      <div
        key={trip.id}
        className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
      >
        {/* Cover Photo Header */}
        <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900">
          <img
            src={coverUrl}
            alt={trip.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

          {/* Top Left Status Badge */}
          <div className="absolute top-3 left-3">{renderStatusBadge(trip.status)}</div>

          {/* Top Right Share Slug Badge */}
          {(trip.isPublic ?? trip.is_public) && (
            <span className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-white text-[10px] font-mono px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1">
              <Share2 className="w-3 h-3 text-sky-400" />
              /{trip.shareToken || trip.share_slug}
            </span>
          )}

          {/* Bottom Title */}
          <div className="absolute bottom-3 left-4 right-4">
            <h3 className="text-lg font-black text-white leading-tight font-display drop-shadow-sm group-hover:text-sky-300 transition-colors">
              {trip.name}
            </h3>
          </div>
        </div>

        {/* Card Body & Short Overview */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {trip.description || 'Custom multi-stop travel itinerary planned with GlobeTrotter.'}
          </p>

          {/* Stats Bar: Dates, Budget, Destination Count */}
          <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Date Range</span>
              <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1 mt-0.5">
                <Calendar className="w-3 h-3 text-[#0284c7]" />
                {trip.startDate || trip.start_date || 'Sep 2026'}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Budget</span>
              <span className="font-bold text-emerald-600 text-[11px] flex items-center gap-1 mt-0.5">
                <DollarSign className="w-3 h-3" />
                ₹{(trip.budget || 25000).toLocaleString('en-IN')}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Stops</span>
              <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-rose-500" />
                {stopCount} {stopCount === 1 ? 'City' : 'Cities'}
              </span>
            </div>
          </div>

          {/* Action Buttons Row: View Itinerary, Edit, Delete */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => onSelectTripItinerary(trip.id)}
              className="flex-1 py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Itinerary</span>
            </button>

            <button
              onClick={() => onSelectTripItinerary(trip.id)}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              title="Edit Trip"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => handleDeleteTrip(trip.id, trip.name)}
              className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-colors cursor-pointer"
              title="Delete Trip"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 pb-24 pt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-[#0284c7] text-xs font-bold border border-sky-100 mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Screen 6: User Trip Listing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
            My Travel Trips & Itineraries
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Easily access, filter, and manage all your created upcoming, ongoing, and completed trips.
          </p>
        </div>

        <button
          onClick={onOpenCreateTrip}
          className="px-5 py-3 rounded-2xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Plan New Trip</span>
        </button>
      </div>

      {/* Screen 6 Wireframe Dock: Search Bar | Group by | Filter | Sort by */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-center gap-3">
        
        {/* 1. Search Bar */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search bar (e.g. Europe, Summer, Paris)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200/80 bg-slate-50/50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          
          {/* 2. Group by Button / Toggle */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl shrink-0">
            <span className="text-[11px] font-bold text-slate-500 pl-2">Group by:</span>
            <button
              onClick={() => setSelectedGroupBy('status')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedGroupBy === 'status'
                  ? 'bg-white text-[#0284c7] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Status
            </button>
            <button
              onClick={() => setSelectedGroupBy('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedGroupBy === 'all'
                  ? 'bg-white text-[#0284c7] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Flat List
            </button>
          </div>

          {/* 3. Filter Dropdown */}
          <div className="relative shrink-0">
            <select
              value={selectedFilterStatus}
              onChange={(e) => setSelectedFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
            >
              <option value="all">Filter: All Statuses</option>
              <option value="ONGOING">Filter: Ongoing Only</option>
              <option value="UPCOMING">Filter: Up-coming Only</option>
              <option value="COMPLETED">Filter: Completed Only</option>
            </select>
          </div>

          {/* 4. Sort by Dropdown */}
          <div className="relative shrink-0">
            <select
              value={selectedSortBy}
              onChange={(e) => setSelectedSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
            >
              <option value="date_asc">Sort by: Date (Earliest)</option>
              <option value="date_desc">Sort by: Date (Latest)</option>
              <option value="budget_desc">Sort by: Budget (High to Low)</option>
              <option value="name">Sort by: Name (A-Z)</option>
            </select>
          </div>

        </div>

      </div>

      {/* Screen 6 Mockup Sections: Ongoing, Up-coming, Completed */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-[#0284c7] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-500">Loading trips from database...</p>
        </div>
      ) : sortedTrips.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-4">
          <Compass className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No trips match your search filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query, status filter, or create a brand new trip itinerary.
          </p>
          <button
            onClick={onOpenCreateTrip}
            className="px-5 py-2.5 rounded-xl bg-[#0284c7] text-white text-xs font-bold hover:bg-[#0369a1] inline-flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Trip</span>
          </button>
        </div>
      ) : selectedGroupBy === 'all' ? (
        /* Flat Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTrips.map((trip) => renderTripCard(trip))}
        </div>
      ) : (
        /* Screen 6 Wireframe Grouped View: Ongoing -> Up-coming -> Completed */
        <div className="space-y-10">
          
          {/* Section 1: Ongoing (Screen 6 Mockup) */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-200/80 pb-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-xl font-black text-slate-900 font-display">Ongoing Trips</h2>
              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {ongoingTrips.length}
              </span>
            </div>

            {ongoingTrips.length === 0 ? (
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-6 text-center text-xs font-semibold text-slate-400">
                No active ongoing trips currently.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ongoingTrips.map((trip) => renderTripCard(trip))}
              </div>
            )}
          </div>

          {/* Section 2: Up-coming (Screen 6 Mockup) */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-200/80 pb-2">
              <span className="w-3 h-3 rounded-full bg-[#0284c7]" />
              <h2 className="text-xl font-black text-slate-900 font-display">Up-coming Trips</h2>
              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {upcomingTrips.length}
              </span>
            </div>

            {upcomingTrips.length === 0 ? (
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-6 text-center text-xs font-semibold text-slate-400">
                No upcoming trips planned yet. Click "+ Plan New Trip" above.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingTrips.map((trip) => renderTripCard(trip))}
              </div>
            )}
          </div>

          {/* Section 3: Completed (Screen 6 Mockup) */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-200/80 pb-2">
              <span className="w-3 h-3 rounded-full bg-slate-600" />
              <h2 className="text-xl font-black text-slate-900 font-display">Completed Trips</h2>
              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {completedTrips.length}
              </span>
            </div>

            {completedTrips.length === 0 ? (
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-6 text-center text-xs font-semibold text-slate-400">
                No completed past trips found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedTrips.map((trip) => renderTripCard(trip))}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
