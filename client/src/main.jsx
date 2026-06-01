import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import ThemeContext from "./context/theme/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <ThemeContext>
      <BrowserRouter>
        <App />
      </BrowserRouter>
  </ThemeContext>
);