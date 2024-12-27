import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useAxios } from "../../utils/hooks/useAxios";

export const getLatestTemplates = createAsyncThunk(
  "latestTemplates/get",
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

const latestTemplateSlice = createSlice({
  name: "latestTemplates",
  initialState: {
    loading: false,
    error: null,
    latestTemplates: [],
    pagination: {
      currentPage: 1,
      totalPages: 0,
    },
  },
  reducers: {
    resetLatestTemplateState: (state) => {
      state.error = null;
      state.loading = false;
      state.latestTemplates = [];
      state.pagination.totalPages = 0;
      state.pagination.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLatestTemplates.pending, (state) => {
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
