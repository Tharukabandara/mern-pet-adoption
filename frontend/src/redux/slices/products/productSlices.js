import axios from "axios";
import baseURL from "../../../utils/baseURL";
import { createAsyncThunk, createSlice, isRejectedWithValue } from "@reduxjs/toolkit";


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
            const { name, description, productCategory, petCategory, price} = 
            payload;

            //make request
            //Token - Authenticated
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                Headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            //Images
            const {data} = await axios.post(`${baseURL}/products`, {
                name,
                description,
                productCategory,
                petCategory,
                price,
        },
        config
        );
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
        
    },
});

//generate the reducer
const productReducer = productSlice.reducer;
export default productReducer;