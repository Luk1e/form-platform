import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useAuthAxios } from "../../utils/hooks/useAxios";

export const fetchAdminTemplates = createAsyncThunk(
  "adminContentSlice/fetchAdminTemplates",
  async (params, { rejectWithValue }) => {
    try {
      Object.keys(params).forEach((key) => {
        if (!params[key]) {
          delete params[key];
        }
      });

      const { data } = await useAuthAxios.get("/api/admin/templates", {
        params,
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchAdminForms = createAsyncThunk(
  "adminContentSlice/fetchAdminForms",
  async (params, { rejectWithValue }) => {
    try {
      Object.keys(params).forEach((key) => {
        if (!params[key]) {
          delete params[key];
        }
      });

      const { data } = await useAuthAxios.get("/api/admin/forms", { params });
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  forms: [],
  templates: [],
  pagination: {
    currentPage: 1,
    totalPages: 0,
    total: 0,
  },
  error: null,
  loading: false,
};

const adminContentSlice = createSlice({
  name: "adminContentSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminTemplates.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(fetchAdminTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload.templates;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAdminTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAdminForms.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(fetchAdminForms.fulfilled, (state, action) => {
        state.loading = false;
        state.forms = action.payload.forms;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAdminForms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminContentSlice.reducer;
