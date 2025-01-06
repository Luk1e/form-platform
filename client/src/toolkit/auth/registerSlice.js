import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { authenticate } from "./authSlice";
import { useAxios } from "../../utils/hooks/useAxios";

export const register = createAsyncThunk(
  "registerSlice/register",
  async (values, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await useAxios.post("/api/auth/register", values);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("csrfToken", data.csrfToken);
      dispatch(authenticate());
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  error: null,
  success: false,
  isLoading: false,
};

export const registerSlice = createSlice({
  name: "registerSlice",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(register.pending, (state) => {
      state.error = null;
      state.isLoading = true;
    });
    builder.addCase(register.fulfilled, (state) => {
      state.success = true;
      state.isLoading = false;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export const { reset } = registerSlice.actions;
export default registerSlice.reducer;
