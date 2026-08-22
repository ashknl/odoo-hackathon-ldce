import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Plane, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { ADVENTURE_STAMPS } from '../data/travelData';
import { AdventureStamp } from '../types/travel';

interface AdventureStampsProps {
  onSelectStamp: (stamp: AdventureStamp) => void;
}

export const AdventureStamps: React.FC<AdventureStampsProps> = ({ onSelectStamp }) => {
  const [startIndex, setStartIndex] = useState(0);

  const handlePrev = () => {
    setStartIndex((prev) => (prev === 0 ? ADVENTURE_STAMPS.length - 4 : Math.max(0, prev - 1)));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev + 4 >= ADVENTURE_STAMPS.length ? 0 : prev + 1));
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      
      {/* Centered Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
          Let's go on an adventure
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1.5">
          Find and book a great experience.
        </p>
      </div>

      {/* 4 Stamps Carousel Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {ADVENTURE_STAMPS.map((stamp, idx) => (
          <motion.div
            key={stamp.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            onClick={() => onSelectStamp(stamp)}
            className="group cursor-pointer flex flex-col items-center"
          >
            {/* Postage Stamp Card Wrapper */}
            <div className="relative bg-white p-2.5 sm:p-3 pb-4 rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all duration-300 w-full group-hover:-translate-y-1">
              
              {/* Circular Postmark Airport Stamp Badge in Top Left */}
              <div className="absolute -top-2.5 -left-2.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0284c7] text-white border-2 border-white shadow-md flex items-center justify-center">
                <Plane className="w-3.5 h-3.5 -rotate-45" />
              </div>

              {/* Stamp Inner Picture with subtle border */}
              <div className="aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden relative bg-slate-100">
                <img
                  src={stamp.image}
                  alt={stamp.city}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* City Label Below */}
              <div className="mt-3 text-center">
                <span className="font-extrabold tracking-[0.25em] text-xs sm:text-sm text-slate-800 uppercase block font-heading group-hover:text-[#0284c7] transition-colors">
                  {stamp.city}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {stamp.landmark}
                </span>
              </div>

            </div>
          </motion.div>
        ))}
      </div>

      {/* Carousel Navigation Arrows */}
      <div className="flex items-center justify-center gap-3 mt-8">
        <button
          onClick={handlePrev}
          className="p-2 rounded-full border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
          aria-label="Previous stamp"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          onClick={handleNext}
          className="p-2 rounded-full border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
          aria-label="Next stamp"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </section>
  );
};
