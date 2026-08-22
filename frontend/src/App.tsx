/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PopularPlaces } from './components/PopularPlaces';
import { SweetMemories } from './components/SweetMemories';
import { ExploreMore } from './components/ExploreMore';
import { AdventureStamps } from './components/AdventureStamps';
import { VideoBanner } from './components/VideoBanner';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { WishlistModal } from './components/WishlistModal';
import { PlaceDetailModal, SelectedPlaceData } from './components/PlaceDetailModal';
import { VideoModal } from './components/VideoModal';
import { AuthModal, UserProfile } from './components/AuthModal';
import { ToastContainer } from './components/ToastContainer';
import { PopularPlace, ExplorePlace, AdventureStamp } from './types/travel';
import { HomePage } from './components/HomePage/HomePage';
import { CreateTripPage } from './components/CreateTripPage';
import { ItineraryBuilderPage } from './components/ItineraryBuilderPage';
import { UserTripListingPage } from './components/UserTripListingPage';
import { UserProfilePage } from './components/UserProfilePage';
import { SearchDiscoveryPage } from './components/SearchDiscoveryPage';
import { ItineraryViewBudgetPage } from './components/ItineraryViewBudgetPage';
import { CommunityTabPage } from './components/CommunityTabPage';
import { CalendarViewPage } from './components/CalendarViewPage';
import { authApi, getAuthToken } from './services/api';

export default function App() {
  // Current logged in user state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('globetrotter_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Wishlist state with localStorage persistence
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('globetrotter_wishlist');
      return saved ? JSON.parse(saved) : ['sc-mindanou', 'amalfi-coast'];
    } catch {
      return ['sc-mindanou', 'amalfi-coast'];
    }
  });

  // Navigation View State ('landing' is DEFAULT for unauthenticated users)
  const [activeView, setActiveView] = useState<'landing' | 'home' | 'create-trip' | 'itinerary-builder' | 'my-trips' | 'profile' | 'search' | 'budget-view' | 'community' | 'calendar'>(() => {
    return currentUser ? 'home' : 'landing';
  });

  const [selectedTripId, setSelectedTripId] = useState<string | undefined>(undefined);

  // Auto-verify auth status on mount
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      authApi.me()
        .then((user) => {
          if (user) {
            const profileUser: UserProfile = {
              id: user.id,
              name: user.name,
              firstName: user.name.split(' ')[0] || user.name,
              lastName: user.name.split(' ').slice(1).join(' ') || '',
              username: `@${user.name.toLowerCase().replace(/\s+/g, '')}`,
              email: user.email,
              photoUrl: user.avatarUrl || user.profile_image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
              country: 'India',
              city: 'Mumbai',
            };
            setCurrentUser(profileUser);
          }
        })
        .catch(() => {
          // Token invalid or expired
          setCurrentUser(null);
          setActiveView('landing');
        });
    }
  }, []);

  // Protected View Change Handler (requires auth for app screens)
  const handleProtectedViewChange = (view: 'landing' | 'home' | 'create-trip' | 'itinerary-builder' | 'my-trips' | 'profile' | 'search' | 'budget-view' | 'community' | 'calendar') => {
    if (view !== 'landing' && !currentUser) {
      setAuthModal({ isOpen: true, mode: 'signin' });
      showToast('Please Sign In or Create an Account to access GlobeTrotter features!');
      return;
    }
    setActiveView(view);
  };

  // Modal States
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'signin' | 'signup' }>({
    isOpen: false,
    mode: 'signin'
  });

  // Selected place for detail modal
  const [selectedPlace, setSelectedPlace] = useState<SelectedPlaceData | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('globetrotter_user', JSON.stringify(user));
    } catch (err) {
      console.error(err);
    }
    showToast(`Welcome, ${user.firstName}! Explorer account connected.`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('globetrotter_user');
    } catch (err) {
      console.error(err);
    }
    showToast('Signed out of GlobeTrotter.');
  };

  // Toggle Wishlist
  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const next = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      try {
        localStorage.setItem('globetrotter_wishlist', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      if (next.includes(id)) {
        showToast('Saved to your bucket list!');
      } else {
        showToast('Removed from saved items');
      }
      return next;
    });
  };

  // Handle place selection from PopularPlaces
  const handleSelectPopularPlace = (place: PopularPlace) => {
    setSelectedPlace({
      id: place.id,
      name: place.name,
      location: place.location,
      image: place.image,
      price: place.price,
      rating: place.rating,
      discount: place.discount,
      description: place.description
    });
  };

  // Handle place selection from ExploreMore
  const handleSelectExplorePlace = (place: ExplorePlace) => {
    setSelectedPlace({
      id: place.id,
      name: place.name,
      location: place.location,
      image: place.image,
      price: place.pricePerPax,
      rating: place.rating,
      description: place.description
    });
  };

  // Handle stamp selection from AdventureStamps
  const handleSelectStamp = (stamp: AdventureStamp) => {
    setSelectedPlace({
      id: stamp.id,
      name: stamp.city,
      location: `${stamp.landmark}, ${stamp.country}`,
      image: stamp.image,
      price: 180,
      rating: 4.9,
      description: stamp.description
    });
  };

  // Search trigger from Hero
  const handleHeroSearch = (params: {
    destination: string;
    checkIn: string;
    checkOut: string;
    guests: string;
    tab: string;
  }) => {
    showToast(`Searching for ${params.tab} in ${params.destination}...`);
    const exploreSection = document.getElementById('explore');
    if (exploreSection) {
      exploreSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 flex flex-col font-sans selection:bg-[#0284c7] selection:text-white">
      
      {/* 1. Clean Navigation Bar with View Switcher */}
      <Navbar
        onOpenBooking={() => setIsBookingOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        wishlistCount={wishlist.length}
        onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })}
        currentUser={currentUser}
        onLogout={handleLogout}
        activeView={activeView}
        onViewChange={(v) => handleProtectedViewChange(v)}
      />

      {activeView === 'calendar' ? (
        <CalendarViewPage
          onOpenTrip={(tId) => {
            setSelectedTripId(tId);
            setActiveView('budget-view');
          }}
          onOpenCreateTrip={() => setActiveView('create-trip')}
          showToast={showToast}
        />
      ) : activeView === 'community' ? (
        <CommunityTabPage
          onCopyTripShortcut={() => setActiveView('create-trip')}
          showToast={showToast}
        />
      ) : activeView === 'budget-view' ? (
        <ItineraryViewBudgetPage
          tripId={selectedTripId}
          onBack={() => setActiveView('home')}
          onOpenEditItinerary={(tId) => {
            setSelectedTripId(tId);
            setActiveView('itinerary-builder');
          }}
          showToast={showToast}
        />
      ) : activeView === 'search' ? (
        <SearchDiscoveryPage
          onOpenCreateTrip={() => setActiveView('create-trip')}
          onSelectCity={(city) => {
            setActiveView('create-trip');
          }}
          showToast={showToast}
        />
      ) : activeView === 'profile' ? (
        <UserProfilePage
          currentUser={currentUser}
          onSelectTripItinerary={(tripId) => {
            setSelectedTripId(tripId);
            setActiveView('itinerary-builder');
          }}
          onOpenCreateTrip={() => setActiveView('create-trip')}
          showToast={showToast}
        />
      ) : activeView === 'my-trips' ? (
        <UserTripListingPage
          onOpenCreateTrip={() => setActiveView('create-trip')}
          onSelectTripItinerary={(tripId) => {
            setSelectedTripId(tripId);
            setActiveView('itinerary-builder');
          }}
          showToast={showToast}
        />
      ) : activeView === 'itinerary-builder' ? (
        <ItineraryBuilderPage
          tripId={selectedTripId}
          onBack={() => setActiveView('home')}
          showToast={showToast}
        />
      ) : activeView === 'create-trip' ? (
        <CreateTripPage
          onBackToHome={() => setActiveView('home')}
          onTripCreated={(newTrip) => {
            showToast(`Trip "${newTrip.name}" created! Saved to your dashboard.`);
            setSelectedTripId(newTrip.id);
            setActiveView('itinerary-builder');
          }}
          showToast={showToast}
        />
      ) : activeView === 'home' ? (
        <HomePage
          currentUser={currentUser}
          onOpenBooking={() => setActiveView('create-trip')}
          onSelectCityDetail={(city) => {
            setSelectedPlace({
              id: city.id,
              name: city.name,
              location: `${city.region}, ${city.country}`,
              image: city.image,
              price: city.cost_index,
              rating: city.rating || 4.7,
              description: city.description,
            });
          }}
        />
      ) : (
        <main className="flex-1 space-y-4 sm:space-y-8">
          
          {/* 2. Hero Section */}
          <Hero onSearch={handleHeroSearch} />

          {/* 3. Popular Place */}
          <PopularPlaces
            onSelectPlace={handleSelectPopularPlace}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
          />

          {/* 4. Sweet Memories */}
          <SweetMemories
            onStartExplore={() => {
              const el = document.getElementById('explore');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* 5. Explore More */}
          <ExploreMore
            onSelectPlace={handleSelectExplorePlace}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
          />

          {/* 6. Adventure Stamps */}
          <AdventureStamps onSelectStamp={handleSelectStamp} />

          {/* 7. Panoramic Ocean Video Banner */}
          <VideoBanner
            onBookNow={() => setIsBookingOpen(true)}
            onPlayVideo={() => setIsVideoOpen(true)}
          />

        </main>
      )}

      {/* 8. Light, Elegant 5-Column Footer */}
      <Footer />

      {/* Interactive Modals */}
      
      {/* Place Detail Inspection Modal */}
      <PlaceDetailModal
        place={selectedPlace}
        isOpen={!!selectedPlace}
        onClose={() => setSelectedPlace(null)}
        onBook={(p) => {
          setSelectedPlace(null);
          setIsBookingOpen(true);
        }}
        isSaved={selectedPlace ? wishlist.includes(selectedPlace.id) : false}
        onToggleWishlist={toggleWishlist}
      />

      {/* Multi-Step Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      {/* Saved Places Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveWishlist={toggleWishlist}
        onSelectPlace={(place) => {
          setIsWishlistOpen(false);
          setSelectedPlace(place);
        }}
      />

      {/* Experience Video Tour Modal */}
      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        onBookNow={() => {
          setIsVideoOpen(false);
          setIsBookingOpen(true);
        }}
      />

      {/* Sign In / Sign Up Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ isOpen: false, mode: 'signin' })}
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />

      {/* Floating Interactive Toast */}
      <ToastContainer message={toastMessage} />

    </div>
  );
}
