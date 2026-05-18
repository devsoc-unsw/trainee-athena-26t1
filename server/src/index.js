import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Item from './models/Item.js';
import fs from 'fs';
import Recipe from './models/Recipe.js';
import { register } from '../scripts/userServices.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

connectDB();

// ============================================
// ROUTES - These handle requests from frontend
// (replace test routes when done, remove 'v2')
// ============================================

// Health Check - Test if server is running
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running' });
});

// Auth
app.post('/api/auth/register', register);

// GET all recipes from database
app.get('/api/v2/recipes', async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET single recipe by ID
app.get('/api/v2/recipes/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CREATE a new recipe
app.post('/api/create-recipe', async (req, res) => {
    try {
        const newRecipe = await Recipe.create(req.body);
        res.status(201).json(newRecipe);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Unused routes (implement frontend first)

// TODO: For these, check if the user actually owns this recipe
// and is authenticated to modify them

// UPDATE an item
app.put('/api/items/:id', async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE an item
app.delete('/api/items/:id', async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json({ message: 'Item deleted successfully', deletedItem });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// TESTING ROUTES - These return the dummy data
// for easier frontend implementation for now
// ============================================

// We're not using recipe-nutrients-sample.json for now
const recipeData = JSON.parse(
    fs.readFileSync("recipe-info-sample.json", "utf-8")
);

const recipes = recipeData.results.filter((recipe) =>
    recipe.id &&
    recipe.title &&
    recipe.image &&
    recipe.readyInMinutes &&
    recipe.servings &&
    recipe.nutrition?.nutrients?.length > 0
);

const KEY_NUTRIENTS = [
    "Calories",
    "Protein",
    "Fat",
    "Saturated Fat",
    "Carbohydrates",
    "Sugar",
    "Fiber",
    "Cholesterol",
    "Sodium",
    "Calcium",
    "Iron",
    "Potassium",
    "Magnesium",
    "Zinc",
    "Vitamin A",
    "Vitamin C",
    "Vitamin D",
    "Vitamin B12",
];

const getKeyNutrients = (recipe) => {
    const nutrients = recipe.nutrition?.nutrients || [];

    return KEY_NUTRIENTS.map((nutrientName) => {
        const nutrient = nutrients.find((n) => n.name === nutrientName);

        if (!nutrient) return null;

        return {
            name: nutrient.name,
            amount: Math.round(nutrient.amount),
            unit: nutrient.unit,
            percentOfDailyNeeds: nutrient.percentOfDailyNeeds
        };
    }).filter(Boolean);
};

// Formats the recipe result with the desired attributes
const formatRecipe = (recipe) => {
    return {
        id: recipe.id,
        image: recipe.image,
        title: recipe.title,
        readyInMinutes: recipe.readyInMinutes,
        servings: recipe.servings,
        sourceUrl: recipe.sourceUrl,

        // Dietaries
        vegetarian: recipe.vegetarian,
        vegan: recipe.vegan,
        glutenFree: recipe.glutenFree,
        dairyFree: recipe.dairyFree,

        // Misc info
        preparationMinutes: recipe.preparationMinutes,
        cookingMinutes: recipe.cookingMinutes,
        healthScore: recipe.healthScore,

        ingredients: recipe.ingredients?.map((ingredient) => ({
            id: ingredient.id,
            name: ingredient.name,
            amount: ingredient.amount,
            unit: ingredient.unit
        })) || [],

        nutrition: {
            nutrients: getKeyNutrients(recipe)
        },

        summary: recipe.summary,
        cuisines: recipe.cuisines || [],
        dishTypes: recipe.dishTypes || [],
        diets: recipe.diets || [],
        instructions: recipe.instructions
    };
};

// GET /api/recipes
app.get('/api/recipes', (req, res) => {
    res.json({ results: recipes.map(formatRecipe) });
});

// Search for an item with query
app.get('/api/recipes/search', (req, res) => {
    const query = req.query.query?.toLowerCase() || "";
    const filteredRecipes = recipes.filter((recipe) => {
        recipe.title.toLowerCase().includes(query)
    });

    res.json({ results: filteredRecipes.map(formatRecipe) });
});

// GET /api/recipes/:id
app.get('/api/recipes/:id', (req, res) => {
    const recipeId = Number(req.params.id);

    const recipe = recipes.find((recipe) => recipe.id === recipeId);

    if (!recipe) {
        return res.status(404).json({ error: "Recipe not found" });
    }

    res.json(formatRecipe(recipe));
});

// ============================================
// Start Server
// ============================================
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
