import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <img src="/logo.svg" alt="MealMatrix logo" className="navbar-logo" />
        <span className="navbar-title">MealMatrix</span>
      </Link>

      <div className="navbar-actions">
        <Link to="/saved-recipes" className="navbar-icon-btn" aria-label="Saved recipes">
          <i className="bi bi-bookmark" style={{ fontSize: '23px', color: '#fff' }} />
        </Link>
        <Link to="/profile" className="navbar-icon-btn" aria-label="Profile">
          <i className="bi bi-person" style={{ fontSize: '26px', color: '#fff' }} />
        </Link>
      </div>
    </nav>
  );
}