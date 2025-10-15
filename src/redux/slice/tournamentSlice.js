import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../baseurl";
import axios from "axios";


export const getTournamentsAdmin = createAsyncThunk(
  "adminAuth/getTournamentsAdmin",
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


const tournamentsSlice = createSlice({
  name: "tournaments",
  initialState: {
    tournaments: [],
    loading: false,
    error: null,
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
      });
  },
});

export default tournamentsSlice.reducer;
