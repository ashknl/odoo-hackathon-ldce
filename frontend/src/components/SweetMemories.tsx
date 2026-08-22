import React from 'react';
import { Star, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { SWEET_MEMORIES_DATA } from '../data/travelData';

interface SweetMemoriesProps {
  onStartExplore: () => void;
}

export const SweetMemories: React.FC<SweetMemoriesProps> = ({ onStartExplore }) => {
  const { title, subtitle, steps, heroImage, reviews } = SWEET_MEMORIES_DATA;

  return (
    <section id="activity" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      
      {/* Centered Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1.5">
          {subtitle}
        </p>
      </div>

      {/* 2-Column Split: Numbered Steps on Left, Tall Image with Floating Cards on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        
        {/* Left Column: 3 Numbered Steps + Button */}
        <div className="lg:col-span-6 space-y-8">
          {steps.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="flex items-start gap-4"
            >
              {/* Blue Number Badge */}
              <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-[#0284c7] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm">
                {step.num}
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mt-1 max-w-md">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}

          {/* Start Your Explore Blue Button */}
          <div className="pt-2">
            <button
              onClick={onStartExplore}
              id="start-your-explore-btn"
              className="px-6 py-3.5 rounded-2xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>Start your explore</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Tall Portrait Image with Floating Review Pills */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="relative max-w-sm sm:max-w-md w-full">
            
            {/* Tall Main Landscape Image Frame */}
            <div className="rounded-[32px] overflow-hidden aspect-[9/13] sm:aspect-[9/12] shadow-xl border border-slate-100 bg-slate-100 relative">
              <img
                src={heroImage}
                alt="Sweet travel memories landscape"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Floating Review Card 1: Top Left - Kamelia Diana */}
            {reviews[0] && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85, x: -20 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="absolute top-8 -left-3 sm:-left-8 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-2.5 z-10 hover:scale-105 transition-transform"
              >
                <img
                  src={reviews[0].avatar}
                  alt={reviews[0].name}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight">
                    {reviews[0].name}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{reviews[0].rating}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Floating Review Card 2: Middle Right - Haikal Adam */}
            {reviews[1] && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85, x: 20 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="absolute top-[44%] -right-3 sm:-right-8 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-2.5 z-10 hover:scale-105 transition-transform"
              >
                <img
                  src={reviews[1].avatar}
                  alt={reviews[1].name}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight">
                    {reviews[1].name}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{reviews[1].rating}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Floating Review Card 3: Bottom Left - Joe Zefrano */}
            {reviews[2] && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute bottom-8 -left-3 sm:-left-6 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-2.5 z-10 hover:scale-105 transition-transform"
              >
                <img
                  src={reviews[2].avatar}
                  alt={reviews[2].name}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight">
                    {reviews[2].name}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{reviews[2].rating}</span>
                  </div>
                </div>
              </motion.div>
            )}

          </div>
        </div>

      </div>

    </section>
  );
};
