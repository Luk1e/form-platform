import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useAxios } from "../../utils/hooks/useAxios";

export const searchTemplates = createAsyncThunk(
  "searchTemplates/search",
  async ({ query, tag, page = 1, limit = 10 }) => {
    const response = await useAxios.get(`/api/templates/search`, {
      params: {
        query,
        tag,
        page,
        limit,
      },
    });
    return response.data;
  }
);

const searchTemplatesSlice = createSlice({
  name: "searchTemplates",
  initialState: {
    templates: [],
    pagination: {
      currentPage: 1,
      pageSize: 10,
      totalTemplates: 0,
      totalPages: 0,
    },
    loading: false,
    error: null,
  },
  reducers: {
    resetSearchState: (state) => {
      state.templates = [];
      state.pagination = {
        currentPage: 1,
        pageSize: 10,
        totalTemplates: 0,
        totalPages: 0,
      };
      state.loading = false;
      state.error = null;
    },
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

export const { resetSearchState } = searchTemplatesSlice.actions;
export default searchTemplatesSlice.reducer;
