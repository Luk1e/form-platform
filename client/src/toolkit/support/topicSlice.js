import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useAxios } from "../../utils/hooks/useAxios";

export const getTopics = createAsyncThunk(
  "topicSlice/getTopics",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await useAxios.get("/api/support/topics");
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = { topics: [], loading: false, error: null };

const topicSlice = createSlice({
  name: "topicSlice",
  initialState,
  reducers: { resetTopicState: () => initialState },
  extraReducers: (builder) => {
    builder
      .addCase(getTopics.pending, (state) => {
        state.error = null;
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

export const { resetTopicState } = topicSlice.actions;
export default topicSlice.reducer;
