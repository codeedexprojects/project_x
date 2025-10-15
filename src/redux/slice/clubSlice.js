import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../baseurl";


export const getClubs = createAsyncThunk(
  "clubs/getClubs",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.get(`${BASE_URL}/admin/club`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get clubs"
      );
    }
  }
);


const clubSlice = createSlice({
  name: "clubs",
  initialState: {
    clubs: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getClubs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClubs.fulfilled, (state, action) => {
        state.loading = false;
        state.clubs = action.payload?.data || [];
      })
      .addCase(getClubs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default clubSlice.reducer;






