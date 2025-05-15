import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminDashboard from "./components/Admin/AdminDashboard";
import Login from "./components/Users/Forms/Login";
import AddProduct from "./components/Admin/Products/AddProduct";
import RegisterForm from "./components/Users/Forms/RegisterForm";
import HomePage from "./components/HomePage/HomePage";
import Navbar from "./components/Navbar/Navbar";
import OrderHistory from "./components/Admin/Orders/ManageOrders";
import OrderPayment from "./components/Users/Products/OrderPayment";
import ManageCategories from "./components/Admin/Categories/ManageCategories";
import UpdateProduct from "./components/Admin/Products/UpdateProduct";
import ManageStocks from "./components/Admin/Products/ManageStocks";
import AddCategory from "./components/Admin/Categories/AddCategory";
import AllCategories from "./components/HomePage/AllCategories";
import Product from "./components/Users/Products/Product";
import ShoppingCart from "./components/Users/Products/ShoppingCart";
import ProductsFilters from "./components/Users/Products/ProductsFilters";
import CustomerProfile from "./components/Users/Profile/CustomerProfile";
import UpdateCategory from "./components/Admin/Categories/UpdateCategory";
import OrdersList from "./components/Admin/Orders/OdersList";
import ManageOrders from "./components/Admin/Orders/ManageOrders";
import Customers from "./components/Admin/Orders/Customers";
import AuthRoute from "./components/AuthRoute/AuthRoute";
import AdminRoutes from "./components/AuthRoute/AdminRoutes";
import AddPetCategory from "./components/Admin/Categories/AddPetCategory";


const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      {/* hide navbar if admin */}
      <Routes>
        {/* nested route */}
        <Route path="admin" element={
          <AdminRoutes>
            <AdminDashboard />
          </AdminRoutes>
        }>
          {/* products */} <Route path="" element={<OrdersList />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="manage-products" element={<ManageStocks />} />
          <Route path="products/edit/:id" element={<UpdateProduct />} />
          {/* Product Category */}
          <Route path="add-product-category" element={<AddCategory />} />
          <Route path="manage-product-category" element={<ManageCategories />} />
          <Route path="edit-category/:id" element={<UpdateCategory />} />
          {/* pet category */}
          <Route path="add-pet-category" element={<AddPetCategory />} />

          {/* Orders */}
          <Route path="manage-orders" element={<ManageOrders />} />
          <Route path="order-payment" element={<OrderPayment />} />
          <Route path="customers" element={<Customers />} />
        </Route>
        {/* public links */}
        {/* Products */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products-filters" element={<ProductsFilters />} />
        <Route path="/products/:id" element={<Product />} />
        <Route path="/all-categories" element={<AllCategories />} />
        {/* shopping cart */}
        <Route path="/shopping-cart" element={<ShoppingCart />} />
        <Route path="/order-payment" element={<OrderPayment />} />
        {/* users */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/customer-profile" element={<CustomerProfile />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
