import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useAuthAxios } from "../../utils/hooks/useAxios";
import { logout } from "../auth/authSlice";

export const fetchUsers = createAsyncThunk(
  "adminUserSlice/fetchUsers",
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
  "adminUserSlice/bulkBlockUsers",
  async (userIds, { dispatch, getState, rejectWithValue }) => {
    try {
      await useAuthAxios.patch("/api/admin/users/block", {
        userIds,
      });

      const { user } = getState().authentication;
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
  "adminUserSlice/bulkUnblockUsers",
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
  "adminUserSlice/bulkAddAdminPrivileges",
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
  "adminUserSlice/bulkRemoveAdminPrivileges",
  async (userIds, { dispatch, getState, rejectWithValue }) => {
    try {
      await useAuthAxios.patch("/api/admin/users/remove-admin", { userIds });
      const { user } = getState().authentication;

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
  "adminUserSlice/bulkDeleteUsers",
  async (userIds, { dispatch, getState, rejectWithValue }) => {
    try {
      await useAuthAxios.delete("/api/admin/users", { data: { userIds } });
      const { user } = getState().authentication;
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

const adminUserSlice = createSlice({
  name: "adminUserSlice",
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
      })
      .addCase(bulkBlockUsers.fulfilled, (state) => {
        state.selectedUserIds = [];
      })
      .addCase(bulkUnblockUsers.fulfilled, (state) => {
        state.selectedUserIds = [];
      })
      .addCase(bulkAddAdminPrivileges.fulfilled, (state) => {
        state.selectedUserIds = [];
      })
      .addCase(bulkRemoveAdminPrivileges.fulfilled, (state) => {
        state.selectedUserIds = [];
      })
      .addCase(bulkDeleteUsers.fulfilled, (state) => {
        state.selectedUserIds = [];
      });
  },
});

export const { setSelectedUserIds } = adminUserSlice.actions;
export default adminUserSlice.reducer;
