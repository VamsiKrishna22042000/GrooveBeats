import "./App.css";
import "./index.css";

/**Dependencies */
import { lazy, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

/**Components*/
import Home from "./assets/Home/home.jsx";
import NotFound from "./assets/NotFound/notfound.jsx";
const Login = lazy(() => import("./assets/Login/login.jsx"));
const SignUp = lazy(() => import("./assets/SignUp/signup.jsx"));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<SignUp />} />
        <Route exact path="/" element={<Home />} />
        <Route exact path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
