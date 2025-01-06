import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useAxios } from "../../utils/hooks/useAxios";

export const getTags = createAsyncThunk(
  "tagSlice/getTags",
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
  "tagSlice/getTagCloud",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await useAxios.get("/api/support/tagCloud");

      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = { tags: [], tagCloud: [], loading: false, error: null };

const tagSlice = createSlice({
  name: "tagSlice",
  initialState,
  reducers: {
    resetTagState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTags.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(getTags.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = action.payload;
      })
      .addCase(getTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getTagCloud.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(getTagCloud.fulfilled, (state, action) => {
        state.loading = false;
        state.tagCloud = action.payload;
      })
      .addCase(getTagCloud.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetTagState } = tagSlice.actions;
export default tagSlice.reducer;
