/**
 * Cooking & Nutrition concept synonyms.
 *
 * Maps canonical cooking/nutrition concepts to alternative terms.
 *
 * @remarks
 * [MINED-2026-01-16] Extracted from cooking-nutrition bulk data (primary + secondary)
 * and domain knowledge. Key gap identified: queries for "nutrition" weren't finding
 * lessons about "nutrients" because no synonym mapping existed.
 */

export const cookingNutritionSynonyms = {
  // ═══════════════════════════════════════════════════════════════════════════
  // NUTRITION CONCEPTS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Core nutrition term - the key gap causing search issues. */
  nutrition: ['nutrients', 'nutritional', 'nutritious', 'nourishment', 'dietary intake'],
  nutrients: ['nutrition', 'nutritional value', 'food nutrients', 'dietary nutrients'],
  macronutrients: [
    'macros',
    'carbohydrates',
    'proteins',
    'fats',
    'carbs protein fat',
    'energy nutrients',
  ],
  micronutrients: ['vitamins', 'minerals', 'vitamins and minerals', 'trace elements'],

  // ═══════════════════════════════════════════════════════════════════════════
  // HEALTHY EATING FRAMEWORKS
  // ═══════════════════════════════════════════════════════════════════════════

  /** The Eatwell Guide - UK's healthy eating framework. */
  'eatwell-guide': [
    'eatwell',
    'eat well guide',
    'eatwell plate',
    'balanced plate',
    'food plate model',
    'healthy plate',
  ],
  'healthy-eating': [
    'healthy diet',
    'balanced diet',
    'good nutrition',
    'eating well',
    'nutritious eating',
    'healthy food choices',
  ],
  'balanced-diet': [
    'healthy diet',
    'varied diet',
    'balanced eating',
    'dietary balance',
    'food balance',
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // DIETARY NEEDS AND HEALTH
  // ═══════════════════════════════════════════════════════════════════════════

  'dietary-needs': [
    'nutritional needs',
    'nutritional requirements',
    'dietary requirements',
    'food requirements',
  ],
  'dietary-conditions': [
    'food allergies',
    'food intolerances',
    'special diets',
    'medical diets',
    'restricted diets',
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // FOOD SOURCES AND SUSTAINABILITY
  // ═══════════════════════════════════════════════════════════════════════════

  'food-origins': [
    'where food comes from',
    'food sources',
    'farm to fork',
    'food provenance',
    'food production',
  ],
  'sustainable-diet': [
    'sustainable eating',
    'plant-rich diet',
    'plant-based eating',
    'eco-friendly eating',
    'environmental diet',
  ],
  'seasonal-food': [
    'seasonal eating',
    'seasonal ingredients',
    'seasonal produce',
    'eating seasonally',
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // COOKING TECHNIQUES
  // ═══════════════════════════════════════════════════════════════════════════

  'cold-preparation': [
    'cooking without heat',
    'no-cook recipes',
    'raw preparation',
    'salad making',
    'cold food preparation',
  ],
  baking: ['baked goods', 'pastry making', 'bread making', 'cakes and biscuits'],
  'cooking-techniques': [
    'cooking methods',
    'cooking skills',
    'food preparation',
    'culinary techniques',
    'kitchen skills',
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // MEAL PLANNING
  // ═══════════════════════════════════════════════════════════════════════════

  'meal-planning': ['planning meals', 'meal preparation', 'menu planning', 'weekly meals'],
  snacks: ['healthy snacks', 'snack foods', 'light bites', 'snack swaps'],
  breakfast: ['morning meal', 'breakfast foods', 'breakfast recipes'],
  lunch: ['midday meal', 'lunch foods', 'packed lunch', 'lunch recipes'],

  // ═══════════════════════════════════════════════════════════════════════════
  // FOOD SAFETY
  // ═══════════════════════════════════════════════════════════════════════════

  'food-safety': [
    'food hygiene',
    'safe food handling',
    'food storage',
    'kitchen hygiene',
    'food preparation safety',
  ],
  'food-labels': [
    'food labelling',
    'nutrition labels',
    'food packaging',
    'nutritional information',
    'ingredient lists',
  ],

  // ═══════════════════════════════════════════════════════════════════════════
  // GLOBAL CUISINE
  // ═══════════════════════════════════════════════════════════════════════════

  'global-cuisine': [
    'world food',
    'international food',
    'food from around the world',
    'multicultural food',
    'diverse cuisine',
  ],
  'food-culture': [
    'food traditions',
    'culinary traditions',
    'food customs',
    'cultural food',
    'food heritage',
  ],
} as const;

export type CookingNutritionSynonyms = typeof cookingNutritionSynonyms;
