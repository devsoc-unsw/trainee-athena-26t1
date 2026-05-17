import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Bookmark, User, Search, Menu, X } from "lucide-react";
import "./Navbar.css";

export type Filters = {
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  maxMinutes: number | null;
};

const DEFAULT_FILTERS: Filters = {
  vegetarian: false,
  vegan: false,
  glutenFree: false,
  maxMinutes: null,
};

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowFilters(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync query input with URL
  useEffect(() => {
    setQuery(searchParams.get("query") ?? "");
  }, [searchParams]);

  const doSearch = () => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("query", query.trim());
    if (filters.vegetarian) params.set("vegetarian", "true");
    if (filters.vegan) params.set("vegan", "true");
    if (filters.glutenFree) params.set("glutenFree", "true");
    if (filters.maxMinutes !== DEFAULT_FILTERS.maxMinutes) {
      params.set("maxMinutes", String(filters.maxMinutes));
    }
    navigate(`/?${params.toString()}`);
    setShowFilters(false);
  };

  const toggleFilter = (key: keyof Omit<Filters, "maxMinutes">) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const activeFilterCount = [
    filters.vegetarian,
    filters.vegan,
    filters.glutenFree,
    filters.maxMinutes !== DEFAULT_FILTERS.maxMinutes,
  ].filter(Boolean).length;

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <img src="/logo.svg" alt="MealMatrix logo" className="navbar-logo" />
        <span className="navbar-title">MealMatrix</span>
      </Link>

      <div className="navbar-search-wrapper" ref={dropdownRef}>
        <div className="navbar-search">
          <button
            className="navbar-menu-btn"
            onClick={() => setShowFilters((v) => !v)}
            aria-label="Filters"
          >
            <Menu size={18} color="#666" />
            {activeFilterCount > 0 && (
              <span className="navbar-filter-dot">{activeFilterCount}</span>
            )}
          </button>

          <input
            type="text"
            className="navbar-search-input"
            placeholder="Search recipes"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && doSearch()}
          />
          <button className="navbar-search-btn" onClick={doSearch} aria-label="Search">
            <Search size={18} color="#666" />
          </button>
        </div>

        {showFilters && (
          <div className="filter-dropdown">
            <div className="filter-header">
              <span className="filter-title">Filters</span>
              <button className="filter-reset" onClick={resetFilters}>
                <X size={14} /> Reset
              </button>
            </div>

            <div className="filter-section">
              <p className="filter-section-label">Dietary</p>
              <div className="filter-toggles">
                {(["vegetarian", "vegan", "glutenFree"] as const).map((key) => (
                  <button
                    key={key}
                    className={`filter-toggle ${filters[key] ? "active" : ""}`}
                    onClick={() => toggleFilter(key)}
                  >
                    {key === "glutenFree" ? "Gluten Free" : capitalize(key)}
                  </button>
                ))}
              </div>
            </div>

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
									setFilters((prev) => ({
										...prev,
										maxMinutes: Number(e.target.value) === 300 ? null : Number(e.target.value),
									}))
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
									setFilters((prev) => ({
										...prev,
										maxMinutes: e.target.value === "" ? null : Number(e.target.value),
									}))
								}
								className="filter-number-input"
							/>
						</div>
            <button className="filter-apply" onClick={doSearch}>
              Apply filters
            </button>
          </div>
        )}
      </div>

      <div className="navbar-actions">
        <Link to="/saved-recipes" className="navbar-icon-btn" aria-label="Saved recipes">
          <Bookmark size={22} color="#fff" />
        </Link>
        <Link to="/profile" className="navbar-icon-btn" aria-label="Profile">
          <User size={22} color="#fff" />
        </Link>
      </div>
    </nav>
  );
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}