import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useAuthAxios } from "../../utils/hooks/useAxios";

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await useAuthAxios.delete(`/api/auth/logout`);
      localStorage.removeItem("user");
      localStorage.removeItem("csrfToken");
    } catch (err) {
      return rejectWithValue(err.response.data.errors[0]);
    }
  }
);

const initialState = {
  user: null,
};

export const authSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    reset: (state) => {
      state.error = null;
    },
    authenticate: (state) => {
      const user = localStorage.getItem("user");
      const csrfToken = localStorage.getItem("csrfToken");

      if (!csrfToken || !user) {
        state.user = null;
      } else {
        state.user = JSON.parse(user);
        state.user.csrfToken = csrfToken;
      }
    },
  },

  extraReducers: (builder) => {
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
    });
  },
});

export const { reset, authenticate } = authSlice.actions;
export default authSlice.reducer;
