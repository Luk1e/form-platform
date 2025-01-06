import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useAxios, useAuthAxios } from "../../utils/hooks/useAxios";

export const getUserTemplateById = createAsyncThunk(
  "getTemplateSlice/getUserTemplateById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await useAuthAxios.get(`/api/users/templates/${id}`);

      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getTemplateById = createAsyncThunk(
  "getTemplateSlice/getTemplateById",
  async ({ id, userId }, { rejectWithValue }) => {
    try {
      const { data } = await useAxios.get(
        `/api/templates/${id}?query=${userId}`
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
  template: null,
};

const getTemplateSlice = createSlice({
  name: "getTemplateSlice",
  initialState,
  reducers: {
    resetGetTemplateState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTemplateById.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(getTemplateById.fulfilled, (state, action) => {
        state.loading = false;
        state.template = action.payload;
      })
      .addCase(getTemplateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getUserTemplateById.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(getUserTemplateById.fulfilled, (state, action) => {
        state.loading = false;
        state.template = action.payload;
      })
      .addCase(getUserTemplateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetGetTemplateState } = getTemplateSlice.actions;
export default getTemplateSlice.reducer;
