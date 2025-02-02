// src/main.jsx
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import "./index.css";
import {ThemeProvider} from "./context/ThemeContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </Router>
);