import React, { useContext, useState } from 'react';

const CategoriesContext = React.createContext();
const CategoriesUpdateContext = React.createContext();

export function useCategories() {
  return useContext(CategoriesContext);
}

export function useCategoriesUpdate() {
  return useContext(CategoriesUpdateContext);
}

export function CategoriesProvider({ children }) {
  const [category, setCategory] = useState([]);

  function changeCategory(category) {
    setCategory(category);
  }

  return (
    <CategoriesContext.Provider value={{ category, setCategory }}>
      <CategoriesUpdateContext.Provider value={changeCategory}>
        {children}
      </CategoriesUpdateContext.Provider>
    </CategoriesContext.Provider>
  );
}
