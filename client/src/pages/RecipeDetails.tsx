import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Recipe } from "../types";
import { api } from "../api";


import Dropdown from "../components/detailed-recipe-page/Dropdown";
import "./RecipeDetails.css";


import star from "../assets/detailed-recipe-page/star.png";
import time from "../assets/detailed-recipe-page/time.png";
import vegan from "../assets/detailed-recipe-page/vegan.png";
import easy from "../assets/detailed-recipe-page/easy.png";

import health from "../assets/detailed-recipe-page/health.png";
import servings from "../assets/detailed-recipe-page/servings.png";


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

      <img
        className="recipe-details-image"
        src={recipe.image}
        alt={recipe.title}
        />
      
      <div className="text-section"> 

        <div className="title-and-rating">
          <h1 className="recipe-title">{recipe.title}</h1>
          <img className="recipe-rating" src={star} alt="star" />
        </div>

        <div className="recipe-details-info">

          <div className="info-pill">
            <img src={time} alt="time" />
            <span>{recipe.readyInMinutes ?? "?"} mins</span>
          </div>

          <div className="info-pill">
            <img src={servings} alt="servings" />
            <span>{recipe.servings ?? "?"} servings</span>
          </div>

          <div className="info-pill">
            <img src={health} alt="health" />
            <span>{recipe.healthScore ?? "?"} health</span>
          </div>

        </div>

        <h2>Summary</h2>
        <div dangerouslySetInnerHTML={{ __html: recipe.summary }} />
        <Dropdown title="Key Nutrients">
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
        </Dropdown>

        <Dropdown title="Ingredients">
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
        </Dropdown>

        <Dropdown title="Instructions" defaultOpen>
          {recipe.instructions ? (
            <div dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
          ) : (
            <p>No instructions available.</p>
          )}
        </Dropdown>

        {recipe.sourceUrl && (
          <p>
            <a href={recipe.sourceUrl} target="_blank" rel="noreferrer">
              View original recipe
            </a>
          </p>
        )}

      </div>
    </div>
  );
}