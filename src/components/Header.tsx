import React, { useState } from 'react';
import { Bell, SlidersHorizontal, Search, X, PlusCircle, Smartphone, Monitor, BookOpen, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  userProfile: UserProfile;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenFilter: () => void;
  onOpenProfile: () => void;
  onOpenCreateRecipe: () => void;
  onOpenFlutterHub: () => void;
  isPhoneFrame: boolean;
  onToggleFrame: () => void;
  activeFilterCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  userProfile,
  searchQuery,
  onSearchChange,
  onOpenFilter,
  onOpenProfile,
  onOpenCreateRecipe,
  onOpenFlutterHub,
  isPhoneFrame,
  onToggleFrame,
  activeFilterCount,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Dinner prep alert: Grilled Lemon Salmon planned for tonight!', time: '20m ago', unread: true },
    { id: 2, text: 'Weekly meal plan has 4 balanced meals scheduled.', time: '2h ago', unread: true },
    { id: 3, text: 'Mia Rose posted a new recipe: Creamy Tuscan Chicken.', time: '1d ago', unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  return (
    <header className="w-full pt-4 pb-2 px-4 sm:px-6">
      {/* Top Bar with User Avatar & Actions */}
      <div className="flex items-center justify-between gap-3 mb-4">
        {/* User Info */}
        <button
          id="user-profile-toggle-btn"
          onClick={onOpenProfile}
          className="flex items-center gap-3 p-1 -ml-1 rounded-full hover:bg-white/5 transition-colors group text-left"
        >
          <div className="relative">
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-[#FF5E3A]/40 group-hover:border-[#FF5E3A] transition-colors"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0F1015]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-400 font-medium">Welcome back,</span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white leading-tight flex items-center gap-1">
              Hi {userProfile.name} <span className="inline-block hover:animate-spin">👋</span>
            </h2>
          </div>
        </button>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2">
          {/* Flutter & SQLite Code Hub Quick Button */}
          <button
            id="flutter-hub-header-btn"
            onClick={onOpenFlutterHub}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1E2029] hover:bg-[#252834] border border-[#2F3342] text-xs font-semibold text-[#FF7043] transition-all hover:scale-105 active:scale-95 shadow-sm"
            title="View Flutter & SQLite Architecture Code"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#FF5E3A]" />
            <span className="hidden sm:inline">Flutter Code</span>
          </button>

          {/* Add Recipe Button */}
          <button
            id="create-recipe-header-btn"
            onClick={onOpenCreateRecipe}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#FF5E3A] hover:bg-[#FF7043] text-white text-xs font-bold transition-all shadow-md shadow-[#FF5E3A]/20 hover:scale-105 active:scale-95"
            title="Create Custom Recipe"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">New Recipe</span>
          </button>

          {/* Device Frame View Mode Switcher (Mobile Mockup vs Full Canvas) */}
          <button
            id="frame-mode-toggle-btn"
            onClick={onToggleFrame}
            className="p-2 rounded-full bg-[#1E2029] hover:bg-[#252834] border border-[#2F3342] text-gray-300 hover:text-white transition-colors"
            title={isPhoneFrame ? "Switch to Wide Layout" : "Switch to Mobile Phone Mockup Frame"}
          >
            {isPhoneFrame ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4 text-[#FF5E3A]" />}
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              id="notification-bell-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-full bg-[#1E2029] hover:bg-[#252834] border border-[#2F3342] text-gray-300 hover:text-white transition-colors"
              title="Notifications & Cooking Reminders"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF5E3A] rounded-full animate-pulse" />
              )}
            </button>

            {/* Notifications Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#1A1C24] border border-[#2F3342] rounded-2xl p-3 shadow-2xl z-50 backdrop-blur-xl">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#252834]">
                  <span className="text-xs font-bold text-white">Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[10px] text-[#FF5E3A] hover:underline font-semibold"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      className={`p-2 rounded-xl text-xs transition-colors ${
                        n.unread ? 'bg-[#252834] text-white' : 'bg-transparent text-gray-400'
                      }`}
                    >
                      <p className="leading-snug">{n.text}</p>
                      <span className="text-[10px] text-gray-500 mt-1 block">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Headline */}
      <div className="mb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          What's cooking <br className="xs:hidden" />
          <span className="text-[#FF5E3A]">today?</span>
        </h1>
      </div>

      {/* Search Bar + Filter Button */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="recipe-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search your home recipes, ingredients..."
            className="w-full bg-[#1A1C24] text-sm text-white placeholder-gray-500 pl-10 pr-9 py-3 rounded-2xl border border-[#252834] focus:outline-none focus:border-[#FF5E3A] focus:ring-1 focus:ring-[#FF5E3A] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Toggle Button */}
        <button
          id="open-filter-btn"
          onClick={onOpenFilter}
          className={`relative p-3 rounded-2xl border transition-all ${
            activeFilterCount > 0
              ? 'bg-[#FF5E3A] text-white border-[#FF5E3A] shadow-md shadow-[#FF5E3A]/30'
              : 'bg-[#1A1C24] text-gray-300 hover:text-white border-[#252834] hover:bg-[#252834]'
          }`}
          title="Filter Recipes"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-[#FF5E3A] rounded-full text-[10px] font-black flex items-center justify-center shadow">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
