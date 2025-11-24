import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../baseurl";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

// GET ALL UMPIRES
export const getUmpiresAdmin = createAsyncThunk(
  "umpire/getUmpiresAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/umpire`, {
        headers: authHeader(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to get umpires");
    }
  }
);

// GET UMPIRE BY ID
export const getUmpireById = createAsyncThunk(
  "umpire/getUmpireById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/umpire/${id}`, {
        headers: authHeader(),
      });
      console.log(response.data.data)
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to get umpire details");
    }
  }
);

// CREATE UMPIRE
export const createUmpire = createAsyncThunk(
  "umpire/createUmpire",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/admin/umpire`, formData, {
        headers: authHeader(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create umpire");
    }
  }
);

// UPDATE UMPIRE - MISSING THUNK
export const updateUmpire = createAsyncThunk(
  "umpire/updateUmpire",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/admin/umpire/${id}`,
        data,
        { headers: authHeader() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update umpire");
    }
  }
);

// ASSIGN UMPIRE TO TOURNAMENT
export const assignUmpireToTournament = createAsyncThunk(
  "umpire/assignTournament",
  async ({ umpireId, tournamentId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/admin/umpire/${umpireId}/assign-tournament`,
        { tournamentId },
        { headers: authHeader() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to assign umpire");
    }
  }
);

// REMOVE UMPIRE FROM TOURNAMENT
export const removeUmpireFromTournament = createAsyncThunk(
  "umpire/removeTournament",
  async ({ umpireId, tournamentId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/admin/umpire/${umpireId}/tournament/${tournamentId}`,
        { headers: authHeader() }
      );
      return { umpireId, tournamentId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to remove umpire");
    }
  }
);

// DELETE UMPIRE
export const deleteUmpire = createAsyncThunk(
  "umpire/deleteUmpire",
  async (umpireId, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/admin/umpire/${umpireId}`, {
        headers: authHeader(),
      });
      return umpireId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete umpire");
    }
  }
);

const umpireSlice = createSlice({
  name: "umpire",
  initialState: {
    umpires: [],
    currentUmpire: null,
    loading: false,
    updateLoading: false, // Added separate loading state for update
    error: null,
  },
  reducers: {
    // Optional: You can add a reset action if needed
    resetUmpireError: (state) => {
      state.error = null;
    },
    clearCurrentUmpire: (state) => {
      state.currentUmpire = null;
    }
  },
  extraReducers: (builder) => {
    builder
      /* Fetch all umpires */
      .addCase(getUmpiresAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUmpiresAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.umpires =
          action.payload?.data?.umpires ||
          action.payload?.data ||
          action.payload ||
          [];
      })
      .addCase(getUmpiresAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* Fetch single umpire */
      .addCase(getUmpireById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUmpireById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUmpire = action.payload?.data || action.payload;
      })
      .addCase(getUmpireById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* Create umpire */
      .addCase(createUmpire.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(createUmpire.fulfilled, (state, action) => {
        state.updateLoading = false;
        const newUmpire = action.payload?.data || action.payload;
        state.umpires.push(newUmpire);
      })
      .addCase(createUmpire.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })

      /* Update umpire - NEW */
      .addCase(updateUmpire.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateUmpire.fulfilled, (state, action) => {
        state.updateLoading = false;
        const updatedUmpire = action.payload?.data || action.payload;
        
        // Update current umpire if it's the one being updated
        if (state.currentUmpire && state.currentUmpire._id === updatedUmpire._id) {
          state.currentUmpire = { ...state.currentUmpire, ...updatedUmpire };
        }
        
        // Update in umpires list
        const index = state.umpires.findIndex(u => u._id === updatedUmpire._id);
        if (index !== -1) {
          state.umpires[index] = { ...state.umpires[index], ...updatedUmpire };
        }
      })
      .addCase(updateUmpire.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })

      /* Assign umpire to tournament */
      .addCase(assignUmpireToTournament.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(assignUmpireToTournament.fulfilled, (state, action) => {
        state.updateLoading = false;
        const updated = action.payload?.data || action.payload;
        
        // Update current umpire
        if (state.currentUmpire?._id === updated._id) {
          state.currentUmpire = updated;
        }
        
        // Update in umpires list
        const index = state.umpires.findIndex((u) => u._id === updated._id);
        if (index !== -1) {
          state.umpires[index] = updated;
        }
      })
      .addCase(assignUmpireToTournament.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })

      /* Remove from tournament */
      .addCase(removeUmpireFromTournament.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(removeUmpireFromTournament.fulfilled, (state, action) => {
        state.updateLoading = false;
        const { umpireId, tournamentId } = action.payload;

        // Update current umpire
        if (state.currentUmpire?._id === umpireId) {
          state.currentUmpire.assignedTournaments = state.currentUmpire.assignedTournaments?.filter(
            (t) => t._id !== tournamentId
          );
        }
        
        const umpireIndex = state.umpires.findIndex(u => u._id === umpireId);
        if (umpireIndex !== -1 && state.umpires[umpireIndex].assignedTournaments) {
          state.umpires[umpireIndex].assignedTournaments = state.umpires[umpireIndex].assignedTournaments.filter(
            t => t._id !== tournamentId
          );
        }
      })
      .addCase(removeUmpireFromTournament.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteUmpire.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(deleteUmpire.fulfilled, (state, action) => {
        state.updateLoading = false;
        const id = action.payload;
        state.umpires = state.umpires.filter((u) => u._id !== id);
        
        if (state.currentUmpire && state.currentUmpire._id === id) {
          state.currentUmpire = null;
        }
      })
      .addCase(deleteUmpire.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetUmpireError, clearCurrentUmpire } = umpireSlice.actions;
export default umpireSlice.reducer;