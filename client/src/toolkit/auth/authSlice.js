import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { useAuthAxios } from "../../utils/hooks/useAxios";

export const logout = createAsyncThunk(
  "authSlice/logout",
  async (_, { rejectWithValue }) => {
    try {
      await useAuthAxios.delete(`/api/auth/logout`);
      localStorage.removeItem("user");
      localStorage.removeItem("csrfToken");
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  user: null,
};

export const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    authenticate: (state) => {
      const user = localStorage.getItem("user");
      const csrfToken = localStorage.getItem("csrfToken");

      if (!csrfToken || !user) {
        state.user = null;
      } else {
        state.user = JSON.parse(user);
      }
    },
  },

  extraReducers: (builder) => {
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
    });
  },
});

export const { authenticate } = authSlice.actions;
export default authSlice.reducer;
