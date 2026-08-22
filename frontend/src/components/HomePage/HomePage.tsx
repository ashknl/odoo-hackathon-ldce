import React, { useState } from 'react';
import { UserProfileSidebar } from './UserProfileSidebar';
import { HomeHeroBanner } from './HomeHeroBanner';
import { TopRegionalSelections } from './TopRegionalSelections';
import { PreviousTripsSection } from './PreviousTripsSection';
import { WidgetsRow } from './WidgetsRow';
import { PlanTripFab } from './PlanTripFab';
import {
  CURRENT_HOME_USER,
  POPULAR_CITIES,
  UPCOMING_TRIP_DATA,
  USER_PREVIOUS_TRIPS,
  YEARLY_WISHLIST,
  FRIENDS_TRIP_COLLABORATORS,
} from '../../data/homeData';
import { City, Trip, User } from '../../types/schema';
import { citiesApi, tripsApi } from '../../services/api';

interface HomePageProps {
  currentUser?: User | null;
  onOpenBooking: () => void;
  onSelectCityDetail?: (city: City) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  currentUser,
  onOpenBooking,
  onSelectCityDetail,
}) => {
  // Active user (defaults to Mallik Cheripally from schema mock if not logged in)
  const activeUser: User = currentUser
    ? {
        ...CURRENT_HOME_USER,
        name: `${currentUser.name || 'Mallik Cheripally'}`,
        email: currentUser.email || CURRENT_HOME_USER.email,
        profile_image: currentUser.profile_image || CURRENT_HOME_USER.profile_image,
      }
    : CURRENT_HOME_USER;

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupBy, setSelectedGroupBy] = useState('all');
  const [selectedSortBy, setSelectedSortBy] = useState('recommended');
  const [activeFilterRegion, setActiveFilterRegion] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('Recommended');

  // Real backend data states
  const [popularCities, setPopularCities] = useState<City[]>([]);
  const [userTrips, setUserTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real cities & trips on mount
  React.useEffect(() => {
    async function loadData() {
      try {
        const [citiesData, tripsData] = await Promise.allSettled([
          citiesApi.getPopularCities(),
          tripsApi.getTrips(),
        ]);
        if (citiesData.status === 'fulfilled' && Array.isArray(citiesData.value)) {
          setPopularCities(citiesData.value);
        }
        if (tripsData.status === 'fulfilled' && Array.isArray(tripsData.value)) {
          setUserTrips(tripsData.value);
        }
      } catch (e) {
        console.error('Failed to load homepage data from backend:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter & Sort cities based on user controls
  let displayedCities = popularCities.filter((c) => {
    // Search query match
    if (
      searchQuery &&
      !c.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !c.region.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !c.country.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    // Region filter match
    if (activeFilterRegion !== 'All' && c.region.toLowerCase() !== activeFilterRegion.toLowerCase()) {
      return false;
    }
    return true;
  });

  // Sort cities
  if (selectedSortBy === 'cost_asc') {
    displayedCities = [...displayedCities].sort(
      (a, b) => (a.costIndex ?? a.cost_index) - (b.costIndex ?? b.cost_index)
    );
  } else if (selectedSortBy === 'cost_desc') {
    displayedCities = [...displayedCities].sort(
      (a, b) => (b.costIndex ?? b.cost_index) - (a.costIndex ?? a.cost_index)
    );
  } else if (selectedSortBy === 'rating') {
    displayedCities = [...displayedCities].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 pb-20 pt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* Dashboard Main Grid: Left Sidebar (Ref 1) + Right Main Dashboard Content (Ref 3 & Ref 2) */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* 1. Left User Profile Sidebar (Ref 1) */}
        <UserProfileSidebar
          user={activeUser}
          upcomingTrip={UPCOMING_TRIP_DATA}
          onOpenBooking={onOpenBooking}
        />

        {/* 2. Main Dashboard Content Area */}
        <main className="flex-1 w-full space-y-8 min-w-0">
          
          {/* A. Hero Banner & Search Controls Dock (Ref 3) */}
          <HomeHeroBanner
            userName={activeUser.name}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedGroupBy={selectedGroupBy}
            onGroupByChange={setSelectedGroupBy}
            selectedSortBy={selectedSortBy}
            onSortByChange={setSelectedSortBy}
            activeFilterRegion={activeFilterRegion}
            onFilterRegionChange={setActiveFilterRegion}
            onOpenPlanner={onOpenBooking}
          />

          {/* B. Top Regional Selections (Ref 1 & Ref 3) */}
          <TopRegionalSelections
            cities={displayedCities}
            onSelectCity={(city) => {
              if (onSelectCityDetail) onSelectCityDetail(city);
            }}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* C. Previous Trips Section (Ref 3 & Trips Schema) */}
          <PreviousTripsSection
            trips={USER_PREVIOUS_TRIPS}
            onSelectTrip={(t) => onOpenBooking()}
            onOpenPlanner={onOpenBooking}
          />

          {/* D. Yearly Wishlist & Collaborators Widgets Row (Ref 2) */}
          <WidgetsRow
            wishlist={YEARLY_WISHLIST}
            collaborators={FRIENDS_TRIP_COLLABORATORS}
            onOpenBooking={onOpenBooking}
          />

        </main>

      </div>

      {/* 3. Floating "+ Plan a trip" FAB (Ref 3) */}
      <PlanTripFab onOpenPlanner={onOpenBooking} />

    </div>
  );
};
