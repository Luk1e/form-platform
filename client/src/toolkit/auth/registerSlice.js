import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useAxios } from "../../utils/hooks/useAxios";
import { authenticate } from "./authSlice";

export const register = createAsyncThunk(
  "auth/register",
  async (values, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await useAxios.post("/api/v1/auth/register", values);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("csrfToken", data.csrfToken);
      dispatch(authenticate);
    } catch (err) {
      return rejectWithValue(err.response.data.errors[0]);
    }
  }
);

const initialState = {
  error: null,
  success: false,
  isLoading: false,
};

export const registerSlice = createSlice({
  name: "auth/register",
  initialState,
  reducers: {
    reset: (state) => {
      state.error = null;
      state.success = false;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(register.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(register.fulfilled, (state) => {
      state.error = null;
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
