import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";
import { resetErrAction, resetSuccessAction } from "../globalActions/globalActions.js";

// Initial state
const initialState = {
  loading: false,
  error: null,
  users: [],
  allUsers: [],
  user: {},
  profile: {},
  userAuth: {
    loading: false,
    error: null,
    userInfo: localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null,
  },
};

// Register
export const registerUserAction = createAsyncThunk(
  "users/register",
  async ({ email, password, fullname }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${baseURL}/users/register`, {
        email,
        password,
        fullname,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Login
export const loginUserAction = createAsyncThunk(
  "users/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${baseURL}/users/login`, {
        email,
        password,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Logout
export const logoutUserAction = () => (dispatch) => {
  localStorage.removeItem("userInfo");
  dispatch(logout());
};

// Get user profile
export const getUserProfileAction = createAsyncThunk(
  "user/profile",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(`${baseURL}/users/profile`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Update shipping address
export const updateShippingAddressAction = createAsyncThunk(
  "users/update-shipping-address",
  async (
    {
      firstName,
      lastName,
      address,
      city,
      postalCode,
      province,
      phone,
      country,
    },
    { rejectWithValue, getState }
  ) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(
        `${baseURL}/users/update/shipping`,
        {
          firstName,
          lastName,
          address,
          city,
          postalCode,
          province,
          phone,
          country,
        },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Fetch all users (admin only)
export const fetchAllUsersAction = createAsyncThunk(
  "users/fetchAll",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(`${baseURL}/users`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Slice
const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    logout: (state) => {
      state.userAuth.userInfo = null;
      localStorage.removeItem("userInfo");
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUserAction.pending, (state) => {
      state.userAuth.loading = true;
    });
    builder.addCase(loginUserAction.fulfilled, (state, action) => {
      state.userAuth.userInfo = action.payload;
      state.userAuth.loading = false;
    });
    builder.addCase(loginUserAction.rejected, (state, action) => {
      state.userAuth.error = action.payload;
      state.userAuth.loading = false;
    });

    // Register
    builder.addCase(registerUserAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(registerUserAction.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
    });
    builder.addCase(registerUserAction.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });

    // Get profile
    builder.addCase(getUserProfileAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getUserProfileAction.fulfilled, (state, action) => {
      state.loading = false;
      state.profile = action.payload;
      if (state.userAuth.userInfo) {
        state.userAuth.userInfo.shippingAddress = action.payload?.user?.shippingAddress;
        state.userAuth.userInfo.hasShippingAddress = action.payload?.user?.hasShippingAddress;
      }
    });
    builder.addCase(getUserProfileAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Update shipping address
    builder.addCase(updateShippingAddressAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateShippingAddressAction.fulfilled, (state, action) => {
      state.loading = false;
      const updatedUser = action.payload?.user;
      if (updatedUser && state.userAuth.userInfo) {
        state.userAuth.userInfo.shippingAddress = updatedUser.shippingAddress;
        state.userAuth.userInfo.hasShippingAddress = updatedUser.hasShippingAddress;
      }
      state.profile = action.payload;
    });
    builder.addCase(updateShippingAddressAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch all users
    builder.addCase(fetchAllUsersAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAllUsersAction.fulfilled, (state, action) => {
      state.loading = false;
      state.allUsers = action.payload?.users || action.payload;
    });
    builder.addCase(fetchAllUsersAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Reset helpers
    builder.addCase(resetSuccessAction, (state) => {
      state.isAdded = false;
    });
    builder.addCase(resetErrAction, (state) => {
      state.error = null;
    });
  },
});

export const { logout } = usersSlice.actions;
export default usersSlice.reducer;
