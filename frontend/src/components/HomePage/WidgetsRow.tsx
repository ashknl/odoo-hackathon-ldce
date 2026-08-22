import React, { useState } from 'react';
import { YearlyWishlistItem, TripCollaborator } from '../../types/schema';
import { CheckCircle2, Circle, Plus, Ticket, Users, Sparkles, MapPin } from 'lucide-react';

interface WidgetsRowProps {
  wishlist: YearlyWishlistItem[];
  collaborators: TripCollaborator[];
  onOpenBooking: () => void;
}

export const WidgetsRow: React.FC<WidgetsRowProps> = ({
  wishlist: initialWishlist,
  collaborators,
  onOpenBooking,
}) => {
  const [items, setItems] = useState<YearlyWishlistItem[]>(initialWishlist);
  const [newWishInput, setNewWishInput] = useState('');
  const [isAddingWish, setIsAddingWish] = useState(false);

  const toggleWish = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleAddWish = () => {
    if (!newWishInput.trim()) return;
    setItems((prev) => [
      ...prev,
      { id: `w-${Date.now()}`, title: newWishInput.trim(), completed: false },
    ]);
    setNewWishInput('');
    setIsAddingWish(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
      
      {/* 1. To Do Plan For The Year Widget (Ref 2 style - Blue theme) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-500" />
              To Do Plan For The Year
            </h3>
            <span className="text-[11px] font-bold bg-sky-50 text-sky-600 px-2.5 py-0.5 rounded-full">
              {items.filter((i) => i.completed).length}/{items.length}
            </span>
          </div>

          {/* Wishlist Checklist */}
          <div className="space-y-2.5 text-xs">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleWish(item.id)}
                className={`p-2.5 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                  item.completed
                    ? 'bg-sky-50/50 border-sky-200 text-slate-400 line-through'
                    : 'bg-slate-50/80 border-slate-200/80 text-slate-700 hover:bg-slate-100/80'
                }`}
              >
                {item.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-400 flex-shrink-0" />
                )}
                <span className="font-medium flex-1">{item.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Add New Wish Input/Button */}
        {isAddingWish ? (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <input
              type="text"
              placeholder="E.g. To swim in the Ocean..."
              value={newWishInput}
              onChange={(e) => setNewWishInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddWish()}
              className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              autoFocus
            />
            <button
              onClick={handleAddWish}
              className="bg-[#0284c7] text-white font-bold text-xs px-3 py-2 rounded-xl hover:bg-[#0369a1] cursor-pointer"
            >
              Add
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingWish(true)}
            className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200/80 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-sky-600" /> Add New Wish
          </button>
        )}
      </div>

      {/* 2. Your Next Trip Ticket Widget (Ref 2 style - Blue theme) */}
      <div className="bg-gradient-to-br from-sky-600 via-sky-500 to-blue-700 text-white rounded-3xl p-5 shadow-sm flex flex-col justify-between relative overflow-hidden">
        
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-100 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
              Your Next Trip
            </span>
            <h4 className="text-lg font-extrabold text-white mt-2">Munnar & Kerala Hills</h4>
          </div>

          <div className="bg-white text-sky-700 px-3 py-1.5 rounded-2xl shadow-md text-center">
            <span className="text-[10px] font-bold block uppercase tracking-wider text-slate-400">In</span>
            <span className="text-sm font-extrabold leading-none">2 Days</span>
          </div>
        </div>

        {/* Departure Details */}
        <div className="my-4 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 space-y-2 text-xs">
          <div className="flex justify-between items-center text-sky-50">
            <span className="font-semibold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-sky-300" /> New Delhi - USA
            </span>
            <span className="text-[11px] opacity-80">Oct, 21 • 6:40 PM</span>
          </div>
          <div className="flex justify-between items-center text-sky-50 pt-1 border-t border-white/10">
            <span className="font-semibold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-sky-300" /> Las Palmas - Spain
            </span>
            <span className="text-[11px] opacity-80">Oct, 22 • 5:00 PM</span>
          </div>
        </div>

        <button
          onClick={onOpenBooking}
          className="w-full bg-white hover:bg-sky-50 text-sky-700 font-extrabold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Ticket className="w-4 h-4 text-sky-600" /> View Boarding Ticket
        </button>

      </div>

      {/* 3. Friends Trip Social Collaborators Widget (Ref 2 style - Blue theme) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-500" />
              Friends Trip
            </h3>
            <span className="text-[11px] font-bold text-slate-400">3 Friends</span>
          </div>

          {/* Collaborator List */}
          <div className="space-y-3">
            {collaborators.map((collab) => (
              <div
                key={collab.id}
                className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={collab.user?.profile_image}
                    alt={collab.user?.name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-sky-100"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{collab.user?.name}</h4>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Role: <span className="text-sky-600 font-semibold">{collab.role}</span>
                    </p>
                  </div>
                </div>

                <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-1 rounded-lg">
                  Co-Planner
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onOpenBooking}
          className="w-full py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs rounded-xl transition-colors border border-sky-200/60 cursor-pointer"
        >
          + Invite Friends to Co-Plan
        </button>
      </div>

    </div>
  );
};
