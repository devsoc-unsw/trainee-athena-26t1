import { useNavigate } from "react-router-dom";
import type { Recipe } from "../../types";
import "./Card.css";

type Props = {
  recipe: Recipe;
};

export default function Card({ recipe }: Props) {
  const navigate = useNavigate();

  // Pick up to 2 tags to show on the card image
  const tags: { label: string; color: string }[] = [];

  if (recipe.readyInMinutes) {
    tags.push({ label: `${recipe.readyInMinutes} min`, color: "#555" });
  }

  const dishTag = recipe.dishTypes?.[0];
  if (dishTag) {
    tags.push({ label: capitalize(dishTag), color: tagColor(dishTag) });
  } else if (recipe.vegan) {
    tags.push({ label: "Vegan", color: "#2e7d32" });
  } else if (recipe.vegetarian) {
    tags.push({ label: "Vegetarian", color: "#388e3c" });
  }

  return (
    <div className="recipe-card" onClick={() => navigate(`/recipes/${recipe.id}`)}>
      <div className="recipe-card-image-wrapper">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="recipe-card-image"
        />
        {tags.length > 0 && (
          <div className="recipe-card-tags">
            {tags.slice(0, 2).map((tag) => (
              <span
                key={tag.label}
                className="recipe-card-tag"
                style={{ backgroundColor: tag.color }}
              >
                {tag.label}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="recipe-card-body">
        <h3 className="recipe-card-title">{recipe.title}</h3>
        {recipe.summary && (
          <p
            className="recipe-card-summary"
            dangerouslySetInnerHTML={{
              __html: stripHtml(recipe.summary),
            }}
          />
        )}
      </div>
    </div>
  );
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "");
}

function tagColor(dishType: string): string {
  const colors: Record<string, string> = {
    breakfast: "#e65100",
    lunch: "#1565c0",
    dinner: "#6a1b9a",
    dessert: "#ad1457",
    snack: "#00695c",
    salad: "#2e7d32",
    soup: "#4e342e",
    "main course": "#6a1b9a",
    "side dish": "#00838f",
    appetizer: "#c62828",
  };
  return colors[dishType.toLowerCase()] ?? "#555";
}