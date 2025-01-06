import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { useAxios } from "../../utils/hooks/useAxios";

export const getPopularTemplates = createAsyncThunk(
  "popularTemplateSlice/getPopularTemplates",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await useAxios.get("/api/templates/popular");

      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  popularTemplates: [],
  loading: false,
  error: null,
};

const popularTemplateSlice = createSlice({
  name: "popularTemplateSlice",
  initialState,
  reducers: {
    resetPopularTemplateState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPopularTemplates.pending, (state) => {
        state.error = null;
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

export const { resetPopularTemplateState } = popularTemplateSlice.actions;
export default popularTemplateSlice.reducer;
