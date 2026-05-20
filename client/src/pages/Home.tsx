import { useEffect, useState } from "react";
import { api } from "../api";
import type { Recipe, RecipeListResponse } from "../types";
import Card from "../components/search-page/CardSaving";
import SearchBar, { DEFAULT_FILTERS } from "../components/search-page/Searchbar";
import type { Filters } from "../types";
import "./Home.css";
import { getAccessToken } from "../auth";
import LoginPopup from "../components/search-page/LoginPopup";

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [savedRecipeIds, setSavedRecipeIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const response = await api.get<RecipeListResponse>("/api/recipes");
        setRecipes(response.data.results);

        const token = getAccessToken();

        if (token) {
          const savedResponse = await api.get("/api/saved-recipes");
          setSavedRecipeIds(savedResponse.data.savedRecipeIds ?? []);
        }
      } catch (err) {
        setError("Failed to load recipes.");
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, []);

  const handleSaveRecipeToggle = async (recipeId: number, isCurrSaved: boolean) => {
    const token = getAccessToken();

    if (!token) {
      setShowLoginPopup(true);
      return;
    }

    try {
      if (isCurrSaved) {
        const res = await api.delete(`/api/recipes/${recipeId}/save`);
        setSavedRecipeIds(res.data.savedRecipeIds ?? []);
      } else {
        const res = await api.post(`/api/recipes/${recipeId}/save`);
        setSavedRecipeIds(res.data.savedRecipeIds ?? []);
      }
    } catch (error) {
      setShowLoginPopup(true);
    }
  };

  if (loading) return <p className="home-status">Loading...</p>;
  if (error) return <p className="home-status">{error}</p>;

  const filteredRecipes = recipes.filter((r) => {
    if (!r.title?.toLowerCase().includes(filters.query.toLowerCase())) return false;
    if (filters.vegetarian && !r.vegetarian) return false;
    if (filters.vegan && !r.vegan) return false;
    if (filters.glutenFree && !r.glutenFree) return false;
    if (filters.dairyFree && !r.dairyFree) return false;
    if (filters.maxMinutes !== null && r.readyInMinutes > filters.maxMinutes) return false;

    const nutrients = r.nutrition?.nutrients ?? [];

    const getNutrient = (name: string) =>
      nutrients.find((n) => n.name.toLowerCase() === name.toLowerCase())?.amount ?? null;

    const calories = getNutrient("Calories");
    const protein = getNutrient("Protein");
    const carbs = getNutrient("Carbohydrates");
    const fat = getNutrient("Fat");

    if (filters.calories.min !== null && (calories === null || calories < filters.calories.min)) return false;
    if (filters.calories.max !== null && (calories === null || calories > filters.calories.max)) return false;
    if (filters.protein.min !== null && (protein === null || protein < filters.protein.min)) return false;
    if (filters.protein.max !== null && (protein === null || protein > filters.protein.max)) return false;
    if (filters.carbs.min !== null && (carbs === null || carbs < filters.carbs.min)) return false;
    if (filters.carbs.max !== null && (carbs === null || carbs > filters.carbs.max)) return false;
    if (filters.fat.min !== null && (fat === null || fat < filters.fat.min)) return false;
    if (filters.fat.max !== null && (fat === null || fat > filters.fat.max)) return false;

    return true;
  });

  return (
    <div className="home">
      <SearchBar filters={filters} onFiltersChange={setFilters} />

      {filteredRecipes.length === 0 ? (
        <p className="home-status">No recipes match your filters.</p>
      ) : (
        <div className="recipe-grid">
          {filteredRecipes.map((recipe) => (
            <Card 
              key={recipe.id} 
              recipe={recipe}
              isSaved={savedRecipeIds.includes(recipe.id)}
              onToggleSave={handleSaveRecipeToggle} 
            />
          ))}
        </div>
      )}

      {showLoginPopup && 
        <LoginPopup 
          setShowLoginPopup={setShowLoginPopup}
          headerMsg={"Log in to save this recipe"}
          bodyMsg={"You need to be logged in before you can save your favourite recipes."}
        />
      }
    </div>
  );
}