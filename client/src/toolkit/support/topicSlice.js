import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useAxios } from "../../utils/hooks/useAxios";

export const getTopics = createAsyncThunk(
  "support/getTopics",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await useAxios.get("/api/support/topics");
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const topicSlice = createSlice({
  name: "support/topics",
  initialState: { topics: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTopics.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTopics.fulfilled, (state, action) => {
        state.topics = action.payload;
        state.loading = false;
      })
      .addCase(getTopics.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default topicSlice.reducer;
