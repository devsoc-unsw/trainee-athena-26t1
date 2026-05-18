import { useState, useRef, useEffect } from "react";
import type { Filters } from "../../types";
import "./Searchbar.css";

type Props = {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
};

export default function SearchBar({ filters, onFiltersChange }: Props) {
  const [showFilters, setShowFilters] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowFilters(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const update = (patch: Partial<Filters>) => {
    onFiltersChange({ ...filters, ...patch });
  };

  const toggleDietary = (key: "vegetarian" | "vegan" | "glutenFree" | "dairyFree") => {
    update({ [key]: !filters[key] });
  };

  const resetFilters = () => {
    onFiltersChange(DEFAULT_FILTERS);
  };

  const activeFilterCount = [
    filters.vegetarian,
    filters.vegan,
    filters.glutenFree,
    filters.dairyFree,
    filters.maxMinutes !== null,
    filters.calories.min !== null || filters.calories.max !== null,
    filters.protein.min !== null || filters.protein.max !== null,
    filters.carbs.min !== null || filters.carbs.max !== null,
    filters.fat.min !== null || filters.fat.max !== null,
  ].filter(Boolean).length;

  return (
    <div className="searchbar-wrapper" ref={dropdownRef}>
      <div className="searchbar">
        <button
          className="searchbar-filter-btn"
          onClick={() => setShowFilters((v) => !v)}
          aria-label="Filters"
        >
          <i className="bi bi-list" style={{ fontSize: "18px", color: "#666" }} />
          {activeFilterCount > 0 && (
            <span className="searchbar-filter-dot">{activeFilterCount}</span>
          )}
        </button>

        <input
          type="text"
          className="searchbar-input"
          placeholder="Search recipes"
          value={filters.query}
          onChange={(e) => update({ query: e.target.value })}
        />

        <button className="searchbar-search-btn" aria-label="Search">
          <i className="bi bi-search" style={{ fontSize: "18px", color: "#666" }} />
        </button>
      </div>

      {showFilters && (
        <div className="filter-dropdown">
          <div className="filter-header">
            <span className="filter-title">Filters</span>
            <button className="filter-reset" onClick={resetFilters}>
              <i className="bi bi-x" style={{ fontSize: "14px" }} /> Reset
            </button>
          </div>

          {/* Dietary */}
          <div className="filter-section">
            <p className="filter-section-label">Dietary</p>
            <div className="filter-toggles">
              {(["vegetarian", "vegan", "glutenFree", "dairyFree"] as const).map((key) => (
                <button
                  key={key}
                  className={`filter-toggle ${filters[key] ? "active" : ""}`}
                  onClick={() => toggleDietary(key)}
                >
                  {DIETARY_LABELS[key]}
                </button>
              ))}
            </div>
          </div>

          {/* Cook time */}
          <div className="filter-section">
            <p className="filter-section-label">
              Max cook time
              <span className="filter-value">
                {filters.maxMinutes === null ? "Any" : `${filters.maxMinutes} min`}
              </span>
            </p>
            <input
              type="range"
              min={5}
              max={300}
              step={5}
              value={filters.maxMinutes ?? 300}
              onChange={(e) =>
                update({
                  maxMinutes: Number(e.target.value) === 300 ? null : Number(e.target.value),
                })
              }
              className="filter-slider"
            />
            <div className="filter-slider-labels">
              <span>5 min</span>
              <span>Any</span>
            </div>
            <input
              type="number"
              min={5}
              placeholder="Or type minutes..."
              value={filters.maxMinutes ?? ""}
              onChange={(e) =>
                update({
                  maxMinutes: e.target.value === "" ? null : Number(e.target.value),
                })
              }
              className="filter-number-input"
            />
          </div>

          {/* Macros */}
          <div className="filter-section">
            <p className="filter-section-label">Macros (per serving)</p>
            {(["calories", "protein", "carbs", "fat"] as const).map((macro) => (
              <MacroRange
                key={macro}
                label={MACRO_LABELS[macro]}
                unit={macro === "calories" ? "kcal" : "g"}
                min={filters[macro].min}
                max={filters[macro].max}
                onChange={(min, max) => update({ [macro]: { min, max } })}
              />
            ))}
          </div>

          <button className="filter-apply" onClick={() => setShowFilters(false)}>
            Apply filters
          </button>
        </div>
      )}
    </div>
  );
}

// ── MacroRange sub-component ──────────────────────────────────────────────────

type MacroRangeProps = {
  label: string;
  unit: string;
  min: number | null;
  max: number | null;
  onChange: (min: number | null, max: number | null) => void;
};

function MacroRange({ label, unit, min, max, onChange }: MacroRangeProps) {
  return (
    <div className="macro-range">
      <span className="macro-label">{label}</span>
      <div className="macro-inputs">
        <input
          type="number"
          min={0}
          placeholder="Min"
          value={min ?? ""}
          onChange={(e) =>
            onChange(e.target.value === "" ? null : Number(e.target.value), max)
          }
          className="macro-input"
        />
        <span className="macro-unit">{unit}</span>
        <span className="macro-dash">–</span>
        <input
          type="number"
          min={0}
          placeholder="Max"
          value={max ?? ""}
          onChange={(e) =>
            onChange(min, e.target.value === "" ? null : Number(e.target.value))
          }
          className="macro-input"
        />
        <span className="macro-unit">{unit}</span>
      </div>
    </div>
  );
}

// ── Constants ─────────────────────────────────────────────────────────────────

export const DEFAULT_FILTERS: Filters = {
  query: "",
  vegetarian: false,
  vegan: false,
  glutenFree: false,
  dairyFree: false,
  maxMinutes: null,
  calories: { min: null, max: null },
  protein: { min: null, max: null },
  carbs: { min: null, max: null },
  fat: { min: null, max: null },
};

const DIETARY_LABELS: Record<string, string> = {
  vegetarian: "Vegetarian",
  vegan: "Vegan",
  glutenFree: "Gluten Free",
  dairyFree: "Dairy Free",
};

const MACRO_LABELS: Record<string, string> = {
  calories: "Calories",
  protein: "Protein",
  carbs: "Carbs",
  fat: "Fat",
};