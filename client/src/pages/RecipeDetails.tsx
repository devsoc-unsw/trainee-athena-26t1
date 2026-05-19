import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Recipe } from "../types";
import { api } from "../api";


import Dropdown from "../components/detailed-recipe-page/Dropdown.tsx";

export default function RecipeDetails() {
  const { recipeId } = useParams();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await api.get<Recipe>(`/api/recipes/${recipeId}`);
        setRecipe(res.data);
      } catch (err) {
        setError("Recipe could not be loaded.");
      }
    };

    if (recipeId) fetchRecipe();
  }, [recipeId]);

  if (error) return <p>{error}</p>;
  if (!recipe) return <p>Loading recipe...</p>;

  return (
    // TODO: Messy right now, abstract this out into some components
    <div className="recipe-details">
      <h1>{recipe.title}</h1>

      <img
        className="recipe-details-image"
        src={recipe.image}
        alt={recipe.title}
      />

      <div className="recipe-details-info">
        <p>Ready in: {recipe.readyInMinutes ?? "Unknown"} minutes</p>
        <p>Servings: {recipe.servings ?? "Unknown"}</p>
        <p>Health score: {recipe.healthScore ?? "Unknown"}</p>
      </div>

      <h2>Summary</h2>
      <div dangerouslySetInnerHTML={{ __html: recipe.summary }} />

      <h2>Key Nutrients</h2>
      {recipe.nutrition.nutrients.length > 0 ? (
        <ul>
          {recipe.nutrition.nutrients.map((nutrient) => (
            <li key={nutrient.name}>
              {nutrient.name}: {nutrient.amount} {nutrient.unit}
            </li>
          ))}
        </ul>
      ) : (
        <p>No nutrient information available.</p>
      )}

      <h2>Ingredients</h2>
      {recipe.ingredients.length > 0 ? (
        <ul>
          {recipe.ingredients.map((ingredient) => (
            <li key={`${ingredient.id}-${ingredient.name}`}>
              {ingredient.amount} {ingredient.unit} {ingredient.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No ingredients available.</p>
      )}

      <h2>Instructions</h2>
      {recipe.instructions ? (
        <div dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
      ) : (
        <p>No instructions available.</p>
      )}

      {recipe.sourceUrl && (
        <p>
          <a href={recipe.sourceUrl} target="_blank" rel="noreferrer">
            View original recipe
          </a>
        </p>
      )}
    </div>
  );
}