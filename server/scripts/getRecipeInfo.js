import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

async function getRecipeInfo() {
  const apiKey = process.env.SPOONACULAR_API_KEY;

  console.log("Key loaded?", Boolean(apiKey));

  const inputData = JSON.parse(
    fs.readFileSync("recipe-nutrients-sample.json", "utf-8")
  );

  const recipeInfos = [];

  for (const recipe of inputData.results) {
    console.log(`Fetching recipe info for ${recipe.title}`);

    const url = new URL(
      `https://api.spoonacular.com/recipes/${recipe.id}/information?includeNutrition=true&apiKey=${apiKey}`
    );

    const response = await fetch(url);
    const data = await response.json();

    recipeInfos.push(data);
  }

  fs.writeFileSync(
    "recipe-info-sample.json",
    JSON.stringify({ results: recipeInfos }, null, 2)
  );

  console.log("Saved recipe info to recipe-info-sample.json");
}

getRecipeInfo().catch(console.error);