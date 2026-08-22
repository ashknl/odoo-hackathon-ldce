import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Compass,
  DollarSign,
  Eye,
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Award
} from 'lucide-react';
import { motion } from 'motion/react';
import { Trip } from '../types/schema';
import { UserProfile } from './AuthModal';
import { tripsApi } from '../services/api';
import { USER_PREVIOUS_TRIPS } from '../data/homeData';

interface UserProfilePageProps {
  currentUser?: UserProfile | null;
  onSelectTripItinerary: (tripId: string) => void;
  onOpenCreateTrip: () => void;
  showToast?: (message: string) => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({
  currentUser,
  onSelectTripItinerary,
  onOpenCreateTrip,
  showToast
}) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  // Default User Data fallback if guest/not logged in
  const user = currentUser || {
    id: 'usr-1',
    firstName: 'Alex',
    lastName: 'Morgan',
    username: 'alex_globetrotter',
    email: 'alex.morgan@example.com',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    country: 'United States',
    city: 'San Francisco',
  };

  useEffect(() => {
    async function loadTrips() {
      setLoading(true);
      try {
        const fetchedTrips = await tripsApi.getTrips();
        setTrips(fetchedTrips && fetchedTrips.length > 0 ? fetchedTrips : USER_PREVIOUS_TRIPS);
      } catch (err) {
        console.error(err);
        setTrips(USER_PREVIOUS_TRIPS);
      } finally {
        setLoading(false);
      }
    }
    loadTrips();
  }, []);

  // Screen 7 Categories: Preplanned Trips vs Previous Trips
  const preplannedTrips = trips.filter(
    (t) => t.status === 'UPCOMING' || t.status === 'ONGOING' || !t.status
  );
  const previousTrips = trips.filter((t) => t.status === 'COMPLETED');

  // Render Single Screen 7 Trip Card
  const renderProfileTripCard = (trip: Trip) => {
    const coverUrl =
      trip.coverUrl ||
      trip.cover_image ||
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80';
    const stopCount = trip.stop_count || trip.stopCount || trip.stops?.length || 1;

    return (
      <div
        key={trip.id}
        className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group h-full justify-between"
      >
        {/* Cover Photo */}
        <div className="relative h-44 w-full overflow-hidden bg-slate-900">
          <img
            src={coverUrl}
            alt={trip.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

          {/* Status Chip */}
          <span className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">
            {trip.status === 'COMPLETED' ? 'Completed' : trip.status === 'ONGOING' ? 'Ongoing' : 'Upcoming'}
          </span>

          <div className="absolute bottom-3 left-3 right-3">
            <h4 className="text-base font-black text-white leading-tight font-display drop-shadow-sm group-hover:text-sky-300 transition-colors">
              {trip.name}
            </h4>
          </div>
        </div>

        {/* Info & View Button */}
        <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {trip.description || 'Custom multi-stop travel itinerary planned on GlobeTrotter.'}
          </p>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <span className="text-slate-600 font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#0284c7]" />
              {trip.startDate || trip.start_date || '2026'}
            </span>
            <span className="font-bold text-emerald-600">
              ₹{(trip.budget || 25000).toLocaleString('en-IN')}
            </span>
          </div>

          {/* Wireframe Screen 7 "View" Button */}
          <button
            onClick={() => onSelectTripItinerary(trip.id)}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-[#0284c7] text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-2"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 pb-24 pt-6 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10 font-sans">
      
      {/* Top Header Label */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-[#0284c7] text-xs font-bold border border-sky-100">
          <User className="w-3.5 h-3.5" />
          <span>Screen 7: User Profile</span>
        </div>
        <span className="text-xs font-semibold text-slate-400">Read-Only View</span>
      </div>

      {/* Screen 7 Wireframe Top Card: Image of the User + User Details (No Edit Option as requested) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center gap-6 sm:gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0284c7]/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        {/* Image of the User */}
        <div className="relative shrink-0">
          <img
            src={user.photoUrl}
            alt={user.firstName}
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-white shadow-lg ring-4 ring-sky-100"
          />
          <div className="absolute bottom-1 right-1 bg-emerald-500 text-white p-1.5 rounded-full ring-2 ring-white" title="Active Traveler">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        {/* User Details Box (Read-Only) */}
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center md:justify-start">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
                {user.firstName} {user.lastName}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0284c7] text-[11px] font-bold border border-sky-100 self-center md:self-auto">
                <Award className="w-3 h-3" /> GlobeTrotter Explorer
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-mono">@{user.username || 'traveler'}</p>
          </div>

          {/* Contact & Location Details */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-600 pt-1">
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
              <Mail className="w-3.5 h-3.5 text-[#0284c7]" />
              <span className="font-medium">{user.email}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span className="font-medium">{user.city || 'San Francisco'}, {user.country || 'USA'}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
              <Calendar className="w-3.5 h-3.5 text-emerald-500" />
              <span className="font-medium">Member since 2026</span>
            </div>
          </div>

          {/* Quick Stats Summary */}
          <div className="grid grid-cols-3 gap-3 pt-2 max-w-md mx-auto md:mx-0">
            <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Trips</span>
              <span className="text-sm font-black text-slate-900">{trips.length}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Preplanned</span>
              <span className="text-sm font-black text-[#0284c7]">{preplannedTrips.length}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Completed</span>
              <span className="text-sm font-black text-emerald-600">{previousTrips.length}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Screen 7 Section 1: Preplanned Trips */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#0284c7]" />
            <h2 className="text-xl font-black text-slate-900 font-display">Preplanned Trips</h2>
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
              {preplannedTrips.length}
            </span>
          </div>

          <button
            onClick={onOpenCreateTrip}
            className="text-xs font-bold text-[#0284c7] hover:underline cursor-pointer"
          >
            + Plan another trip
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400">Loading preplanned trips...</div>
        ) : preplannedTrips.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-6 text-center text-xs text-slate-400">
            No upcoming or ongoing preplanned trips found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {preplannedTrips.map((trip) => renderProfileTripCard(trip))}
          </div>
        )}
      </div>

      {/* Screen 7 Section 2: Previous Trips */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-black text-slate-900 font-display">Previous Trips</h2>
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
              {previousTrips.length}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400">Loading previous trips...</div>
        ) : previousTrips.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-6 text-center text-xs text-slate-400">
            No completed previous trips found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {previousTrips.map((trip) => renderProfileTripCard(trip))}
          </div>
        )}
      </div>

    </div>
  );
};
