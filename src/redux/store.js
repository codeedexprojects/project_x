import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "./slice/adminAuth";
import PlayerReducer from "./slice/playersSlice";
import tournamentReducer from "./slice/tournamentSlice";
import clubReducer from "./slice/clubSlice";
import categoryReducer from "./slice/categorySlice";
import umpireReducer from "./slice/umpireSlice"
import rankingReducer from "./slice/rankingSlice"

export const store = configureStore({
  reducer: {
    adminAuth: adminAuthReducer,
    playerSlice: PlayerReducer,
    tournamentsSlice: tournamentReducer,
    clubs: clubReducer,
    category: categoryReducer,
    umpires: umpireReducer,
    rankings: rankingReducer,
  },
});

export default store;
