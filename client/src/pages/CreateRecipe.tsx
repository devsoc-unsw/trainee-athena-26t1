import { api } from "../api";

export default function CreateRecipe() {
  // TODO: This is the POST request format, populate these fields
  // and refer to types.ts for more info

  /*
    await api.post("/api/create-recipe", {
      title: "High Protein Chicken Bowl",
      image: "",
      readyInMinutes: 25,
      servings: 2,
      vegetarian: false,
      vegan: false,
      glutenFree: true,
      dairyFree: true,
      healthScore: 85,
      ingredients: [
        {
          id: 1,
          name: "chicken breast",
          amount: 200,
          unit: "g",
        },
        {
          id: 2,
          name: "rice",
          amount: 1,
          unit: "cup",
        },
      ],
      nutrition: {
        nutrients: [
          {
            name: "Calories",
            amount: 520,
            unit: "kcal",
          },
          {
            name: "Protein",
            amount: 45,
            unit: "g",
          },
        ],
      },
      summary: "A simple high protein meal.",
      cuisines: ["American"],
      dishTypes: ["main course"],
      diets: ["gluten free"],
      instructions: "Cook the chicken, prepare the rice, and serve together.",
    });
  */
  
  return (
    <div>This is where you can create a recipe!</div>
    // No need to make any API calls yet, just make a visually working page first
  );
}