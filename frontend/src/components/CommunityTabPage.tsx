import React, { useState } from 'react';
import {
  Search,
  Heart,
  MessageSquare,
  Share2,
  Sparkles,
  MapPin,
  Star,
  Plus,
  Compass,
  User,
  Ticket,
  DollarSign,
  Send,
  ThumbsUp,
  Award,
  Filter,
  ArrowUpDown,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface CommunityPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorBadge: string;
  title: string;
  location: string;
  category: 'Trip Experience' | 'Activity Highlight' | 'Budget Tip' | 'Food & Stay';
  rating: number;
  cost: number;
  content: string;
  image?: string;
  likes: number;
  isLiked?: boolean;
  commentsCount: number;
  createdAt: string;
  tripId?: string;
}

const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    authorName: 'Aarav Sharma',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    authorBadge: 'Globetrotter Pro',
    title: 'Hidden Gem: Sunset Paragliding & Fort Sunset in Manali',
    location: 'Manali, Himachal Pradesh',
    category: 'Activity Highlight',
    rating: 4.9,
    cost: 3200,
    content: 'Trekking up Solang Valley for sunset paragliding was an unforgettable thrill. The winds were perfect, and the local guides ensured complete safety equipment! Pro tip: book the 4:30 PM slot for the best lighting.',
    image: 'https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&w=800&q=80',
    likes: 42,
    commentsCount: 9,
    createdAt: '2 hours ago',
  },
  {
    id: 'post-2',
    authorName: 'Elena Rostova',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    authorBadge: 'Budget Explorer',
    title: '3-Day Backpacker Itinerary to Paris under ₹25,000',
    location: 'Paris, France',
    category: 'Trip Experience',
    rating: 4.8,
    cost: 24500,
    content: 'Explored the Louvre, Eiffel Tower gardens, and Le Marais bakeries without breaking the bank. Used the Metro pass and stayed in a charming hostel near Canal Saint-Martin!',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    likes: 89,
    commentsCount: 17,
    createdAt: '5 hours ago',
  },
  {
    id: 'post-3',
    authorName: 'Rohan Mehta',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    authorBadge: 'Foodie Nomad',
    title: 'Top 5 Local Food Stalls & Night Markets in Goa',
    location: 'North Goa, India',
    category: 'Food & Stay',
    rating: 4.7,
    cost: 1800,
    content: 'Don’t miss out on authentic Goan Fish Thali at local shacks in Anjuna. Super fresh seafood at fraction of resort prices.',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    likes: 64,
    commentsCount: 12,
    createdAt: '1 day ago',
  },
];

interface CommunityTabPageProps {
  onCopyTripShortcut?: (title: string) => void;
  showToast?: (message: string) => void;
}

export const CommunityTabPage: React.FC<CommunityTabPageProps> = ({
  onCopyTripShortcut,
  showToast,
}) => {
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_POSTS);

  // Screen 10 Dock Controls State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [selectedGroupBy, setSelectedGroupBy] = useState<'all' | 'activities' | 'trips'>('all');
  const [selectedSortBy, setSelectedSortBy] = useState<'latest' | 'likes' | 'rating'>('latest');

  // Share Experience Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newCategory, setNewCategory] = useState<CommunityPost['category']>('Trip Experience');
  const [newCost, setNewCost] = useState('');
  const [newRating, setNewRating] = useState('5');
  const [newContent, setNewContent] = useState('');

  // Like Toggle
  const handleToggleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likes: isLiked ? p.likes + 1 : p.likes - 1,
          };
        }
        return p;
      })
    );
  };

  // Add New Experience Post
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPostItem: CommunityPost = {
      id: `post-${Date.now()}`,
      authorName: 'You (Traveler)',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      authorBadge: 'Community Explorer',
      title: newTitle,
      location: newLocation || 'Global Destination',
      category: newCategory,
      rating: parseFloat(newRating) || 5,
      cost: parseFloat(newCost) || 2500,
      content: newContent,
      likes: 1,
      isLiked: true,
      commentsCount: 0,
      createdAt: 'Just now',
    };

    setPosts([newPostItem, ...posts]);
    setShowCreateModal(false);

    // Reset Form
    setNewTitle('');
    setNewLocation('');
    setNewContent('');
    setNewCost('');

    if (showToast) showToast('Published your experience to the Community!');
  };

  // Filter Posts
  const filteredPosts = posts.filter((post) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchLoc = post.location.toLowerCase().includes(q);
      const matchContent = post.content.toLowerCase().includes(q);
      if (!matchTitle && !matchLoc && !matchContent) return false;
    }

    if (selectedCategoryFilter !== 'all' && post.category !== selectedCategoryFilter) {
      return false;
    }

    if (selectedGroupBy === 'activities' && post.category !== 'Activity Highlight') return false;
    if (selectedGroupBy === 'trips' && post.category !== 'Trip Experience') return false;

    return true;
  });

  // Sort Posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (selectedSortBy === 'likes') return b.likes - a.likes;
    if (selectedSortBy === 'rating') return b.rating - a.rating;
    return 0; // 'latest' keeps array order
  });

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 pb-24 pt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-[#0284c7] text-xs font-bold border border-sky-100 mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Screen 10: Community Tab</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
            Traveler Experiences & Community
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Community section where all users can share their experiences, budget tips, and activity highlights for any trip destination.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Share Your Experience</span>
        </button>
      </div>

      {/* Screen 10 Wireframe Dock: Search Bar | Group by | Filter | Sort by */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-center gap-3">
        
        {/* Search Bar Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search experiences by keyword, destination, or activity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200/80 bg-slate-50/50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
          />
        </div>

        {/* Dock Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          
          {/* Group By Control */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl shrink-0">
            <span className="text-[11px] font-bold text-slate-500 pl-2">Group by:</span>
            <button
              onClick={() => setSelectedGroupBy('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedGroupBy === 'all' ? 'bg-white text-[#0284c7] shadow-xs' : 'text-slate-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedGroupBy('activities')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedGroupBy === 'activities' ? 'bg-white text-[#0284c7] shadow-xs' : 'text-slate-600'
              }`}
            >
              Activities
            </button>
            <button
              onClick={() => setSelectedGroupBy('trips')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedGroupBy === 'trips' ? 'bg-white text-[#0284c7] shadow-xs' : 'text-slate-600'
              }`}
            >
              Trips
            </button>
          </div>

          {/* Filter Dropdown */}
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white cursor-pointer shrink-0"
          >
            <option value="all">Filter: All Categories</option>
            <option value="Trip Experience">Trip Experience</option>
            <option value="Activity Highlight">Activity Highlight</option>
            <option value="Budget Tip">Budget Tip</option>
            <option value="Food & Stay">Food & Stay</option>
          </select>

          {/* Sort By Dropdown */}
          <select
            value={selectedSortBy}
            onChange={(e) => setSelectedSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white cursor-pointer shrink-0"
          >
            <option value="latest">Sort by: Latest Posts</option>
            <option value="likes">Sort by: Most Liked</option>
            <option value="rating">Sort by: Top Rated</option>
          </select>

        </div>
      </div>

      {/* Screen 10 Excalidraw Wireframe Core Layout: Avatar Circle + Post Content Block */}
      <div className="space-y-6">
        <h2 className="text-xl font-black text-slate-900 font-display flex items-center justify-between">
          <span>Community Tab Posts</span>
          <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
            {sortedPosts.length} Experiences Shared
          </span>
        </h2>

        {sortedPosts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
            <Sparkles className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No community posts match your filter</h3>
            <p className="text-xs text-slate-500">Be the first to share an experience for this search term!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedPosts.map((post) => (
              /* Screen 10 Wireframe Layout: Left Avatar Circle + Right Post Box */
              <div
                key={post.id}
                className="flex items-start gap-4 sm:gap-6 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all group"
              >
                
                {/* Left Avatar Circle (Screen 10 Wireframe Circle) */}
                <div className="shrink-0 flex flex-col items-center gap-1">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover ring-2 ring-sky-200 shadow-xs"
                  />
                  <span className="text-[9px] font-extrabold text-[#0284c7] bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100 text-center whitespace-nowrap">
                    {post.authorBadge}
                  </span>
                </div>

                {/* Main Post Content Box (Screen 10 Wireframe Rounded Box) */}
                <div className="flex-1 space-y-3 min-w-0">
                  
                  {/* Post Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-[#0284c7] transition-colors leading-snug font-display">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                        <span className="font-bold text-slate-700">{post.authorName}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-rose-500" />
                          {post.location}
                        </span>
                        <span>•</span>
                        <span className="text-slate-400">{post.createdAt}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-full text-xs font-black">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{post.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Post Text Story */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {post.content}
                  </p>

                  {/* Optional Photo Attachment */}
                  {post.image && (
                    <div className="rounded-2xl overflow-hidden h-48 sm:h-64 w-full bg-slate-900">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 opacity-90"
                      />
                    </div>
                  )}

                  {/* Engagement Bar & Shortcut Actions */}
                  <div className="pt-2 flex items-center justify-between gap-4 text-xs font-bold text-slate-500">
                    <div className="flex items-center gap-4">
                      {/* Like Button */}
                      <button
                        onClick={() => handleToggleLike(post.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                          post.isLiked
                            ? 'bg-rose-50 text-rose-600 font-black'
                            : 'hover:bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                        <span>{post.likes} Likes</span>
                      </button>

                      {/* Comment Counter */}
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 cursor-pointer">
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.commentsCount} Comments</span>
                      </span>
                    </div>

                    {/* Copy Trip / Inspiration Action */}
                    {onCopyTripShortcut && (
                      <button
                        onClick={() => {
                          onCopyTripShortcut(post.title);
                          if (showToast) showToast(`Added trip inspiration from "${post.authorName}"!`);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-sky-50 text-[#0284c7] hover:bg-sky-100 font-extrabold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Ticket className="w-3.5 h-3.5" />
                        <span>Use as Template</span>
                      </button>
                    )}
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* "Share Your Experience" Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-[#0284c7] font-black text-base font-display">
                  <Sparkles className="w-4 h-4" />
                  <span>Share Experience with Community</span>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-slate-400 hover:text-slate-700 text-lg font-bold"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Experience Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Paragliding & Food Walk in Solang Valley"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Destination / City</label>
                    <input
                      type="text"
                      placeholder="e.g. Manali, India"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold focus:outline-none"
                    >
                      <option value="Trip Experience">Trip Experience</option>
                      <option value="Activity Highlight">Activity Highlight</option>
                      <option value="Budget Tip">Budget Tip</option>
                      <option value="Food & Stay">Food & Stay</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Estimated Cost (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 3200"
                      value={newCost}
                      onChange={(e) => setNewCost(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Rating (1 to 5 Stars)</label>
                    <select
                      value={newRating}
                      onChange={(e) => setNewRating(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold focus:outline-none"
                    >
                      <option value="5">5 ⭐ - Exceptional</option>
                      <option value="4">4 ⭐ - Great</option>
                      <option value="3">3 ⭐ - Average</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Your Story & Tips *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Share what you liked, budget advice, safety tips, best time to visit..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0284c7]"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Experience</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
