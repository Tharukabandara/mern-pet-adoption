import axios from "axios";
import baseURL from "../../../utils/baseURL";
import { createAsyncThunk, createSlice, } from "@reduxjs/toolkit";


//initialState
const initialState = {
    petCategories: [],
    petCategory: {},
    loading: false,
    error: null,
    isAdded: false,
    isUpdated: false,
    isDelete: false,
};

//create Pet Category action
export const createPetCategoryAction = createAsyncThunk(
    "petCategory/create",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const { name } = 
            payload;

            //make request
            //Token - Authenticated
            const token = getState()?.users?.userAuth?.userInfo?.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            //Images
            const {data} = await axios.post(`${baseURL}/petCategories`, 
            {
                name,
            },
        config
        );
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);

//Fetch Pet Categories action
export const fetchPetCategoriesAction = createAsyncThunk(
    "petCategories/fetch All",
    async (payload, { rejectWithValue, getState, dispatch }) => {
        try {
            const {data} = await axios.get(`${baseURL}/petCategories`);
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data);
        }
    }
);

//slice
const petCategorySlice = createSlice({
    name: "petCategories",
    initialState,
    extraReducers: (builder) => {

        //create
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

        //fetch all
        builder.addCase(fetchPetCategoriesAction.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchPetCategoriesAction.fulfilled, (state, action) => {
            state.loading = false;
            state.petCategories = action.payload;
            state.isAdded = true;
        });
        builder.addCase(fetchPetCategoriesAction.rejected, (state, action) => {
            state.loading = false;
            state.petCategories = null;
            state.isAdded = false;
            state.error = action.payload;
        });
        
    },
});

//generate the reducer
const petCategoryReducer = petCategorySlice.reducer;
export default petCategoryReducer;