import { Link } from "react-router-dom";
import "./Navbar.css";
import { getAccessToken, logout } from "../../auth";
import React, { useState } from "react";
import LoginPopup from "./LoginPopup";

export default function Navbar() {
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const loggedIn = Boolean(getAccessToken());

  const handleSavedRecipeNav = (event: React.MouseEvent) => {
    const token = getAccessToken();
    if (!token) {
      event?.preventDefault();
      setShowLoginPopup(true);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <img src="/logo.svg" alt="MealMatrix logo" className="navbar-logo" />
        <span className="navbar-title">MealMatrix</span>
      </Link>

      <div className="navbar-actions">
        <Link to="/saved-recipes" className="navbar-icon-btn" aria-label="Saved recipes" onClick={(event) => handleSavedRecipeNav(event)}>
          <i className="bi bi-bookmark" style={{ fontSize: '23px', color: '#fff' }} />
        </Link>
        {loggedIn ? (
            <Link to="/" className="navbar-icon-btn" aria-label="Login" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right" style={{ fontSize: '27px', color: '#fff' }} />
            </Link>
          ) : (
            <Link to="/login" className="navbar-icon-btn" aria-label="Login">
              <i className="bi bi-box-arrow-in-right" style={{ fontSize: '27px', color: '#fff' }} />
            </Link>
          )
        }
      </div>

      {showLoginPopup && 
        <LoginPopup 
          setShowLoginPopup={setShowLoginPopup} 
          headerMsg={"Log in to view saved recipes"} 
          bodyMsg={"You need to be logged in before you can view recipes you've saved."} 
        />
      }
    </nav>
  );
}