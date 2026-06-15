import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import { Route } from "./routes/index";

// Reuse the existing route component in a plain SPA shell (no router required).
const TriviaScorer = (Route.options as { component: React.ComponentType }).component;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TriviaScorer />
  </React.StrictMode>,
);
