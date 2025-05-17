import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        // If the item already exists, update its quantity
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id
            ? { ...x, qty: x.qty + (item.qty || 1) }
            : x
        );
      } else {
        // If it's a new item, adding it with qty fallback to 1
        state.cartItems.push({ ...item, qty: item.qty || 1 });
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    updateQuantity: (state, action) => {
      const { id, qty } = action.payload;
      state.cartItems = state.cartItems.map((item) =>
        item._id === id ? { ...item, qty } : item
      );
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    clearCart: (state) => {
      state.cartItems = [];
      localStorage.setItem("cartItems", JSON.stringify([]));
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
const cartReducer = cartSlice.reducer;
export default cartReducer;
