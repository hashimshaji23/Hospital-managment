// This is the very first file that runs in our React app.
// It finds the <div id="root"> in index.html and renders our App inside it.

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* BrowserRouter lets us use multiple pages (routes) in our app */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
