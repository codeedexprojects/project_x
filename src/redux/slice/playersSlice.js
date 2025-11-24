import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../baseurl";

export const getPlayersAdmin = createAsyncThunk(
  "adminAuth/getPlayersAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${BASE_URL}/admin/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get players"
      );
    }
  }
);

export const getUserById = createAsyncThunk(
  "adminAuth/getUserById",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${BASE_URL}/admin/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get user details"
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  "adminAuth/updateUser",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.patch(
        `${BASE_URL}/admin/user/${id}`,
        formData, 
        {
          headers: { 
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update user"
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      
      .addCase(getPlayersAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPlayersAdmin.fulfilled, (state, action) => {
        state.loading = false;
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

      
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleUser =
          action.payload?.data ||
          action.payload ||
          null;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;

        const updatedUser =
          action.payload?.data ||
          action.payload ||
          null;

        
        if (updatedUser?._id) {
          const index = state.players.findIndex((u) => u._id === updatedUser._id);
          if (index !== -1) {
            state.players[index] = updatedUser;
          }
        }

        
        if (state.singleUser?._id === updatedUser?._id) {
          state.singleUser = updatedUser;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default playersSlice.reducer;
