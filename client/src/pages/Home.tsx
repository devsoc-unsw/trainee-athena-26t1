import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api";
import type { Recipe, RecipeListResponse } from "../types";
import Card from "../components/search-page/Card";
import "./Home.css";

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();

  const query = searchParams.get("query")?.toLowerCase() ?? "";
  const filterVegetarian = searchParams.get("vegetarian") === "true";
  const filterVegan = searchParams.get("vegan") === "true";
  const filterGlutenFree = searchParams.get("glutenFree") === "true";
  const maxMinutes = searchParams.get("maxMinutes")
    ? Number(searchParams.get("maxMinutes"))
    : null;

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const response = await api.get<RecipeListResponse>("/api/recipes");
        setRecipes(response.data.results);
      } catch (err) {
        setError("Failed to load recipes.");
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, []);

  if (loading) return <p className="home-status">Loading...</p>;
  if (error) return <p className="home-status">{error}</p>;

  const filteredRecipes = recipes.filter((r) => {
    if (!r.title?.toLowerCase().includes(query)) return false;
    if (filterVegetarian && !r.vegetarian) return false;
    if (filterVegan && !r.vegan) return false;
    if (filterGlutenFree && !r.glutenFree) return false;
    if (maxMinutes !== null && r.readyInMinutes > maxMinutes) return false;
    return true;
  });

  return (
    <div className="home">
      {filteredRecipes.length === 0 ? (
        <p className="home-status">No recipes match your filters.</p>
      ) : (
        <div className="recipe-grid">
          {filteredRecipes.map((recipe) => (
            <Card key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}