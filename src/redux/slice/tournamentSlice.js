import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../baseurl";
import axios from "axios";

// ✅ Get all tournaments
export const getTournamentsAdmin = createAsyncThunk(
  "tournaments/getTournamentsAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${BASE_URL}/admin/tournament`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get tournaments"
      );
    }
  }
);

// ✅ Get tournament by ID
export const getTournamentById = createAsyncThunk(
  "tournaments/getTournamentById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${BASE_URL}/admin/tournament/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Tournament response:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get tournament details"
      );
    }
  }
);

// ✅ Create new tournament
export const createTournament = createAsyncThunk(
  "tournaments/createTournament",
  async (tournamentData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${BASE_URL}/admin/tournament/upload`,
        tournamentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create tournament"
      );
    }
  }
);

// ✅ Slice
const tournamentsSlice = createSlice({
  name: "tournaments",
  initialState: {
    tournaments: [],
    singleTournament: null, // 👈 For /id data
    loading: false,
    error: null,
    createLoading: false, // 👈 Separate loading state for create operation
    createError: null, // 👈 Separate error state for create operation
  },

  reducers: {
    // 👈 Optional: Add reducer to clear errors
    clearError: (state) => {
      state.error = null;
      state.createError = null;
    },
    // 👈 Optional: Add reducer to clear single tournament data
    clearSingleTournament: (state) => {
      state.singleTournament = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // 🔹 Get all tournaments
      .addCase(getTournamentsAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTournamentsAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.tournaments = action.payload?.data || [];
      })
      .addCase(getTournamentsAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Get single tournament by ID
      .addCase(getTournamentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTournamentById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleTournament = action.payload?.data || null;
      })
      .addCase(getTournamentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Create new tournament
      .addCase(createTournament.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createTournament.fulfilled, (state, action) => {
        state.createLoading = false;
        // Optionally add the new tournament to the tournaments list
        if (action.payload?.data) {
          state.tournaments.unshift(action.payload.data);
        }
      })
      .addCase(createTournament.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload;
      });
  },
});

export const { clearError, clearSingleTournament } = tournamentsSlice.actions;
export default tournamentsSlice.reducer;