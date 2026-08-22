import React, { useState } from 'react';
import { 
  MapPin, 
  Calendar, 
  Compass, 
  DollarSign, 
  Search,
  Sparkles
} from 'lucide-react';
import { QuickFilterState } from '../types/travel';

interface QuickSearchDockProps {
  onFilterChange: (filters: QuickFilterState) => void;
  onSearchClick: () => void;
  resultCount: number;
}

export const QuickSearchDock: React.FC<QuickSearchDockProps> = ({
  onFilterChange,
  onSearchClick,
  resultCount
}) => {
  const [selectedDestination, setSelectedDestination] = useState('All Global Destinations');
  const [selectedMonth, setSelectedMonth] = useState('Any Travel Season');
  const [selectedActivity, setSelectedActivity] = useState('All Trip Styles');
  const [maxBudget, setMaxBudget] = useState(2500);

  const handleApply = (
    dest = selectedDestination,
    month = selectedMonth,
    activity = selectedActivity,
    budget = maxBudget
  ) => {
    onFilterChange({
      destination: dest === 'All Global Destinations' ? '' : dest,
      month: month === 'Any Travel Season' ? '' : month,
      activityType: activity === 'All Trip Styles' ? '' : activity,
      maxBudget: budget,
      duration: ''
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 sm:-mt-12 relative z-30 mb-14">
      <div 
        id="quick-search-dock-card"
        className="bg-white rounded-3xl sm:rounded-full p-3 sm:p-3.5 shadow-2xl border border-slate-200/80 backdrop-blur-xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 transition-all"
      >
        
        {/* Destination Field */}
        <div className="flex-1 px-4 py-2 hover:bg-slate-50 rounded-2xl sm:rounded-full transition-colors relative group">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-sky-500" />
            <span>Destination / City</span>
          </label>
          <select
            id="filter-destination-select"
            value={selectedDestination}
            onChange={(e) => {
              setSelectedDestination(e.target.value);
              handleApply(e.target.value, selectedMonth, selectedActivity, maxBudget);
            }}
            className="w-full bg-transparent font-semibold text-slate-800 text-sm focus:outline-none cursor-pointer py-0.5"
          >
            <option value="All Global Destinations">All Global Destinations</option>
            <option value="Japan">Japan (Tokyo, Kyoto, Osaka)</option>
            <option value="Italy">Italy (Rome, Florence, Amalfi)</option>
            <option value="France">France & Swiss Alps (Paris, Lucerne)</option>
            <option value="Indonesia">Indonesia (Bali, Ubud, Penida)</option>
            <option value="Spain">Spain (Barcelona, Costa Brava)</option>
            <option value="USA">North America (NYC, Boston, Montreal)</option>
          </select>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px h-8 bg-slate-200" />

        {/* Season / Month Field */}
        <div className="flex-1 px-4 py-2 hover:bg-slate-50 rounded-2xl sm:rounded-full transition-colors">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-emerald-500" />
            <span>Travel Season</span>
          </label>
          <select
            id="filter-month-select"
            value={selectedMonth}
            onChange={(e) => {
              setSelectedMonth(e.target.value);
              handleApply(selectedDestination, e.target.value, selectedActivity, maxBudget);
            }}
            className="w-full bg-transparent font-semibold text-slate-800 text-sm focus:outline-none cursor-pointer py-0.5"
          >
            <option value="Any Travel Season">Any Travel Season</option>
            <option value="Spring">Spring (Cherry Blossoms & Mild)</option>
            <option value="Summer">Summer (Coastal & Long Days)</option>
            <option value="Autumn">Autumn (Foliage & Harvest)</option>
            <option value="Winter">Winter (Snow & Festive Lights)</option>
          </select>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px h-8 bg-slate-200" />

        {/* Trip Style Field */}
        <div className="flex-1 px-4 py-2 hover:bg-slate-50 rounded-2xl sm:rounded-full transition-colors">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-amber-500" />
            <span>Trip Category</span>
          </label>
          <select
            id="filter-activity-select"
            value={selectedActivity}
            onChange={(e) => {
              setSelectedActivity(e.target.value);
              handleApply(selectedDestination, selectedMonth, e.target.value, maxBudget);
            }}
            className="w-full bg-transparent font-semibold text-slate-800 text-sm focus:outline-none cursor-pointer py-0.5"
          >
            <option value="All Trip Styles">All Trip Styles</option>
            <option value="Multi-City">Multi-City Rail & Flight</option>
            <option value="Cultural">Cultural & Historic</option>
            <option value="Culinary">Culinary & Food Crawls</option>
            <option value="Nature & Scenic">Nature & Scenic Vistas</option>
            <option value="Coastal & Island">Coastal & Island Hopping</option>
          </select>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px h-8 bg-slate-200" />

        {/* Budget Estimator Slider */}
        <div className="px-4 py-2 flex flex-col justify-center">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-sky-500" />
              <span>Budget: &lt; ${maxBudget}</span>
            </span>
          </div>
          <input
            type="range"
            min={600}
            max={3000}
            step={100}
            value={maxBudget}
            onChange={(e) => {
              const val = Number(e.target.value);
              setMaxBudget(val);
              handleApply(selectedDestination, selectedMonth, selectedActivity, val);
            }}
            className="w-28 sm:w-32 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
          />
        </div>

        {/* Search CTA Button */}
        <button
          id="dock-search-btn"
          onClick={onSearchClick}
          className="bg-slate-950 hover:bg-slate-800 text-white font-bold px-6 py-3.5 rounded-2xl sm:rounded-full flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 shrink-0 cursor-pointer"
        >
          <Search className="w-4 h-4 text-sky-400" />
          <span className="text-sm">Find Trips</span>
          <span className="bg-sky-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full ml-1">
            {resultCount}
          </span>
        </button>

      </div>
    </div>
  );
};
