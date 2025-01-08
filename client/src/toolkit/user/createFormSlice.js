import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useAuthAxios } from "../../utils/hooks/useAxios";

export const createForm = createAsyncThunk(
  "createFormSlice/createForm",
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

export const checkIsFilled = createAsyncThunk(
  "createFormSlice/checkIsFilled",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await useAuthAxios.get(
        `/api/users/templates/${id}/isFilled`
      );
      return data;
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

const createFormSlice = createSlice({
  name: "createFormSlice",
  initialState,
  reducers: {
    resetCreateFormState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createForm.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(createForm.fulfilled, (state, action) => {
        state.success = true;
        state.loading = false;
      })
      .addCase(createForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetCreateFormState } = createFormSlice.actions;
export default createFormSlice.reducer;
