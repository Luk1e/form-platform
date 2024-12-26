import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useAuthAxios } from "../../utils/hooks/useAxios";

export const fetchTemplates = createAsyncThunk(
  "templates/fetchTemplates",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await useAuthAxios.get("/api/templates/search", {
        params,
      });
      return data;
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
  currentTemplate: null,
};

const templateSlice = createSlice({
  name: "templates",
  initialState,
  reducers: {
    setCurrentTemplate: (state, action) => {
      state.currentTemplate = action.payload;
    },
    clearCurrentTemplate: (state) => {
      state.currentTemplate = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTemplates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload.templates;
        state.pagination = action.payload.pagination;
      });
  },
});

export const { setCurrentTemplate, clearCurrentTemplate } =
  templateSlice.actions;
export default templateSlice.reducer;
