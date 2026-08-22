import React from 'react';
import { 
  Star, 
  ShieldCheck, 
  Quote, 
  Award, 
  CheckCircle2, 
  Layers,
  Sparkles,
  Users, 
  DollarSign,
  Globe2,
  TrendingDown
} from 'lucide-react';
import { motion } from 'motion/react';
import { TESTIMONIALS, PLATFORM_STATS, CORE_PILLARS } from '../data/travelData';

export const TestimonialsTrust: React.FC = () => {
  return (
    <section id="about" className="py-16 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Platform Highlights / Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {PLATFORM_STATS.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center"
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight font-display">
                {stat.value}
              </div>
              <div className="text-sm font-bold text-slate-800 mt-2">
                {stat.label}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {stat.detail}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Loved by Independent Explorers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Journeys Planned With Precision
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-1.5">
            Read how global travelers saved hours of research and thousands of dollars with personalized itineraries.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {TESTIMONIALS.map((test, idx) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-slate-200" />
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "{test.quote}"
                </p>

                {test.savedMoney && (
                  <div className="mt-3.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>{test.savedMoney}</span>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-slate-100 mt-6 flex items-center gap-3">
                <img
                  src={test.avatar}
                  alt={test.author}
                  className="w-11 h-11 rounded-full object-cover border border-slate-200 shadow-sm"
                />
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-slate-900 truncate">{test.author}</span>
                    {test.verified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0" title="Verified Traveler" />
                    )}
                  </div>
                  <span className="text-xs text-slate-500 truncate">{test.role}</span>
                  <span className="text-[11px] text-sky-600 font-medium truncate max-w-[200px]">{test.tripName}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global Planning Guarantees & Transparency Banner */}
        <div className="bg-[#0f172a] text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>The GlobeTrotter Standard</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white">
                Zero Budget Surprises & Clean Route Design
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                We synthesize realistic cost indices, rail transfers, and verified attractions so you spend less time budgeting and more time traveling.
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CORE_PILLARS.map((pillar, i) => (
                <div key={i} className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-col justify-center">
                  <span className="text-sm font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                    <span className="truncate">{pillar.name}</span>
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1">{pillar.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
