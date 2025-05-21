import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../slices/users/usersSlice";
import productReducer from "../slices/products/productSlices";
import categoryReducer from "../slices/categories/categoriesSlice";
import petCategoryReducer from "../slices/categories/petCategoriesSlice";
import petAdReducer from "../slices/petAds/petAdSlices";
import cartReducer from "../slices/cart/cartSlice";
import orderReducer from "../slices/orders/orderSlice";
import reviewsReducer from "../slices/reviews/reviewSlice";

//store

const store = configureStore({
    reducer: {
        users: usersReducer,
        products: productReducer,
        categories: categoryReducer,
        petCategories: petCategoryReducer,
        petAds: petAdReducer,
        cart: cartReducer,
        orders: orderReducer,
        reviews: reviewsReducer,
    },
});

export default store;