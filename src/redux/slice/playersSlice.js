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

export const createUser = createAsyncThunk(
  "adminAuth/createUser",
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `${BASE_URL}/admin/user/create`,
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
        error.response?.data?.message || "Failed to create user"
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
      console.log(response);

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

export const deleteUser = createAsyncThunk(
  "adminAuth/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.delete(`${BASE_URL}/admin/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { id, message: response.data?.message || "User deleted successfully" };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete user"
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
    deleteLoading: false, 
    deleteError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;

        const newUser = action.payload?.data || action.payload || null;

        if (newUser) {
          state.players.unshift(newUser);
        }
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

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
        state.singleUser = action.payload?.data || action.payload || null;
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

        const updatedUser = action.payload?.data || action.payload || null;

        if (updatedUser?._id) {
          const index = state.players.findIndex(
            (u) => u._id === updatedUser._id
          );
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
      })

      // Delete user cases
      .addCase(deleteUser.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.deleteLoading = false;
        
        // Remove the deleted user from the players array
        state.players = state.players.filter(
          (player) => player._id !== action.payload.id
        );
        
        // If the deleted user is the current singleUser, clear it
        if (state.singleUser?._id === action.payload.id) {
          state.singleUser = null;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
      });
  },
});

export default playersSlice.reducer;