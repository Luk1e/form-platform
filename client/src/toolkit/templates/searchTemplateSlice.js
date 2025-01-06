import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { useAxios } from "../../utils/hooks/useAxios";

export const searchTemplates = createAsyncThunk(
  "searchTemplateSlice/search",
  async ({ tag, query, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await useAxios.get(`/api/templates/search`, {
        params: {
          query,
          tag,
          page,
          limit,
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  templates: [],
  pagination: {
    currentPage: 1,
    pageSize: 10,
    totalTemplates: 0,
    totalPages: 0,
  },
  loading: false,
  error: null,
};

const searchTemplateSlice = createSlice({
  name: "searchTemplateSlice",
  initialState,
  reducers: {
    resetSearchState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = [...state.templates, ...action.payload.templates];
        state.pagination = action.payload.pagination;
      })
      .addCase(searchTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetSearchState } = searchTemplateSlice.actions;
export default searchTemplateSlice.reducer;
