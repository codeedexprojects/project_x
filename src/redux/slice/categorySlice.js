import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../baseurl";


export const getCategories = createAsyncThunk(
  "clubs/getCategories",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.get(`${BASE_URL}/admin/category`, {
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

const categorySlice =createSlice({
     name: "category",
      initialState: {
        category: [],
        loading: false,
        error: null,
      },
      extraReducers: (builder) => {
        builder
          .addCase(getCategories.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(getCategories.fulfilled, (state, action) => {
            state.loading = false;
            state.category = action.payload?.data || [];
          })
          .addCase(getCategories.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
        }
})

export default categorySlice.reducer;
