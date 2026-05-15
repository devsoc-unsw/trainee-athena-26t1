export type Ingredient = {
  id: number;
  name: string;
  amount: number;
  unit: string;
};

export type Nutrient = {
  name: string;
  amount: number;
  unit: string;
  percentOfDailyNeeds?: number;
};

export type Recipe = {
  id: number;
  image: string;
  title: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;

  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;

  preparationMinutes: number | null;
  cookingMinutes: number | null;
  healthScore: number;

  ingredients: Ingredient[];

  nutrition: {
    nutrients: Nutrient[];
  };

  summary: string;
  cuisines: string[];
  dishTypes: string[];
  diets: string[];
  instructions: string;
};

export type RecipeListResponse = {
  results: Recipe[];
};