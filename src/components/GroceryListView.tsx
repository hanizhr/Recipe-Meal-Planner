import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Check, 
  Trash2, 
  Share2, 
  Copy, 
  CheckCheck, 
  Sparkles, 
  Apple, 
  Fish, 
  Milk, 
  Package, 
  Wheat, 
  Flame 
} from 'lucide-react';
import { GroceryItem, IngredientCategory } from '../types';

interface GroceryListViewProps {
  groceryItems: GroceryItem[];
  onToggleItem: (id: string) => void;
  onAddItem: (name: string, amount: number, unit: string, category: IngredientCategory) => void;
  onClearCompleted: () => void;
  onClearAll: () => void;
}

const CATEGORY_ICONS: Record<IngredientCategory, React.ComponentType<{ className?: string }>> = {
  produce: Apple,
  seafood: Fish,
  meat: Flame,
  dairy: Milk,
  pantry: Package,
  bakery: Wheat,
  spices: Flame,
  other: Package,
};

export const GroceryListView: React.FC<GroceryListViewProps> = ({
  groceryItems,
  onToggleItem,
  onAddItem,
  onClearCompleted,
  onClearAll,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customAmount, setCustomAmount] = useState('1');
  const [customUnit, setCustomUnit] = useState('unit');
  const [customCategory, setCustomCategory] = useState<IngredientCategory>('produce');
  const [copyFeedback, setCopyFeedback] = useState(false);

  const completedCount = groceryItems.filter(i => i.isCompleted).length;
  const totalCount = groceryItems.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Group items by category
  const categories: IngredientCategory[] = ['produce', 'seafood', 'meat', 'dairy', 'bakery', 'pantry', 'spices', 'other'];
  const groupedItems = categories.map(cat => ({
    category: cat,
    items: groceryItems.filter(item => item.category === cat),
  })).filter(group => group.items.length > 0);

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    onAddItem(customName.trim(), parseFloat(customAmount) || 1, customUnit.trim() || 'unit', customCategory);
    setCustomName('');
    setCustomAmount('1');
    setShowAddModal(false);
  };

  const handleCopyFormattedList = () => {
    const lines = ['🛒 CulinaryHub Grocery List:\n'];
    groupedItems.forEach(group => {
      lines.push(`\n📌 ${group.category.toUpperCase()}:`);
      group.items.forEach(item => {
        lines.push(` ${item.isCompleted ? '✓' : '☐'} ${item.name} (${item.amount} ${item.unit})`);
      });
    });
    navigator.clipboard.writeText(lines.join('\n'));
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2200);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#1A1C24] to-[#252834] border border-[#2F3342] rounded-3xl p-5 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FF5E3A]/20 text-[#FF5E3A] border border-[#FF5E3A]/30">
              Smart Shopping Cart
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Grocery Checklist
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {completedCount} of {totalCount} items checked off ({progressPercent}%).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="add-custom-grocery-btn"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#FF5E3A] hover:bg-[#FF7043] text-white text-xs font-bold shadow-lg shadow-[#FF5E3A]/30 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>

          {totalCount > 0 && (
            <>
              <button
                id="copy-grocery-list-btn"
                onClick={handleCopyFormattedList}
                className="p-2.5 rounded-2xl bg-[#161822] hover:bg-[#252834] text-gray-300 hover:text-white border border-[#2F3342] transition-colors"
                title="Copy formatted list for WhatsApp / Messages"
              >
                {copyFeedback ? <CheckCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>

              {completedCount > 0 && (
                <button
                  id="clear-completed-grocery-btn"
                  onClick={onClearCompleted}
                  className="p-2.5 rounded-2xl bg-[#161822] hover:bg-amber-500/20 text-gray-300 hover:text-amber-400 border border-[#2F3342] transition-colors"
                  title="Clear bought items"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Copy Toast */}
      {copyFeedback && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-4 py-2 rounded-2xl text-xs font-bold text-center animate-fade-in">
          Shopping list copied to clipboard! Ready to paste into SMS or WhatsApp.
        </div>
      )}

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="w-full h-2 bg-[#1A1C24] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#FF5E3A] rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* Grouped Category Lists */}
      {groupedItems.length > 0 ? (
        <div className="space-y-4 sm:space-y-5">
          {groupedItems.map(group => {
            const Icon = CATEGORY_ICONS[group.category] || Package;
            return (
              <div
                key={group.category}
                className="bg-[#1A1C24] border border-[#252834] rounded-3xl p-3.5 sm:p-5 space-y-3"
              >
                <div className="flex items-center gap-2 pb-2 border-b border-[#252834]">
                  <div className="w-7 h-7 rounded-lg bg-[#252834] text-[#FF5E3A] flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    {group.category} ({group.items.length})
                  </h3>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  {group.items.map(item => (
                    <div
                      key={item.id}
                      onClick={() => onToggleItem(item.id)}
                      className={`flex items-center justify-between p-2.5 sm:p-3 rounded-2xl cursor-pointer transition-all min-h-[46px] touch-manipulation active:scale-[0.99] ${
                        item.isCompleted
                          ? 'bg-black/30 text-gray-500 line-through'
                          : 'bg-[#161822] hover:bg-[#1E202B] text-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors shrink-0 ${
                            item.isCompleted
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-[#2F3342] bg-[#1A1C24]'
                          }`}
                        >
                          {item.isCompleted && <Check className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs sm:text-sm font-semibold truncate block">{item.name}</span>
                          {item.recipeSource && (
                            <span className="text-[10px] text-gray-500 block truncate">
                              From: {item.recipeSource}
                            </span>
                          )}
                        </div>
                      </div>

                      <span className="text-xs font-mono font-bold text-[#FF5E3A] shrink-0 ml-2">
                        {item.amount} {item.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 sm:py-16 bg-[#161822] border border-[#252834] rounded-3xl p-6 sm:p-8 space-y-3">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#FF5E3A]/20 text-[#FF5E3A] flex items-center justify-center mx-auto">
            <ShoppingCart className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white">Your Shopping List is Empty</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Add ingredients from any recipe, click "Smart Grocery Sync" in the Meal Planner, or tap the button below to add custom items.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#FF5E3A] text-white text-xs font-bold shadow-md shadow-[#FF5E3A]/30 mt-2 touch-manipulation active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Ingredient</span>
          </button>
        </div>
      )}

      {/* Add Custom Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <form
            onSubmit={handleCreateItem}
            className="bg-[#1A1C24] border border-[#252834] rounded-t-[32px] sm:rounded-3xl p-5 sm:p-6 max-w-sm w-full space-y-4 shadow-2xl pb-[max(1.5rem,env(safe-area-inset-bottom,1.5rem))]"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#252834]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#FF5E3A]" />
                Add Grocery Item
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-[#252834] text-gray-400 hover:text-white flex items-center justify-center touch-manipulation"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-xs text-gray-400 font-semibold mb-1 block">Item Name</label>
              <input
                type="text"
                required
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Organic Avocados"
                className="w-full bg-[#161822] text-sm text-white px-4 py-3 rounded-xl border border-[#252834] focus:outline-none focus:border-[#FF5E3A]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-400 font-semibold mb-1 block">Quantity</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  required
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full bg-[#161822] text-sm text-white px-4 py-3 rounded-xl border border-[#252834] focus:outline-none focus:border-[#FF5E3A]"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 font-semibold mb-1 block">Unit</label>
                <input
                  type="text"
                  value={customUnit}
                  onChange={(e) => setCustomUnit(e.target.value)}
                  placeholder="e.g. lbs, count"
                  className="w-full bg-[#161822] text-sm text-white px-4 py-3 rounded-xl border border-[#252834] focus:outline-none focus:border-[#FF5E3A]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 font-semibold mb-1 block">Category</label>
              <select
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value as IngredientCategory)}
                className="w-full bg-[#161822] text-sm text-white px-4 py-3 rounded-xl border border-[#252834] focus:outline-none focus:border-[#FF5E3A]"
              >
                <option value="produce">Produce (Fruits & Veggies)</option>
                <option value="meat">Meat & Poultry</option>
                <option value="seafood">Seafood</option>
                <option value="dairy">Dairy & Eggs</option>
                <option value="bakery">Bakery & Grains</option>
                <option value="pantry">Pantry & Cans</option>
                <option value="spices">Spices & Oils</option>
                <option value="other">Other Items</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#FF5E3A] hover:bg-[#FF7043] text-white font-bold text-sm shadow-md shadow-[#FF5E3A]/30 transition-transform active:scale-95 mt-2 touch-manipulation"
            >
              Add to Grocery List
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
