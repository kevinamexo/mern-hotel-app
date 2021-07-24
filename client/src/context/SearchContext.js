import React, { useState, createContext, useContext } from "react";

const SearchContext = createContext();

export const SearchContextProvider = ({ children }) => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <SearchContext.Provider value={(searchValue, setSearchValue)}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => useContext(SearchContext);
