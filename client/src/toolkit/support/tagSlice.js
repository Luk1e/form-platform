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

const tagSlice = createSlice({
  name: "support/tags",
  initialState: { tags: [], loading: false, error: null },
  reducers: {},
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
      });
  },
});

export default tagSlice.reducer;
