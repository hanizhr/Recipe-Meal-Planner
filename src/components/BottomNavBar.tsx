import React from 'react';
import { 
  Home, 
  Search, 
  CalendarDays, 
  ShoppingCart, 
  Heart, 
  Smartphone 
} from 'lucide-react';

export type TabType = 'home' | 'explore' | 'planner' | 'grocery' | 'favorites' | 'flutter';

interface BottomNavBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  groceryCount: number;
  plannedCount: number;
  favoritesCount: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabChange,
  groceryCount,
  plannedCount,
  favoritesCount,
}) => {
  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Home },
    { id: 'planner' as TabType, label: 'Planner', icon: CalendarDays, badge: plannedCount },
    { id: 'grocery' as TabType, label: 'Grocery', icon: ShoppingCart, badge: groceryCount },
    { id: 'favorites' as TabType, label: 'Saved', icon: Heart, badge: favoritesCount },
    { id: 'flutter' as TabType, label: 'Flutter', icon: Smartphone, highlight: true },
  ];

  return (
    <nav aria-label="Main Navigation" className="fixed bottom-4 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
      <div className="bg-[#14161F]/90 backdrop-blur-xl border border-[#252834] rounded-full px-3 py-2 shadow-2xl flex items-center gap-1 sm:gap-2 pointer-events-auto max-w-md w-full justify-between">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center py-2 px-3 sm:px-4 rounded-full transition-all duration-300 ${
                isActive
                  ? 'bg-[#FF5E3A] text-white shadow-lg shadow-[#FF5E3A]/40 scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {tab.badge !== undefined && tab.badge > 0 && !isActive && (
                  <span className="absolute -top-1.5 -right-2.5 w-4 h-4 bg-[#FF5E3A] text-white text-[9px] font-black rounded-full flex items-center justify-center shadow">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-bold tracking-tight mt-0.5 ${isActive ? 'text-white' : 'text-gray-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
