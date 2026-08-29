import React from 'react';
import { 
  Sparkles, 
  UtensilsCrossed, 
  Wheat, 
  Soup, 
  Cake, 
  Coffee, 
  Flame, 
  Pizza, 
  Leaf, 
  Dumbbell, 
  Zap 
} from 'lucide-react';
import { Category } from '../types';

interface CategoryChipsProps {
  selectedCategory: Category;
  onSelectCategory: (cat: Category) => void;
  recipeCounts: Record<Category, number>;
}

interface CategoryItem {
  id: Category;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CATEGORIES: CategoryItem[] = [
  { id: 'All', label: 'All Recipes', icon: Sparkles },
  { id: 'Western', label: 'Western', icon: UtensilsCrossed },
  { id: 'Bread', label: 'Bread', icon: Wheat },
  { id: 'Soup', label: 'Soup', icon: Soup },
  { id: 'Dessert', label: 'Dessert', icon: Cake },
  { id: 'Coffee', label: 'Coffee', icon: Coffee },
  { id: 'Asian', label: 'Asian', icon: Flame },
  { id: 'Italian', label: 'Italian', icon: Pizza },
  { id: 'Healthy', label: 'Healthy', icon: Leaf },
  { id: 'High-Protein', label: 'High-Protein', icon: Dumbbell },
  { id: 'Keto', label: 'Keto', icon: Zap },
];

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  selectedCategory,
  onSelectCategory,
  recipeCounts,
}) => {
  return (
    <div className="w-full px-3.5 sm:px-6 my-2 sm:my-3">
      <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar py-1 touch-pan-x -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const Icon = cat.icon;

          return (
            <button
              key={cat.id}
              id={`cat-chip-${cat.id.toLowerCase()}`}
              onClick={() => onSelectCategory(cat.id)}
              className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none touch-manipulation active:scale-95 transition-transform"
            >
              {/* Circular Icon Container matching mockup */}
              <div
                className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#FF5E3A] text-white shadow-lg shadow-[#FF5E3A]/30 ring-2 ring-[#FF5E3A]/50'
                    : 'bg-[#1A1C24] text-gray-400 group-hover:text-white group-hover:bg-[#252834] border border-[#252834]'
                }`}
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" />
              </div>

              {/* Label */}
              <span
                className={`text-[11px] sm:text-xs font-semibold tracking-tight transition-colors whitespace-nowrap ${
                  isSelected ? 'text-[#FF5E3A] font-bold' : 'text-gray-400 group-hover:text-gray-200'
                }`}
              >
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

