import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../baseurl";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

export const getUniversalRankings = createAsyncThunk(
  "ranking/getUniversalRankings",
  async ({ categoryId, tournamentId }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (categoryId) params.append("categoryId", categoryId);
      if (tournamentId) params.append("tournamentId", tournamentId);

      const response = await axios.get(
        `${BASE_URL}/admin/ranking/universal?${params.toString()}`,
        {
          headers: authHeader(),
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get rankings"
      );
    }
  }
);


export const getOverallRankings = createAsyncThunk(
  "ranking/getUniversalRankings",
  async ({ categoryId, tournamentId }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (categoryId) params.append("categoryId", categoryId);
      if (tournamentId) params.append("tournamentId", tournamentId);

      const response = await axios.get(
        `${BASE_URL}/admin/ranking/overall`,
        {
          headers: authHeader(),
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get rankings"
      );
    }
  }
);

const rankingSlice = createSlice({
  name: "ranking",
  initialState: {
    universalRankings: [],
    currentRanking: null,
    loading: false,
    error: null,
    filters: {
      categoryId: null,
      tournamentId: null,
    },
  },
  reducers: {
    resetRankingError: (state) => {
      state.error = null;
    },
    clearCurrentRanking: (state) => {
      state.currentRanking = null;
    },
    setRankingFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearRankingFilters: (state) => {
      state.filters = {
        categoryId: null,
        tournamentId: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUniversalRankings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUniversalRankings.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRanking = action.payload?.data || null;

        state.universalRankings =
          action.payload?.data?.players || action.payload?.data || [];
      })
      .addCase(getUniversalRankings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  resetRankingError,
  clearCurrentRanking,
  setRankingFilters,
  clearRankingFilters,
} = rankingSlice.actions;

export default rankingSlice.reducer;
