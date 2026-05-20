import { useState } from "react";


export interface FilterState {
  maxTime: number | "";
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  calories: { min: number | null; max: number | null };
  fat: { min: number | null; max: number | null };
  protein: { min: number | null; max: number | null };
  carbs: { min: number | null; max: number | null };
}

// default filterless
const EMPTY_FILTERS: FilterState = {
  maxTime: "",
  vegetarian: false,
  vegan: false,
  glutenFree: false,
  dairyFree: false,
  calories: { min: null, max: null },
  fat: { min: null, max: null },
  protein: { min: null, max: null },
  carbs: { min: null, max: null },
};

export default function Filter({
  hasFilters,
  onApply,
}: {
  hasFilters: boolean;
  onApply: (filters: FilterState) => void;
}) {
  // USE STATES + EFFECTS
  // on/off switch for expanding the button
  const [filterOpen, setFilterOpen] = useState(false);

  // filtration types
  const [maxTime, setMaxTime] = useState<number | "" >("");
  const [vegetarian, setVegetarian] = useState(false);
  const [vegan, setVegan] = useState(false);
  const [glutenFree, setGlutenFree] = useState(false);
  const [dairyFree, setDairyFree] = useState(false);
  const [calories, setCalories] = useState<{ min: number | null; max: number | null }>({ min: null, max: null });
  const [fat, setFat] = useState<{ min: number | null; max: number | null }>({ min: null, max: null });
  const [protein, setProtein] = useState<{ min: number | null; max: number | null }>({ min: null, max: null });
  const [carbs, setCarbs] = useState<{ min: number | null; max: number | null }>({ min: null, max: null });

  const handleClear = () => {
    setMaxTime("");
    setVegetarian(false);
    setVegan(false);
    setGlutenFree(false);
    setDairyFree(false);
    setCalories({ min: null, max: null });
    setFat({ min: null, max: null });
    setProtein({ min: null, max: null });
    setCarbs({ min: null, max: null });
    onApply(EMPTY_FILTERS);
  };


  
  const handleApply = () => {
    onApply({
      maxTime,
      vegetarian,
      vegan,
      glutenFree,
      dairyFree,
      calories,
      fat,
      protein,
      carbs,
    });
    /* setFilterOpen(false); */
  };


  // component
  return (
     <div className="filterSection" >
      <div className="filterHeader"> {/* small vers (button before expansion) */}
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
      
      </div>
      

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

              {/* Macro ranges */}
              <div className="filterBox">
                <label className="filterLabel">Calories</label>
                <div className="rangeBox">
                  <input
                    type="number"
                    placeholder="min"
                    className="rangeInput"
                    value={calories.min ?? ""}
                    onChange={(e) => setCalories(prev => ({ ...prev, min: Number(e.target.value) || null }))}
                  />
                  <span className="rangeSep">–</span>
                  <input
                    type="number"
                    placeholder="max"
                    className="rangeInput"
                    value={calories.max ?? ""}
                    onChange={(e) => setCalories(prev => ({ ...prev, max: Number(e.target.value) || null }))}
                  />
                </div>
              </div>

              <div className="filterBox">
                <label className="filterLabel">Fat</label>
                  <div className="rangeBox">
                    <input
                      type="number"
                      placeholder="min"
                      className="rangeInput"
                      value={fat.min ?? ""}
                      onChange={(e) => setFat(prev => ({ ...prev, min: Number(e.target.value) || null }))}
                    />
                    <span className="rangeSep">–</span>
                    <input
                      type="number"
                      placeholder="max"
                      className="rangeInput"
                      value={fat.max ?? ""}
                      onChange={(e) => setFat(prev => ({ ...prev, max: Number(e.target.value) || null }))}
                    />
                </div>
              </div>

              <div className="filterBox">
                <label className="filterLabel">Protein</label>
                <div className="rangeBox">
                    <input
                      type="number"
                      placeholder="min"
                      className="rangeInput"
                      value={protein.min ?? ""}
                      onChange={(e) => setProtein(prev => ({ ...prev, min: Number(e.target.value) || null }))}
                    />
                    <span className="rangeSep">–</span>
                    <input
                      type="number"
                      placeholder="max"
                      className="rangeInput"
                      value={protein.max ?? ""}
                      onChange={(e) => setProtein(prev => ({ ...prev, max: Number(e.target.value) || null }))}
                    />
                </div>
              </div>

              <div className="filterBox">
                <label className="filterLabel">Carbohydrates</label>
                <div className="rangeBox">
                    <input
                      type="number"
                      placeholder="min"
                      className="rangeInput"
                      value={carbs.min ?? ""}
                      onChange={(e) => setCarbs(prev => ({ ...prev, min: Number(e.target.value) || null }))}
                    />
                    <span className="rangeSep">–</span>
                    <input
                      type="number"
                      placeholder="max"
                      className="rangeInput"
                      value={carbs.max ?? ""}
                      onChange={(e) => setCarbs(prev => ({ ...prev, max: Number(e.target.value) || null }))}
                    />
                </div>
              </div>

              {/* boolean filters */}
              <div className="checkboxBox">
                <label className="filterLabel">Vegetarian</label>
                <input
                  type="checkbox"
                  checked={vegetarian}
                  onChange={(e) => setVegetarian(e.target.checked)}
                />
              </div>

              <div className="checkboxBox">
                <label className="filterLabel">Vegan</label>
                <input
                  type="checkbox"
                  checked={vegan}
                  onChange={(e) => setVegan(e.target.checked)}
                />
              </div>

              <div className="checkboxBox">
                <label className="filterLabel">Dairy Free</label>
                <input
                  type="checkbox"
                  checked={dairyFree}
                  onChange={(e) => setDairyFree(e.target.checked)}
                />
              </div>

              <div className="checkboxBox">
                <label className="filterLabel">Gluten Free</label>
                <input
                  type="checkbox"
                  checked={glutenFree}
                  onChange={(e) => setGlutenFree(e.target.checked)}
                />
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