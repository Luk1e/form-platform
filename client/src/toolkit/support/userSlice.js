import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useAuthAxios } from "../../utils/hooks/useAxios";

export const getUsers = createAsyncThunk(
  "support/getUsers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await useAuthAxios.get("/api/support/users");
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const topicSlice = createSlice({
  name: "support/users",
  initialState: { users: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default topicSlice.reducer;
