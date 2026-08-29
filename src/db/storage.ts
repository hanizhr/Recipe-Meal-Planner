import { GroceryItem, MealPlanEntry, Recipe, UserProfile, DayOfWeek, MealSlot } from '../types';
import { INITIAL_RECIPES } from '../data/initialRecipes';

const STORAGE_KEYS = {
  RECIPES: 'culinaryhub_recipes_v1',
  MEAL_PLAN: 'culinaryhub_meal_plan_v1',
  GROCERY_LIST: 'culinaryhub_grocery_list_v1',
  USER_PROFILE: 'culinaryhub_profile_v1',
  ONBOARDING_SEEN: 'culinaryhub_onboarding_seen_v1',
};

const DEFAULT_PROFILE: UserProfile = {
  name: 'Daniel',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
  dailyCalorieTarget: 2200,
  dailyProteinTarget: 140,
  dietaryPreferences: ['High-Protein', 'Quick Dinner'],
};

const INITIAL_MEAL_PLAN: MealPlanEntry[] = [
  {
    id: 'mp-1',
    day: 'Monday',
    slot: 'dinner',
    recipeId: 'rec-1', // Grilled Lemon Garlic Salmon
    servings: 2,
    notes: 'Family dinner'
  },
  {
    id: 'mp-2',
    day: 'Tuesday',
    slot: 'dinner',
    recipeId: 'rec-2', // Creamy Tuscan Chicken
    servings: 3,
    notes: 'Prep extra for lunch'
  },
  {
    id: 'mp-3',
    day: 'Wednesday',
    slot: 'lunch',
    recipeId: 'rec-9', // Mediterranean Quinoa Bowl
    servings: 2,
    notes: 'Post-workout clean fuel'
  },
  {
    id: 'mp-4',
    day: 'Thursday',
    slot: 'dinner',
    recipeId: 'rec-3', // Spicy Tofu & Veggie Stir-Fry
    servings: 2,
    notes: 'Meatless Thursday'
  },
  {
    id: 'mp-5',
    day: 'Friday',
    slot: 'dinner',
    recipeId: 'rec-4', // Authentic Italian Carbonara
    servings: 2,
    notes: 'Friday pasta night'
  },
  {
    id: 'mp-6',
    day: 'Saturday',
    slot: 'breakfast',
    recipeId: 'rec-8', // Signature Cold Brew
    servings: 1,
    notes: 'Weekend morning brew'
  }
];

export class StorageService {
  // --- Recipes Database Operations ---
  static getRecipes(): Recipe[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RECIPES);
      if (!data) {
        this.saveRecipes(INITIAL_RECIPES);
        return INITIAL_RECIPES;
      }
      const parsed: Recipe[] = JSON.parse(data);
      const existingIds = new Set(parsed.map(r => r.id));
      const newDefaults = INITIAL_RECIPES.filter(r => !existingIds.has(r.id));
      if (newDefaults.length > 0) {
        const merged = [...parsed, ...newDefaults];
        this.saveRecipes(merged);
        return merged;
      }
      return parsed;
    } catch (e) {
      console.error('Failed to load recipes from local storage', e);
      return INITIAL_RECIPES;
    }
  }

  static saveRecipes(recipes: Recipe[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(recipes));
    } catch (e) {
      console.error('Failed to save recipes to local storage', e);
    }
  }

  static getRecipeById(id: string): Recipe | undefined {
    const recipes = this.getRecipes();
    return recipes.find(r => r.id === id);
  }

  static toggleFavorite(recipeId: string): Recipe[] {
    const recipes = this.getRecipes().map(r => {
      if (r.id === recipeId) {
        return { ...r, isFavorite: !r.isFavorite };
      }
      return r;
    });
    this.saveRecipes(recipes);
    return recipes;
  }

  static toggleFollowChef(chefName: string): Recipe[] {
    const recipes = this.getRecipes().map(r => {
      if (r.chef.name === chefName) {
        return {
          ...r,
          chef: {
            ...r.chef,
            isFollowed: !r.chef.isFollowed
          }
        };
      }
      return r;
    });
    this.saveRecipes(recipes);
    return recipes;
  }

  static addRecipe(recipe: Omit<Recipe, 'id' | 'createdAt'>): Recipe {
    const newRecipe: Recipe = {
      ...recipe,
      id: `custom-rec-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      isUserCreated: true,
      rating: 5.0,
      reviewsCount: 1,
    };
    const recipes = [newRecipe, ...this.getRecipes()];
    this.saveRecipes(recipes);
    return newRecipe;
  }

  static deleteRecipe(id: string): Recipe[] {
    const recipes = this.getRecipes().filter(r => r.id !== id);
    this.saveRecipes(recipes);
    return recipes;
  }

  // --- Meal Planner Operations ---
  static getMealPlan(): MealPlanEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEAL_PLAN);
      if (!data) {
        this.saveMealPlan(INITIAL_MEAL_PLAN);
        return INITIAL_MEAL_PLAN;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load meal plan', e);
      return INITIAL_MEAL_PLAN;
    }
  }

  static saveMealPlan(plan: MealPlanEntry[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.MEAL_PLAN, JSON.stringify(plan));
    } catch (e) {
      console.error('Failed to save meal plan', e);
    }
  }

  static addMealPlanEntry(day: DayOfWeek, slot: MealSlot, recipeId: string, servings: number = 2, notes?: string): MealPlanEntry[] {
    const plan = this.getMealPlan();
    const existingIndex = plan.findIndex(item => item.day === day && item.slot === slot && item.recipeId === recipeId);
    
    let updated: MealPlanEntry[];
    if (existingIndex >= 0) {
      updated = [...plan];
      updated[existingIndex] = { ...updated[existingIndex], servings, notes };
    } else {
      const newEntry: MealPlanEntry = {
        id: `mp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        day,
        slot,
        recipeId,
        servings,
        notes
      };
      updated = [...plan, newEntry];
    }

    this.saveMealPlan(updated);
    return updated;
  }

  static removeMealPlanEntry(id: string): MealPlanEntry[] {
    const updated = this.getMealPlan().filter(item => item.id !== id);
    this.saveMealPlan(updated);
    return updated;
  }

  static clearMealPlan(): MealPlanEntry[] {
    this.saveMealPlan([]);
    return [];
  }

  // --- Grocery Shopping List Operations ---
  static getGroceryList(): GroceryItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GROCERY_LIST);
      if (!data) {
        const initial = this.generateGroceryListFromPlan(INITIAL_MEAL_PLAN.slice(0, 2));
        this.saveGroceryList(initial);
        return initial;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load grocery list', e);
      return [];
    }
  }

  static saveGroceryList(items: GroceryItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.GROCERY_LIST, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save grocery list', e);
    }
  }

  static toggleGroceryItem(id: string): GroceryItem[] {
    const items = this.getGroceryList().map(item => 
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    this.saveGroceryList(items);
    return items;
  }

  static addCustomGroceryItem(name: string, amount: number = 1, unit: string = 'unit', category: any = 'produce'): GroceryItem[] {
    const newItem: GroceryItem = {
      id: `groc-${Date.now()}`,
      name,
      amount,
      unit,
      category,
      isCompleted: false,
      recipeSource: 'Manual entry',
      addedAt: new Date().toISOString(),
    };
    const items = [newItem, ...this.getGroceryList()];
    this.saveGroceryList(items);
    return items;
  }

  static addRecipeToGroceryList(recipe: Recipe, targetServings?: number): GroceryItem[] {
    const currentItems = this.getGroceryList();
    const multiplier = targetServings ? targetServings / recipe.servings : 1;

    const newItems: GroceryItem[] = recipe.ingredients.map(ing => ({
      id: `groc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: ing.name,
      amount: Number((ing.amount * multiplier).toFixed(1)),
      unit: ing.unit,
      category: ing.category,
      isCompleted: false,
      recipeSource: recipe.title,
      addedAt: new Date().toISOString(),
    }));

    const combined = [...newItems, ...currentItems];
    this.saveGroceryList(combined);
    return combined;
  }

  static generateGroceryListFromPlan(mealPlan?: MealPlanEntry[]): GroceryItem[] {
    const plan = mealPlan || this.getMealPlan();
    const recipes = this.getRecipes();
    const itemsMap = new Map<string, GroceryItem>();

    plan.forEach(entry => {
      const recipe = recipes.find(r => r.id === entry.recipeId);
      if (!recipe) return;
      
      const multiplier = entry.servings / (recipe.servings || 1);

      recipe.ingredients.forEach(ing => {
        const key = `${ing.name.toLowerCase()}_${ing.unit.toLowerCase()}`;
        const scaledAmount = ing.amount * multiplier;

        if (itemsMap.has(key)) {
          const existing = itemsMap.get(key)!;
          existing.amount = Number((existing.amount + scaledAmount).toFixed(1));
          if (existing.recipeSource && !existing.recipeSource.includes(recipe.title)) {
            existing.recipeSource += `, ${recipe.title}`;
          }
        } else {
          itemsMap.set(key, {
            id: `groc-gen-${Math.random().toString(36).substring(2, 8)}`,
            name: ing.name,
            amount: Number(scaledAmount.toFixed(1)),
            unit: ing.unit,
            category: ing.category,
            isCompleted: false,
            recipeSource: recipe.title,
            addedAt: new Date().toISOString(),
          });
        }
      });
    });

    const result = Array.from(itemsMap.values());
    return result;
  }

  static clearCompletedGroceryItems(): GroceryItem[] {
    const items = this.getGroceryList().filter(i => !i.isCompleted);
    this.saveGroceryList(items);
    return items;
  }

  static clearAllGroceryItems(): GroceryItem[] {
    this.saveGroceryList([]);
    return [];
  }

  // --- Profile Operations ---
  static getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  }

  static saveProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  }

  // --- Onboarding Seen Status ---
  static hasSeenOnboarding(): boolean {
    return localStorage.getItem(STORAGE_KEYS.ONBOARDING_SEEN) === 'true';
  }

  static setSeenOnboarding(value: boolean = true): void {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_SEEN, value ? 'true' : 'false');
  }

  // --- Free Database Export / Import (Zero-cost local backup) ---
  static exportFullDatabase(): string {
    const payload = {
      recipes: this.getRecipes(),
      mealPlan: this.getMealPlan(),
      groceryList: this.getGroceryList(),
      profile: this.getProfile(),
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };
    return JSON.stringify(payload, null, 2);
  }

  static importFullDatabase(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.recipes && Array.isArray(parsed.recipes)) {
        this.saveRecipes(parsed.recipes);
      }
      if (parsed.mealPlan && Array.isArray(parsed.mealPlan)) {
        this.saveMealPlan(parsed.mealPlan);
      }
      if (parsed.groceryList && Array.isArray(parsed.groceryList)) {
        this.saveGroceryList(parsed.groceryList);
      }
      if (parsed.profile) {
        this.saveProfile(parsed.profile);
      }
      return true;
    } catch (e) {
      console.error('Import database error', e);
      return false;
    }
  }

  static resetToDefault(): void {
    localStorage.clear();
    this.saveRecipes(INITIAL_RECIPES);
    this.saveMealPlan(INITIAL_MEAL_PLAN);
    this.saveProfile(DEFAULT_PROFILE);
  }
}
