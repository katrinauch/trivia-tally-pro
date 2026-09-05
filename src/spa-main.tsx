import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import { TriviaScorer } from "./components/TriviaScorer";

// Plain SPA shell for the Capacitor iOS build (no router required).
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TriviaScorer />
  </React.StrictMode>,
);
