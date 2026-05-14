import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

async function testSpoonacular() {
  const query = "garlic";
  const number = 10;
  const apiKey = process.env.SPOONACULAR_API_KEY;
  const filePath = "recipe-nutrients-sample.json";

  console.log("Key loaded?", Boolean(apiKey));

  const url = new URL(
    `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=${number}&addRecipeNutrition=true&apiKey=${apiKey}`
  );

  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Spoonacular error ${response.status}: ${errorText}`);
  }

  const data = await response.json();

  let existingData = { results: [] };

  if (fs.existsSync(filePath)) {
    existingData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }

  const existingResults = existingData.results || [];
  const newResults = data.results || [];

  const allResults = [...existingResults, ...newResults];

  const uniqueResults = Array.from(
    new Map(allResults.map((recipe) => [recipe.id, recipe])).values()
  );

  const outputData = {
    results: uniqueResults,
  };

  fs.writeFileSync(filePath, JSON.stringify(outputData, null, 2));

  console.log(`Added ${newResults.length} recipes`);
  console.log(`Total recipes in file: ${uniqueResults.length}`);
  console.log("Saved response to recipe-nutrients-sample.json");
}

testSpoonacular().catch(console.error);