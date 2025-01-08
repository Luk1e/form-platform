import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useAuthAxios } from "../../utils/hooks/useAxios";

export const deleteForm = createAsyncThunk(
  "deleteFormSlice/deleteForm",
  async (id, { rejectWithValue }) => {
    try {
      await useAuthAxios.delete(`/api/users/forms/${id}`);
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const deleteFormSlice = createSlice({
  name: "deleteFormSlice",
  initialState,
  reducers: {
    resetDeleteFormState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteForm.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(deleteForm.fulfilled, (state, action) => {
        state.success = true;
        state.loading = false;
      })
      .addCase(deleteForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetDeleteFormState } = deleteFormSlice.actions;
export default deleteFormSlice.reducer;
