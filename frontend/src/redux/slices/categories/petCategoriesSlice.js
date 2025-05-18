import axios from "axios";
import baseURL from "../../../utils/baseURL";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  petCategories: [],
  petCategory: {},
  loading: false,
  error: null,
  isAdded: false,
  isUpdated: false,
  isDelete: false,
};

// Create Pet Category action
export const createPetCategoryAction = createAsyncThunk(
  "petCategory/create",
  async (payload, { rejectWithValue, getState }) => {
    try {
      const { name, image } = payload;

      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", image);

      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await axios.post(`${baseURL}/pet-categories`, formData, config);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Fetch Pet Categories action
export const fetchPetCategoriesAction = createAsyncThunk(
  "petCategory/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${baseURL}/pet-categories`);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Delete Pet Category action
export const deletePetCategoryAction = createAsyncThunk(
  "petCategory/delete",
  async (categoryId, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.delete(`${baseURL}/pet-categories/${categoryId}`, config);
      return { id: categoryId, message: data?.message };
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Slice
const petCategorySlice = createSlice({
  name: "petCategories",
  initialState,
  extraReducers: (builder) => {
    // Create
    builder.addCase(createPetCategoryAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createPetCategoryAction.fulfilled, (state, action) => {
      state.loading = false;
      state.petCategory = action.payload;
      state.isAdded = true;
    });
    builder.addCase(createPetCategoryAction.rejected, (state, action) => {
      state.loading = false;
      state.petCategory = null;
      state.isAdded = false;
      state.error = action.payload;
    });

    // Fetch all
    builder.addCase(fetchPetCategoriesAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchPetCategoriesAction.fulfilled, (state, action) => {
      state.loading = false;
      state.petCategories = action.payload?.petCategories || [];
    });
    builder.addCase(fetchPetCategoriesAction.rejected, (state, action) => {
      state.loading = false;
      state.petCategories = null;
      state.error = action.payload;
    });

    // Delete
    builder.addCase(deletePetCategoryAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deletePetCategoryAction.fulfilled, (state, action) => {
      state.loading = false;
      state.isDelete = true;
      state.petCategories = state.petCategories.filter((cat) => cat._id !== action.payload.id);
    });
    builder.addCase(deletePetCategoryAction.rejected, (state, action) => {
      state.loading = false;
      state.isDelete = false;
      state.error = action.payload;
    });
  },
});

export default petCategorySlice.reducer;
