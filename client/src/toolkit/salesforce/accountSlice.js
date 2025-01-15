import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useAuthAxios } from "../../utils/hooks/useAxios";

export const getSalesforceAccount = createAsyncThunk(
  "accountSlice/getSalesforceAccount",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await useAuthAxios.get(`/api/salesforce`);

      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  accountDetails: null,
  loading: false,
  error: null,
};

const accountSlice = createSlice({
  name: "accountSlice",
  initialState,
  reducers: {
    resetAccountState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSalesforceAccount.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(getSalesforceAccount.fulfilled, (state, action) => {
        state.accountDetails = action.payload;
        state.loading = false;
      })
      .addCase(getSalesforceAccount.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { resetAccountState } = accountSlice.actions;
export default accountSlice.reducer;
