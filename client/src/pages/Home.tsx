import { useEffect, useState } from "react";
import { api } from "../api";
import type { Recipe, RecipeListResponse } from "../types";

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    async function fetchRecipes() {
      const response = await api.get<RecipeListResponse>("/api/recipes");
      setRecipes(response.data.results);
    }

    fetchRecipes();
  }, []);

  return (
    // TODO: Super messy right now - turn these into a RecipeCard component!
    <div>
      <h1>MealMatrix</h1>

      {recipes.map((recipe) => (
        <div key={recipe.id}>
          <h2>{recipe.title}</h2>
          <img src={recipe.image} alt={recipe.title} width={200} />

          <p>Ready in: {recipe.readyInMinutes} minutes</p>
          <p>Servings: {recipe.servings}</p>
          <p>Health score: {recipe.healthScore}</p>

          <h3>Nutrients</h3>
          {recipe.nutrition.nutrients.map((nutrient) => (
            <p key={nutrient.name}>
              {nutrient.name}: {nutrient.amount} {nutrient.unit}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}