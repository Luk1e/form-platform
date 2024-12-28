import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useAuthAxios } from "../../utils/hooks/useAxios";

export const fetchUserTemplates = createAsyncThunk(
  "userContent/fetchUserTemplates",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await useAuthAxios.get("/api/users/my-templates", {
        params: {
          title: params.title || "",
          order: params.order || "desc",
          page: params.page || 1,
          limit: params.limit || 10,
        },
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchUserForms = createAsyncThunk(
  "userContent/fetchUserForms",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await useAuthAxios.get("/api/users/my-forms", {
        params: {
          template_title: params.template_title || "",
          order: params.order || "desc",
          page: params.page || 1,
          limit: params.limit || 10,
        },
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteTemplate = createAsyncThunk(
  "userContent/deleteTemplate",
  async (templateId, { rejectWithValue }) => {
    try {
      await useAuthAxios.delete(`/api/templates/${templateId}`);
      return templateId;
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

const userContentSlice = createSlice({
  name: "userContent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
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
        state.loading = true;
        state.error = null;
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

export const { setActiveView } = userContentSlice.actions;
export default userContentSlice.reducer;
