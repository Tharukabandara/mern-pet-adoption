import axios from "axios";
import baseURL from "../../../utils/baseURL";
import { createAsyncThunk, createSlice, } from "@reduxjs/toolkit";
import { resetErrAction, resetSuccessAction } from "../globalActions/globalActions";


//initialState
const initialState = {
    products: [],
    product: {},
    loading: false,
    error: null,
    isAdded: false,
    isUpdated: false,
    isDelete: false,
};

//create product action
export const createProductAction = createAsyncThunk(
    "product/create",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const { name, description, category, petCategory, price,totalQty,files} = 
            payload;

            //make request
            //Token - Authenticated
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            };

            //FromData
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

            const {data} = await axios.post(`${baseURL}/products`,
                formData,
                config
        );
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);

//fetch products action
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


//fetch product action
export const fetchProductAction = createAsyncThunk(
    "product/details",
    async (productId, { rejectWithValue, getState, dispatch }) => {
        try { 

            //make request
            //Token - Authenticated
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const {data} = await axios.get(`${baseURL}/products/${productId}`, config );
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);

//slice
const productSlice = createSlice({
    name: "products",
    initialState,
    extraReducers: (builder) => {

        //create
        builder.addCase(createProductAction.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createProductAction.fulfilled, (state, action) => {
            state.loading = false;
            state.product = action.payload;
            state.isAdded = true;
        });

        builder.addCase(createProductAction.rejected, (state, action) => {
            state.loading = false;
            state.product = null;
            state.isAdded = false;
            state.error = action.payload;
        });

        //fetch all
        builder.addCase(fetchProductsAction.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchProductsAction.fulfilled, (state, action) => {
            state.loading = false;
            state.products = action.payload.products;
            state.isAdded = true;
        });

        builder.addCase(fetchProductsAction.rejected, (state, action) => {
            state.loading = false;
            state.products = null;
            state.isAdded = false;
            state.error = action.payload;
        });

        //fetch product
        builder.addCase(fetchProductAction.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchProductAction.fulfilled, (state, action) => {
            state.loading = false;
            state.product = action.payload;
            state.isAdded = true;
        });

        builder.addCase(fetchProductAction.rejected, (state, action) => {
            state.loading = false;
            state.product = null;
            state.isAdded = false;
            state.error = action.payload;
        });

        //reset success
        builder.addCase(resetSuccessAction.pending, (state, action)=>{
            state.isAdded = false
        });

        //reset error
        builder.addCase(resetErrAction.pending, (state, action)=>{
            state.error = null;
        });
        
    },
});

//generate the reducer
const productReducer = productSlice.reducer;
export default productReducer;