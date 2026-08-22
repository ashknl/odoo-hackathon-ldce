import React from 'react';
import { Plus, Compass } from 'lucide-react';

interface PlanTripFabProps {
  onOpenPlanner: () => void;
}

export const PlanTripFab: React.FC<PlanTripFabProps> = ({ onOpenPlanner }) => {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={onOpenPlanner}
        className="group relative bg-gradient-to-r from-[#0284c7] via-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-extrabold text-sm py-3.5 px-6 rounded-full shadow-2xl shadow-sky-900/30 hover:shadow-sky-500/40 border border-sky-300/40 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2.5 cursor-pointer"
      >
        {/* Glow backdrop ring */}
        <span className="absolute -inset-1 rounded-full bg-sky-400/30 blur-md group-hover:opacity-100 opacity-60 transition-opacity pointer-events-none" />

        <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:rotate-90 transition-transform duration-300">
          <Plus className="w-4 h-4 stroke-[3]" />
        </div>

        <span className="tracking-tight text-white font-bold relative z-10">Plan a trip</span>

        <Compass className="w-4 h-4 text-sky-200 animate-spin-slow ml-0.5" />
      </button>
    </div>
  );
};
