import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SavedRecipes from "./pages/SavedRecipes";
import RecipeDetails from "./pages/RecipeDetails";
import CreateRecipe from "./pages/CreateRecipe";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/saved-recipes" element={<SavedRecipes />} />
      <Route path="/create-recipe" element={<CreateRecipe />} />
      <Route path="/recipes/:recipeId" element={<RecipeDetails />} />
    </Routes>
  );
}