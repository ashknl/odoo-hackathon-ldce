import React from 'react';
import { Play, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface VideoBannerProps {
  onBookNow: () => void;
  onPlayVideo: () => void;
}

export const VideoBanner: React.FC<VideoBannerProps> = ({
  onBookNow,
  onPlayVideo
}) => {
  return (
    <section id="tickets" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      
      {/* Section Header Row */}
      <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
          Book tickets and go now!
        </h2>

        <button
          onClick={onBookNow}
          id="banner-book-now-btn"
          className="px-6 sm:px-7 py-2.5 sm:py-3 rounded-full bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer whitespace-nowrap"
        >
          Book now
        </button>
      </div>

      {/* Large Rounded Panoramic Aerial Ocean Banner with Play Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden aspect-[16/8] sm:aspect-[21/9] bg-slate-900 shadow-md group cursor-pointer"
        onClick={onPlayVideo}
      >
        <img
          src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=85"
          alt="Turquoise ocean aerial view with kayak"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Soft Ambient Overlay */}
        <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/30 transition-colors" />

        {/* Central Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#0284c7]/85 hover:bg-[#0284c7] text-white backdrop-blur-md flex items-center justify-center shadow-2xl border border-white/30 transition-all pl-1"
          >
            <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white text-white" />
          </motion.div>
        </div>

      </motion.div>

    </section>
  );
};
