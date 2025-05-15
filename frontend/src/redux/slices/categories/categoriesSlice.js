import axios from "axios";
import baseURL from "../../../utils/baseURL";
import { createAsyncThunk, createSlice, } from "@reduxjs/toolkit";


//initialState
const initialState = {
    categories: [],
    category: {},
    loading: false,
    error: null,
    isAdded: false,
    isUpdated: false,
    isDelete: false,
};

//create Categories action
export const createCategoryAction = createAsyncThunk(
  "category/create",
  async (payload, { rejectWithValue, getState }) => {
    try {
      const { name, image } = payload;

      // Prepare FormData
      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", image);

      // Auth headers
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      // Send request
      const { data } = await axios.post(`${baseURL}/categories`, formData, config);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);


//Fetch Categories action
export const fetchCategoriesAction = createAsyncThunk(
    "category/fetch All",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const {data} = await axios.get(`${baseURL}/categories`);
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);

//slice
const categorySlice = createSlice({
    name: "categories",
    initialState,
    extraReducers: (builder) => {

        //create
        builder.addCase(createCategoryAction.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createCategoryAction.fulfilled, (state, action) => {
            state.loading = false;
            state.category = action.payload;
            state.isAdded = true;
        });
        builder.addCase(createCategoryAction.rejected, (state, action) => {
            state.loading = false;
            state.category = null;
            state.isAdded = false;
            state.error = action.payload;
        });

        //fetch all
        builder.addCase(fetchCategoriesAction.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchCategoriesAction.fulfilled, (state, action) => {
            state.loading = false;
            state.categories = action.payload;
            state.isAdded = true;
        });
        builder.addCase(fetchCategoriesAction.rejected, (state, action) => {
            state.loading = false;
            state.categories = null;
            state.isAdded = false;
            state.error = action.payload;
        });
        
    },
});

//generate the reducer
const categoryReducer = categorySlice.reducer;
export default categoryReducer;