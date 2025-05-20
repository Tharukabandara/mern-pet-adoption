import axios from "axios";
import baseURL from "../../../utils/baseURL";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { resetErrAction, resetSuccessAction } from "../globalActions/globalActions";

// Initial state
const initialState = {
  petAds: [],
  petAd: {},
  loading: false,
  error: null,
  isAdded: false,
  isUpdated: false,
  isDelete: false,
};

// Create Pet Ad Action
export const createPetAdAction = createAsyncThunk(
  "petAd/create",
  async (payload, { rejectWithValue, getState }) => {
    try {
      const { title, description, petCategory, location, phone, price, files } = payload;

      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("petCategory", petCategory);
      formData.append("location", location);
      formData.append("phone", phone);
      formData.append("price", price);

      files.forEach((file) => {
        formData.append("files", file);
      });

      const { data } = await axios.post(`${baseURL}/petAds`, formData, config);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Fetch All Pet Ads
export const fetchPetAdsAction = createAsyncThunk(
  "petAd/list",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams(filters).toString();
      const { data } = await axios.get(`${baseURL}/petAds?${query}`);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Fetch Single Pet Ad
export const fetchPetAdAction = createAsyncThunk(
  "petAd/details",
  async (adId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${baseURL}/petAds/${adId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Get My Pet Ads
export const fetchMyPetAdsAction = createAsyncThunk(
  "petAd/myAds",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(`${baseURL}/petAds/my-ads`, config);
      return data.petAds;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Delete Pet Ad
export const deletePetAdAction = createAsyncThunk(
  "petAd/delete",
  async (adId, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`${baseURL}/petAds/${adId}`, config);
      return adId;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// Slice
const petAdSlice = createSlice({
  name: "petAds",
  initialState,
  extraReducers: (builder) => {
    // Create Pet Ad
    builder.addCase(createPetAdAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createPetAdAction.fulfilled, (state, action) => {
      state.loading = false;
      state.petAd = action.payload;
      state.isAdded = true;
    });
    builder.addCase(createPetAdAction.rejected, (state, action) => {
      state.loading = false;
      state.petAd = null;
      state.isAdded = false;
      state.error = action.payload;
    });

    // Fetch All Pet Ads
    builder.addCase(fetchPetAdsAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchPetAdsAction.fulfilled, (state, action) => {
      state.loading = false;
      state.petAds = action.payload.petAds;
    });
    builder.addCase(fetchPetAdsAction.rejected, (state, action) => {
      state.loading = false;
      state.petAds = null;
      state.error = action.payload;
    });

    // Fetch Single Pet Ad
    builder.addCase(fetchPetAdAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchPetAdAction.fulfilled, (state, action) => {
      state.loading = false;
      state.petAd = action.payload;
    });
    builder.addCase(fetchPetAdAction.rejected, (state, action) => {
      state.loading = false;
      state.petAd = null;
      state.error = action.payload;
    });

    // Fetch My Ads
    builder.addCase(fetchMyPetAdsAction.fulfilled, (state, action) => {
      state.loading = false;
      state.petAds = action.payload;
    });

    // Delete Ad
    builder.addCase(deletePetAdAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deletePetAdAction.fulfilled, (state, action) => {
      state.loading = false;
      state.petAds = state.petAds.filter((ad) => ad._id !== action.payload);
    });
    builder.addCase(deletePetAdAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Reset Actions
    builder.addCase(resetSuccessAction, (state) => {
      state.isAdded = false;
    });
    builder.addCase(resetErrAction, (state) => {
      state.error = null;
    });
  },
});

// Export reducer
const petAdReducer = petAdSlice.reducer;
export default petAdReducer;
