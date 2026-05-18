import Router from "./Router";
import Navbar from "./components/search-page/Navbar";
import "./App.css";

function App() {
  return (
    <>
      <Navbar />
      <div id="content">
        <Router />
      </div>
    </>
  );
}

export default App;