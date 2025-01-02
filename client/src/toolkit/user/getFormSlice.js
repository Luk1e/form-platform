import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useAuthAxios } from "../../utils/hooks/useAxios";

export const getForm = createAsyncThunk(
  "getForm/getForm",
  async (formId, { rejectWithValue }) => {
    try {
      const { data } = await useAuthAxios.get(`/api/users/forms/${formId}`);

      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const getFormSlice = createSlice({
  name: "getForm",
  initialState: {
    loading: false,
    error: null,
    form: null,
  },
  reducers: {
    resetGetFormState: (state) => {
      state.loading = false;
      state.error = null;
      state.form = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getForm.fulfilled, (state, action) => {
        state.loading = false;
        state.form = action.payload;
      })
      .addCase(getForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetGetFormState } = getFormSlice.actions;
export default getFormSlice.reducer;
