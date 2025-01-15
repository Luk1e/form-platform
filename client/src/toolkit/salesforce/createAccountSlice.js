import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useAuthAxios } from "../../utils/hooks/useAxios";
import { getSalesforceAccount } from "./accountSlice";

export const createSalesforceAccount = createAsyncThunk(
  "createAccountSlice/createSalesforceAccount",
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      Object.keys(formData).forEach((key) => {
        if (!formData[key]) {
          delete formData[key];
        }
      });

      const { data } = await useAuthAxios.post(`/api/salesforce`, formData);

      dispatch(getSalesforceAccount());
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

const createAccountSlice = createSlice({
  name: "createAccountSlice",
  initialState,
  reducers: {
    resetCreateAccountState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSalesforceAccount.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(createSalesforceAccount.fulfilled, (state) => {
        state.success = true;
        state.loading = false;
      })
      .addCase(createSalesforceAccount.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { resetCreateAccountState } = createAccountSlice.actions;
export default createAccountSlice.reducer;
