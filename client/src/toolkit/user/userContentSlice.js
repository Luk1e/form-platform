import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useAuthAxios } from "../../utils/hooks/useAxios";

export const fetchUserTemplates = createAsyncThunk(
  "userContentSlice/fetchUserTemplates",
  async (params, { rejectWithValue }) => {
    try {
      Object.keys(params).forEach((key) => {
        if (!params[key]) {
          delete params[key];
        }
      });

      const { data } = await useAuthAxios.get("/api/users/my-templates", {
        params,
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchUserForms = createAsyncThunk(
  "userContentSlice/fetchUserForms",
  async (params, { rejectWithValue }) => {
    try {
      Object.keys(params).forEach((key) => {
        if (!params[key]) {
          delete params[key];
        }
      });

      const { data } = await useAuthAxios.get("/api/users/my-forms", {
        params,
      });
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

const userContentSlice = createSlice({
  name: "userContentSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserTemplates.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(fetchUserTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload.templates;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUserTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserForms.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(fetchUserForms.fulfilled, (state, action) => {
        state.loading = false;
        state.forms = action.payload.forms;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUserForms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userContentSlice.reducer;
