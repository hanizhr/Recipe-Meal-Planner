import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  Flame, 
  Clock, 
  Heart, 
  Calendar, 
  ShoppingCart, 
  ChevronRight, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  BookOpen, 
  Smartphone, 
  Layers 
} from 'lucide-react';
import { 
  Category, 
  DayOfWeek, 
  GroceryItem, 
  IngredientCategory, 
  MealPlanEntry, 
  MealSlot, 
  Recipe, 
  RecipeFilterState, 
  UserProfile 
} from './types';
import { StorageService } from './db/storage';
import { Header } from './components/Header';
import { CategoryChips } from './components/CategoryChips';
import { RecipeCard } from './components/RecipeCard';
import { RecipeDetailModal } from './components/RecipeDetailModal';
import { MealPlannerView } from './components/MealPlannerView';
import { GroceryListView } from './components/GroceryListView';
import { RecipeCreatorModal } from './components/RecipeCreatorModal';
import { FilterDrawer } from './components/FilterDrawer';
import { FlutterCodeHubModal } from './components/FlutterCodeHubModal';
import { ProfileModal } from './components/ProfileModal';
import { OnboardingModal } from './components/OnboardingModal';
import { BottomNavBar, TabType } from './components/BottomNavBar';

const INITIAL_FILTERS: RecipeFilterState = {
  searchQuery: '',
  category: 'All',
  maxTimeMinutes: 60,
  difficulty: 'All',
  dietaryTags: [],
  maxCalories: 1000,
  sortBy: 'trending',
};

export default function App() {
  // --- Persistent Local Database State ---
  const [recipes, setRecipes] = useState<Recipe[]>(() => StorageService.getRecipes());
  const [mealPlan, setMealPlan] = useState<MealPlanEntry[]>(() => StorageService.getMealPlan());
  const [groceryList, setGroceryList] = useState<GroceryItem[]>(() => StorageService.getGroceryList());
  const [userProfile, setUserProfile] = useState<UserProfile>(() => StorageService.getProfile());
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => !StorageService.hasSeenOnboarding());

  // --- UI Navigation State ---
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<RecipeFilterState>(INITIAL_FILTERS);
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(false);

  // --- Modals State ---
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [showFlutterHubModal, setShowFlutterHubModal] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);

  // Sync state helpers
  const refreshAllData = () => {
    setRecipes(StorageService.getRecipes());
    setMealPlan(StorageService.getMealPlan());
    setGroceryList(StorageService.getGroceryList());
    setUserProfile(StorageService.getProfile());
  };

  const handleCloseOnboarding = () => {
    StorageService.setSeenOnboarding(true);
    setShowOnboarding(false);
  };

  // Toggle favorite recipe
  const handleToggleFavorite = (recipeId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = StorageService.toggleFavorite(recipeId);
    setRecipes(updated);
    if (selectedRecipe && selectedRecipe.id === recipeId) {
      setSelectedRecipe(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    }
  };

  // Toggle follow chef
  const handleToggleFollowChef = (chefName: string) => {
    const updated = StorageService.toggleFollowChef(chefName);
    setRecipes(updated);
    if (selectedRecipe && selectedRecipe.chef.name === chefName) {
      setSelectedRecipe(prev => prev ? {
        ...prev,
        chef: { ...prev.chef, isFollowed: !prev.chef.isFollowed }
      } : null);
    }
  };

  // Add custom recipe
  const handleSaveCustomRecipe = (newRecipeData: Omit<Recipe, 'id' | 'createdAt'>) => {
    const created = StorageService.addRecipe(newRecipeData);
    setRecipes(StorageService.getRecipes());
    setSelectedRecipe(created);
  };

  // Meal Plan Handlers
  const handleAddMealPlanEntry = (day: DayOfWeek, slot: MealSlot, recipeId: string, servings: number = 2) => {
    const updated = StorageService.addMealPlanEntry(day, slot, recipeId, servings);
    setMealPlan(updated);
  };

  const handleRemoveMealPlanEntry = (id: string) => {
    const updated = StorageService.removeMealPlanEntry(id);
    setMealPlan(updated);
  };

  const handleClearMealPlan = () => {
    const updated = StorageService.clearMealPlan();
    setMealPlan(updated);
  };

  // Grocery Handlers
  const handleToggleGroceryItem = (id: string) => {
    const updated = StorageService.toggleGroceryItem(id);
    setGroceryList(updated);
  };

  const handleAddCustomGrocery = (name: string, amount: number, unit: string, category: IngredientCategory) => {
    const updated = StorageService.addCustomGroceryItem(name, amount, unit, category);
    setGroceryList(updated);
  };

  const handleAddRecipeToGrocery = (recipe: Recipe, servings: number) => {
    const updated = StorageService.addRecipeToGroceryList(recipe, servings);
    setGroceryList(updated);
  };

  const handleGenerateGroceryFromPlan = () => {
    const generated = StorageService.generateGroceryListFromPlan(mealPlan);
    StorageService.saveGroceryList(generated);
    setGroceryList(generated);
  };

  const handleClearCompletedGrocery = () => {
    const updated = StorageService.clearCompletedGroceryItems();
    setGroceryList(updated);
  };

  const handleClearAllGrocery = () => {
    const updated = StorageService.clearAllGroceryItems();
    setGroceryList(updated);
  };

  // Count recipes per category
  const recipeCategoryCounts = useMemo(() => {
    const counts: Record<Category, number> = {
      All: recipes.length,
      Western: 0,
      Bread: 0,
      Soup: 0,
      Dessert: 0,
      Coffee: 0,
      Asian: 0,
      Italian: 0,
      Healthy: 0,
      'High-Protein': 0,
      Keto: 0,
    };

    recipes.forEach(r => {
      if (counts[r.category] !== undefined) {
        counts[r.category]++;
      }
      r.tags.forEach(t => {
        if (t === 'High-Protein') counts['High-Protein']++;
        if (t === 'Keto') counts['Keto']++;
        if (t === 'Healthy') counts['Healthy']++;
      });
    });

    return counts;
  }, [recipes]);

  // Active filters count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.difficulty !== 'All') count++;
    if (filters.maxTimeMinutes < 60) count++;
    if (filters.dietaryTags.length > 0) count += filters.dietaryTags.length;
    if (filters.sortBy !== 'trending') count++;
    return count;
  }, [filters]);

  // Filtered & Sorted Recipes
  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = recipe.title.toLowerCase().includes(q);
        const matchDesc = recipe.description.toLowerCase().includes(q);
        const matchChef = recipe.chef.name.toLowerCase().includes(q);
        const matchTags = recipe.tags.some(t => t.toLowerCase().includes(q));
        const matchIng = recipe.ingredients.some(i => i.name.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchChef && !matchTags && !matchIng) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== 'All') {
        if (selectedCategory === 'High-Protein' || selectedCategory === 'Keto' || selectedCategory === 'Healthy') {
          if (!recipe.tags.includes(selectedCategory) && recipe.category !== selectedCategory) {
            return false;
          }
        } else if (recipe.category !== selectedCategory) {
          return false;
        }
      }

      // Max Time
      if (recipe.totalTimeMinutes > filters.maxTimeMinutes) return false;

      // Difficulty
      if (filters.difficulty !== 'All' && recipe.difficulty !== filters.difficulty) return false;

      // Dietary Tags
      if (filters.dietaryTags.length > 0) {
        const hasAllTags = filters.dietaryTags.every(tag => recipe.tags.includes(tag));
        if (!hasAllTags) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'rating') return b.rating - a.rating;
      if (filters.sortBy === 'time') return a.totalTimeMinutes - b.totalTimeMinutes;
      if (filters.sortBy === 'calories') return a.calories - b.calories;
      // Default trending
      return (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0);
    });
  }, [recipes, searchQuery, selectedCategory, filters]);

  // Separate trending recipes for top section
  const trendingRecipes = useMemo(() => {
    return recipes.filter(r => r.isTrending);
  }, [recipes]);

  const favoriteRecipes = useMemo(() => {
    return recipes.filter(r => r.isFavorite);
  }, [recipes]);

  // Render main content based on activeTab
  const renderTabContent = () => {
    if (activeTab === 'planner') {
      return (
        <MealPlannerView
          mealPlan={mealPlan}
          recipes={recipes}
          userProfile={userProfile}
          onAddMealPlanEntry={handleAddMealPlanEntry}
          onRemoveMealPlanEntry={handleRemoveMealPlanEntry}
          onClearMealPlan={handleClearMealPlan}
          onGenerateGroceryList={handleGenerateGroceryFromPlan}
          onSelectRecipe={(r) => setSelectedRecipe(r)}
        />
      );
    }

    if (activeTab === 'grocery') {
      return (
        <GroceryListView
          groceryItems={groceryList}
          onToggleItem={handleToggleGroceryItem}
          onAddItem={handleAddCustomGrocery}
          onClearCompleted={handleClearCompletedGrocery}
          onClearAll={handleClearAllGrocery}
        />
      );
    }

    if (activeTab === 'favorites') {
      return (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 space-y-6">
          <div className="bg-[#1A1C24] border border-[#252834] rounded-3xl p-5 shadow-xl flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FF5E3A]/20 text-[#FF5E3A] border border-[#FF5E3A]/30">
                  Bookmarked Recipes
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-white mt-1">Your Saved Favorites</h2>
              <p className="text-xs text-gray-400 mt-0.5">{favoriteRecipes.length} saved recipes</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-[#FF5E3A]/20 text-[#FF5E3A] flex items-center justify-center">
              <Heart className="w-5 h-5 fill-[#FF5E3A]" />
            </div>
          </div>

          {favoriteRecipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteRecipes.map(recipe => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onSelect={(r) => setSelectedRecipe(r)}
                  onToggleFavorite={(id, e) => handleToggleFavorite(id, e)}
                  onQuickAddToMealPlan={(r, e) => {
                    e.stopPropagation();
                    handleAddMealPlanEntry('Monday', 'dinner', r.id, 2);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#161822] border border-[#252834] rounded-3xl p-8 space-y-3">
              <Heart className="w-12 h-12 text-gray-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No saved recipes yet</h3>
              <p className="text-xs text-gray-400">Tap the heart icon on any recipe card to save it here.</p>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'flutter') {
      return (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 space-y-6">
          <div className="bg-gradient-to-r from-[#02569B]/30 to-[#14161F] border border-[#02569B]/40 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#54C5F8]/20 text-[#54C5F8] border border-[#54C5F8]/40">
                Flutter 3.x + Free SQLite Engine
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                Flutter Dart Code & Architecture Hub
              </h2>
              <p className="text-xs text-gray-300 mt-1 max-w-lg">
                Complete production-ready Dart models, SQLite database manager (<code className="text-[#FF5E3A]">sqflite</code>), and Material 3 Dark UI code matching this exact design.
              </p>
            </div>

            <button
              onClick={() => setShowFlutterHubModal(true)}
              className="px-5 py-3 rounded-2xl bg-[#FF5E3A] hover:bg-[#FF7043] text-white font-extrabold text-xs shadow-lg shadow-[#FF5E3A]/30 transition-all hover:scale-105"
            >
              Open Full Code Inspector
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#1A1C24] border border-[#252834] rounded-2xl p-4 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-[#FF5E3A]/20 text-[#FF5E3A] flex items-center justify-center font-bold text-xs">
                01
              </div>
              <h4 className="text-sm font-bold text-white">Free SQLite Storage</h4>
              <p className="text-xs text-gray-400">
                Uses the free <code className="text-gray-300">sqflite</code> plugin for persistent offline relational storage without cloud costs.
              </p>
            </div>

            <div className="bg-[#1A1C24] border border-[#252834] rounded-2xl p-4 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs">
                02
              </div>
              <h4 className="text-sm font-bold text-white">Weekly Meal Planner</h4>
              <p className="text-xs text-gray-400">
                7-Day interactive schedule with auto-aggregating grocery shopping generator.
              </p>
            </div>

            <div className="bg-[#1A1C24] border border-[#252834] rounded-2xl p-4 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                03
              </div>
              <h4 className="text-sm font-bold text-white">Pixel-Perfect Dark UI</h4>
              <p className="text-xs text-gray-400">
                Warm coral highlights (<code className="text-gray-300">#FF5E3A</code>), smooth cards, and responsive layouts.
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Default Home View
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6 pb-24">
        {/* Category Horizontal Scroll Chips */}
        <CategoryChips
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          recipeCounts={recipeCategoryCounts}
        />

        {/* Trending Recipes Section (Matching Screen 2 in Mockup) */}
        {selectedCategory === 'All' && !searchQuery && (
          <section className="px-4 sm:px-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                  Trending Recipes
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF5E3A]/20 text-[#FF5E3A]">
                  Popular
                </span>
              </div>

              <button
                onClick={() => setSelectedCategory('All')}
                className="text-xs text-gray-400 hover:text-[#FF5E3A] flex items-center gap-1 font-semibold transition-colors"
              >
                See More <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Trending Cards Stack */}
            <div className="space-y-4">
              {trendingRecipes.slice(0, 3).map(recipe => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  variant="trending"
                  onSelect={(r) => setSelectedRecipe(r)}
                  onToggleFavorite={(id, e) => handleToggleFavorite(id, e)}
                  onQuickAddToMealPlan={(r, e) => {
                    e.stopPropagation();
                    handleAddMealPlanEntry('Monday', 'dinner', r.id, 2);
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {/* All / Filtered Recipes Grid */}
        <section className="px-4 sm:px-6 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-white tracking-tight">
                {selectedCategory === 'All' ? 'Explore Delicious Dishes' : `${selectedCategory} Dishes`}
              </h3>
              <span className="text-xs text-gray-400">
                {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'} found
              </span>
            </div>

            {activeFilterCount > 0 && (
              <button
                onClick={() => setFilters(INITIAL_FILTERS)}
                className="text-xs text-[#FF5E3A] hover:underline font-bold"
              >
                Clear Filters
              </button>
            )}
          </div>

          {filteredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecipes.map(recipe => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  variant="standard"
                  onSelect={(r) => setSelectedRecipe(r)}
                  onToggleFavorite={(id, e) => handleToggleFavorite(id, e)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#161822] border border-[#252834] rounded-3xl p-8 space-y-3">
              <Search className="w-12 h-12 text-gray-600 mx-auto" />
              <h4 className="text-base font-bold text-white">No matching recipes found</h4>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                Try clearing your search query or relaxing your filter constraints.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setFilters(INITIAL_FILTERS);
                }}
                className="px-4 py-2 rounded-full bg-[#FF5E3A] text-white text-xs font-bold shadow"
              >
                Reset Search & Filters
              </button>
            </div>
          )}
        </section>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#F3F4F6] flex flex-col items-center selection:bg-[#FF5E3A] selection:text-white">
      {/* Phone Mockup Frame wrapper or Full Canvas mode */}
      <div 
        className={`w-full transition-all duration-300 ${
          isPhoneFrame 
            ? 'max-w-[430px] my-6 rounded-[48px] border-8 border-[#252834] shadow-2xl overflow-hidden bg-[#0F1015] min-h-[880px] ring-1 ring-white/10' 
            : 'max-w-5xl mx-auto'
        }`}
      >
        {/* Mobile Mockup Notch / Speaker bar if in phone frame */}
        {isPhoneFrame && (
          <div className="pt-3 pb-1 px-8 flex items-center justify-between bg-[#0F1015] text-[11px] text-gray-400 font-semibold border-b border-[#1A1C24]">
            <span>9:41</span>
            <div className="w-20 h-4 bg-[#1E2029] rounded-full mx-auto" />
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px]">100%</span>
            </div>
          </div>
        )}

        {/* Global App Header */}
        <Header
          userProfile={userProfile}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenFilter={() => setShowFilterModal(true)}
          onOpenProfile={() => setShowProfileModal(true)}
          onOpenCreateRecipe={() => setShowCreateModal(true)}
          onOpenFlutterHub={() => setShowFlutterHubModal(true)}
          isPhoneFrame={isPhoneFrame}
          onToggleFrame={() => setIsPhoneFrame(!isPhoneFrame)}
          activeFilterCount={activeFilterCount}
        />

        {/* Main Tab Content Body */}
        <main className="flex-1 pb-20">
          {renderTabContent()}
        </main>

        {/* Floating Bottom Navigation Bar */}
        <BottomNavBar
          activeTab={activeTab}
          onTabChange={(tab) => {
            if (tab === 'flutter') {
              setShowFlutterHubModal(true);
            } else {
              setActiveTab(tab);
            }
          }}
          groceryCount={groceryList.filter(i => !i.isCompleted).length}
          plannedCount={mealPlan.length}
          favoritesCount={favoriteRecipes.length}
        />
      </div>

      {/* --- MODALS --- */}
      {/* 1. Recipe Detail Modal (Matching Screen 3) */}
      <RecipeDetailModal
        recipe={selectedRecipe}
        isOpen={Boolean(selectedRecipe)}
        onClose={() => setSelectedRecipe(null)}
        onToggleFavorite={(id) => handleToggleFavorite(id)}
        onToggleFollowChef={(chefName) => handleToggleFollowChef(chefName)}
        onAddToGroceryList={(r, s) => handleAddRecipeToGrocery(r, s)}
        onAddToMealPlan={(day, slot, rId, s) => handleAddMealPlanEntry(day, slot, rId, s)}
      />

      {/* 2. Recipe Creator Modal */}
      <RecipeCreatorModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSaveRecipe={handleSaveCustomRecipe}
      />

      {/* 3. Filter Drawer */}
      <FilterDrawer
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        onUpdateFilters={(newF) => setFilters(prev => ({ ...prev, ...newF }))}
        onResetFilters={() => setFilters(INITIAL_FILTERS)}
      />

      {/* 4. Flutter Code Hub & Architecture Explorer Modal */}
      <FlutterCodeHubModal
        isOpen={showFlutterHubModal}
        onClose={() => setShowFlutterHubModal(false)}
      />

      {/* 5. User Profile & Free Database Management Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        profile={userProfile}
        onUpdateProfile={(p) => {
          setUserProfile(p);
          StorageService.saveProfile(p);
        }}
        onRefreshData={refreshAllData}
        onOpenOnboarding={() => setShowOnboarding(true)}
      />

      {/* 6. Onboarding Splash Modal (Matching Screen 1) */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={handleCloseOnboarding}
      />
    </div>
  );
}
