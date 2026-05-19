import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Recipe } from "../types";
import { api } from "../api";
import "../components/saved-recipes/Filter.css"


// all the fields tracked by our filter
export interface FilterState {
  maxTime: number | "";
  mealType: string;
  difficulty: string;
}

export interface Recipe {
  id: number;
  title: string;
  desc: string;
  time: string;
  meal: MealType;
  difficulty: Difficulty;
  img: string;
}

const RECIPES: Recipe[] = [
  { id: 1, title: "Chicken Stew", desc: "Hearty chicken and vegetable stew", time: "30 min", meal: "Dinner", difficulty: "Easy", img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&q=80" },
  { id: 2, title: "Pasta Primavera", desc: "Fresh veggies tossed with al dente pasta", time: "20 min", meal: "Lunch", difficulty: "Easy", img: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80" },
  { id: 3, title: "Beef Tacos", desc: "Crispy tacos with seasoned ground beef", time: "25 min", meal: "Dinner", difficulty: "Medium", img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80" },
  { id: 4, title: "Greek Salad", desc: "Classic Mediterranean salad", time: "10 min", meal: "Lunch", difficulty: "Easy", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80" },
  { id: 5, title: "Mushroom Risotto", desc: "Creamy Arborio with wild mushrooms", time: "45 min", meal: "Dinner", difficulty: "Hard", img: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&q=80" },
  { id: 6, title: "Avocado Toast", desc: "Sourdough with smashed avo & chilli flakes", time: "10 min", meal: "Breakfast", difficulty: "Easy", img: "https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=400&q=80" },
  { id: 7, title: "Tom Yum Soup", desc: "Spicy Thai broth with prawns", time: "35 min", meal: "Dinner", difficulty: "Medium", img: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80" },
  { id: 8, title: "Banana Pancakes", desc: "Fluffy stacks with maple syrup", time: "20 min", meal: "Breakfast", difficulty: "Easy", img: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80" },
  { id: 9, title: "Caesar Salad", desc: "Romaine, croutons & parmesan", time: "15 min", meal: "Lunch", difficulty: "Easy", img: "https://images.unsplash.com/photo-1551248429-40975aa4de74?w=400&q=80" },
];


export default function SavedRecipes() {
  // filter tracking
  const [applied, setApplied] = useState<FilterState>({ maxTime: "", mealType: "", difficulty: "" });

  const hasFilters = Boolean(applied.maxTime || applied.mealType || applied.difficulty);

  const filtered = RECIPES.filter((r) => {
    if (applied.maxTime && parseInt(r.time) > parseInt(applied.maxTime)) return false;
    if (applied.mealType && r.meal !== applied.mealType) return false;
    if (applied.difficulty && r.difficulty !== applied.difficulty) return false;
    return true;
  });


  return (
    <div>
         
      <Filter 
        hasFilters = {hasFilters}
        onApply = {setApplied} 

        /> 

      <div className="resultsInfo">
        {filtered.length} recipe{filtered.length !== 1 ? "s" : ""} saved
        {hasFilters && <span className="filterTag"> · filtered</span>}
      </div>
    </div>

   

    
  );
}


// rip hardcoding
const MEAL_TYPES = ["", "Breakfast", "Lunch", "Dinner"];
const DIFFICULTIES = ["", "Easy", "Medium", "Hard"];


function Filter({ hasFilters, onApply }: { hasFilters: boolean, onApply: (filters: FilterState) => void }) {
  // USE STATES + EFFECTS
  // on/off switch for expanding the button
  const [filterOpen, setFilterOpen] = useState(false);

  // filtration types
  const [maxTime, setMaxTime] = useState<number | "" >("");
  const [mealType, setMealType] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>(""); 



  const handleClear = () => {
    setMaxTime("");
    setMealType("");
    setDifficulty("");
  };


  const handleApply = () => {
    onApply({ maxTime, mealType, difficulty });
    setFilterOpen(false);
  };

  // component
  return (
     <div className="filterSection" >
      {/* small vers (button before expansion) */}
      <button className="filterBtn" onClick={() => setFilterOpen((o) => !o)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6 }}>
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
        Filter by...
      {/*   {hasFilters && <span style={styles.filterDot} />} */}
      </button>

      {hasFilters && (
        <button className="clearBtn" onClick={handleClear}>
          Clear
        </button>
      )}

      {filterOpen && (
        <div className="filterPanel">
            <div className="filterGroup"> 
              {/* all the possible inputs here flexboxed */}


                <div className="filterBox">
                <label className="filterLabel">Max Time</label>
                  <div className="inputBox">
                    <input
                      type="number"
                      value={maxTime}
                      onChange={(e) => setMaxTime(Number(e.target.value) || "")}
                      placeholder="mins"
                      className="fi"
                    />
                    
                    <span className="filterInput">min</span>
                  </div>
                
              </div>

              <div className="filterBox">
                <label className="filterLabel">Meal Type</label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  className="filterSelect"
                >
                  {MEAL_TYPES.map((m) => (
                    <option key={m} value={m}>{m || "Any"}</option>
                  ))}
                </select>
              </div>

              
              <div className="filterBox">
                <label className="filterLabel">Meal Type</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="filterSelect"
                >
                  {DIFFICULTIES.map((m) => (
                    <option key={m} value={m}>{m || "Any"}</option>
                  ))}
                </select>
              </div>

              <button className="applyBtn" onClick={handleApply}>
                Apply
              </button>
            </div>
        </div>  
      )}
    </div>


  );
}