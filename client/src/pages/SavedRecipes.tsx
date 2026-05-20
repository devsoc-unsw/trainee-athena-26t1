import { useEffect, useState } from "react";
import { api } from "../api";
import type { Recipe, RecipeListResponse } from "../types";
import { getAccessToken } from "../auth";
import Card from "../components/search-page/CardSaving";

import Filter from "../components/saved-recipes/Filter";
import type { FilterState } from "../components/saved-recipes/Filter";
import "../components/saved-recipes/Filter.css";

const EMPTY_FILTERS: FilterState = {
  maxTime: "",
  vegetarian: false,
  vegan: false,
  glutenFree: false,
  dairyFree: false,
  calories: { min: null, max: null },
  fat: { min: null, max: null },
  protein: { min: null, max: null },
  carbs: { min: null, max: null },
};

// pull nutrients
function getNutrient(recipe: Recipe, name: string): number | null {
  const n = recipe.nutrition?.nutrients?.find(
    (x) => x.name.toLowerCase() === name.toLowerCase()
  );
  return n ? n.amount : null;
}

// true if value is within [min, max]; null bounds mean "no limit".
function inRange(
  value: number | null,
  range: { min: number | null; max: number | null }
): boolean {
  if (range.min === null && range.max === null) return true;
  if (value === null) return false;
  if (range.min !== null && value < range.min) return false;
  if (range.max !== null && value > range.max) return false;
  return true;
}

export default function SavedRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [savedRecipeIds, setSavedRecipeIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applied, setApplied] = useState<FilterState>(EMPTY_FILTERS);

  useEffect(() => {
    async function fetchSaved() {
      try {
        const token = getAccessToken();
        if (!token) {
          setError("Please log in to see your saved recipes.");
          return;
        }

        const allRes = await api.get<RecipeListResponse>("/api/recipes");
        setRecipes(allRes.data.results);

        const savedRes = await api.get("/api/saved-recipes");
        setSavedRecipeIds(savedRes.data.savedRecipeIds ?? []);
      } catch (err) {
        setError("Failed to load saved recipes.");
      } finally {
        setLoading(false);
      }
    }
    fetchSaved();
  }, []);

  const handleToggleSave = async (recipeId: number, isCurrSaved: boolean) => {
    try {
      if (isCurrSaved) {
        const res = await api.delete(`/api/recipes/${recipeId}/save`);
        setSavedRecipeIds(res.data.savedRecipeIds ?? []);
      } else {
        const res = await api.post(`/api/recipes/${recipeId}/save`);
        setSavedRecipeIds(res.data.savedRecipeIds ?? []);
      }
    } catch {
      setError("Couldn't update saved recipes.");
    }
  };

  const hasFilters = Boolean(
    applied.maxTime ||
    applied.vegetarian || applied.vegan || applied.glutenFree || applied.dairyFree ||
    applied.calories.min !== null || applied.calories.max !== null ||
    applied.fat.min !== null || applied.fat.max !== null ||
    applied.protein.min !== null || applied.protein.max !== null ||
    applied.carbs.min !== null || applied.carbs.max !== null
  );

  // Narrow to saved, then apply the filter panel.
  const savedRecipes = recipes.filter((r) => savedRecipeIds.includes(r.id));

  const filtered = savedRecipes.filter((r) => {
    if (applied.maxTime !== "" && r.readyInMinutes > applied.maxTime) return false;
    if (applied.vegetarian && !r.vegetarian) return false;
    if (applied.vegan && !r.vegan) return false;
    if (applied.glutenFree && !r.glutenFree) return false;
    if (applied.dairyFree && !r.dairyFree) return false;
    if (!inRange(getNutrient(r, "Calories"), applied.calories)) return false;
    if (!inRange(getNutrient(r, "Fat"), applied.fat)) return false;
    if (!inRange(getNutrient(r, "Protein"), applied.protein)) return false;
    if (!inRange(getNutrient(r, "Carbohydrates"), applied.carbs)) return false;
    return true;
  });

  if (loading) return <p className="home-status">Loading...</p>;
  if (error) return <p className="home-status">{error}</p>;

  return (
    <div>
      <Filter hasFilters={hasFilters} onApply={setApplied} />

      <div className="recipeGridWrapper">
        {filtered.length === 0 ? (
          <p className="home-status">
            {savedRecipes.length === 0
              ? "You haven't saved any recipes yet."
              : "No saved recipes match your filters."}
          </p>
        ) : (
          <div className="recipe-grid">
            {filtered.map((recipe) => (
              <Card
                key={recipe.id}
                recipe={recipe}
                isSaved={savedRecipeIds.includes(recipe.id)}
                onToggleSave={handleToggleSave}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}