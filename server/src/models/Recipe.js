import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema(
  {
    id: Number,
    name: String,
    amount: Number,
    unit: String,
  },
  { _id: false }
);

const nutrientSchema = new mongoose.Schema(
  {
    name: String,
    amount: Number,
    unit: String,
    percentOfDailyNeeds: Number,
  },
  { _id: false }
);

const recipeSchema = new mongoose.Schema(
  {
    image: String,
    title: {
      type: String,
      required: true,
    },
    readyInMinutes: Number,
    servings: Number,
    sourceUrl: String,

    vegetarian: Boolean,
    vegan: Boolean,
    glutenFree: Boolean,
    dairyFree: Boolean,
    preparationMinutes: Number,
    cookingMinutes: Number,
    healthScore: Number,

    ingredients: [ingredientSchema],

    nutrition: {
      nutrients: [nutrientSchema],
    },

    summary: String,
    cuisines: [String],
    dishTypes: [String],
    diets: [String],
    instructions: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Recipe", recipeSchema);
