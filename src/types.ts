export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type Category = 
  | 'All'
  | 'Western' 
  | 'Bread' 
  | 'Soup' 
  | 'Dessert' 
  | 'Coffee' 
  | 'Asian' 
  | 'Italian' 
  | 'Healthy' 
  | 'High-Protein' 
  | 'Keto';

export type IngredientCategory = 'produce' | 'meat' | 'dairy' | 'pantry' | 'bakery' | 'seafood' | 'spices' | 'other';

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: IngredientCategory;
  notes?: string;
}

export interface CookingStep {
  stepNumber: number;
  title: string;
  instruction: string;
  durationMinutes?: number;
  timerLabel?: string;
  icon?: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number; // in grams
  carbs: number;   // in grams
  fat: number;     // in grams
  fiber?: number;  // in grams
}

export interface ChefInfo {
  name: string;
  title: string;
  avatar: string;
  bio?: string;
  isFollowed?: boolean;
}

export interface Recipe {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  category: Category;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  totalTimeMinutes: number;
  servings: number;
  difficulty: Difficulty;
  rating: number;
  reviewsCount: number;
  calories: number;
  heroImage: string;
  tags: string[];
  chef: ChefInfo;
  ingredients: Ingredient[];
  instructions: CookingStep[];
  nutrition: NutritionInfo;
  isTrending?: boolean;
  isFavorite?: boolean;
  isUserCreated?: boolean;
  createdAt: string;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
export type MealSlot = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MealPlanEntry {
  id: string;
  day: DayOfWeek;
  slot: MealSlot;
  recipeId: string;
  servings: number;
  notes?: string;
}

export interface GroceryItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: IngredientCategory;
  isCompleted: boolean;
  recipeSource?: string;
  addedAt: string;
}

export interface UserProfile {
  name: string;
  avatar: string;
  dailyCalorieTarget: number;
  dailyProteinTarget: number;
  dietaryPreferences: string[];
}

export interface RecipeFilterState {
  searchQuery: string;
  category: Category;
  maxTimeMinutes: number;
  difficulty: Difficulty | 'All';
  dietaryTags: string[];
  maxCalories: number;
  sortBy: 'trending' | 'rating' | 'time' | 'calories';
}
