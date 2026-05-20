import Router from "./Router";
import Navbar from "./components/search-page/Navbar";
import "./App.css";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/profile";
  return (
    <>
      <Navbar />
      <div id="content" className={isAuthPage ? 'fullPageContent' : ""}>
        <Router />
      </div>
    </>
  );
}

export default App;