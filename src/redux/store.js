import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "./slice/adminAuth"
import SliceReducer from "./slice/playersSlice"
import tournamentReducer from "./slice/tournamentSlice"
import clubReducer from "./slice/clubSlice"

export const store = configureStore({
  reducer: {
 adminAuth: adminAuthReducer,
 playerSlice: SliceReducer,
 tournamentsSlice: tournamentReducer,
  clubs: clubReducer, 
  },

  });

  export default store;