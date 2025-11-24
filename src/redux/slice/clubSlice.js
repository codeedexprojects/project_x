import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../baseurl";

// getclubs
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

// createclub (updated for FormData)
export const createClubs = createAsyncThunk(
  "clubs/createClubs",
  async (clubData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.post(`${BASE_URL}/admin/club`, clubData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Changed to multipart/form-data
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create club"
      );
    }
  }
);

// editclub (updated for FormData)
export const editClubs = createAsyncThunk(
  "clubs/editClubs",
  async ({ id, clubData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.patch(
        `${BASE_URL}/admin/club/${id}`,
        clubData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Changed to multipart/form-data
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to edit club"
      );
    }
  }
);

// deleteclub

export const deleteClubs = createAsyncThunk(
  "clubs/deleteClubs",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await axios.delete(`${BASE_URL}/admin/club/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
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
    deleting: false,
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
      })

      // create club

      .addCase(createClubs.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createClubs.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.clubs.push(action.payload.data);
      })
      .addCase(createClubs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // edit club
      .addCase(editClubs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editClubs.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Club updated successfully!";
        const index = state.clubs.findIndex(
          (club) => club._id === action.payload._id
        );
        if (index !== -1) {
          state.clubs[index] = action.payload;
        }
      })
      .addCase(editClubs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // delete club
      .addCase(deleteClubs.pending, (state) => {
        state.deleting = true;
      })
      .addCase(deleteClubs.fulfilled, (state, action) => {
        state.deleting = false;
        state.clubs = state.clubs.filter(
          (club) => club._id !== action.payload.id
        );
      })
      .addCase(deleteClubs.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      });
  },
});

export default clubSlice.reducer;
