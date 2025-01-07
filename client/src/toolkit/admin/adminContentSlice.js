import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useAuthAxios } from "../../utils/hooks/useAxios";

export const fetchAdminTemplates = createAsyncThunk(
  "adminContent/fetchAdminTemplates",
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
  "adminContent/fetchAdminForms",
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
  error: null,
  loading: false,

  forms: [],
  templates: [],
  pagination: {
    currentPage: 1,
    totalPages: 0,
    total: 0,
  },
};

const adminContentSlice = createSlice({
  name: "adminContent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
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
        state.loading = true;
        state.error = null;
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
