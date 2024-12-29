import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useAuthAxios } from "../../utils/hooks/useAxios";

export const getTemplateById = createAsyncThunk(
  "getTemplate/getTemplateById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await useAuthAxios.get(`/api/templates/${id}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const getTemplateSlice = createSlice({
  name: "getTemplate",
  initialState: {
    loading: false,
    error: null,
    template: null,
  },
  reducers: {
    resetGetTemplateState: (state) => {
      state.loading = false;
      state.error = null;
      state.template = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTemplateById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTemplateById.fulfilled, (state, action) => {
        state.loading = false;
        state.template = action.payload;
      })
      .addCase(getTemplateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetGetTemplateState } = getTemplateSlice.actions;
export default getTemplateSlice.reducer;
