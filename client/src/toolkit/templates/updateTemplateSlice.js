import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useAuthAxios } from "../../utils/hooks/useAxios";

export const updateTemplate = createAsyncThunk(
  "updateTemplate/update",
  async ({ id, templateData }, { rejectWithValue }) => {
    try {
      const { data } = await useAuthAxios.put(
        `/api/templates/${id}`,
        templateData
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const updateTemplateSlice = createSlice({
  name: "updateTemplate",
  initialState: {
    loading: false,
    error: null,
    success: false,
    updatedTemplate: null,
  },
  reducers: {
    resetUpdateTemplateState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.updatedTemplate = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.updatedTemplate = action.payload;
      })
      .addCase(updateTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetUpdateTemplateState } = updateTemplateSlice.actions;
export default updateTemplateSlice.reducer;
