import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Heart, 
  Share2, 
  Clock, 
  Users, 
  Flame, 
  Minus, 
  Plus, 
  PlusCircle, 
  Check, 
  ShoppingCart, 
  Calendar, 
  ChefHat, 
  Sparkles, 
  Star,
  Play,
  CheckCircle2
} from 'lucide-react';
import { Recipe, DayOfWeek, MealSlot } from '../types';
import { InteractiveCookingMode } from './InteractiveCookingMode';

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite: (recipeId: string) => void;
  onToggleFollowChef: (chefName: string) => void;
  onAddToGroceryList: (recipe: Recipe, servings: number) => void;
  onAddToMealPlan: (day: DayOfWeek, slot: MealSlot, recipeId: string, servings: number) => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  isOpen,
  onClose,
  onToggleFavorite,
  onToggleFollowChef,
  onAddToGroceryList,
  onAddToMealPlan,
}) => {
  if (!isOpen || !recipe) return null;

  const [servings, setServings] = useState<number>(recipe.servings || 2);
  const [selectedIngredientFilter, setSelectedIngredientFilter] = useState<string | null>(null);
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);
  const [showCookingMode, setShowCookingMode] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Monday');
  const [selectedSlot, setSelectedSlot] = useState<MealSlot>('dinner');
  const [addedGroceryFeedback, setAddedGroceryFeedback] = useState(false);
  const [shareFeedback, setShareFeedback] = useState(false);

  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const slots: { id: MealSlot; label: string }[] = [
    { id: 'breakfast', label: 'Breakfast' },
    { id: 'lunch', label: 'Lunch' },
    { id: 'dinner', label: 'Dinner' },
    { id: 'snack', label: 'Snack' },
  ];

  // Calculate dynamic multiplier for ingredient scaling
  const scalingFactor = servings / (recipe.servings || 1);

  const toggleCheckIngredient = (id: string) => {
    setCheckedIngredients(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleAddAllToGrocery = () => {
    onAddToGroceryList(recipe, servings);
    setAddedGroceryFeedback(true);
    setTimeout(() => setAddedGroceryFeedback(false), 2500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe.title,
        text: `Check out this delicious recipe for ${recipe.title} on CulinaryHub!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${recipe.title} - ${recipe.subtitle || recipe.description}`);
      setShareFeedback(true);
      setTimeout(() => setShareFeedback(false), 2000);
    }
  };

  const handleConfirmAddToPlan = () => {
    onAddToMealPlan(selectedDay, selectedSlot, recipe.id, servings);
    setShowPlanModal(false);
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex justify-center p-0 sm:p-4"
      >
        <motion.div
          initial={{ y: 50, scale: 0.98 }}
          animate={{ y: 0, scale: 1 }}
          exit={{ y: 50, scale: 0.98 }}
          transition={{ type: "spring", damping: 26, stiffness: 280 }}
          className="relative w-full max-w-xl bg-[#0F1015] sm:border sm:border-[#252834] sm:rounded-[36px] overflow-hidden shadow-2xl flex flex-col min-h-screen sm:min-h-0 sm:my-auto"
        >
          {/* Top Hero Image Header matching Screen 3 mockup */}
          <div className="relative h-72 sm:h-80 w-full overflow-hidden shrink-0">
            <img
              src={recipe.heroImage}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F1015] via-black/40 to-black/30" />

            {/* Top Navigation Bar */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
              <button
                id="recipe-detail-back-btn"
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/80 text-white flex items-center justify-center transition-transform active:scale-90"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/80 text-white flex items-center justify-center transition-transform active:scale-90"
                  title="Share Recipe"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                <button
                  id="recipe-detail-fav-btn"
                  onClick={() => onToggleFavorite(recipe.id)}
                  className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/80 text-white flex items-center justify-center transition-transform active:scale-90"
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      recipe.isFavorite ? 'fill-[#FF5E3A] text-[#FF5E3A]' : 'text-white'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Share Feedback Toast */}
            {shareFeedback && (
              <div className="absolute top-16 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white text-[#0F1015] font-bold text-xs shadow-xl z-20 animate-bounce">
                Recipe link copied to clipboard!
              </div>
            )}

            {/* Bottom Category Tag */}
            <div className="absolute bottom-4 left-5">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FF5E3A] text-white shadow-md">
                {recipe.category}
              </span>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="p-5 sm:p-7 space-y-6 flex-1">
            {/* Title & Description */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  {recipe.title}
                </h1>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A1C24] border border-[#252834] text-amber-400 font-bold text-xs shrink-0">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{recipe.rating.toFixed(1)}</span>
                  <span className="text-gray-500 font-normal">({recipe.reviewsCount})</span>
                </div>
              </div>

              <p className="text-sm text-gray-300 mt-2.5 leading-relaxed">
                {recipe.description}
              </p>
            </div>

            {/* Meta Stats Badges matching mockup */}
            <div className="grid grid-cols-3 gap-2.5">
              {/* Prep & Cook Time */}
              <div className="bg-[#1A1C24] border border-[#252834] rounded-2xl p-3 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FF5E3A]/20 text-[#FF5E3A] flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-semibold block">TOTAL TIME</span>
                  <span className="text-xs font-bold text-white">{recipe.totalTimeMinutes} min</span>
                </div>
              </div>

              {/* Dynamic Servings Adjuster */}
              <div className="bg-[#1A1C24] border border-[#252834] rounded-2xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-semibold block">SERVINGS</span>
                    <span className="text-xs font-bold text-white">{servings} ppl</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 ml-1">
                  <button
                    onClick={() => setServings(Math.max(1, servings - 1))}
                    className="w-5 h-5 rounded-full bg-[#252834] hover:bg-[#FF5E3A] text-white flex items-center justify-center text-[10px]"
                    title="Decrease Servings"
                  >
                    <Minus className="w-2.5 h-2.5" />
                  </button>
                  <button
                    onClick={() => setServings(servings + 1)}
                    className="w-5 h-5 rounded-full bg-[#252834] hover:bg-[#FF5E3A] text-white flex items-center justify-center text-[10px]"
                    title="Increase Servings"
                  >
                    <Plus className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>

              {/* Calories / Difficulty */}
              <div className="bg-[#1A1C24] border border-[#252834] rounded-2xl p-3 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 font-semibold block">CALORIES</span>
                  <span className="text-xs font-bold text-white">{Math.round(recipe.calories * scalingFactor)} kcal</span>
                </div>
              </div>
            </div>

            {/* Chef Profile Card matching mockup */}
            <div className="bg-[#1A1C24] border border-[#252834] rounded-2xl p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={recipe.chef.avatar}
                  alt={recipe.chef.name}
                  className="w-11 h-11 rounded-full object-cover border border-white/10"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{recipe.chef.name}</h4>
                  <p className="text-xs text-gray-400">{recipe.chef.title}</p>
                </div>
              </div>

              <button
                onClick={() => onToggleFollowChef(recipe.chef.name)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  recipe.chef.isFollowed
                    ? 'bg-[#252834] text-gray-300 border border-[#2F3342]'
                    : 'bg-white text-[#0F1015] hover:bg-gray-200'
                }`}
              >
                {recipe.chef.isFollowed ? 'Following' : '+ Follow'}
              </button>
            </div>

            {/* Quick Ingredient Chips scroll row matching mockup */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Ingredients</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#1A1C24] text-[#FF5E3A] font-semibold border border-[#252834]">
                    {recipe.ingredients.length} items
                  </span>
                </h3>

                <button
                  id="add-all-grocery-btn"
                  onClick={handleAddAllToGrocery}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#FF5E3A] hover:underline"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  {addedGroceryFeedback ? 'Added to Grocery List! ✓' : 'Add to Smart Grocery List'}
                </button>
              </div>

              {/* Horizontal Pill Tags matching mockup */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 mb-3">
                {recipe.ingredients.map((ing) => {
                  const isSelected = selectedIngredientFilter === ing.id;
                  return (
                    <button
                      key={ing.id}
                      onClick={() => setSelectedIngredientFilter(isSelected ? null : ing.id)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                        isSelected
                          ? 'bg-[#FF5E3A] text-white shadow-md shadow-[#FF5E3A]/30'
                          : 'bg-[#1A1C24] hover:bg-[#252834] text-gray-300 border border-[#252834]'
                      }`}
                    >
                      {ing.name}
                    </button>
                  );
                })}
              </div>

              {/* Detailed Ingredient Checklist */}
              <div className="space-y-2 bg-[#161822] rounded-2xl p-3 border border-[#252834]">
                {recipe.ingredients.map((ing) => {
                  const isChecked = checkedIngredients.includes(ing.id);
                  const scaledAmount = Number((ing.amount * scalingFactor).toFixed(1));

                  return (
                    <div
                      key={ing.id}
                      onClick={() => toggleCheckIngredient(ing.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                        isChecked ? 'bg-black/40 text-gray-500 line-through' : 'hover:bg-[#1E202B] text-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-colors ${
                            isChecked
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-[#2F3342] bg-[#1A1C24]'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-xs sm:text-sm font-medium">{ing.name}</span>
                      </div>

                      <span className="text-xs font-bold text-[#FF5E3A] font-mono">
                        {scaledAmount} {ing.unit}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step-by-Step Cooking Steps matching mockup */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Cooking Steps</h3>
                <button
                  id="start-live-cooking-btn"
                  onClick={() => setShowCookingMode(true)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF5E3A] hover:bg-[#FF7043] text-white text-xs font-bold shadow-md shadow-[#FF5E3A]/20 transition-all hover:scale-105 active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Start Cooking Mode</span>
                </button>
              </div>

              {/* Numbered Step Cards matching mockup (01, 02, etc.) */}
              <div className="space-y-3">
                {recipe.instructions.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="bg-[#1A1C24] border border-[#252834] rounded-2xl p-4 flex items-start gap-4 transition-colors hover:border-[#2F3342]"
                  >
                    {/* Number Badge */}
                    <div className="w-9 h-9 rounded-xl bg-[#252834] text-[#FF5E3A] flex items-center justify-center font-mono font-black text-sm shrink-0">
                      {step.stepNumber.toString().padStart(2, '0')}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white">{step.title}</h4>
                        {step.durationMinutes && (
                          <span className="text-[10px] font-semibold text-gray-400 bg-[#252834] px-2 py-0.5 rounded-md">
                            {step.durationMinutes} min
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                        {step.instruction}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Bottom Action Bar */}
          <div className="sticky bottom-0 bg-[#0F1015]/95 backdrop-blur-xl border-t border-[#252834] p-4 flex items-center gap-3">
            <button
              id="open-meal-plan-assign-btn"
              onClick={() => setShowPlanModal(true)}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#1A1C24] hover:bg-[#252834] border border-[#2F3342] text-white text-sm font-bold transition-all"
            >
              <Calendar className="w-4 h-4 text-[#FF5E3A]" />
              <span>Add to Meal Planner</span>
            </button>

            <button
              id="cook-now-cta-btn"
              onClick={() => setShowCookingMode(true)}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#FF5E3A] hover:bg-[#FF7043] text-white text-sm font-extrabold shadow-lg shadow-[#FF5E3A]/30 transition-all hover:scale-[1.02] active:scale-95"
            >
              <ChefHat className="w-4 h-4" />
              <span>Cook Now</span>
            </button>
          </div>

          {/* Quick Assign to Meal Plan Modal */}
          {showPlanModal && (
            <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#1A1C24] border border-[#252834] rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#FF5E3A]" />
                    Schedule Meal
                  </h3>
                  <button
                    onClick={() => setShowPlanModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                {/* Day selector */}
                <div>
                  <label className="text-xs text-gray-400 font-medium mb-1.5 block">Select Day</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {days.map(d => (
                      <button
                        key={d}
                        onClick={() => setSelectedDay(d)}
                        className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                          selectedDay === d
                            ? 'bg-[#FF5E3A] text-white'
                            : 'bg-[#252834] text-gray-300 hover:text-white'
                        }`}
                      >
                        {d.substring(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slot selector */}
                <div>
                  <label className="text-xs text-gray-400 font-medium mb-1.5 block">Meal Time</label>
                  <div className="grid grid-cols-2 gap-2">
                    {slots.map(s => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedSlot(s.id)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all ${
                          selectedSlot === s.id
                            ? 'bg-[#FF5E3A] text-white'
                            : 'bg-[#252834] text-gray-300 hover:text-white'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  id="confirm-meal-plan-assign-btn"
                  onClick={handleConfirmAddToPlan}
                  className="w-full py-3 rounded-2xl bg-[#FF5E3A] hover:bg-[#FF7043] text-white font-bold text-sm shadow-md shadow-[#FF5E3A]/30 transition-transform active:scale-95"
                >
                  Save to Schedule
                </button>
              </div>
            </div>
          )}

          {/* Interactive Cooking Mode Modal */}
          {showCookingMode && (
            <InteractiveCookingMode
              recipe={recipe}
              isOpen={showCookingMode}
              onClose={() => setShowCookingMode(false)}
              servings={servings}
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
