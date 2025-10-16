import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../baseurl";

// ✅ Get all players
export const getPlayersAdmin = createAsyncThunk(
  "adminAuth/getPlayersAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${BASE_URL}/admin/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data; // Keep the whole response
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get players"
      );
    }
  }
);

// ✅ Get user by ID
export const getUserById = createAsyncThunk(
  "adminAuth/getUserById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${BASE_URL}/admin/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Single user response:", response.data);
      return response.data; // Keep full response
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get user details"
      );
    }
  }
);

const playersSlice = createSlice({
  name: "adminAuth",
  initialState: {
    players: [],
    singleUser: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      // ✅ Get all players
      .addCase(getPlayersAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPlayersAdmin.fulfilled, (state, action) => {
        state.loading = false;
        // Adjust based on backend structure
        state.players =
          action.payload?.data?.users ||
          action.payload?.data ||
          action.payload ||
          [];
      })
      .addCase(getPlayersAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Get single player by ID
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        // Store full object so UI can access { user, summary, tournamentParticipation }
        state.singleUser =
          action.payload?.data ||
          action.payload ||
          null;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default playersSlice.reducer;
