import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Sparkles, 
  Clock, 
  Users, 
  Flame, 
  ChefHat, 
  Image as ImageIcon 
} from 'lucide-react';
import { Category, CookingStep, Difficulty, Ingredient, IngredientCategory, Recipe } from '../types';

interface RecipeCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt'>) => void;
}

const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=1200&q=80',
];

export const RecipeCreatorModal: React.FC<RecipeCreatorModalProps> = ({
  isOpen,
  onClose,
  onSaveRecipe,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Western');
  const [prepTime, setPrepTime] = useState(10);
  const [cookTime, setCookTime] = useState(15);
  const [servings, setServings] = useState(2);
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [calories, setCalories] = useState(400);
  const [heroImage, setHeroImage] = useState(PRESET_IMAGES[0]);
  const [tagsInput, setTagsInput] = useState('Home Cooking, High-Protein');

  // Ingredients state
  const [ingredients, setIngredients] = useState<Omit<Ingredient, 'id'>[]>([
    { name: 'Olive oil', amount: 2, unit: 'tbsp', category: 'pantry' },
    { name: 'Garlic cloves', amount: 3, unit: 'cloves', category: 'produce' },
  ]);

  // Instructions state
  const [instructions, setInstructions] = useState<CookingStep[]>([
    { stepNumber: 1, title: 'Prep ingredients', instruction: 'Chop all vegetables and prepare sauces.', durationMinutes: 5 },
    { stepNumber: 2, title: 'Cook and combine', instruction: 'Heat pan, sauté aromatics, and cook until tender.', durationMinutes: 10 },
  ]);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: 1, unit: 'unit', category: 'produce' }]);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleUpdateIngredient = (index: number, field: keyof Omit<Ingredient, 'id'>, value: any) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  };

  const handleAddInstruction = () => {
    const nextStepNum = instructions.length + 1;
    setInstructions([
      ...instructions,
      { stepNumber: nextStepNum, title: `Step ${nextStepNum}`, instruction: '', durationMinutes: 5 }
    ]);
  };

  const handleRemoveInstruction = (index: number) => {
    const filtered = instructions.filter((_, i) => i !== index);
    const renumbered = filtered.map((step, i) => ({ ...step, stepNumber: i + 1 }));
    setInstructions(renumbered);
  };

  const handleUpdateInstruction = (index: number, field: keyof CookingStep, value: any) => {
    const updated = [...instructions];
    updated[index] = { ...updated[index], [field]: value };
    setInstructions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const formattedIngredients: Ingredient[] = ingredients
      .filter(i => i.name.trim().length > 0)
      .map((ing, idx) => ({
        ...ing,
        id: `custom-ing-${Date.now()}-${idx}`,
      }));

    const formattedInstructions: CookingStep[] = instructions
      .filter(ins => ins.instruction.trim().length > 0)
      .map((ins, idx) => ({
        ...ins,
        stepNumber: idx + 1,
      }));

    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    onSaveRecipe({
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      description: description.trim() || 'A delicious homemade recipe.',
      category,
      prepTimeMinutes: prepTime,
      cookTimeMinutes: cookTime,
      totalTimeMinutes: prepTime + cookTime,
      servings,
      difficulty,
      calories,
      rating: 5.0,
      reviewsCount: 1,
      heroImage,
      tags: tags.length > 0 ? tags : ['Homemade', category],
      chef: {
        name: 'You (Chef)',
        title: 'Home Kitchen Creator',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        bio: 'Passionate home cook exploring rich flavours and wholesome meal plans.',
        isFollowed: true,
      },
      nutrition: {
        calories,
        protein: 28,
        carbs: 35,
        fat: 16,
      },
      ingredients: formattedIngredients.length > 0 ? formattedIngredients : [
        { id: `ing-${Date.now()}`, name: 'Main ingredient', amount: 1, unit: 'portion', category: 'produce' }
      ],
      instructions: formattedInstructions.length > 0 ? formattedInstructions : [
        { stepNumber: 1, title: 'Cook and Enjoy', instruction: 'Prepare according to your preference.', durationMinutes: cookTime }
      ],
      isFavorite: true,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-[#0F1015] border border-[#252834] rounded-3xl p-5 sm:p-7 max-w-2xl w-full space-y-6 shadow-2xl my-auto max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#252834]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FF5E3A]/20 text-[#FF5E3A] flex items-center justify-center">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">Create New Recipe</h2>
              <span className="text-xs text-gray-400">Stores directly to your free local database</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-[#1A1C24] hover:bg-[#252834] text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Basic Details */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-300 mb-1 block">Recipe Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Garlic Butter Glazed Steak Bites"
              className="w-full bg-[#1A1C24] text-sm text-white px-4 py-3 rounded-2xl border border-[#252834] focus:outline-none focus:border-[#FF5E3A]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-300 mb-1 block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full bg-[#1A1C24] text-sm text-white px-4 py-3 rounded-2xl border border-[#252834] focus:outline-none focus:border-[#FF5E3A]"
              >
                <option value="Western">Western</option>
                <option value="Asian">Asian</option>
                <option value="Italian">Italian</option>
                <option value="Healthy">Healthy</option>
                <option value="High-Protein">High-Protein</option>
                <option value="Keto">Keto</option>
                <option value="Bread">Bread</option>
                <option value="Soup">Soup</option>
                <option value="Dessert">Dessert</option>
                <option value="Coffee">Coffee</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 mb-1 block">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="w-full bg-[#1A1C24] text-sm text-white px-4 py-3 rounded-2xl border border-[#252834] focus:outline-none focus:border-[#FF5E3A]"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-300 mb-1 block">Prep (mins)</label>
              <input
                type="number"
                min="0"
                value={prepTime}
                onChange={(e) => setPrepTime(parseInt(e.target.value) || 0)}
                className="w-full bg-[#1A1C24] text-sm text-white px-3 py-2.5 rounded-xl border border-[#252834]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-300 mb-1 block">Cook (mins)</label>
              <input
                type="number"
                min="0"
                value={cookTime}
                onChange={(e) => setCookTime(parseInt(e.target.value) || 0)}
                className="w-full bg-[#1A1C24] text-sm text-white px-3 py-2.5 rounded-xl border border-[#252834]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-300 mb-1 block">Calories</label>
              <input
                type="number"
                min="0"
                value={calories}
                onChange={(e) => setCalories(parseInt(e.target.value) || 0)}
                className="w-full bg-[#1A1C24] text-sm text-white px-3 py-2.5 rounded-xl border border-[#252834]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-300 mb-1 block">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief summary of flavors, origins, or tips..."
              className="w-full bg-[#1A1C24] text-sm text-white px-4 py-2.5 rounded-2xl border border-[#252834] focus:outline-none focus:border-[#FF5E3A]"
            />
          </div>

          {/* Photo Selector */}
          <div>
            <label className="text-xs font-bold text-gray-300 mb-2 block">Choose Hero Photo Preset</label>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_IMAGES.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setHeroImage(img)}
                  className={`h-14 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                    heroImage === img ? 'border-[#FF5E3A] scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="preset" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ingredients Builder */}
        <div className="space-y-3 pt-3 border-t border-[#252834]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Ingredients List</span>
              <span className="text-xs text-[#FF5E3A]">({ingredients.length})</span>
            </h3>
            <button
              type="button"
              onClick={handleAddIngredient}
              className="flex items-center gap-1 text-xs font-bold text-[#FF5E3A] hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Ingredient</span>
            </button>
          </div>

          <div className="space-y-2">
            {ingredients.map((ing, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ingredient name (e.g. Salmon fillets)"
                  value={ing.name}
                  onChange={(e) => handleUpdateIngredient(idx, 'name', e.target.value)}
                  className="flex-2 bg-[#1A1C24] text-xs text-white px-3 py-2 rounded-xl border border-[#252834]"
                />
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  placeholder="Amount"
                  value={ing.amount}
                  onChange={(e) => handleUpdateIngredient(idx, 'amount', parseFloat(e.target.value) || 1)}
                  className="w-18 bg-[#1A1C24] text-xs text-white px-2 py-2 rounded-xl border border-[#252834]"
                />
                <input
                  type="text"
                  placeholder="Unit (e.g. tbsp, g, fillets)"
                  value={ing.unit}
                  onChange={(e) => handleUpdateIngredient(idx, 'unit', e.target.value)}
                  className="w-20 bg-[#1A1C24] text-xs text-white px-2 py-2 rounded-xl border border-[#252834]"
                />
                <select
                  value={ing.category}
                  onChange={(e) => handleUpdateIngredient(idx, 'category', e.target.value as IngredientCategory)}
                  className="w-24 bg-[#1A1C24] text-xs text-white px-1 py-2 rounded-xl border border-[#252834]"
                >
                  <option value="produce">Produce</option>
                  <option value="meat">Meat</option>
                  <option value="seafood">Seafood</option>
                  <option value="dairy">Dairy</option>
                  <option value="bakery">Bakery</option>
                  <option value="pantry">Pantry</option>
                  <option value="spices">Spices</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(idx)}
                  className="p-2 text-gray-500 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions Builder */}
        <div className="space-y-3 pt-3 border-t border-[#252834]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Cooking Steps</span>
              <span className="text-xs text-[#FF5E3A]">({instructions.length})</span>
            </h3>
            <button
              type="button"
              onClick={handleAddInstruction}
              className="flex items-center gap-1 text-xs font-bold text-[#FF5E3A] hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Step</span>
            </button>
          </div>

          <div className="space-y-3">
            {instructions.map((step, idx) => (
              <div key={idx} className="bg-[#1A1C24] border border-[#252834] rounded-2xl p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#252834] text-[#FF5E3A] text-xs font-mono font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      placeholder="Step Title (e.g. Sauté Garlic)"
                      value={step.title}
                      onChange={(e) => handleUpdateInstruction(idx, 'title', e.target.value)}
                      className="bg-[#161822] text-xs text-white px-3 py-1.5 rounded-lg border border-[#252834] font-bold"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <input
                        type="number"
                        min="1"
                        placeholder="Mins"
                        value={step.durationMinutes || 5}
                        onChange={(e) => handleUpdateInstruction(idx, 'durationMinutes', parseInt(e.target.value) || 1)}
                        className="w-14 bg-[#161822] text-xs text-white px-2 py-1 rounded-lg border border-[#252834]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveInstruction(idx)}
                      className="p-1 text-gray-500 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <textarea
                  rows={2}
                  placeholder="Detailed instructions for this step..."
                  value={step.instruction}
                  onChange={(e) => handleUpdateInstruction(idx, 'instruction', e.target.value)}
                  className="w-full bg-[#161822] text-xs text-gray-300 p-2.5 rounded-xl border border-[#252834]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-[#252834] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-[#1A1C24] hover:bg-[#252834] text-gray-300 text-xs font-bold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-2xl bg-[#FF5E3A] hover:bg-[#FF7043] text-white text-xs font-bold shadow-lg shadow-[#FF5E3A]/30 transition-all active:scale-95"
          >
            Save Recipe
          </button>
        </div>
      </form>
    </div>
  );
};
