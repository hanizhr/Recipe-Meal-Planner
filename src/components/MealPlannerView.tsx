import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Trash2, 
  ShoppingCart, 
  ChevronRight, 
  Clock, 
  Flame, 
  Sparkles, 
  Utensils, 
  Coffee, 
  Sun, 
  Moon, 
  Check, 
  Users,
  Dumbbell
} from 'lucide-react';
import { MealPlanEntry, Recipe, DayOfWeek, MealSlot, UserProfile } from '../types';

interface MealPlannerViewProps {
  mealPlan: MealPlanEntry[];
  recipes: Recipe[];
  userProfile: UserProfile;
  onAddMealPlanEntry: (day: DayOfWeek, slot: MealSlot, recipeId: string, servings: number) => void;
  onRemoveMealPlanEntry: (id: string) => void;
  onClearMealPlan: () => void;
  onGenerateGroceryList: () => void;
  onSelectRecipe: (recipe: Recipe) => void;
}

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const SLOTS: { id: MealSlot; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'breakfast', label: 'Breakfast', icon: Sun },
  { id: 'lunch', label: 'Lunch', icon: Utensils },
  { id: 'dinner', label: 'Dinner', icon: Moon },
  { id: 'snack', label: 'Snacks & Drinks', icon: Coffee },
];

export const MealPlannerView: React.FC<MealPlannerViewProps> = ({
  mealPlan,
  recipes,
  userProfile,
  onAddMealPlanEntry,
  onRemoveMealPlanEntry,
  onClearMealPlan,
  onGenerateGroceryList,
  onSelectRecipe,
}) => {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Monday');
  const [pickerSlot, setPickerSlot] = useState<MealSlot | null>(null);
  const [pickerSearch, setPickerSearch] = useState('');
  const [syncSuccessFeedback, setSyncSuccessFeedback] = useState(false);

  // Filter recipes in current day's plan
  const currentDayEntries = mealPlan.filter(entry => entry.day === selectedDay);

  // Calculate daily nutrition totals
  const dailyTotals = currentDayEntries.reduce(
    (acc, entry) => {
      const recipe = recipes.find(r => r.id === entry.recipeId);
      if (!recipe) return acc;
      const ratio = entry.servings / (recipe.servings || 1);
      return {
        calories: acc.calories + Math.round(recipe.calories * ratio),
        protein: acc.protein + Math.round(recipe.nutrition.protein * ratio),
        carbs: acc.carbs + Math.round(recipe.nutrition.carbs * ratio),
        fat: acc.fat + Math.round(recipe.nutrition.fat * ratio),
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const caloriePercentage = Math.min(100, Math.round((dailyTotals.calories / userProfile.dailyCalorieTarget) * 100));
  const proteinPercentage = Math.min(100, Math.round((dailyTotals.protein / userProfile.dailyProteinTarget) * 100));

  const handleSyncToGrocery = () => {
    onGenerateGroceryList();
    setSyncSuccessFeedback(true);
    setTimeout(() => setSyncSuccessFeedback(false), 2500);
  };

  const filteredPickerRecipes = recipes.filter(r => 
    r.title.toLowerCase().includes(pickerSearch.toLowerCase()) ||
    r.category.toLowerCase().includes(pickerSearch.toLowerCase())
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 space-y-6">
      {/* Top Banner with Sync & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#1A1C24] to-[#252834] border border-[#2F3342] rounded-3xl p-5 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FF5E3A]/20 text-[#FF5E3A] border border-[#FF5E3A]/30">
              Weekly Meal Planning
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Organize & Plan Meals
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {mealPlan.length} meals planned for this week.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="sync-grocery-from-plan-btn"
            onClick={handleSyncToGrocery}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#FF5E3A] hover:bg-[#FF7043] text-white text-xs font-bold shadow-lg shadow-[#FF5E3A]/30 transition-all hover:scale-105 active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{syncSuccessFeedback ? 'Synced to Grocery! ✓' : 'Smart Grocery Sync'}</span>
          </button>

          {mealPlan.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Clear all scheduled meals for the week?')) {
                  onClearMealPlan();
                }
              }}
              className="p-2.5 rounded-2xl bg-[#161822] hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-[#2F3342] transition-colors"
              title="Clear weekly plan"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 7-Day Horizontal Pill Selector */}
      <div className="bg-[#161822] p-1.5 sm:p-2 rounded-2xl border border-[#252834]">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1 touch-pan-x -mx-1 px-1 sm:mx-0 sm:px-0">
          {DAYS.map(day => {
            const isSelected = selectedDay === day;
            const dayCount = mealPlan.filter(item => item.day === day).length;

            return (
              <button
                key={day}
                id={`plan-day-${day.toLowerCase()}`}
                onClick={() => setSelectedDay(day)}
                className={`flex-1 min-w-[76px] sm:min-w-[86px] py-2.5 px-2 rounded-xl flex flex-col items-center gap-1 transition-all touch-manipulation active:scale-95 ${
                  isSelected
                    ? 'bg-[#FF5E3A] text-white font-bold shadow-lg shadow-[#FF5E3A]/30'
                    : 'bg-[#1A1C24] hover:bg-[#252834] text-gray-400 hover:text-gray-200 border border-[#252834]'
                }`}
              >
                <span className="text-xs uppercase tracking-wider font-extrabold">{day.substring(0, 3)}</span>
                <div className="flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${dayCount > 0 ? (isSelected ? 'bg-white' : 'bg-[#FF5E3A]') : 'bg-transparent'}`} />
                  <span className="text-[10px] opacity-80">{dayCount} meals</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Daily Nutrition & Calorie Bar */}
      <div className="bg-[#1A1C24] border border-[#252834] rounded-3xl p-3.5 sm:p-5 space-y-3 sm:space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF5E3A]" />
            <h3 className="text-xs sm:text-sm font-bold text-white">{selectedDay}'s Daily Targets</h3>
          </div>
          <span className="text-xs font-mono font-bold text-[#FF5E3A]">
            {dailyTotals.calories} / {userProfile.dailyCalorieTarget} kcal
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-2.5 bg-[#121318] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-[#FF5E3A] rounded-full transition-all duration-500"
              style={{ width: `${caloriePercentage}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-1.5 text-center text-xs">
            <div className="bg-[#161822] p-2 rounded-xl border border-[#252834]">
              <span className="text-gray-400 block text-[9px] sm:text-[10px] uppercase">Protein</span>
              <span className="font-bold text-white text-xs sm:text-sm">{dailyTotals.protein}g / {userProfile.dailyProteinTarget}g</span>
            </div>
            <div className="bg-[#161822] p-2 rounded-xl border border-[#252834]">
              <span className="text-gray-400 block text-[9px] sm:text-[10px] uppercase">Carbs</span>
              <span className="font-bold text-white text-xs sm:text-sm">{dailyTotals.carbs}g</span>
            </div>
            <div className="bg-[#161822] p-2 rounded-xl border border-[#252834]">
              <span className="text-gray-400 block text-[9px] sm:text-[10px] uppercase">Fats</span>
              <span className="font-bold text-white text-xs sm:text-sm">{dailyTotals.fat}g</span>
            </div>
          </div>
        </div>
      </div>

      {/* Meal Slots (Breakfast, Lunch, Dinner, Snack) */}
      <div className="space-y-3 sm:space-y-4">
        {SLOTS.map(slot => {
          const SlotIcon = slot.icon;
          const entry = currentDayEntries.find(e => e.slot === slot.id);
          const recipe = entry ? recipes.find(r => r.id === entry.recipeId) : null;

          return (
            <div
              key={slot.id}
              className="bg-[#1A1C24] border border-[#252834] rounded-3xl p-3.5 sm:p-5 transition-all hover:border-[#2F3342]"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#252834] text-[#FF5E3A] flex items-center justify-center">
                    <SlotIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{slot.label}</h4>
                    <span className="text-[10px] text-gray-500 font-medium">{entry ? '1 Planned Dish' : 'Empty slot'}</span>
                  </div>
                </div>

                {!entry ? (
                  <button
                    id={`add-slot-btn-${slot.id}`}
                    onClick={() => setPickerSlot(slot.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 min-h-[38px] rounded-full bg-[#252834] hover:bg-[#FF5E3A] text-gray-200 hover:text-white text-xs font-bold transition-all shadow-sm active:scale-95 touch-manipulation"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Dish</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onRemoveMealPlanEntry(entry.id)}
                    className="p-2.5 min-h-[38px] min-w-[38px] flex items-center justify-center rounded-full hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors touch-manipulation active:scale-95"
                    title="Remove from slot"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Scheduled Recipe Card */}
              {recipe && entry ? (
                <div
                  onClick={() => onSelectRecipe(recipe)}
                  className="bg-[#161822] hover:bg-[#1E202B] border border-[#252834] rounded-2xl p-3 flex items-center justify-between gap-3 cursor-pointer transition-all group touch-manipulation active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={recipe.heroImage}
                      alt={recipe.title}
                      className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl object-cover group-hover:scale-105 transition-transform shrink-0"
                    />
                    <div className="min-w-0">
                      <h5 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#FF5E3A] transition-colors truncate">
                        {recipe.title}
                      </h5>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] text-gray-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#FF5E3A]" />
                          {recipe.totalTimeMinutes}m
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-blue-400" />
                          {entry.servings}p
                        </span>
                        <span className="flex items-center gap-1 text-orange-400">
                          <Flame className="w-3 h-3" />
                          {Math.round(recipe.calories * (entry.servings / (recipe.servings || 1)))} kcal
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-[#252834] group-hover:bg-[#FF5E3A] text-white flex items-center justify-center transition-colors shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => setPickerSlot(slot.id)}
                  className="border border-dashed border-[#252834] hover:border-[#FF5E3A]/40 rounded-2xl p-3.5 sm:p-4 text-center cursor-pointer transition-colors bg-black/10 hover:bg-white/5 touch-manipulation active:scale-[0.99]"
                >
                  <span className="text-xs text-gray-500 font-medium">+ Click to choose a recipe for {slot.label.toLowerCase()}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Recipe Picker Modal */}
      {pickerSlot && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#1A1C24] border border-[#252834] rounded-t-[32px] sm:rounded-3xl p-5 sm:p-6 max-w-md w-full space-y-4 shadow-2xl max-h-[85vh] flex flex-col pb-[max(1.5rem,env(safe-area-inset-bottom,1.5rem))]">
            <div className="flex items-center justify-between pb-2 border-b border-[#252834]">
              <div>
                <h3 className="text-base font-bold text-white">Add Recipe to {selectedDay}</h3>
                <span className="text-xs text-[#FF5E3A] font-semibold uppercase">{pickerSlot} slot</span>
              </div>
              <button
                onClick={() => setPickerSlot(null)}
                className="w-8 h-8 rounded-full bg-[#252834] text-gray-400 hover:text-white flex items-center justify-center touch-manipulation"
              >
                ✕
              </button>
            </div>

            {/* Search within picker */}
            <input
              type="text"
              value={pickerSearch}
              onChange={(e) => setPickerSearch(e.target.value)}
              placeholder="Search recipes to schedule..."
              className="w-full bg-[#161822] text-sm text-white placeholder-gray-500 px-4 py-3 rounded-xl border border-[#252834] focus:outline-none focus:border-[#FF5E3A]"
            />

            {/* Recipes List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredPickerRecipes.map(r => (
                <div
                  key={r.id}
                  onClick={() => {
                    onAddMealPlanEntry(selectedDay, pickerSlot, r.id, 2);
                    setPickerSlot(null);
                  }}
                  className="bg-[#161822] hover:bg-[#252834] border border-[#252834] rounded-2xl p-3 flex items-center justify-between cursor-pointer transition-all group touch-manipulation active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={r.heroImage}
                      alt={r.title}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <h5 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#FF5E3A] truncate">
                        {r.title}
                      </h5>
                      <span className="text-[11px] text-gray-400 block truncate">{r.category} • {r.totalTimeMinutes}m • {r.calories} kcal</span>
                    </div>
                  </div>

                  <button className="px-3.5 py-1.5 rounded-full bg-[#FF5E3A] text-white text-xs font-bold shadow-sm shrink-0 ml-2">
                    Select
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
