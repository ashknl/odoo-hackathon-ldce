import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  MapPin, 
  ArrowRight, 
  X, 
  User,
  Share2,
  Bookmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { JOURNAL_ENTRIES } from '../data/travelData';
import { JournalEntry } from '../types/travel';

export const TravelJournals: React.FC = () => {
  const [activeJournal, setActiveJournal] = useState<JournalEntry | null>(null);

  return (
    <section id="journals" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Community Stories & Planning Guides</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Traveler Stories & Itinerary Guides
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-1.5 max-w-xl">
            Real budget breakdowns, multi-city logistics strategies, and advice penned by passionate GlobeTrotter creators and planners.
          </p>
        </div>

        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden md:inline">
          GlobeTrotter Community Dispatches
        </span>
      </div>

      {/* Journal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {JOURNAL_ENTRIES.map((journal, idx) => (
          <motion.article
            key={journal.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Image with Tag Overlay */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                <img
                  src={journal.image}
                  alt={journal.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-slate-900 text-xs font-bold shadow-sm">
                    {journal.category}
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 text-white text-[11px] font-medium flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-sky-400" />
                    <span>{journal.location}</span>
                  </span>
                </div>
              </div>

              {/* Text Body */}
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs text-slate-400 mb-2.5">
                  <span>{journal.date}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{journal.readTime}</span>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors leading-snug line-clamp-2">
                  {journal.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
                  {journal.excerpt}
                </p>
              </div>
            </div>

            {/* Author Footer & Read CTA */}
            <div className="p-6 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={journal.author.avatar}
                  alt={journal.author.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900">{journal.author.name}</span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[130px]">{journal.author.role}</span>
                </div>
              </div>

              <button
                id={`read-journal-${journal.id}`}
                onClick={() => setActiveJournal(journal)}
                className="w-9 h-9 rounded-full bg-slate-100 group-hover:bg-slate-900 group-hover:text-white flex items-center justify-center transition-all cursor-pointer"
                title="Read guide"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </motion.article>
        ))}
      </div>

      {/* Interactive Journal Reader Modal */}
      <AnimatePresence>
        {activeJournal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative p-6 sm:p-8"
            >
              <button
                onClick={() => setActiveJournal(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider inline-block mb-3">
                {activeJournal.category}
              </span>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mb-3 leading-tight">
                {activeJournal.title}
              </h2>

              <div className="flex items-center gap-3 pb-4 border-b border-slate-100 text-xs text-slate-500 mb-6">
                <img
                  src={activeJournal.author.avatar}
                  alt={activeJournal.author.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-bold text-slate-900">{activeJournal.author.name}</div>
                  <div>{activeJournal.author.role} · {activeJournal.date}</div>
                </div>
              </div>

              <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-6">
                <img
                  src={activeJournal.image}
                  alt={activeJournal.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
                <p className="font-medium text-slate-900 bg-slate-50 p-4 rounded-xl border border-slate-100 italic">
                  "{activeJournal.excerpt}"
                </p>
                <p>
                  Planning multi-city travel is always a balance between ambition and realism. When you string together multiple stops across different regions or countries, logistical friction like train transfers, baggage check-in windows, and hotel check-in times can quickly accumulate.
                </p>
                <p>
                  Using GlobeTrotter’s automatic budget estimator and visual day-wise timeline allowed us to visualize the flow of every single day before locking in bookings. We could easily see that adding a 2-day buffer in Kyoto instead of rushing directly to Osaka gave us 30% more relaxation time while cutting transit costs by grouping train routes together.
                </p>
                <p>
                  Key Takeaway: Always map your cities sequentially along high-speed rail corridors or budget carrier routes, and review your daily cost breakdown before final departures!
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="w-4 h-4 text-sky-600" />
                  <span>Route: {activeJournal.location}</span>
                </div>

                <button
                  onClick={() => setActiveJournal(null)}
                  className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
                >
                  Close Guide
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
