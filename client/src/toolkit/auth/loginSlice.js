import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useAxios } from "../../utils/hooks/useAxios";
import { authenticate } from "./authSlice";

export const login = createAsyncThunk(
  "auth/login",
  async (values, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await useAxios.post(`/api/v1/auth/login`, values);
      localStorage.setItem("user",JSON.stringify(data.user));
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

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    reset: (state) => {
      state.error = null;
      state.success = false;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(login.fulfilled, (state) => {
      state.error = null;
      state.success = true;
      state.isLoading = false;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export const { reset } = loginSlice.actions;
export default loginSlice.reducer;
