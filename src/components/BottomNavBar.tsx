import React from 'react';
import { 
  Home, 
  CalendarDays, 
  ShoppingCart, 
  Heart 
} from 'lucide-react';

export type TabType = 'home' | 'planner' | 'grocery' | 'favorites';

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
  ];

  return (
    <nav 
      aria-label="Main Navigation" 
      className="fixed bottom-0 left-0 right-0 z-40 flex justify-center px-3 sm:px-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0.75rem))] pt-2 pointer-events-none"
    >
      <div className="bg-[#14161F]/95 backdrop-blur-xl border border-[#252834]/80 rounded-full px-2.5 sm:px-4 py-1.5 shadow-2xl flex items-center gap-1 sm:gap-2 pointer-events-auto max-w-sm sm:max-w-md w-full justify-between ring-1 ring-white/5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center min-h-[44px] min-w-[56px] flex-1 py-1 px-2 rounded-full transition-all duration-200 active:scale-95 touch-manipulation ${
                isActive
                  ? 'bg-[#FF5E3A] text-white shadow-lg shadow-[#FF5E3A]/40'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {tab.badge !== undefined && tab.badge > 0 && !isActive && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 bg-[#FF5E3A] text-white text-[9px] font-black rounded-full flex items-center justify-center shadow">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-bold tracking-tight mt-0.5 whitespace-nowrap ${isActive ? 'text-white' : 'text-gray-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

