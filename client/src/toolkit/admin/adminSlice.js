import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useAuthAxios } from "../../utils/hooks/useAxios";
import { logout } from "../auth/authSlice";

export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (params, { rejectWithValue }) => {
    Object.keys(params).forEach((key) => {
      if (!params[key]) {
        delete params[key];
      }
    });

    try {
      const { data } = await useAuthAxios.get("/api/admin/users", { params });
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const bulkBlockUsers = createAsyncThunk(
  "admin/bulkBlockUsers",
  async (userIds, { dispatch, rejectWithValue }) => {
    try {
      await useAuthAxios.patch("/api/admin/users/block", {
        userIds,
      });

      const user = JSON.parse(localStorage.getItem("user"));
      if (user && userIds.includes(user.id)) {
        setTimeout(() => {
          dispatch(logout());
        }, 1000);
      }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const bulkUnblockUsers = createAsyncThunk(
  "admin/bulkUnblockUsers",
  async (userIds, { rejectWithValue }) => {
    try {
      await useAuthAxios.patch("/api/admin/users/unblock", { userIds });
      return userIds;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const bulkAddAdminPrivileges = createAsyncThunk(
  "admin/bulkAddAdminPrivileges",
  async (userIds, { rejectWithValue }) => {
    try {
      await useAuthAxios.patch("/api/admin/users/add-admin", { userIds });
      return userIds;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const bulkRemoveAdminPrivileges = createAsyncThunk(
  "admin/bulkRemoveAdminPrivileges",
  async (userIds, { dispatch, rejectWithValue }) => {
    try {
      await useAuthAxios.patch("/api/admin/users/remove-admin", { userIds });
      const user = JSON.parse(localStorage.getItem("user"));

      if (user && userIds.includes(user.id)) {
        setTimeout(() => {
          dispatch(logout());
        }, 1000);
      }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const bulkDeleteUsers = createAsyncThunk(
  "admin/bulkDeleteUsers",
  async (userIds, { dispatch, rejectWithValue }) => {
    try {
      await useAuthAxios.delete("/api/admin/users", { data: { userIds } });
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && userIds.includes(user.id)) {
        setTimeout(() => {
          dispatch(logout());
        }, 1000);
      }
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  users: [],
  pagination: {
    currentPage: 1,
    pageSize: 10,
    totalUsers: 0,
    totalPages: 0,
  },
  loading: false,
  error: null,
  selectedUserIds: [],
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setSelectedUserIds: (state, action) => {
      state.selectedUserIds = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedUserIds } = adminSlice.actions;
export default adminSlice.reducer;
