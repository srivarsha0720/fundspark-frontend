import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

/* routing import — enables page navigation */
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* wrap App with BrowserRouter so routing works */}
    <BrowserRouter>
    <AuthProvider>
        <App />
    </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);