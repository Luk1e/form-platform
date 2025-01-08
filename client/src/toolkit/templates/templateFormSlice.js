import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useAuthAxios } from "../../utils/hooks/useAxios";

export const fetchTemplateForms = createAsyncThunk(
  "templateFormSlice/fetchTemplateForms",
  async ({ templateId, ...params }, { rejectWithValue }) => {
    try {
      Object.keys(params).forEach((key) => {
        if (!params[key]) {
          delete params[key];
        }
      });

      const { data } = await useAuthAxios.get(
        `/api/templates/${templateId}/forms`,
        {
          params,
        }
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  forms: [],
  template: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    total_pages: 0,
  },
  loading: false,
  error: null,
};

const templateFormSlice = createSlice({
  name: "templateFormSlice",
  initialState,
  reducers: { resetTemplateFormState: () => initialState },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTemplateForms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplateForms.fulfilled, (state, action) => {
        state.loading = false;
        state.forms = action.payload.forms;
        state.template = action.payload.template;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTemplateForms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetTemplateFormState } = templateFormSlice.actions;
export default templateFormSlice.reducer;
