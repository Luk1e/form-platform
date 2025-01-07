import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useAuthAxios } from "../../utils/hooks/useAxios";

const storedTheme = localStorage.getItem("appTheme") || "light";

export const getUserTheme = createAsyncThunk(
  "themeSlice/getUserTheme",
  async (_, { rejectWithValue, getState }) => {
    const { user } = getState().authentication;
    try {
      if (!user) {
        return { theme: storedTheme };
      }

      const { data } = await useAuthAxios.get(`/api/users/theme`);
      localStorage.setItem("appTheme", data.theme);

      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const toggleTheme = createAsyncThunk(
  "themeSlice/toggleTheme",
  async (_, { rejectWithValue, getState }) => {
    const { user } = getState().authentication;
    try {
      if (!user) {
        const newTheme = storedTheme === "light" ? "dark" : "light";
        localStorage.setItem("appTheme", newTheme);
        return { theme: newTheme };
      }

      const { data } = await useAuthAxios.patch(`/api/users/theme`);
      localStorage.setItem("appTheme", data.theme);

      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  mode: storedTheme,
  loading: false,
  error: null,
};

export const themeSlice = createSlice({
  name: "themeSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserTheme.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(getUserTheme.fulfilled, (state, action) => {
        state.loading = false;
        state.mode = action.payload.theme;
      })
      .addCase(getUserTheme.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(toggleTheme.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(toggleTheme.fulfilled, (state, action) => {
        state.loading = false;
        state.mode = action.payload.theme;
      })
      .addCase(toggleTheme.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default themeSlice.reducer;
