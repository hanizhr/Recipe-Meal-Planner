import React from 'react';
import { X, RotateCcw, Check } from 'lucide-react';
import { Difficulty, RecipeFilterState } from '../types';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: RecipeFilterState;
  onUpdateFilters: (newFilters: Partial<RecipeFilterState>) => void;
  onResetFilters: () => void;
}

const DIETARY_TAGS = [
  'High-Protein',
  'Keto',
  'Vegan',
  'Gluten-Free',
  'Vegetarian',
  'Comfort Food',
  'Quick Dinner',
  'Meal Prep',
  'Immunity Boost'
];

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onUpdateFilters,
  onResetFilters,
}) => {
  if (!isOpen) return null;

  const toggleTag = (tag: string) => {
    const current = filters.dietaryTags;
    const updated = current.includes(tag)
      ? current.filter(t => t !== tag)
      : [...current, tag];
    onUpdateFilters({ dietaryTags: updated });
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#121319] border-t sm:border border-[#252834] rounded-t-[32px] sm:rounded-3xl p-5 sm:p-6 max-w-md w-full space-y-5 sm:space-y-6 shadow-2xl max-h-[88vh] overflow-y-auto pb-[max(1.5rem,env(safe-area-inset-bottom,1.5rem))]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#252834]">
          <h3 className="text-base sm:text-lg font-bold text-white">Filter & Sort Recipes</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/5 touch-manipulation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full text-gray-400 hover:text-white hover:bg-white/10 flex items-center justify-center touch-manipulation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sort By */}
        <div>
          <label className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 block">
            Sort By
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'trending', label: '🔥 Trending' },
              { id: 'rating', label: '⭐ Highest Rated' },
              { id: 'time', label: '⏱️ Quickest Cook' },
              { id: 'calories', label: '🥗 Lowest Calorie' },
            ].map(s => (
              <button
                key={s.id}
                onClick={() => onUpdateFilters({ sortBy: s.id as any })}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold text-left transition-all touch-manipulation active:scale-95 ${
                  filters.sortBy === s.id
                    ? 'bg-[#FF5E3A] text-white shadow-md shadow-[#FF5E3A]/20'
                    : 'bg-[#1A1C24] text-gray-300 hover:text-white border border-[#252834]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Max Cook Time Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Max Total Time
            </label>
            <span className="text-xs font-mono font-bold text-[#FF5E3A]">
              ≤ {filters.maxTimeMinutes} mins
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="60"
            step="5"
            value={filters.maxTimeMinutes}
            onChange={(e) => onUpdateFilters({ maxTimeMinutes: parseInt(e.target.value) })}
            className="w-full accent-[#FF5E3A] cursor-pointer h-2"
          />
          <div className="flex justify-between text-[10px] text-gray-500 mt-1">
            <span>10 min</span>
            <span>30 min</span>
            <span>60+ min</span>
          </div>
        </div>

        {/* Difficulty Selector */}
        <div>
          <label className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 block">
            Difficulty Level
          </label>
          <div className="grid grid-cols-4 gap-2">
            {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
              <button
                key={diff}
                onClick={() => onUpdateFilters({ difficulty: diff as any })}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all touch-manipulation active:scale-95 ${
                  filters.difficulty === diff
                    ? 'bg-[#FF5E3A] text-white'
                    : 'bg-[#1A1C24] text-gray-300 border border-[#252834]'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Dietary / Preference Tags */}
        <div>
          <label className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 block">
            Dietary Preferences
          </label>
          <div className="flex flex-wrap gap-1.5">
            {DIETARY_TAGS.map((tag) => {
              const isSelected = filters.dietaryTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all touch-manipulation active:scale-95 ${
                    isSelected
                      ? 'bg-[#FF5E3A] text-white font-bold shadow-sm'
                      : 'bg-[#1A1C24] text-gray-300 border border-[#252834] hover:border-[#FF5E3A]/40'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Apply CTA */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-[#FF5E3A] hover:bg-[#FF7043] text-white font-extrabold text-sm shadow-xl shadow-[#FF5E3A]/30 transition-transform active:scale-95 touch-manipulation"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};
