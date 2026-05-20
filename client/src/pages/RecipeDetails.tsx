import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Recipe } from "../types";
import { api } from "../api";

import Dropdown from "../components/detailed-recipe-page/Dropdown";
import "./RecipeDetails.css";

import star from "../assets/detailed-recipe-page/star.png";
import time from "../assets/detailed-recipe-page/time.png";
// import vegan from "../assets/detailed-recipe-page/vegan.png";
// import easy from "../assets/detailed-recipe-page/easy.png";

import {
  FaFire,
  FaDrumstickBite,
  FaBreadSlice,
  FaTint,
  FaHeart,
  FaBolt,
} from "react-icons/fa";

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
          <p className="recipe-title">{recipe.title}</p>
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

        <div className="below-section">
          <div className="summary-section">
            <h2 className="summary-title">Summary</h2>
            <div
              className="summary-body"
              dangerouslySetInnerHTML={{ __html: recipe.summary }}
            />
          </div>

          <Dropdown title="Nutrition Intelligence">
            <div className="nutrition-header">
              <h3>Macros Breakdown</h3>
            </div>

            <div className="nutrition-grid">
              {recipe.nutrition.nutrients.slice(0, 6).map((nutrient) => {
                let icon = <FaBolt />;

                if (nutrient.name.toLowerCase().includes("calories")) {
                  icon = <FaFire />;
                } else if (nutrient.name.toLowerCase().includes("protein")) {
                  icon = <FaDrumstickBite />;
                } else if (nutrient.name.toLowerCase().includes("carbo")) {
                  icon = <FaBreadSlice />;
                } else if (nutrient.name.toLowerCase().includes("fat")) {
                  icon = <FaTint />;
                } else if (nutrient.name.toLowerCase().includes("fiber")) {
                  icon = <FaHeart />;
                }

                return (
                  <div className={`nutrition-card`} key={nutrient.name}>
                    <div className="nutrition-icon">{icon}</div>

                    <div className="nutrition-info">
                      <p className="nutrition-name">{nutrient.name}</p>

                      <h2 className="nutrition-value">
                        {Math.round(nutrient.amount)}
                        <span>{nutrient.unit}</span>
                      </h2>

                      <div className="nutrition-bar">
                        <div
                          className="nutrition-fill"
                          style={{
                            width: `${Math.min(nutrient.amount, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
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
              <div
                className="instructions-body"
                dangerouslySetInnerHTML={{ __html: recipe.instructions }}
              />
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
    </div>
  );
}
