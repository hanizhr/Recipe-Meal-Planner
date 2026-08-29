export interface FlutterSnippet {
  id: string;
  title: string;
  filename: string;
  description: string;
  category: 'Setup' | 'Database' | 'Models' | 'Screens' | 'State';
  code: string;
}

export const FLUTTER_SNIPPETS: FlutterSnippet[] = [
  {
    id: 'pubspec',
    title: 'Dependencies & Setup (100% Free)',
    filename: 'pubspec.yaml',
    description: 'Free Flutter packages for local SQLite database, animations, cached images, and icons.',
    category: 'Setup',
    code: `name: culinary_hub
description: "A sleek recipe and meal planner app in Flutter."
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  # Free Local SQLite Database
  sqflite: ^2.3.0
  path_provider: ^2.1.1
  path: ^1.8.3

  # State Management & Utilities
  provider: ^6.1.1
  google_fonts: ^6.1.0
  cached_network_image: ^3.3.0
  flutter_animate: ^4.5.0
  lucide_icons: ^0.257.0
  intl: ^0.19.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
`
  },
  {
    id: 'database_helper',
    title: 'Free SQLite Database Helper (CRUD Engine)',
    filename: 'lib/services/database_helper.dart',
    description: 'Complete SQLite database manager with tables for recipes, meal plans, and grocery shopping list with full CRUD methods.',
    category: 'Database',
    code: `import 'dart:async';
import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';
import '../models/recipe_model.dart';
import '../models/meal_plan_model.dart';
import '../models/grocery_item_model.dart';

class DatabaseHelper {
  static final DatabaseHelper instance = DatabaseHelper._init();
  static Database? _database;

  DatabaseHelper._init();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDB('culinary_hub.db');
    return _database!;
  }

  Future<Database> _initDB(String filePath) async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, filePath);

    return await openDatabase(
      path,
      version: 1,
      onCreate: _createDB,
    );
  }

  Future _createDB(Database db, int version) async {
    // Recipes Table
    await db.execute('''
      CREATE TABLE recipes (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        subtitle TEXT,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        prep_time INTEGER NOT NULL,
        cook_time INTEGER NOT NULL,
        servings INTEGER NOT NULL,
        difficulty TEXT NOT NULL,
        calories INTEGER NOT NULL,
        rating REAL NOT NULL,
        hero_image TEXT NOT NULL,
        is_favorite INTEGER NOT NULL DEFAULT 0,
        chef_name TEXT,
        chef_title TEXT,
        chef_avatar TEXT,
        ingredients_json TEXT NOT NULL,
        instructions_json TEXT NOT NULL
      )
    ''');

    // Meal Planner Table
    await db.execute('''
      CREATE TABLE meal_plans (
        id TEXT PRIMARY KEY,
        day TEXT NOT NULL,
        slot TEXT NOT NULL,
        recipe_id TEXT NOT NULL,
        servings INTEGER NOT NULL,
        notes TEXT,
        FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE
      )
    ''');

    // Grocery List Table
    await db.execute('''
      CREATE TABLE grocery_items (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        amount REAL NOT NULL,
        unit TEXT NOT NULL,
        category TEXT NOT NULL,
        is_completed INTEGER NOT NULL DEFAULT 0,
        recipe_source TEXT
      )
    ''');
  }

  // --- Recipe CRUD ---
  Future<List<Recipe>> getAllRecipes() async {
    final db = await instance.database;
    final result = await db.query('recipes');
    return result.map((json) => Recipe.fromMap(json)).toList();
  }

  Future<int> insertRecipe(Recipe recipe) async {
    final db = await instance.database;
    return await db.insert('recipes', recipe.toMap(),
        conflictAlgorithm: ConflictAlgorithm.replace);
  }

  Future<int> toggleFavorite(String recipeId, bool isFavorite) async {
    final db = await instance.database;
    return await db.update(
      'recipes',
      {'is_favorite': isFavorite ? 1 : 0},
      where: 'id = ?',
      whereArgs: [recipeId],
    );
  }

  // --- Meal Plan CRUD ---
  Future<List<MealPlanEntry>> getWeeklyMealPlan() async {
    final db = await instance.database;
    final result = await db.query('meal_plans');
    return result.map((json) => MealPlanEntry.fromMap(json)).toList();
  }

  Future<int> insertMealPlanEntry(MealPlanEntry entry) async {
    final db = await instance.database;
    return await db.insert('meal_plans', entry.toMap(),
        conflictAlgorithm: ConflictAlgorithm.replace);
  }

  Future<int> deleteMealPlanEntry(String id) async {
    final db = await instance.database;
    return await db.delete('meal_plans', where: 'id = ?', whereArgs: [id]);
  }

  // --- Grocery List CRUD ---
  Future<List<GroceryItem>> getGroceryItems() async {
    final db = await instance.database;
    final result = await db.query('grocery_items');
    return result.map((json) => GroceryItem.fromMap(json)).toList();
  }

  Future<int> insertGroceryItem(GroceryItem item) async {
    final db = await instance.database;
    return await db.insert('grocery_items', item.toMap(),
        conflictAlgorithm: ConflictAlgorithm.replace);
  }

  Future<int> toggleGroceryItem(String id, bool isCompleted) async {
    final db = await instance.database;
    return await db.update(
      'grocery_items',
      {'is_completed': isCompleted ? 1 : 0},
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  Future<int> clearCompletedGroceryItems() async {
    final db = await instance.database;
    return await db.delete('grocery_items', where: 'is_completed = ?', whereArgs: [1]);
  }
}
`
  },
  {
    id: 'recipe_model',
    title: 'Recipe & Ingredient Data Models',
    filename: 'lib/models/recipe_model.dart',
    description: 'Dart models with JSON serialization and SQLite mapping.',
    category: 'Models',
    code: `import 'dart:convert';

class Ingredient {
  final String id;
  final String name;
  final double amount;
  final String unit;
  final String category;

  Ingredient({
    required this.id,
    required this.name,
    required this.amount,
    required this.unit,
    required this.category,
  });

  Map<String, dynamic> toMap() => {
    'id': id,
    'name': name,
    'amount': amount,
    'unit': unit,
    'category': category,
  };

  factory Ingredient.fromMap(Map<String, dynamic> map) => Ingredient(
    id: map['id'],
    name: map['name'],
    amount: (map['amount'] as num).toDouble(),
    unit: map['unit'],
    category: map['category'] ?? 'other',
  );
}

class CookingStep {
  final int stepNumber;
  final String title;
  final String instruction;
  final int? durationMinutes;

  CookingStep({
    required this.stepNumber,
    required this.title,
    required this.instruction,
    this.durationMinutes,
  });

  Map<String, dynamic> toMap() => {
    'stepNumber': stepNumber,
    'title': title,
    'instruction': instruction,
    'durationMinutes': durationMinutes,
  };

  factory CookingStep.fromMap(Map<String, dynamic> map) => CookingStep(
    stepNumber: map['stepNumber'],
    title: map['title'],
    instruction: map['instruction'],
    durationMinutes: map['durationMinutes'],
  );
}

class Recipe {
  final String id;
  final String title;
  final String? subtitle;
  final String description;
  final String category;
  final int prepTime;
  final int cookTime;
  final int servings;
  final String difficulty;
  final int calories;
  final double rating;
  final String heroImage;
  bool isFavorite;
  final String? chefName;
  final String? chefTitle;
  final String? chefAvatar;
  final List<Ingredient> ingredients;
  final List<CookingStep> instructions;

  Recipe({
    required this.id,
    required this.title,
    this.subtitle,
    required this.description,
    required this.category,
    required this.prepTime,
    required this.cookTime,
    required this.servings,
    required this.difficulty,
    required this.calories,
    required this.rating,
    required this.heroImage,
    this.isFavorite = false,
    this.chefName,
    this.chefTitle,
    this.chefAvatar,
    required this.ingredients,
    required this.instructions,
  });

  Map<String, dynamic> toMap() => {
    'id': id,
    'title': title,
    'subtitle': subtitle,
    'description': description,
    'category': category,
    'prep_time': prepTime,
    'cook_time': cookTime,
    'servings': servings,
    'difficulty': difficulty,
    'calories': calories,
    'rating': rating,
    'hero_image': heroImage,
    'is_favorite': isFavorite ? 1 : 0,
    'chef_name': chefName,
    'chef_title': chefTitle,
    'chef_avatar': chefAvatar,
    'ingredients_json': jsonEncode(ingredients.map((i) => i.toMap()).toList()),
    'instructions_json': jsonEncode(instructions.map((i) => i.toMap()).toList()),
  };

  factory Recipe.fromMap(Map<String, dynamic> map) => Recipe(
    id: map['id'],
    title: map['title'],
    subtitle: map['subtitle'],
    description: map['description'],
    category: map['category'],
    prepTime: map['prep_time'],
    cookTime: map['cook_time'],
    servings: map['servings'],
    difficulty: map['difficulty'],
    calories: map['calories'],
    rating: (map['rating'] as num).toDouble(),
    heroImage: map['hero_image'],
    isFavorite: map['is_favorite'] == 1,
    chefName: map['chef_name'],
    chefTitle: map['chef_title'],
    chefAvatar: map['chef_avatar'],
    ingredients: (jsonDecode(map['ingredients_json']) as List)
        .map((i) => Ingredient.fromMap(i))
        .toList(),
    instructions: (jsonDecode(map['instructions_json']) as List)
        .map((i) => CookingStep.fromMap(i))
        .toList(),
  );
}
`
  },
  {
    id: 'main_theme',
    title: 'Flutter App Entry & Dark Luxury Theme',
    filename: 'lib/main.dart',
    description: 'Material 3 theme configuration matching the exact dark UI with warm coral accents.',
    category: 'Setup',
    code: `import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'screens/home_screen.dart';
import 'screens/meal_planner_screen.dart';
import 'providers/recipe_provider.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => RecipeProvider()..loadData()),
      ],
      child: const CulinaryHubApp(),
    ),
  );
}

class CulinaryHubApp extends StatelessWidget {
  const CulinaryHubApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'CulinaryHub',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF0F1015),
        primaryColor: const Color(0xFFFF5E3A),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFFFF5E3A),
          secondary: Color(0xFFFF7043),
          surface: Color(0xFF1A1C24),
          surfaceContainerHighest: Color(0xFF252834),
        ),
        textTheme: GoogleFonts.plusJakartaSansTextTheme(
          ThemeData(brightness: Brightness.dark).textTheme,
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF0F1015),
          elevation: 0,
        ),
      ),
      home: const MainNavigationScreen(),
    );
  }
}
`
  },
  {
    id: 'meal_planner_code',
    title: 'Meal Planner Flutter Screen',
    filename: 'lib/screens/meal_planner_screen.dart',
    description: '7-Day interactive schedule with breakfast, lunch, dinner slots and smart grocery generator.',
    category: 'Screens',
    code: `import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import '../providers/recipe_provider.dart';

class MealPlannerScreen extends StatefulWidget {
  const MealPlannerScreen({super.key});

  @override
  State<MealPlannerScreen> createState() => _MealPlannerScreenState();
}

class _MealPlannerScreenState extends State<MealPlannerScreen> {
  final List<String> _days = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];
  String _selectedDay = 'Monday';

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<RecipeProvider>();
    final dayPlans = provider.getPlansForDay(_selectedDay);

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Weekly Meal Planner',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.shoppingBag, color: Color(0xFFFF5E3A)),
            tooltip: 'Sync with Grocery List',
            onPressed: () {
              provider.generateGroceryFromPlan();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Grocery list updated from meal plan!')),
              );
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Horizontal Day Selector
          SizedBox(
            height: 60,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _days.length,
              itemBuilder: (context, index) {
                final day = _days[index];
                final isSelected = day == _selectedDay;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ChoiceChip(
                    label: Text(day.substring(0, 3)),
                    selected: isSelected,
                    selectedColor: const Color(0xFFFF5E3A),
                    backgroundColor: const Color(0xFF1E2029),
                    labelStyle: TextStyle(
                      color: isSelected ? Colors.white : Colors.grey[400],
                      fontWeight: FontWeight.bold,
                    ),
                    onSelected: (_) => setState(() => _selectedDay = day),
                  ),
                );
              },
            ),
          ),
          // Slots: Breakfast, Lunch, Dinner, Snack
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                _buildMealSlotCard('breakfast', 'Breakfast', LucideIcons.sunrise, dayPlans, provider),
                _buildMealSlotCard('lunch', 'Lunch', LucideIcons.sun, dayPlans, provider),
                _buildMealSlotCard('dinner', 'Dinner', LucideIcons.moon, dayPlans, provider),
                _buildMealSlotCard('snack', 'Snacks & Drinks', LucideIcons.coffee, dayPlans, provider),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMealSlotCard(String slot, String title, IconData icon, List plans, RecipeProvider provider) {
    final entry = plans.firstWhere((p) => p.slot == slot, orElse: () => null);

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1A1C24),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF252834)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 18, color: const Color(0xFFFF5E3A)),
              const SizedBox(width: 8),
              Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              const Spacer(),
              if (entry == null)
                TextButton.icon(
                  icon: const Icon(LucideIcons.plus, size: 16),
                  label: const Text('Add Meal'),
                  onPressed: () => _showRecipePicker(slot),
                ),
            ],
          ),
          if (entry != null) ...[
            const SizedBox(height: 12),
            Text(entry.recipeTitle, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600)),
            const SizedBox(height: 4),
            Text('\${entry.servings} servings • \${entry.calories} kcal', style: TextStyle(color: Colors.grey[400], fontSize: 13)),
          ],
        ],
      ),
    );
  }

  void _showRecipePicker(String slot) {
    // Show modal bottom sheet to pick recipe
  }
}
`
  }
];
