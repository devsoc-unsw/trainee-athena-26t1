import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Recipe } from "../types";
import { api } from "../api";


import "../components/saved-recipes/Filter.css"
import "../components/saved-recipes/RecipeGrid.css"
import "../components/saved-recipes/RecipeCard.css"
import Filter from "../components/saved-recipes/Filter";
import type { FilterState } from "../components/saved-recipes/Filter";
// all the fields tracked by our filter


export default function SavedRecipes() {
  // filter tracking
  const [applied, setApplied] = useState<FilterState>({
  maxTime: "",
  vegetarian: false,
  vegan: false,
  glutenFree: false,
  dairyFree: false,
  calories: { min: null, max: null },
  fat: { min: null, max: null },
  protein: { min: null, max: null },
  carbs: { min: null, max: null },
  });

  const hasFilters = Boolean(
    applied.maxTime ||
    applied.vegetarian ||
    applied.vegan ||
    applied.glutenFree ||
    applied.dairyFree ||
    applied.calories.min !== null || applied.calories.max !== null ||
    applied.fat.min !== null || applied.fat.max !== null ||
    applied.protein.min !== null || applied.protein.max !== null ||
    applied.carbs.min !== null || applied.carbs.max !== null
  );

  const filtered = RECIPES.filter((r) => {
    // Time
    if (applied.maxTime !== "" && r.readyInMinutes > applied.maxTime) return false;

    // Diet booleans — only constrain when the box is checked
    if (applied.vegetarian && !r.vegetarian) return false;
    if (applied.vegan && !r.vegan) return false;
    if (applied.glutenFree && !r.glutenFree) return false;
    if (applied.dairyFree && !r.dairyFree) return false;

    // Macro ranges
    if (!inRange(getNutrient(r, "Calories"), applied.calories)) return false;
    if (!inRange(getNutrient(r, "Fat"), applied.fat)) return false;
    if (!inRange(getNutrient(r, "Protein"), applied.protein)) return false;
    if (!inRange(getNutrient(r, "Carbohydrates"), applied.carbs)) return false;

    return true;
  });

  return (
    <div>
         
      <Filter 
        hasFilters = {hasFilters}
        onApply = {setApplied} 

        /> 

      {/* <div className="resultsInfo">
        {filtered.length} recipe{filtered.length !== 1 ? "s" : ""} saved
        {hasFilters && <span className="filterTag"> · filtered</span>}
      </div> */}
      <div className="recipeGridWrapper">
        <RecipeGrid recipes={filtered} />
      </div>
      
    </div>

    
  );
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <div className="card">
      <img src={recipe.image} alt={recipe.title} className="cardImg" />
      <p className="cardTitle">{recipe.title}</p>
      <p className="cardCaption">{recipe.readyInMinutes} min · {recipe.dishTypes[0]}</p>
    </div>
  );
}


type RecipeGridProps = {
  recipes: Recipe[];
  lastRecipeRef?: (node: HTMLDivElement | null) => void;
};

function RecipeGrid({ recipes, lastRecipeRef }: RecipeGridProps) {
  return (
    <div className="recipeGrid">
      {recipes.map((r, index) => {
        const isLast = index === recipes.length - 1;
        return (
          <div ref={isLast ? lastRecipeRef : undefined} key={r.id}>
            <RecipeCard recipe={r} />
          </div>
        );
      })}
    </div>
  );
}

// helpers

// fetches macros
function getNutrient(recipe: Recipe, name: string): number | null {
  const n = recipe.nutrition.nutrients.find(
    (x) => x.name.toLowerCase() === name.toLowerCase()
  );
  return n ? n.amount : null;
}

// calc for range filter
function inRange(
  value: number | null,
  range: { min: number | null; max: number | null }
): boolean {
  if (range.min === null && range.max === null) return true; // no filter set
  if (value === null) return false; // filter set but recipe has no data
  if (range.min !== null && value < range.min) return false;
  if (range.max !== null && value > range.max) return false;
  return true;
}

// test consts (hardcoded asf)


const RECIPES: Recipe[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&q=80",
    title: "Chicken Stew",
    readyInMinutes: 30,
    servings: 4,
    sourceUrl: "https://example.com/chicken-stew",
    vegetarian: false,
    vegan: false,
    glutenFree: true,
    dairyFree: true,
    preparationMinutes: 10,
    cookingMinutes: 20,
    healthScore: 72,
    ingredients: [
      { id: 1, name: "Chicken Breast", amount: 500, unit: "g" },
      { id: 2, name: "Tomatoes", amount: 3, unit: "whole" },
      { id: 3, name: "Onion", amount: 1, unit: "whole" },
    ],
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 320, unit: "kcal", percentOfDailyNeeds: 16 },
        { name: "Protein", amount: 38, unit: "g", percentOfDailyNeeds: 76 },
        { name: "Fat", amount: 9, unit: "g", percentOfDailyNeeds: 14 },
        { name: "Carbohydrates", amount: 18, unit: "g", percentOfDailyNeeds: 6 },
      ],
    },
    summary: "A hearty chicken and vegetable stew perfect for cold nights.",
    cuisines: ["American"],
    dishTypes: ["main course", "dinner"],
    diets: ["gluten free", "dairy free"],
    instructions: "1. Dice chicken. 2. Sauté onion. 3. Add tomatoes and chicken. 4. Simmer 20 mins.",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80",
    title: "Pasta Primavera",
    readyInMinutes: 20,
    servings: 2,
    sourceUrl: "https://example.com/pasta-primavera",
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    preparationMinutes: 5,
    cookingMinutes: 15,
    healthScore: 65,
    ingredients: [
      { id: 4, name: "Pasta", amount: 200, unit: "g" },
      { id: 5, name: "Zucchini", amount: 1, unit: "whole" },
      { id: 6, name: "Parmesan", amount: 50, unit: "g" },
    ],
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 480, unit: "kcal", percentOfDailyNeeds: 24 },
        { name: "Protein", amount: 16, unit: "g", percentOfDailyNeeds: 32 },
        { name: "Fat", amount: 12, unit: "g", percentOfDailyNeeds: 18 },
        { name: "Carbohydrates", amount: 74, unit: "g", percentOfDailyNeeds: 25 },
      ],
    },
    summary: "Fresh veggies tossed with al dente pasta and parmesan.",
    cuisines: ["Italian"],
    dishTypes: ["main course", "lunch"],
    diets: ["vegetarian"],
    instructions: "1. Boil pasta. 2. Sauté veggies. 3. Toss together with parmesan.",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
    title: "Greek Salad",
    readyInMinutes: 10,
    servings: 2,
    sourceUrl: "https://example.com/greek-salad",
    vegetarian: true,
    vegan: false,
    glutenFree: true,
    dairyFree: false,
    preparationMinutes: 10,
    cookingMinutes: 0,
    healthScore: 88,
    ingredients: [
      { id: 7, name: "Cucumber", amount: 1, unit: "whole" },
      { id: 8, name: "Feta Cheese", amount: 100, unit: "g" },
      { id: 9, name: "Olives", amount: 50, unit: "g" },
    ],
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 210, unit: "kcal", percentOfDailyNeeds: 10 },
        { name: "Protein", amount: 8, unit: "g", percentOfDailyNeeds: 16 },
        { name: "Fat", amount: 14, unit: "g", percentOfDailyNeeds: 22 },
        { name: "Carbohydrates", amount: 12, unit: "g", percentOfDailyNeeds: 4 },
      ],
    },
    summary: "Classic Mediterranean salad with feta and olives.",
    cuisines: ["Greek", "Mediterranean"],
    dishTypes: ["salad", "lunch"],
    diets: ["vegetarian", "gluten free"],
    instructions: "1. Chop vegetables. 2. Add feta and olives. 3. Drizzle with olive oil.",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&q=80",
    title: "Mushroom Risotto",
    readyInMinutes: 45,
    servings: 4,
    sourceUrl: "https://example.com/mushroom-risotto",
    vegetarian: true,
    vegan: false,
    glutenFree: true,
    dairyFree: false,
    preparationMinutes: 10,
    cookingMinutes: 35,
    healthScore: 70,
    ingredients: [
      { id: 10, name: "Arborio Rice", amount: 300, unit: "g" },
      { id: 11, name: "Mushrooms", amount: 200, unit: "g" },
      { id: 12, name: "Parmesan", amount: 60, unit: "g" },
    ],
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 420, unit: "kcal", percentOfDailyNeeds: 21 },
        { name: "Protein", amount: 12, unit: "g", percentOfDailyNeeds: 24 },
        { name: "Fat", amount: 11, unit: "g", percentOfDailyNeeds: 17 },
        { name: "Carbohydrates", amount: 68, unit: "g", percentOfDailyNeeds: 23 },
      ],
    },
    summary: "Creamy Arborio rice with wild mushrooms and parmesan.",
    cuisines: ["Italian"],
    dishTypes: ["main course", "dinner"],
    diets: ["vegetarian", "gluten free"],
    instructions: "1. Sauté mushrooms. 2. Toast rice. 3. Add stock gradually. 4. Stir in parmesan.",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=400&q=80",
    title: "Avocado Toast",
    readyInMinutes: 10,
    servings: 1,
    sourceUrl: "https://example.com/avocado-toast",
    vegetarian: true,
    vegan: true,
    glutenFree: false,
    dairyFree: true,
    preparationMinutes: 5,
    cookingMinutes: 5,
    healthScore: 82,
    ingredients: [
      { id: 13, name: "Sourdough Bread", amount: 2, unit: "slices" },
      { id: 14, name: "Avocado", amount: 1, unit: "whole" },
      { id: 15, name: "Chilli Flakes", amount: 1, unit: "tsp" },
    ],
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 290, unit: "kcal", percentOfDailyNeeds: 14 },
        { name: "Protein", amount: 7, unit: "g", percentOfDailyNeeds: 14 },
        { name: "Fat", amount: 18, unit: "g", percentOfDailyNeeds: 28 },
        { name: "Carbohydrates", amount: 28, unit: "g", percentOfDailyNeeds: 9 },
      ],
    },
    summary: "Sourdough topped with smashed avocado and chilli flakes.",
    cuisines: [],
    dishTypes: ["breakfast", "brunch"],
    diets: ["vegan", "dairy free"],
    instructions: "1. Toast bread. 2. Smash avocado. 3. Spread and season.",
  },
];