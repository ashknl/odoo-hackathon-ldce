import React from 'react';
import { User, Trip } from '../../types/schema';
import { Award, Star, Ticket, Utensils, Compass, MapPin, ChevronRight } from 'lucide-react';

interface UserProfileSidebarProps {
  user: User;
  upcomingTrip: Trip;
  onOpenBooking: () => void;
}

export const UserProfileSidebar: React.FC<UserProfileSidebarProps> = ({
  user,
  upcomingTrip,
  onOpenBooking,
}) => {
  return (
    <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">
      
      {/* 1. User Profile Box (Ref 1 style - Blue theme) */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100/80 text-center flex flex-col items-center relative overflow-hidden group">
        
        {/* Subtle background glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-sky-100/50 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

        {/* Profile Avatar with status ring */}
        <div className="relative mb-3">
          <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-sky-500 via-blue-500 to-indigo-500 shadow-md">
            <img
              src={user.profile_image}
              alt={user.name}
              className="w-full h-full object-cover rounded-full border-2 border-white"
            />
          </div>
          <span className="absolute bottom-0 right-0 w-4 h-4 bg-sky-500 border-2 border-white rounded-full shadow-sm" />
        </div>

        {/* Name & Level */}
        <h3 className="font-bold text-slate-800 text-lg tracking-tight">{user.name}</h3>
        <p className="text-xs font-medium text-sky-600 bg-sky-50 px-3 py-1 rounded-full mt-1 border border-sky-100/60 inline-flex items-center gap-1">
          <Compass className="w-3 h-3 text-sky-500" />
          {user.level || 'Beginner Explorer'}
        </p>

        {/* Stats Row: Badges & Points */}
        <div className="grid grid-cols-2 gap-3 w-full mt-5 pt-4 border-t border-slate-100">
          
          <div className="bg-slate-50/70 p-3 rounded-2xl flex flex-col items-center hover:bg-sky-50/40 transition-colors">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-1">
              <Award className="w-4 h-4" />
            </div>
            <span className="text-base font-bold text-slate-800">{user.badges ?? 3}</span>
            <span className="text-[11px] text-slate-400 font-medium">Badges</span>
          </div>

          <div className="bg-slate-50/70 p-3 rounded-2xl flex flex-col items-center hover:bg-sky-50/40 transition-colors">
            <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mb-1">
              <Star className="w-4 h-4" />
            </div>
            <span className="text-base font-bold text-slate-800">{user.points ?? 85}</span>
            <span className="text-[11px] text-slate-400 font-medium">Points</span>
          </div>

        </div>
      </div>

      {/* 2. Upcoming Trips Ticket Card (Ref 1 style - Blue theme) */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100/80 space-y-4">
        
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Upcoming Trips</span>
          <span className="w-6 h-6 rounded-full bg-sky-50 text-sky-600 text-xs font-bold flex items-center justify-center">
            1
          </span>
        </div>

        {/* Ticket Box */}
        <div className="bg-gradient-to-br from-slate-50 via-sky-50/40 to-blue-50/30 rounded-2xl p-4 border border-sky-100/80 relative overflow-hidden">
          
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-xs font-bold text-sky-600 block">December 25</span>
              <p className="text-[11px] text-slate-500 font-medium">3 Days / 4 Nights • 2 Adults</p>
            </div>
            <span className="text-sm font-extrabold text-slate-800">₹{upcomingTrip.budget.toLocaleString('en-IN')}</span>
          </div>

          {/* Route Timeline */}
          <div className="my-4 space-y-3 relative pl-4 border-l-2 border-dashed border-sky-300">
            <div className="relative">
              <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-sky-500 ring-4 ring-sky-100" />
              <p className="text-xs font-bold text-slate-800">Hyderabad</p>
              <p className="text-[10px] text-slate-400">Telangana, India</p>
            </div>
            <div className="relative">
              <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-blue-100" />
              <p className="text-xs font-bold text-slate-800">Munnar</p>
              <p className="text-[10px] text-slate-400">Kerala, India</p>
            </div>
          </div>

          {/* Realistic Barcode Graphic */}
          <div className="pt-3 border-t border-slate-200/80 flex flex-col items-center">
            <div className="h-8 w-full bg-[repeating-linear-gradient(90deg,#1e293b,#1e293b_2px,transparent_2px,transparent_4px,#1e293b_4px,#1e293b_7px,transparent_7px,transparent_9px)] opacity-70" />
            <span className="text-[9px] font-mono text-slate-400 mt-1 uppercase tracking-widest">
              {user.name.toLowerCase().replace(/\s+/g, '')}
            </span>
          </div>

        </div>

      </div>

      {/* 3. Exclusive Offer Banner Card (Ref 1 style - Blue theme) */}
      <div className="bg-gradient-to-br from-[#0284c7] via-sky-700 to-blue-800 text-white rounded-3xl p-5 shadow-lg shadow-sky-900/10 relative overflow-hidden">
        
        {/* Floating utensil icon circle */}
        <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-sky-200">
          <Utensils className="w-5 h-5" />
        </div>

        <span className="text-[10px] font-bold tracking-widest text-sky-200 uppercase block mb-1">
          Exclusive Offer
        </span>

        <h4 className="text-sm font-semibold text-white/90 leading-snug max-w-[80%] mb-4">
          Get free lunch and dinner on all the restaurants in your vacation!
        </h4>

        <button
          onClick={onOpenBooking}
          className="w-full bg-sky-300 hover:bg-sky-200 text-slate-950 font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 group cursor-pointer"
        >
          <span>Use Coupon: <strong className="font-mono">GOLDMEMXSE11</strong></span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>

      </div>

    </aside>
  );
};
