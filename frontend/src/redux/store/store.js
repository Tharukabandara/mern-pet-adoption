import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../slices/users/usersSlice";
import productReducer from "../slices/products/productSlices";
import categoryReducer from "../slices/categories/categoriesSlice";
import petCategoryReducer from "../slices/categories/petCategoriesSlice";

//store

const store = configureStore({
    reducer: {
        users: usersReducer,
        products: productReducer,
        categories: categoryReducer,
        petCategories: petCategoryReducer,
    },
});

export default store;