import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useAxios, useAuthAxios } from "../../utils/hooks/useAxios";

export const getTemplateEngagements = createAsyncThunk(
  "templateEngagementSlice/getTemplateEngagements",
  async ({ id, userId }, { rejectWithValue }) => {
    try {
      const { data } = await useAxios.get(
        `/api/support/engagements/${id}?userId=${userId}`
      );

      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const addComment = createAsyncThunk(
  "templateEngagementSlice/addComment",
  async ({ id, content }, { rejectWithValue }) => {
    try {
      const { data } = await useAuthAxios.post(
        `/api/users/templates/${id}/comment`,
        { content }
      );

      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const toggleLike = createAsyncThunk(
  "templateEngagementSlice/toggleLike",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await useAuthAxios.post(
        `/api/users/templates/${id}/like`
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
  engagements: null,
};

const templateEngagementSlice = createSlice({
  name: "templateEngagementSlice",
  initialState,
  reducers: {
    resetTemplateEngagementState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTemplateEngagements.fulfilled, (state, action) => {
        state.engagements = action.payload;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        state.engagements = action.payload;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.engagements = action.payload;
      });
  },
});

export const { resetTemplateEngagementState } = templateEngagementSlice.actions;
export default templateEngagementSlice.reducer;
