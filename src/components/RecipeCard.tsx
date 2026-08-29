import React from 'react';
import { Heart, Clock, Flame, ArrowUpRight, CalendarPlus, Star } from 'lucide-react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
  onToggleFavorite: (recipeId: string, e: React.MouseEvent) => void;
  onQuickAddToMealPlan?: (recipe: Recipe, e: React.MouseEvent) => void;
  variant?: 'trending' | 'standard' | 'compact';
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onSelect,
  onToggleFavorite,
  onQuickAddToMealPlan,
  variant = 'standard',
}) => {
  if (variant === 'trending') {
    return (
      <div
        id={`recipe-card-trending-${recipe.id}`}
        onClick={() => onSelect(recipe)}
        className="group relative bg-[#1A1C24] hover:bg-[#1E212B] border border-[#252834] hover:border-[#FF5E3A]/50 rounded-3xl p-3 sm:p-4 transition-all duration-300 shadow-lg hover:shadow-2xl cursor-pointer overflow-hidden flex flex-col sm:flex-row gap-3.5 sm:gap-4 items-stretch touch-manipulation active:scale-[0.99]"
      >
        {/* Left/Content Info */}
        <div className="flex-1 flex flex-col justify-between order-2 sm:order-1 py-1">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FF5E3A]/15 text-[#FF5E3A] border border-[#FF5E3A]/20">
                {recipe.category}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-amber-400 font-semibold">
                <Star className="w-3 h-3 fill-amber-400" />
                {recipe.rating.toFixed(1)}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#FF5E3A] transition-colors leading-snug line-clamp-2">
              {recipe.title}
            </h3>

            <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
              {recipe.subtitle || recipe.description}
            </p>
          </div>

          <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-[#252834]">
            <div className="flex items-center gap-3 text-xs text-gray-300 font-medium">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#FF5E3A]" />
                {recipe.totalTimeMinutes} min
              </span>
              <span className="flex items-center gap-1 text-gray-400">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                {recipe.calories} kcal
              </span>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-1.5">
              {onQuickAddToMealPlan && (
                <button
                  id={`quick-plan-btn-${recipe.id}`}
                  onClick={(e) => onQuickAddToMealPlan(recipe, e)}
                  title="Add to Weekly Meal Plan"
                  className="p-2.5 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full bg-[#252834] hover:bg-[#FF5E3A] text-gray-300 hover:text-white transition-colors active:scale-90 touch-manipulation"
                >
                  <CalendarPlus className="w-4 h-4" />
                </button>
              )}
              <div className="w-9 h-9 rounded-full bg-white/10 group-hover:bg-[#FF5E3A] text-white flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Food Photo matching mockup */}
        <div className="relative w-full sm:w-48 h-48 sm:h-auto rounded-2xl overflow-hidden shrink-0 order-1 sm:order-2">
          <img
            src={recipe.heroImage}
            alt={recipe.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 sm:hidden" />

          {/* Favorite Heart Button */}
          <button
            id={`fav-btn-${recipe.id}`}
            onClick={(e) => onToggleFavorite(recipe.id, e)}
            className="absolute top-2.5 right-2.5 sm:top-2.5 sm:left-2.5 p-2.5 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full bg-black/60 backdrop-blur-md hover:bg-black/80 text-white transition-transform active:scale-90 touch-manipulation"
            title={recipe.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                recipe.isFavorite ? 'fill-[#FF5E3A] text-[#FF5E3A]' : 'text-white'
              }`}
            />
          </button>

          {/* Difficulty Badge */}
          <span className="absolute bottom-2.5 left-2.5 sm:bottom-2.5 sm:right-2.5 px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-black/70 backdrop-blur-md text-gray-200">
            {recipe.difficulty}
          </span>
        </div>
      </div>
    );
  }

  // Standard Grid Card
  return (
    <div
      id={`recipe-card-${recipe.id}`}
      onClick={() => onSelect(recipe)}
      className="group relative bg-[#1A1C24] hover:bg-[#1E212B] border border-[#252834] hover:border-[#FF5E3A]/50 rounded-3xl p-3 transition-all duration-300 shadow-md hover:shadow-xl cursor-pointer flex flex-col justify-between touch-manipulation active:scale-[0.98]"
    >
      {/* Top Image Container */}
      <div className="relative w-full h-44 xs:h-40 rounded-2xl overflow-hidden mb-3">
        <img
          src={recipe.heroImage}
          alt={recipe.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Favorite Heart Button */}
        <button
          id={`fav-btn-std-${recipe.id}`}
          onClick={(e) => onToggleFavorite(recipe.id, e)}
          className="absolute top-2 right-2 p-2.5 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full bg-black/60 backdrop-blur-md hover:bg-black/80 text-white transition-transform active:scale-90 touch-manipulation"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              recipe.isFavorite ? 'fill-[#FF5E3A] text-[#FF5E3A]' : 'text-white'
            }`}
          />
        </button>

        {/* Category Pill */}
        <span className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FF5E3A]/90 text-white backdrop-blur-md">
          {recipe.category}
        </span>

        {/* Rating */}
        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] text-amber-400 font-bold">
          <Star className="w-3 h-3 fill-amber-400" />
          {recipe.rating.toFixed(1)}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-sm font-bold text-white group-hover:text-[#FF5E3A] transition-colors line-clamp-1">
            {recipe.title}
          </h4>
          <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
            {recipe.subtitle || recipe.description}
          </p>
        </div>

        {/* Bottom meta */}
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#252834] text-[11px] text-gray-300">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#FF5E3A]" />
            {recipe.totalTimeMinutes}m
          </span>
          <span className="flex items-center gap-1 text-gray-400">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            {recipe.calories} kcal
          </span>

          <div className="w-7 h-7 rounded-full bg-[#252834] group-hover:bg-[#FF5E3A] text-white flex items-center justify-center transition-colors">
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};

