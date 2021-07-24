import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { SearchContextProvider } from "./context/SearchContext";

ReactDOM.render(
  <Router>
    <SearchContextProvider>
      <App />
    </SearchContextProvider>
  </Router>,
  document.getElementById("root")
);
