import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useAuthAxios } from "../../utils/hooks/useAxios";

export const deleteTemplate = createAsyncThunk(
  "deleteTemplate/delete",
  async (id, { rejectWithValue }) => {
    try {
      await useAuthAxios.delete(`/api/templates/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  success: false,
  deletedTemplateId: null,
};

const deleteTemplateSlice = createSlice({
  name: "deleteTemplate",
  initialState,
  reducers: {
    resetDeleteTemplateState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.deletedTemplateId = action.payload;
      })
      .addCase(deleteTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetDeleteTemplateState } = deleteTemplateSlice.actions;
export default deleteTemplateSlice.reducer;
