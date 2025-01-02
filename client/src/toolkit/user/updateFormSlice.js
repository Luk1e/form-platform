import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useAuthAxios } from "../../utils/hooks/useAxios";

export const updateForm = createAsyncThunk(
  "updateForm/getUserFilledForm",
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

const updateFormSlice = createSlice({
  name: "updateForm",
  initialState: {
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetUpdateFormState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateForm.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateForm.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetUpdateFormState } = updateFormSlice.actions;
export default updateFormSlice.reducer;
