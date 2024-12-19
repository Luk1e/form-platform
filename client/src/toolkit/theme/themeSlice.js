import { createSlice } from "@reduxjs/toolkit";

const storedTheme = localStorage.getItem("appTheme") || "light";

const initialState = {
  mode: storedTheme,
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
      localStorage.setItem("appTheme", state.mode);
    },
  },
});

export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;
