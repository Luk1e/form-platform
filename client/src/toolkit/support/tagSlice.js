import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useAxios } from "../../utils/hooks/useAxios";

export const getTags = createAsyncThunk(
  "support/getTags",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await useAxios.get("/api/support/tags");
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getTagCloud = createAsyncThunk(
  "support/getTagCloud",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await useAxios.get("/api/support/tagCloud");
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const tagSlice = createSlice({
  name: "support/tags",
  initialState: { tags: [], tagCloud: [], loading: false, error: null },
  reducers: {
    resetTagState: (state) => {
      state.loading = false;
      state.error = null;
      state.tags = [];
      state.tagCloud = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTags.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTags.fulfilled, (state, action) => {
        state.tags = action.payload;
        state.loading = false;
      })
      .addCase(getTags.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(getTagCloud.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTagCloud.fulfilled, (state, action) => {
        state.tagCloud = action.payload;
        state.loading = false;
      })
      .addCase(getTagCloud.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { resetTagState } = tagSlice.actions;
export default tagSlice.reducer;
