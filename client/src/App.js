import React from "react";
import { Switch, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HotelsPage from "./components/pages/HotelsPage";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Switch>
        <Route exact path="/" component={HotelsPage} />
        <Route exact path="/hotels" component={HotelsPage} />
      </Switch>
    </div>
  );
}

export default App;
