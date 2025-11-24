import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../baseurl";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

// GET UNIVERSAL RANKINGS
export const getUniversalRankings = createAsyncThunk(
  "ranking/getUniversalRankings",
  async ({ categoryId, tournamentId }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (categoryId) params.append('categoryId', categoryId);
      if (tournamentId) params.append('tournamentId', tournamentId);

      const response = await axios.get(
        `${BASE_URL}/admin/ranking/universal?${params.toString()}`,
        {
          headers: authHeader(),
        }
      );
      console.log(response)
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to get rankings");
    }
  }
);

// GET RANKING BY ID
export const getRankingById = createAsyncThunk(
  "ranking/getRankingById",
  async (rankingId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/admin/ranking/${rankingId}`,
        {
          headers: authHeader(),
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to get ranking details");
    }
  }
);

// CREATE RANKING
export const createRanking = createAsyncThunk(
  "ranking/createRanking",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/admin/ranking`,
        formData,
        {
          headers: authHeader(),
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create ranking");
    }
  }
);

// UPDATE RANKING
export const updateRanking = createAsyncThunk(
  "ranking/updateRanking",
  async ({ rankingId, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/admin/ranking/${rankingId}`,
        data,
        { headers: authHeader() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update ranking");
    }
  }
);

// DELETE RANKING
export const deleteRanking = createAsyncThunk(
  "ranking/deleteRanking",
  async (rankingId, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${BASE_URL}/admin/ranking/${rankingId}`,
        {
          headers: authHeader(),
        }
      );
      return rankingId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete ranking");
    }
  }
);

// UPDATE RANKING POINTS
export const updateRankingPoints = createAsyncThunk(
  "ranking/updateRankingPoints",
  async ({ rankingId, pointsData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/admin/ranking/${rankingId}/points`,
        pointsData,
        { headers: authHeader() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update ranking points");
    }
  }
);

// BULK UPDATE RANKINGS
export const bulkUpdateRankings = createAsyncThunk(
  "ranking/bulkUpdateRankings",
  async (rankingsData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/admin/ranking/bulk-update`,
        rankingsData,
        { headers: authHeader() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to bulk update rankings");
    }
  }
);

const rankingSlice = createSlice({
  name: "ranking",
  initialState: {
    rankings: [],
    universalRankings: [],
    currentRanking: null,
    loading: false,
    updateLoading: false,
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
      /* Fetch universal rankings */
      .addCase(getUniversalRankings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUniversalRankings.fulfilled, (state, action) => {
  state.loading = false;

  // 🔥 Correct fix: store actual ranking response
  state.currentRanking = action.payload?.data || null;

  // OPTIONAL: keep universalRankings list as backup
  state.universalRankings =
    action.payload?.data?.players ||
    action.payload?.data ||
    [];
})

      .addCase(getUniversalRankings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* Fetch single ranking */
      .addCase(getRankingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRankingById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRanking = action.payload?.data || action.payload;
      })
      .addCase(getRankingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* Create ranking */
      .addCase(createRanking.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(createRanking.fulfilled, (state, action) => {
        state.updateLoading = false;
        const newRanking = action.payload?.data || action.payload;
        state.rankings.push(newRanking);
        
        // Also add to universal rankings if it matches current filters
        if (state.filters.categoryId === newRanking.categoryId && 
            state.filters.tournamentId === newRanking.tournamentId) {
          state.universalRankings.push(newRanking);
        }
      })
      .addCase(createRanking.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })

      /* Update ranking */
      .addCase(updateRanking.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateRanking.fulfilled, (state, action) => {
        state.updateLoading = false;
        const updatedRanking = action.payload?.data || action.payload;
        
        // Update current ranking if it's the one being updated
        if (state.currentRanking && state.currentRanking._id === updatedRanking._id) {
          state.currentRanking = { ...state.currentRanking, ...updatedRanking };
        }
        
        // Update in rankings list
        const index = state.rankings.findIndex(r => r._id === updatedRanking._id);
        if (index !== -1) {
          state.rankings[index] = { ...state.rankings[index], ...updatedRanking };
        }
        
        // Update in universal rankings list
        const universalIndex = state.universalRankings.findIndex(r => r._id === updatedRanking._id);
        if (universalIndex !== -1) {
          state.universalRankings[universalIndex] = { 
            ...state.universalRankings[universalIndex], 
            ...updatedRanking 
          };
        }
      })
      .addCase(updateRanking.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })

      /* Delete ranking */
      .addCase(deleteRanking.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(deleteRanking.fulfilled, (state, action) => {
        state.updateLoading = false;
        const rankingId = action.payload;
        
        // Remove from rankings list
        state.rankings = state.rankings.filter((r) => r._id !== rankingId);
        
        // Remove from universal rankings list
        state.universalRankings = state.universalRankings.filter((r) => r._id !== rankingId);
        
        // Clear current ranking if it's the one being deleted
        if (state.currentRanking && state.currentRanking._id === rankingId) {
          state.currentRanking = null;
        }
      })
      .addCase(deleteRanking.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })

      /* Update ranking points */
      .addCase(updateRankingPoints.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateRankingPoints.fulfilled, (state, action) => {
        state.updateLoading = false;
        const updatedRanking = action.payload?.data || action.payload;
        
        // Update current ranking
        if (state.currentRanking && state.currentRanking._id === updatedRanking._id) {
          state.currentRanking = { ...state.currentRanking, ...updatedRanking };
        }
        
        // Update in rankings list
        const index = state.rankings.findIndex(r => r._id === updatedRanking._id);
        if (index !== -1) {
          state.rankings[index] = { ...state.rankings[index], ...updatedRanking };
        }
        
        // Update in universal rankings list
        const universalIndex = state.universalRankings.findIndex(r => r._id === updatedRanking._id);
        if (universalIndex !== -1) {
          state.universalRankings[universalIndex] = { 
            ...state.universalRankings[universalIndex], 
            ...updatedRanking 
          };
        }
      })
      .addCase(updateRankingPoints.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })

      /* Bulk update rankings */
      .addCase(bulkUpdateRankings.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(bulkUpdateRankings.fulfilled, (state, action) => {
        state.updateLoading = false;
        const updatedRankings = action.payload?.data || action.payload;
        
        // Update all rankings in the list
        if (Array.isArray(updatedRankings)) {
          updatedRankings.forEach(updatedRanking => {
            // Update in rankings list
            const index = state.rankings.findIndex(r => r._id === updatedRanking._id);
            if (index !== -1) {
              state.rankings[index] = { ...state.rankings[index], ...updatedRanking };
            }
            
            // Update in universal rankings list
            const universalIndex = state.universalRankings.findIndex(r => r._id === updatedRanking._id);
            if (universalIndex !== -1) {
              state.universalRankings[universalIndex] = { 
                ...state.universalRankings[universalIndex], 
                ...updatedRanking 
              };
            }
          });
        }
      })
      .addCase(bulkUpdateRankings.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  resetRankingError, 
  clearCurrentRanking, 
  setRankingFilters, 
  clearRankingFilters 
} = rankingSlice.actions;

export default rankingSlice.reducer;