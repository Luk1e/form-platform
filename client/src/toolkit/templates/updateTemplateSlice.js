import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useAuthAxios } from "../../utils/hooks/useAxios";

export const updateTemplate = createAsyncThunk(
  "updateTemplate/update",
  async ({ id, templateData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      if (templateData.image_file) {
        formData.append("image", templateData.image_file);
      }

      const { image_file, image_url, ...restData } = templateData;
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

const updateTemplateSlice = createSlice({
  name: "updateTemplate",
  initialState: {
    loading: false,
    error: null,
    success: false,
    updatedTemplateId: null,
  },
  reducers: {
    resetUpdateTemplateState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.updatedTemplateId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.updatedTemplateId = action.payload;
      })
      .addCase(updateTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetUpdateTemplateState } = updateTemplateSlice.actions;
export default updateTemplateSlice.reducer;
