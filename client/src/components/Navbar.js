import React from "react";
import SearchBar from "./Searchbar";

import "./Navbar.css";
const Navbar = () => {
  return (
    <div className="navbar">
      <h3>FindHotels</h3>
      <SearchBar />
    </div>
  );
};

export default Navbar;
