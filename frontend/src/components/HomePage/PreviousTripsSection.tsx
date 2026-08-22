import React, { useState } from 'react';
import { Trip } from '../../types/schema';
import { Calendar, MapPin, DollarSign, Share2, CheckCircle2, Clock, PlayCircle } from 'lucide-react';

interface PreviousTripsSectionProps {
  trips: Trip[];
  onSelectTrip: (trip: Trip) => void;
  onOpenPlanner: () => void;
}

export const PreviousTripsSection: React.FC<PreviousTripsSectionProps> = ({
  trips,
  onSelectTrip,
  onOpenPlanner,
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'UPCOMING' | 'ONGOING' | 'COMPLETED'>('ALL');

  const filteredTrips = trips.filter((t) => (activeTab === 'ALL' ? true : t.status === activeTab));

  const getStatusBadge = (status: Trip['status']) => {
    switch (status) {
      case 'UPCOMING':
        return (
          <span className="bg-sky-500/90 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider shadow-sm">
            <Clock className="w-3 h-3" /> Upcoming
          </span>
        );
      case 'ONGOING':
        return (
          <span className="bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider shadow-sm animate-pulse">
            <PlayCircle className="w-3 h-3" /> Ongoing
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="bg-slate-700/90 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider shadow-sm">
            <CheckCircle2 className="w-3 h-3 text-sky-400" /> Completed
          </span>
        );
    }
  };

  return (
    <section className="space-y-4 pt-2">
      
      {/* 1. Header & Filter Tabs (Ref 3) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Previous Trips
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Your travel history, multi-stop itineraries, and public sharing links
          </p>
        </div>

        {/* Status filter tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl text-xs font-semibold text-slate-600">
          {(['ALL', 'UPCOMING', 'ONGOING', 'COMPLETED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-xl capitalize transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-white text-slate-900 shadow-sm font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              {tab.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Previous Trips Cards Grid (Ref 3 - Blue theme) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {filteredTrips.map((trip) => (
          <div
            key={trip.id}
            onClick={() => onSelectTrip(trip)}
            className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group cursor-pointer"
          >
            {/* Trip Cover Image Header */}
            <div className="relative h-44 w-full overflow-hidden bg-slate-800">
              <img
                src={trip.cover_image}
                alt={trip.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              
              {/* Status Badge */}
              <div className="absolute top-3 left-3">{getStatusBadge(trip.status)}</div>

              {/* Share Slug Badge */}
              {trip.is_public && (
                <span className="absolute top-3 right-3 bg-black/40 backdrop-blur-md text-white text-[10px] font-mono px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1">
                  <Share2 className="w-3 h-3 text-sky-400" />
                  /{trip.share_slug}
                </span>
              )}

              {/* Title Overlay */}
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-base font-bold text-white leading-tight group-hover:text-sky-300 transition-colors">
                  {trip.name}
                </h3>
              </div>
            </div>

            {/* Trip Details Body */}
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {trip.description}
              </p>

              {/* Dates & Budget */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Calendar className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                  <span className="font-medium text-[11px]">{trip.start_date}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 justify-end">
                  <DollarSign className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                  <span className="font-bold text-slate-900 text-[11px]">₹{trip.budget.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Stops Summary */}
              {trip.stops && trip.stops.length > 0 && (
                <div className="bg-slate-50 p-2.5 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Itinerary Stops ({trip.stops.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {trip.stops.map((stop) => (
                      <span
                        key={stop.id}
                        className="text-[11px] font-medium bg-white text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/60 inline-flex items-center gap-1"
                      >
                        <MapPin className="w-2.5 h-2.5 text-sky-500" />
                        {stop.city?.name || 'City Stop'}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        ))}
      </div>

    </section>
  );
};
