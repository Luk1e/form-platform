import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useAxios } from "../../utils/hooks/useAxios";

export const getPopularTemplates = createAsyncThunk(
  "popularTemplates/get",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await useAxios.get("/api/templates/popular");

      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const popularTemplateSlice = createSlice({
  name: "popularTemplates",
  initialState: {
    loading: false,
    error: null,
    popularTemplates: [],
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPopularTemplates.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPopularTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.popularTemplates = action.payload;
      })
      .addCase(getPopularTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default popularTemplateSlice.reducer;
