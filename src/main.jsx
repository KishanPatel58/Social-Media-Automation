import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import ThemeContext from "./context/theme/ThemeContext.jsx";
import AuthContext from "./context/auth/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <ThemeContext>
    <BrowserRouter>
      <AuthContext>
        <App />
      </AuthContext>
    </BrowserRouter>
  </ThemeContext>
);