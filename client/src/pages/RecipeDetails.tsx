import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Recipe } from "../types";
import { api } from "../api";

export default function RecipeDetails() {
  const { recipeId } = useParams();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        // TODO: You can comment this out for now, make a dummy Recipe variable
        // and use its attributes to design the page (until the API has been implemented)
        const res = await api.get(`/api/recipes/${recipeId}`);
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
    <div>
      <h1>{recipe.name}</h1>
      <p>{recipe.description}</p>
    </div>
  );
}