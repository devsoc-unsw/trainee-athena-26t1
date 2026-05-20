import { useNavigate } from "react-router-dom";

import "./LoginPopup.css";

type Props = {
  setShowLoginPopup: (value: boolean) => void;
};

export default function LoginPopup({ setShowLoginPopup }: Props) {
    const navigate = useNavigate();

    return (
        <div 
          className="login-popup-backdrop"
          onClick={() => {setShowLoginPopup(false)}}
        >
          <div 
            className="login-popup"
            onClick={(event) => event.stopPropagation()}
          >
            <h2>Log in to save recipes</h2>
            <p>You need to be logged in before you can favourite recipes.</p>

            <div className="login-popup-actions">
              <button onClick={() => navigate("/login")}>Go to login</button>
              <button
                className="secondary-button"
                onClick={() => setShowLoginPopup(false)}
              >
                Not now
              </button>
            </div>
          </div>
        </div>
    );
}