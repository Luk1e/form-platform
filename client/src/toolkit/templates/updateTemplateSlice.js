import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useAuthAxios } from "../../utils/hooks/useAxios";

export const updateTemplate = createAsyncThunk(
  "updateTemplateSlice/updateTemplate",
  async ({ id, templateData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      if (templateData.image_file) {
        formData.append("image", templateData.image_file);
      }

      const { image_file, ...restData } = templateData;
      formData.append("data", JSON.stringify(restData));

      const { data } = await useAuthAxios.put(
        `/api/templates/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

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
  updatedTemplateId: null,
};

const updateTemplateSlice = createSlice({
  name: "updateTemplateSlice",
  initialState,
  reducers: {
    resetUpdateTemplateState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateTemplate.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(updateTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.updatedTemplateId = action.payload;
      })
      .addCase(updateTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetUpdateTemplateState } = updateTemplateSlice.actions;
export default updateTemplateSlice.reducer;
