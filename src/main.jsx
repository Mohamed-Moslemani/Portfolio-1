import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

import "./styles/reset.css";
import "./styles/theme.css";
import "./styles/typography.css";
import "./styles/globals.css";
import "./styles/home.css";
import "./styles/work.css";
import "./styles/navbar.css";
import "./styles/experience.css";
import "./styles/about.css";
import "./styles/contact.css";
import "./styles/footer.css";
import "./styles/blog-link-preview.css";
import "./styles/ambient-animation.css";
import "./styles/floating-particles.css";
import "./styles/constellation-graph.css";

// Register a simple service worker for PWA offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
