import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth-slice';
import favoritesReducer from './favorites-slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    favorites: favoritesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
