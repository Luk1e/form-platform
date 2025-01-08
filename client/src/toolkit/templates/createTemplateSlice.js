import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useAuthAxios } from "../../utils/hooks/useAxios";

export const createTemplate = createAsyncThunk(
  "createTemplateSlice/createTemplate",
  async (templateData, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      if (templateData.image_file) {
        formData.append("image", templateData.image_file);
      }

      const { image_file, ...restData } = templateData;
      formData.append("data", JSON.stringify(restData));

      const { data } = await useAuthAxios.post("/api/templates", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return data?.templateId;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  success: false,
  createdTemplateId: null,
};

const createTemplateSlice = createSlice({
  name: "createTemplateSlice",
  initialState,
  reducers: {
    resetCreateTemplateState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.createdTemplateId = action.payload;
      })
      .addCase(createTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetCreateTemplateState } = createTemplateSlice.actions;
export default createTemplateSlice.reducer;
