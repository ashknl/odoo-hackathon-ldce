import React, { useState } from 'react';
import { Search as SearchIcon, SlidersHorizontal as FilterIcon, ArrowUpDown as SortIcon, Layers as GroupIcon, X as XIcon, Check as CheckIcon } from 'lucide-react';

interface HomeHeroBannerProps {
  userName: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedGroupBy: string;
  onGroupByChange: (group: string) => void;
  selectedSortBy: string;
  onSortByChange: (sort: string) => void;
  activeFilterRegion: string;
  onFilterRegionChange: (region: string) => void;
  onOpenPlanner: () => void;
}

export const HomeHeroBanner: React.FC<HomeHeroBannerProps> = ({
  userName,
  searchQuery,
  onSearchChange,
  selectedGroupBy,
  onGroupByChange,
  selectedSortBy,
  onSortByChange,
  activeFilterRegion,
  onFilterRegionChange,
  onOpenPlanner,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isGroupOpen, setIsGroupOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const groupOptions = [
    { label: 'All Destinations', value: 'all' },
    { label: 'Group by Region', value: 'region' },
    { label: 'Group by Country', value: 'country' },
  ];

  const sortOptions = [
    { label: 'Recommended', value: 'recommended' },
    { label: 'Cost: Low to High', value: 'cost_asc' },
    { label: 'Cost: High to Low', value: 'cost_desc' },
    { label: 'Highest Rated', value: 'rating' },
  ];

  const regionOptions = ['All', 'Kerala', 'Goa', 'Ladakh', 'Andaman', 'Rishikesh', 'World'];

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 bg-slate-900 text-white">
      
      {/* 1. Background Banner Image with Gradient Mask */}
      <div className="relative h-64 sm:h-72 md:h-80 w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80"
          alt="GlobeTrotter Banner"
          className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent" />
        
        {/* Banner Content Overlay */}
        <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end max-w-3xl">
          <span className="text-xs font-bold tracking-widest text-sky-400 uppercase mb-1 bg-sky-950/70 px-3 py-1 rounded-full border border-sky-500/30 w-fit backdrop-blur-md">
            Good Morning, {userName.split(' ')[0]}.
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Best exciting trips in India & Beyond
          </h1>
          <p className="text-sm text-slate-300 font-normal mt-1 hidden sm:block">
            Curated multi-city itineraries, live POIs, and custom trip planning all in one dashboard.
          </p>
        </div>
      </div>

      {/* 2. Reference 3 Search Bar & Controls Panel (Blue theme) */}
      <div className="p-4 bg-white border-t border-slate-100 text-slate-800 flex flex-wrap items-center gap-3">
        
        {/* Search input field */}
        <div className="relative flex-1 min-w-[220px]">
          <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search bar ....."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-slate-800 placeholder-slate-400 font-medium transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <XIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Group by control dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsGroupOpen(!isGroupOpen);
              setIsFilterOpen(false);
              setIsSortOpen(false);
            }}
            className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              selectedGroupBy !== 'all'
                ? 'bg-sky-50 border-sky-300 text-sky-700'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <GroupIcon className="w-3.5 h-3.5 text-sky-600" />
            <span>Group by{selectedGroupBy !== 'all' ? `: ${selectedGroupBy}` : ''}</span>
          </button>

          {isGroupOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 p-2 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider block">Group Destinations</span>
              {groupOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onGroupByChange(opt.value);
                    setIsGroupOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700 rounded-xl flex items-center justify-between cursor-pointer"
                >
                  <span>{opt.label}</span>
                  {selectedGroupBy === opt.value && <CheckIcon className="w-3.5 h-3.5 text-sky-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filter control toggle */}
        <div className="relative">
          <button
            onClick={() => {
              setIsFilterOpen(!isFilterOpen);
              setIsGroupOpen(false);
              setIsSortOpen(false);
            }}
            className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeFilterRegion !== 'All'
                ? 'bg-sky-50 border-sky-300 text-sky-700'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <FilterIcon className="w-3.5 h-3.5 text-sky-600" />
            <span>Filter{activeFilterRegion !== 'All' ? `: ${activeFilterRegion}` : ''}</span>
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 p-4 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">Filter by Region</span>
                <button onClick={() => setIsFilterOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <XIcon className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {regionOptions.map((reg) => (
                  <button
                    key={reg}
                    onClick={() => {
                      onFilterRegionChange(reg);
                      setIsFilterOpen(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      activeFilterRegion === reg
                        ? 'bg-[#0284c7] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {reg}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sort by... dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsSortOpen(!isSortOpen);
              setIsGroupOpen(false);
              setIsFilterOpen(false);
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
          >
            <SortIcon className="w-3.5 h-3.5 text-sky-600" />
            <span>Sort by...</span>
          </button>

          {isSortOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl z-30 p-2 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider block">Sort Options</span>
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onSortByChange(opt.value);
                    setIsSortOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700 rounded-xl flex items-center justify-between cursor-pointer"
                >
                  <span>{opt.label}</span>
                  {selectedSortBy === opt.value && <CheckIcon className="w-3.5 h-3.5 text-sky-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
