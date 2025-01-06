import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { authenticate } from "./authSlice";
import { useAxios } from "../../utils/hooks/useAxios";

export const login = createAsyncThunk(
  "loginSlice/login",
  async (values, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await useAxios.post(`/api/auth/login`, values);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("csrfToken", data.csrfToken);
      dispatch(authenticate());
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  "loginSlice/loginWithGoogle",
  async (accessToken, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await useAxios.post("/api/auth/google", {
        accessToken,
      });

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("csrfToken", data.csrfToken);
      dispatch(authenticate());
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  success: false,
  loading: false,
  error: null,
};

export const loginSlice = createSlice({
  name: "loginSlice",
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.error = null;
      state.loading = true;
    });
    builder.addCase(login.fulfilled, (state) => {
      state.success = true;
      state.loading = false;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(loginWithGoogle.pending, (state) => {
      state.error = null;
      state.loading = true;
    });
    builder.addCase(loginWithGoogle.fulfilled, (state) => {
      state.success = true;
      state.loading = false;
    });
    builder.addCase(loginWithGoogle.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { reset } = loginSlice.actions;
export default loginSlice.reducer;
