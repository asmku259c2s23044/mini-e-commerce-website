import React, { createContext, useContext, useState } from "react";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favoriteItems, setFavoriteItems] = useState([]);

  const addToFavorites = (product) => {
    const exist = favoriteItems.find((item) => item._id === product._id);

    if (!exist) {
      setFavoriteItems([...favoriteItems, { ...product }]);
    }
  };

  const removeFromFavorites = (id) => {
    setFavoriteItems(favoriteItems.filter((item) => item._id !== id));
  };

  const isFavorite = (id) => {
    return favoriteItems.some((item) => item._id === id);
  };

  return (
    <FavoritesContext.Provider
      value={{ favoriteItems, addToFavorites, removeFromFavorites, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
