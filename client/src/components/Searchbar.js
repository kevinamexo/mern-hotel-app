import React, { useEffect, useState, useRef } from "react";
import { useSearchContext } from "../context/SearchContext";
import { TextField, IconButton, InputAdornment } from "@material-ui/core";
import { AiOutlineSearch } from "react-icons/ai";
import "./Searchbar.css";

const Searchbar = () => {
  const { searchValue, setSearchValue } = useSearchContext();
  const [searchFocus, setSearchFocus] = useState(false);
  const searchInput = useRef();
  const clearSearchFocus = (e) => {
    if (e.target !== searchInput.current) {
      setSearchFocus(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", clearSearchFocus);

    return () => {
      document.removeEventListener("click", clearSearchFocus);
    };
  }, []);

  return (
    <form className="navbar-search" onFocus={() => setSearchFocus(true)}>
      <span className={searchFocus ? "hidden" : "navbar-search-icon"}>
        <AiOutlineSearch />
      </span>

      <input
        ref={searchInput}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Search for Hotels"
        className={
          searchFocus ? "navbar-search-inputFocused" : "navbar-search-input"
        }
      />
    </form>
  );
};

export default Searchbar;
