import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  Compass,
  MapPin,
  Clock,
  CheckCircle2,
  Edit2,
  Trash2,
  GripVertical,
  X,
  Sparkles,
  Ticket,
  DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Trip, TripStop, PlannedActivity } from '../types/schema';
import { tripsApi } from '../services/api';
import { USER_PREVIOUS_TRIPS } from '../data/homeData';

interface CalendarEventItem {
  id: string;
  tripId: string;
  tripName: string;
  destination: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  color: string;
  status: 'Upcoming' | 'Completed' | 'Draft';
  budget: number;
}

const SAMPLE_CALENDAR_TRIPS: CalendarEventItem[] = [
  {
    id: 'trip-paris-1',
    tripId: '1',
    tripName: 'PARIS TRIP',
    destination: 'Paris, France',
    startDate: '2026-09-04',
    endDate: '2026-09-08',
    color: 'bg-[#0284c7] text-white border-sky-600',
    status: 'Upcoming',
    budget: 65000,
  },
  {
    id: 'trip-nyc-2',
    tripId: '2',
    tripName: 'NYC GETAWAY',
    destination: 'New York, USA',
    startDate: '2026-09-14',
    endDate: '2026-09-19',
    color: 'bg-purple-600 text-white border-purple-700',
    status: 'Upcoming',
    budget: 85000,
  },
  {
    id: 'trip-japan-3',
    tripId: '3',
    tripName: 'JAPAN ADVENTURE',
    destination: 'Tokyo & Kyoto, Japan',
    startDate: '2026-09-20',
    endDate: '2026-09-27',
    color: 'bg-emerald-600 text-white border-emerald-700',
    status: 'Upcoming',
    budget: 120000,
  },
];

interface CalendarViewPageProps {
  onOpenTrip?: (tripId: string) => void;
  onOpenCreateTrip?: () => void;
  showToast?: (message: string) => void;
}

export const CalendarViewPage: React.FC<CalendarViewPageProps> = ({
  onOpenTrip,
  onOpenCreateTrip,
  showToast,
}) => {
  // Real DB Trips state for Calendar
  const [calendarTrips, setCalendarTrips] = useState<CalendarEventItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Calendar Month Navigation state
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [selectedSortBy, setSelectedSortBy] = useState<'date' | 'name' | 'budget'>('date');

  // Selected Day Drawer State
  const [selectedDayDate, setSelectedDayDate] = useState<string | null>(null);
  const [activeDayEvents, setActiveDayEvents] = useState<CalendarEventItem[]>([]);

  // Fetch real trips from database on mount
  useEffect(() => {
    async function loadTrips() {
      setLoading(true);
      try {
        const rawTrips = await tripsApi.getTrips();
        if (Array.isArray(rawTrips) && rawTrips.length > 0) {
          const colors = [
            'bg-[#0284c7] text-white border-sky-600',
            'bg-purple-600 text-white border-purple-700',
            'bg-emerald-600 text-white border-emerald-700',
            'bg-amber-600 text-white border-amber-700',
          ];
          const mapped: CalendarEventItem[] = rawTrips.map((t, idx) => ({
            id: t.id,
            tripId: t.id,
            tripName: t.name.toUpperCase(),
            destination: t.stops && t.stops.length > 0 ? t.stops.map((s) => s.city?.name).filter(Boolean).join(' & ') : 'Multi-City Tour',
            startDate: (t.startDate || t.start_date || '2026-09-01').slice(0, 10),
            endDate: (t.endDate || t.end_date || '2026-09-10').slice(0, 10),
            color: colors[idx % colors.length],
            status: t.status === 'COMPLETED' ? 'Completed' : 'Upcoming',
            budget: t.budget || 50000,
          }));
          setCalendarTrips(mapped);
          
          // Auto-adjust calendar to first trip's start date
          if (mapped[0]?.startDate) {
            const firstDate = new Date(mapped[0].startDate);
            if (!isNaN(firstDate.getTime())) {
              setCurrentDate(new Date(firstDate.getFullYear(), firstDate.getMonth(), 1));
            }
          }
        } else {
          setCalendarTrips([]);
        }
      } catch (err) {
        console.error('Failed to load trips for calendar:', err);
        setCalendarTrips([]);
      } finally {
        setLoading(false);
      }
    }
    loadTrips();
  }, []);

  // Sample Day Activities for Drawer (Reorderable)
  const [dayActivities, setDayActivities] = useState<
    Array<{ id: string; title: string; time: string; cost: number; category: string }>
  >([
    { id: 'act-a', title: 'Eiffel Tower Morning Walk', time: '09:00 AM', cost: 2500, category: 'Sightseeing' },
    { id: 'act-b', title: 'Seine River Cruise & Lunch', time: '01:30 PM', cost: 4200, category: 'Dining' },
    { id: 'act-c', title: 'Louvre Art Gallery Pass', time: '05:00 PM', cost: 3000, category: 'Museum' },
  ]);

  // Quick Edit Activity State
  const [editingActId, setEditingActId] = useState<string | null>(null);
  const [newActTitle, setNewActTitle] = useState('');

  // Month navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = currentDate.getFullYear();
  const currentMonthIndex = currentDate.getMonth();
  const currentMonthName = monthNames[currentMonthIndex];

  // Helper: Days in current month & starting day of week
  const firstDayOfWeek = new Date(currentYear, currentMonthIndex, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();

  // Filter events
  const filteredEvents = calendarTrips.filter((evt) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = evt.tripName.toLowerCase().includes(q);
      const matchDest = evt.destination.toLowerCase().includes(q);
      if (!matchName && !matchDest) return false;
    }
    if (selectedStatusFilter !== 'all' && evt.status.toLowerCase() !== selectedStatusFilter) {
      return false;
    }
    return true;
  });

  // Handle Day Click
  const handleDayClick = (dayNumber: number) => {
    const monthFormatted = String(currentMonthIndex + 1).padStart(2, '0');
    const dayFormatted = String(dayNumber).padStart(2, '0');
    const dateStr = `${currentYear}-${monthFormatted}-${dayFormatted}`;

    // Find overlapping trips for this date
    const matchingTrips = filteredEvents.filter((evt) => {
      return dateStr >= evt.startDate && dateStr <= evt.endDate;
    });

    setSelectedDayDate(dateStr);
    setActiveDayEvents(matchingTrips);
  };

  // Reorder Activity Handler
  const handleMoveActivityUp = (index: number) => {
    if (index === 0) return;
    const updated = [...dayActivities];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setDayActivities(updated);
    if (showToast) showToast('Reordered activity timing!');
  };

  // Quick Edit Save
  const handleSaveQuickEdit = (id: string) => {
    setDayActivities((prev) =>
      prev.map((act) => (act.id === id ? { ...act, title: newActTitle || act.title } : act))
    );
    setEditingActId(null);
    if (showToast) showToast('Updated activity details!');
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 pb-24 pt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-[#0284c7] text-xs font-bold border border-sky-100 mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Screen 11: Calendar View Screen</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
            Interactive Trip Calendar & Timeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Visual calendar view of full itinerary plans, multi-city trip spans, and expandable daily schedule flow.
          </p>
        </div>

        {onOpenCreateTrip && (
          <button
            onClick={onOpenCreateTrip}
            className="px-5 py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Plan New Trip</span>
          </button>
        )}
      </div>

      {/* Screen 11 Wireframe Dock: Search Bar | Group by | Filter | Sort by */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-center gap-3">
        
        {/* Search Bar Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search trips on calendar (e.g. Paris, NYC, Japan)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200/80 bg-slate-50/50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
          />
        </div>

        {/* Dock Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          
          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white cursor-pointer shrink-0"
          >
            <option value="all">Filter: All Statuses</option>
            <option value="upcoming">Upcoming Trips</option>
            <option value="completed">Completed Trips</option>
          </select>

          {/* Sort By Dropdown */}
          <select
            value={selectedSortBy}
            onChange={(e) => setSelectedSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white cursor-pointer shrink-0"
          >
            <option value="date">Sort by: Date Flow</option>
            <option value="budget">Sort by: Budget Size</option>
            <option value="name">Sort by: Name</option>
          </select>

        </div>
      </div>

      {/* Screen 11 Excalidraw Wireframe Core Layout: Interactive Month Calendar Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        
        {/* Calendar Month Selector Header (Screen 11 Wireframe Layout: ← January 2024 →) */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-display flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-[#0284c7]" />
            <span>{currentMonthName} {currentYear}</span>
          </h2>

          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* 7-Day Header Labels (SUN MON TUE WED THU FRI SAT) */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-black text-slate-400 uppercase tracking-wider">
          <span>SUN</span>
          <span>MON</span>
          <span>TUE</span>
          <span>WED</span>
          <span>THU</span>
          <span>FRI</span>
          <span>SAT</span>
        </div>

        {/* Month Day Grid Boxes */}
        <div className="grid grid-cols-7 gap-2">
          
          {/* Blank Padding Boxes before first day of month */}
          {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
            <div key={`blank-${idx}`} className="h-28 bg-slate-50/50 rounded-2xl border border-slate-100/60 opacity-40" />
          ))}

          {/* Date Cells (1 to daysInMonth) */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const monthFormatted = String(currentMonthIndex + 1).padStart(2, '0');
            const dayFormatted = String(dayNum).padStart(2, '0');
            const dateStr = `${currentYear}-${monthFormatted}-${dayFormatted}`;

            // Check if day falls within any trip date span
            const matchingEvents = filteredEvents.filter(
              (evt) => dateStr >= evt.startDate && dateStr <= evt.endDate
            );

            const isSelected = selectedDayDate === dateStr;

            return (
              <div
                key={dayNum}
                onClick={() => handleDayClick(dayNum)}
                className={`h-28 p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between overflow-hidden relative ${
                  isSelected
                    ? 'border-[#0284c7] ring-2 ring-sky-100 bg-sky-50/30'
                    : 'border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                {/* Date Number Badge */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-black ${matchingEvents.length > 0 ? 'text-[#0284c7]' : 'text-slate-700'}`}>
                    {dayNum}
                  </span>
                  {matchingEvents.length > 0 && (
                    <span className="w-2 h-2 rounded-full bg-[#0284c7]" />
                  )}
                </div>

                {/* Trip Event Bands (Screen 11 Wireframe Layout: Paris Trip, NYC Getaway, Japan Adventure) */}
                <div className="space-y-1 my-auto">
                  {matchingEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className={`px-2 py-1 rounded-lg font-black text-[10px] uppercase truncate shadow-2xs ${evt.color}`}
                    >
                      {evt.tripName}
                    </div>
                  ))}
                </div>

                <span className="text-[9px] text-slate-400 font-semibold truncate block">
                  {matchingEvents.length > 0 ? `${matchingEvents.length} Event` : ''}
                </span>
              </div>
            );
          })}

        </div>

      </div>

      {/* Expandable Day Detail Drawer & Drag-to-Reorder Quick Editor (Screen 11 Requirement) */}
      <AnimatePresence>
        {selectedDayDate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-extrabold text-[#0284c7] uppercase tracking-wider block">
                  Expandable Day Detail Flow
                </span>
                <h3 className="text-xl font-black text-slate-900 font-display">
                  Itinerary Schedule for {selectedDayDate}
                </h3>
              </div>

              <button
                onClick={() => setSelectedDayDate(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Overlapping Trips on this Date */}
            {activeDayEvents.length > 0 ? (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {activeDayEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className={`px-4 py-2 rounded-2xl border font-black text-xs flex items-center gap-2 shrink-0 ${evt.color}`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{evt.tripName} — {evt.destination}</span>
                    {onOpenTrip && (
                      <button
                        onClick={() => onOpenTrip(evt.tripId)}
                        className="ml-2 px-2 py-0.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[10px] font-bold"
                      >
                        Open Trip →
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No major multi-day trips scheduled for this exact date yet.</p>
            )}

            {/* Reorderable Activities List */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Daily Activities Timeline (Drag / Click Arrow to Reorder)</span>
                <span>Quick Actions</span>
              </div>

              <div className="space-y-3">
                {dayActivities.map((act, idx) => (
                  <div
                    key={act.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4 group hover:bg-white transition-all shadow-2xs"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Move Up Handle */}
                      <button
                        onClick={() => handleMoveActivityUp(idx)}
                        disabled={idx === 0}
                        title="Reorder item up"
                        className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                      >
                        <GripVertical className="w-4 h-4" />
                      </button>

                      {editingActId === act.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="text"
                            value={newActTitle}
                            onChange={(e) => setNewActTitle(e.target.value)}
                            className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none"
                          />
                          <button
                            onClick={() => handleSaveQuickEdit(act.id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 truncate">{act.title}</h4>
                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                            <span className="flex items-center gap-1 font-medium">
                              <Clock className="w-3.5 h-3.5 text-[#0284c7]" />
                              {act.time}
                            </span>
                            <span className="font-semibold text-emerald-700">₹{act.cost.toLocaleString('en-IN')}</span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-600 font-bold text-[10px]">
                              {act.category}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingActId(act.id);
                          setNewActTitle(act.title);
                        }}
                        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
