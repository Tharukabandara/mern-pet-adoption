import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../slices/users/usersSlice";
import productReducer from "../slices/products/productSlices";
import categoryReducer from "../slices/categories/categoriesSlice";
import petCategoryReducer from "../slices/categories/petCategoriesSlice";
import petAdReducer from "../slices/petAds/petAdSlices";

//store

const store = configureStore({
    reducer: {
        users: usersReducer,
        products: productReducer,
        categories: categoryReducer,
        petCategories: petCategoryReducer,
        petAds: petAdReducer,
    },
});

export default store;