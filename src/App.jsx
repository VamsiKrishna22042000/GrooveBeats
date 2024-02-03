import "./App.css";
import "./index.css";

/**Dependencies */
import { BrowserRouter, Route, Routes } from "react-router-dom";

/**Components*/
import Home from "./assets/Home/home.jsx";
import NotFound from "./assets/NotFound/notfound.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
