import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../baseurl";


export const getPlayersAdmin = createAsyncThunk(
  "adminAuth/getPlayersAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.get(`${BASE_URL}/admin/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "failed to get players"
      );
    }
  }
);


const playersSlice = createSlice({
  name: "adminAuth",
  initialState: {
    players: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPlayersAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPlayersAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.players = action.payload?.data || [];
      })
      .addCase(getPlayersAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default playersSlice.reducer;





