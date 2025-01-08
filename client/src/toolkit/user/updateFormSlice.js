import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useAuthAxios } from "../../utils/hooks/useAxios";

export const updateForm = createAsyncThunk(
  "updateFormSlice/updateForm",
  async ({ formId, answers }, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      formData.append("data", JSON.stringify(answers));

      await useAuthAxios.put(`/api/users/forms/${formId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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

const updateFormSlice = createSlice({
  name: "updateFormSlice",
  initialState,
  reducers: {
    resetUpdateFormState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateForm.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(updateForm.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetUpdateFormState } = updateFormSlice.actions;
export default updateFormSlice.reducer;
