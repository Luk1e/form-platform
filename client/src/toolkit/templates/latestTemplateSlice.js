import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { useAxios } from "../../utils/hooks/useAxios";

export const getLatestTemplates = createAsyncThunk(
  "latestTemplateSlice/getLatestTemplates",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const { data } = await useAxios.get(
        `/api/templates/latest?page=${page}&limit=${limit}`
      );

      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  latestTemplates: [],
  pagination: {
    currentPage: 1,
    totalPages: 0,
  },
  loading: false,
  error: null,
};

const latestTemplateSlice = createSlice({
  name: "latestTemplateSlice",
  initialState,
  reducers: {
    resetLatestTemplateState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLatestTemplates.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(getLatestTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.latestTemplates = [
          ...state.latestTemplates,
          ...action.payload.latestTemplates,
        ];
        state.pagination = action.payload.pagination;
      })
      .addCase(getLatestTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetLatestTemplateState } = latestTemplateSlice.actions;
export default latestTemplateSlice.reducer;
