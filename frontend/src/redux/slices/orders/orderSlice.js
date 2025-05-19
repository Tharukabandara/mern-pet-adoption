import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";

// Create Order
export const createOrderAction = createAsyncThunk(
  "order/create",
  async (orderData, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(`${baseURL}/orders`, orderData, config);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Fetch All Orders (Admin)
export const fetchAllOrdersAction = createAsyncThunk(
  "orders/fetchAll",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get(`${baseURL}/orders`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Update Order Status 
export const updateOrderStatusAction = createAsyncThunk(
  "orders/updateStatus",
  async ({ id, status }, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(`${baseURL}/orders/update/${id}`, { status }, config);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    order: {},
    allOrders: [],
    loading: false,
    error: null,
    isPlaced: false,
  },
  reducers: {
    resetOrderPlacedFlag: (state) => {
      state.isPlaced = false;
    },
  },
  extraReducers: (builder) => {
    // Create Order
    builder.addCase(createOrderAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createOrderAction.fulfilled, (state, action) => {
      state.loading = false;
      state.order = action.payload;
      state.isPlaced = true;
    });
    builder.addCase(createOrderAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch All Orders
    builder.addCase(fetchAllOrdersAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAllOrdersAction.fulfilled, (state, action) => {
      state.loading = false;
      state.allOrders = (action.payload?.orders || []).sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    });
    builder.addCase(fetchAllOrdersAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Update Order Status
    builder.addCase(updateOrderStatusAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateOrderStatusAction.fulfilled, (state, action) => {
  state.loading = false;
  const updatedOrder = action.payload?.order;

  if (!updatedOrder || !updatedOrder._id) {
    console.warn("Unexpected payload format:", action.payload);
    return;
  }

  // Optimistically update the order in the list
  state.allOrders = state.allOrders.map((order) =>
    order._id === updatedOrder._id ? updatedOrder : order
  );
});

    builder.addCase(updateOrderStatusAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { resetOrderPlacedFlag } = orderSlice.actions;
export default orderSlice.reducer;
