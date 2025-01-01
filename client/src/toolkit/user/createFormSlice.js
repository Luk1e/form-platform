import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useAuthAxios } from "../../utils/hooks/useAxios";

export const createForm = createAsyncThunk(
  "createForm/create",
  async ({ id, answers }, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      formData.append("data", JSON.stringify(answers));

      await useAuthAxios.post(`/api/users/templates/${id}/fill`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const createFormSlice = createSlice({
  name: "createForm",
  initialState: {
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetCreateFormState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createForm.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createForm.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetCreateFormState } = createFormSlice.actions;
export default createFormSlice.reducer;
