import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Calendar, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  DollarSign,
  CheckCircle2,
  Download,
  Share2,
  Building2,
  Train,
  Ticket,
  MapPin,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Destination, TravelPackage } from '../types/travel';
import { DESTINATIONS, TRAVEL_PACKAGES } from '../data/travelData';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPackage?: TravelPackage;
  initialDestination?: Destination;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialPackage,
  initialDestination
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Selected item
  const [selectedDestId, setSelectedDestId] = useState<string>(
    initialDestination?.id || DESTINATIONS[0].id
  );
  
  const [selectedDate, setSelectedDate] = useState('2026-09-15');
  const [guests, setGuests] = useState(2);
  const [lodgingTier, setLodgingTier] = useState<'budget' | 'comfort' | 'luxury'>('comfort');
  const [transitStyle, setTransitStyle] = useState<'high-speed-rail' | 'economy-rail' | 'private-car'>('high-speed-rail');

  // Add-ons
  const [addOns, setAddOns] = useState({
    fastTrackMuseums: true,
    pocketWifi: true,
    unlimitedTransitPass: true,
    comprehensiveInsurance: true,
    culinaryWalkingTour: false
  });

  // Contact Info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [bookingRef, setBookingRef] = useState('');

  // Selected Destination or Package object
  const currentDest = DESTINATIONS.find(d => d.id === selectedDestId) || DESTINATIONS[0];
  const basePrice = initialPackage ? initialPackage.price : currentDest.priceFrom;

  // Lodging fee calculation
  const lodgingFee = lodgingTier === 'luxury' ? 450 : lodgingTier === 'budget' ? -150 : 0;
  
  // Transit fee calculation
  const transitFee = transitStyle === 'private-car' ? 280 : transitStyle === 'economy-rail' ? -80 : 0;

  // Addon fees
  const addOnTotal = 
    (addOns.fastTrackMuseums ? 75 : 0) +
    (addOns.pocketWifi ? 35 : 0) +
    (addOns.unlimitedTransitPass ? 90 : 0) +
    (addOns.comprehensiveInsurance ? 65 : 0) +
    (addOns.culinaryWalkingTour ? 110 : 0);

  const pricePerPerson = Math.max(300, basePrice + lodgingFee + transitFee + addOnTotal);
  const totalPrice = pricePerPerson * guests;

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomRef = 'GT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setBookingRef(randomRef);
    setStep(4);

    // Fire celebratory confetti!
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 relative my-auto"
      >
        {/* Top Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              {step < 4 ? `0${step}` : '✓'}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {step === 1 && 'Select Destination & Dates'}
                {step === 2 && 'Custom Travel Passes & Add-ons'}
                {step === 3 && 'Lead Traveler Information'}
                {step === 4 && 'Trip Itinerary Confirmed!'}
              </h3>
              <p className="text-xs text-slate-400">
                {step === 4 ? 'Reference: ' + bookingRef : 'Step ' + step + ' of 3 · Complimentary Custom Itinerary Hold'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: DESTINATION, DATES & GUESTS */}
        {step === 1 && (
          <div className="p-6 space-y-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                1. Selected Trip / Destination Route
              </label>
              <select
                value={selectedDestId}
                onChange={(e) => setSelectedDestId(e.target.value)}
                className="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-800 text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none cursor-pointer"
              >
                {DESTINATIONS.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.title} ({d.city}, {d.country}) — Est. ${d.priceFrom}/person
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Target Departure Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-slate-50"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Travelers: <strong className="text-sky-600">{guests} {guests === 1 ? 'Person' : 'People'}</strong>
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 6].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGuests(num)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        guests === num
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {num} {num === 1 ? 'Solo' : 'pax'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Lodging Tier Selection */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Accommodation Level
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'budget', name: 'Budget Friendly', fee: 'Save ~$150', note: 'Central hostels & B&Bs' },
                  { id: 'comfort', name: 'Comfort Boutique', fee: 'Standard', note: 'Curated 4-star hotels' },
                  { id: 'luxury', name: 'Luxury 5-Star', fee: '+$450', note: 'Premium suites & spas' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setLodgingTier(item.id as any)}
                    className={`p-3 rounded-2xl border text-left text-xs transition-all cursor-pointer ${
                      lodgingTier === item.id
                        ? 'border-sky-500 bg-sky-50 text-slate-950 font-bold ring-2 ring-sky-500/20'
                        : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold text-slate-900">{item.name}</div>
                    <div className="text-[10px] text-sky-600 font-semibold">{item.fee}</div>
                    <div className="text-[10px] text-slate-400">{item.note}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 1 Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block uppercase font-bold">Estimated Base Total</span>
                <span className="text-xl font-black text-slate-950">${pricePerPerson} <span className="text-xs font-normal text-slate-400">/ person</span></span>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>Continue to Passes & Add-ons</span>
                <ArrowRight className="w-4 h-4 text-sky-400" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: ADD-ONS */}
        {step === 2 && (
          <div className="p-6 space-y-4">
            <p className="text-xs text-slate-500">
              Customize your trip with activity fast-tracks, high-speed regional rail passes, and portable connectivity.
            </p>

            <div className="space-y-2.5">
              {[
                {
                  key: 'fastTrackMuseums',
                  title: 'Skip-The-Line VIP Museum & Monument Passes',
                  desc: 'Priority entrance to major landmarks (Louvre, Colosseum, TeamLab, etc.)',
                  price: '+$75 / person'
                },
                {
                  key: 'unlimitedTransitPass',
                  title: 'Unlimited High-Speed & Metro Rail Pass',
                  desc: 'Pre-activated digital contactless pass for all inter-city trains and local subways.',
                  price: '+$90 / person'
                },
                {
                  key: 'pocketWifi',
                  title: 'Unlimited 5G Pocket Wi-Fi & eSIM Data Pack',
                  desc: 'High-speed unlimited connection delivered directly to your first destination hotel.',
                  price: '+$35 total'
                },
                {
                  key: 'culinaryWalkingTour',
                  title: 'Local Food Market Crawl & Hidden Gems Tour',
                  desc: '3-hour guided evening culinary tour with 6 tastings and local wine.',
                  price: '+$110 / person'
                },
                {
                  key: 'comprehensiveInsurance',
                  title: 'Full Flight Interruption & Medical Travel Insurance',
                  desc: 'Complete coverage for cancellations, delays, lost luggage, and global medical.',
                  price: '+$65 / person'
                }
              ].map(item => {
                const isChecked = addOns[item.key as keyof typeof addOns];
                return (
                  <label
                    key={item.key}
                    className={`flex items-start justify-between p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                      isChecked
                        ? 'border-sky-500 bg-sky-50/50 shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => setAddOns({ ...addOns, [item.key]: e.target.checked })}
                        className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 mt-0.5"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{item.title}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                      </div>
                    </div>
                    <span className="font-bold text-slate-700 whitespace-nowrap ml-2">
                      {item.price}
                    </span>
                  </label>
                );
              })}
            </div>

            {/* Step 2 Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>Enter Traveler Details</span>
                <ArrowRight className="w-4 h-4 text-sky-400" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CONTACT FORM */}
        {step === 3 && (
          <form onSubmit={handleFinalSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Lead Traveler Full Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Elena Rostova"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Email Address *
                </label>
                <input
                  required
                  type="email"
                  placeholder="elena@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 234-5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Preferences or Route Requests
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vegetarian dining, early morning rail"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Total Cost Summary Box */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block font-bold uppercase">Estimated Total ({guests} Travelers)</span>
                <span className="text-2xl font-black text-sky-400">${totalPrice}</span>
              </div>
              <div className="text-right text-[11px] text-slate-400">
                <span>Deposit required: <strong>$0 now</strong></span>
                <span className="block text-emerald-400">Free Itinerary Export & Hold</span>
              </div>
            </div>

            {/* Step 3 Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                id="confirm-reservation-btn"
                className="px-8 py-3.5 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
                <span>Generate Custom Trip Itinerary</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: CONFIRMATION SUCCESS */}
        {step === 4 && (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Itinerary Created Successfully
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-3">
                Your Adventure Awaits, {name || 'Traveler'}!
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-2 max-w-md mx-auto">
                We have generated your personalized itinerary package for {currentDest.title} ({guests} travelers).
              </p>
            </div>

            {/* Reference Ticket Card */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left max-w-md mx-auto space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-400">Itinerary Reference</span>
                <span className="font-mono font-bold text-slate-900">{bookingRef}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-400">Destination</span>
                <span className="font-bold text-slate-900">{currentDest.title}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-400">Planned Departure</span>
                <span className="font-bold text-slate-900">{selectedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated Total Cost</span>
                <span className="font-extrabold text-slate-950">${totalPrice}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Done & Return to Explorer
              </button>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
};
