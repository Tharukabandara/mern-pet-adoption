import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";

export const createReviewAction = createAsyncThunk(
  "reviews/create",
  async ({ productID, message, rating }, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(`${baseURL}/reviews/${productID}`, { message, rating }, config);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  }
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetReviewState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createReviewAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(createReviewAction.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createReviewAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetReviewState } = reviewSlice.actions;
export default reviewSlice.reducer;
