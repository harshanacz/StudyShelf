import { Book } from '@/types/book';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavoritesState {
  favorites: Book[];
}

const initialState: FavoritesState = {
  favorites: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<Book>) => {
      const exists = state.favorites.find((book) => book.key === action.payload.key);
      if (!exists) {
        state.favorites.push(action.payload);
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter((book) => book.key !== action.payload);
    },
    toggleFavorite: (state, action: PayloadAction<Book>) => {
      const index = state.favorites.findIndex((book) => book.key === action.payload.key);
      if (index >= 0) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.push(action.payload);
      }
    },
  },
});

export const { addFavorite, removeFavorite, toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
