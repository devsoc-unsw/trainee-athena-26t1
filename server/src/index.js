import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Item from './models/Item.js';
import Recipe from './models/Recipe.js';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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

app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running' });
});

app.get('/api/v2/recipes', async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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

app.post('/api/create-recipe', async (req, res) => {
    try {
        const newRecipe = await Recipe.create(req.body);
        res.status(201).json(newRecipe);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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

const formatRecipe = (recipe) => {
    return {
        id: recipe.id,
        image: recipe.image,
        title: recipe.title,
        readyInMinutes: recipe.readyInMinutes,
        servings: recipe.servings,
        sourceUrl: recipe.sourceUrl,

        vegetarian: recipe.vegetarian,
        vegan: recipe.vegan,
        glutenFree: recipe.glutenFree,
        dairyFree: recipe.dairyFree,

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

app.get('/api/recipes', (req, res) => {
    res.json({ results: recipes.map(formatRecipe) });
});

app.get('/api/recipes/search', (req, res) => {
    const query = req.query.query?.toLowerCase() || "";
    const filteredRecipes = recipes.filter((recipe) => {
        recipe.title.toLowerCase().includes(query)
    });

    res.json({ results: filteredRecipes.map(formatRecipe) });
});

app.get('/api/recipes/:id', (req, res) => {
    const recipeId = Number(req.params.id);

    const recipe = recipes.find((recipe) => recipe.id === recipeId);

    if (!recipe) {
        return res.status(404).json({ error: "Recipe not found" });
    }

    res.json(formatRecipe(recipe));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
