import axios from "axios";
import baseURL from "../../../utils/baseURL";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { resetErrAction, resetSuccessAction } from "../globalActions/globalActions";

// Initial state
const initialState = {
  products: [],
  product: {},
  loading: false,
  error: null,
  isAdded: false,
  isUpdated: false,
  isDelete: false,
};

// Create product
export const createProductAction = createAsyncThunk(
  "product/create",
  async (payload, { rejectWithValue, getState }) => {
    try {
      const { name, description, category, petCategory, price, totalQty, files } = payload;
      const token = getState()?.users?.userAuth?.userInfo?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("productCategory", category);
      formData.append("petCategory", petCategory);
      formData.append("totalQty", totalQty);
      formData.append("price", price);

      files.forEach((file) => {
        formData.append("files", file);
      });

      const { data } = await axios.post(`${baseURL}/products`, formData, config);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Update product
export const updateProductAction = createAsyncThunk(
  "product/update",
  async ({ productId, formData }, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await axios.put(`${baseURL}/products/${productId}`, formData, config);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Delete product
export const deleteProductAction = createAsyncThunk(
  "product/delete",
  async (productId, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.delete(`${baseURL}/products/${productId}`, config);
      return { id: productId, message: data?.message };
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Fetch all products
export const fetchProductsAction = createAsyncThunk(
  "product/list",
  async (filters = {}, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const query = new URLSearchParams(filters).toString();
      const { data } = await axios.get(`${baseURL}/products?${query}`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Fetch single product
export const fetchProductAction = createAsyncThunk(
  "product/details",
  async (productId, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(`${baseURL}/products/${productId}`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Slice
const productSlice = createSlice({
  name: "products",
  initialState,
  extraReducers: (builder) => {
    builder
      // Create product
      .addCase(createProductAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProductAction.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
        state.isAdded = true;
      })
      .addCase(createProductAction.rejected, (state, action) => {
        state.loading = false;
        state.product = null;
        state.isAdded = false;
        state.error = action.payload;
      })

      // Update product
      .addCase(updateProductAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProductAction.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
        state.isUpdated = true;
      })
      .addCase(updateProductAction.rejected, (state, action) => {
        state.loading = false;
        state.isUpdated = false;
        state.error = action.payload;
      })

      // Delete product
      .addCase(deleteProductAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProductAction.fulfilled, (state, action) => {
        state.loading = false;
        state.isDelete = true;
        state.products = state.products.filter((prod) => prod._id !== action.payload.id);
      })
      .addCase(deleteProductAction.rejected, (state, action) => {
        state.loading = false;
        state.isDelete = false;
        state.error = action.payload;
      })

      // Fetch all
      .addCase(fetchProductsAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductsAction.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
      })
      .addCase(fetchProductsAction.rejected, (state, action) => {
        state.loading = false;
        state.products = null;
        state.error = action.payload;
      })

      // Fetch one
      .addCase(fetchProductAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductAction.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductAction.rejected, (state, action) => {
        state.loading = false;
        state.product = null;
        state.error = action.payload;
      })

      // Reset
      .addCase(resetSuccessAction, (state) => {
        state.isAdded = false;
        state.isUpdated = false;
        state.isDelete = false;
      })
      .addCase(resetErrAction, (state) => {
        state.error = null;
      });
  },
});

export default productSlice.reducer;
