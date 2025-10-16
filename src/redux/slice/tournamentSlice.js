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
            "Content-Type": "multipart/form-data",
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

// delete tournament
export const deleteTournament = createAsyncThunk(
  "tournaments/deleteTournament",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.delete(
        `${BASE_URL}/admin/tournament/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete tournament"
      );
    }
  }
);

// edittournament
export const editTournament = createAsyncThunk(
  "tournaments/editTournament",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.patch(`${BASE_URL}/admin/tournament/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to edit tournament"
      );
    }
  }
);

// ✅ Slice
const tournamentsSlice = createSlice({
  name: "tournaments",
  initialState: {
    tournaments: [],
    singleTournament: null,
    loading: false,
    error: null,
    createLoading: false,
    createError: null,
  },

  reducers: {
    clearError: (state) => {
      state.error = null;
      state.createError = null;
    },
    clearSingleTournament: (state) => {
      state.singleTournament = null;
    },
  },

  extraReducers: (builder) => {
    builder
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
        if (action.payload?.data) {
          state.tournaments.unshift(action.payload.data);
        }
      })
      .addCase(createTournament.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload;
      })

      // deletetournament
      .addCase(deleteTournament.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTournament.fulfilled, (state, action) => {
        state.loading = false;
        state.tournaments = state.tournaments.filter(
          (tournament) =>
            tournament.id !== action.meta.arg ||
            tournament._id !== action.meta.arg
        );
        state.success = "Tournament deleted successfully";
      })
      .addCase(deleteTournament.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // edit modal
      .addCase(editTournament.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editTournament.fulfilled, (state, action) => {
        state.loading = false;
        state.tournaments = state.tournaments.filter(
          (tournament) =>
            tournament.id !== action.meta.arg ||
            tournament._id !== action.meta.arg
        );
        state.success = "Tournament edited successfully";
      })
      .addCase(editTournament.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSingleTournament } = tournamentsSlice.actions;
export default tournamentsSlice.reducer;
