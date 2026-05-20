import { useNavigate } from "react-router-dom";

import "./LoginPopup.css";

type Props = {
  setShowLoginPopup: (value: boolean) => void;
  headerMsg: string;
  bodyMsg: string;
};

export default function LoginPopup({ setShowLoginPopup, headerMsg, bodyMsg }: Props) {
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
            <h2>{headerMsg}</h2>
            <p>{bodyMsg}</p>

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