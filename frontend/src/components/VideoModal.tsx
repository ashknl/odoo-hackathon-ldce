import React from 'react';
import { X, Play, Volume2, Maximize2, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookNow: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  onBookNow
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative bg-slate-900 rounded-3xl overflow-hidden max-w-3xl w-full shadow-2xl z-10 border border-slate-800"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/70 transition-colors z-20 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Video Player Mockup with rich live simulation */}
          <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=85"
              alt="Turquoise Lagoon Tour Preview"
              className="w-full h-full object-cover opacity-90 scale-105 animate-pulse duration-1000"
            />
            
            {/* Ambient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />

            {/* Centered live playing indicator */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#0284c7]/90 text-white flex items-center justify-center shadow-xl animate-bounce">
                <Play className="w-7 h-7 fill-white pl-1" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight font-heading drop-shadow">
                Lagoon & Island Expedition Preview
              </h3>
              <p className="text-xs text-white/80 max-w-md">
                Experience crystal clear waters, secluded atolls, and guided sea kayaking.
              </p>
            </div>

            {/* Video timeline bar */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between text-white/70 text-xs">
              <div className="flex items-center gap-3">
                <Volume2 className="w-4 h-4" />
                <span>01:24 / 04:30</span>
              </div>
              <div className="flex-1 mx-4 h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-[#0284c7]" />
              </div>
              <Maximize2 className="w-4 h-4" />
            </div>
          </div>

          {/* Bottom Action strip */}
          <div className="p-5 bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-800">
            <div>
              <div className="text-white font-bold text-sm">Ready to embark on this journey?</div>
              <div className="text-xs text-slate-400">Exclusive 20% discount applied for early reservations.</div>
            </div>

            <button
              onClick={() => {
                onClose();
                onBookNow();
              }}
              className="px-6 py-2.5 rounded-full bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold shadow-md transition-all cursor-pointer whitespace-nowrap"
            >
              Book Now
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
