import React, { useState } from 'react';
import { City } from '../../types/schema';
import { Star, ArrowRight, Heart, Bookmark, Share2, MoreVertical } from 'lucide-react';

interface TopRegionalSelectionsProps {
  cities: City[];
  onSelectCity: (city: City) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const TopRegionalSelections: React.FC<TopRegionalSelectionsProps> = ({
  cities,
  onSelectCity,
  selectedCategory,
  onSelectCategory,
}) => {
  const categoryPills = [
    'Recommended',
    'Browse',
    'India',
    'World',
    'Adventurous',
    'Romantic',
    'Road-trip',
    'Exciting',
    'Kerala',
    'Goa',
    'Ladakh',
    'Andaman',
    'Rishikesh',
  ];

  const subFilterPills = ['Recommended', 'Kerala', 'Goa', 'Ladakh', 'Andaman', 'Rishikesh'];

  // Filter cities based on selected category pill
  const filteredCities = cities.filter((city) => {
    if (selectedCategory === 'Recommended' || selectedCategory === 'Browse') return true;
    if (selectedCategory === 'India') return city.country === 'India';
    if (selectedCategory === 'World') return city.country !== 'India';
    return (
      city.tags?.includes(selectedCategory) ||
      city.region.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      city.name.toLowerCase().includes(selectedCategory.toLowerCase())
    );
  });

  return (
    <section className="space-y-4">
      
      {/* 1. Primary Category Nav Row (Ref 1 style - Blue theme) */}
      <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none text-xs font-semibold text-slate-500">
        {categoryPills.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`whitespace-nowrap transition-all duration-200 py-1 border-b-2 cursor-pointer ${
              selectedCategory === cat
                ? 'border-sky-500 text-slate-900 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 2. Section Header & Quick Icon Controls (Ref 1 style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Top Regional Selections
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Handpicked destinations with verified guides and custom stop itineraries
          </p>
        </div>

        {/* Action icons row (Ref 1) */}
        <div className="flex items-center gap-3 text-slate-400">
          <button className="p-2 rounded-full hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer">
            <Heart className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-full hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer">
            <Bookmark className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-full hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-full hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Secondary Filter Pills (Ref 1 style) */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1 text-xs">
        {subFilterPills.map((subCat) => (
          <button
            key={subCat}
            onClick={() => onSelectCategory(subCat)}
            className={`px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
              selectedCategory === subCat
                ? 'bg-[#0284c7] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {subCat}
          </button>
        ))}
      </div>

      {/* 4. Destination Cards Grid / Horizontal Carousel (Ref 1 & Ref 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-2">
        {filteredCities.slice(0, 4).map((city) => (
          <div
            key={city.id}
            onClick={() => onSelectCity(city)}
            className="group relative h-72 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-slate-100 bg-slate-900 flex flex-col justify-between p-4"
          >
            {/* Background Image */}
            <img
              src={city.image}
              alt={city.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90"
            />

            {/* Gradient Mask */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/10 group-hover:via-slate-950/40 transition-colors" />

            {/* Top Rating Overlay Badge (Ref 1 style) */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {city.rating ?? 4.7}
              </span>

              <span className="text-[10px] font-bold text-white/90 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                ₹{(city.costIndex ?? city.cost_index).toLocaleString('en-IN')}/day
              </span>
            </div>

            {/* Bottom Details Overlay (Ref 1 style) */}
            <div className="relative z-10 flex justify-between items-end">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-sky-300 transition-colors">
                  {city.name}
                </h3>
                <p className="text-xs font-medium text-slate-300 flex items-center gap-1 mt-0.5">
                  {city.region}, {city.country}
                </p>
              </div>

              {/* Circular Action Arrow */}
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md group-hover:bg-[#0284c7] text-white flex items-center justify-center transition-all group-hover:scale-110 shadow-md">
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
};
