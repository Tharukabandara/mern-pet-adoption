import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  fetchProductAction,
  updateProductAction,
} from "../../../redux/slices/products/productSlices";
import { fetchCategoriesAction } from "../../../redux/slices/categories/categoriesSlice";
import { fetchPetCategoriesAction } from "../../../redux/slices/categories/petCategoriesSlice";

import LoadingComponent from "../../LoadingComp/LoadingComponent";

export default function UpdateProduct() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: productId } = useParams();

  const { product, isUpdated, error, loading } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories.categories || {});
  const { petCategories } = useSelector((state) => state.petCategories.petCategories || {});

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    petCategory: "",
    price: "",
    totalQty: "",
    description: "",
  });
  const [image] = useState(null);

  // Load product, categories, and petCategories
  useEffect(() => {
    if (productId) {
      dispatch(fetchProductAction(productId));
    }
    dispatch(fetchCategoriesAction());
    dispatch(fetchPetCategoriesAction());
  }, [dispatch, productId]);

  // Populate form when product is loaded
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        category: product.productCategory || "",
        petCategory: product.petCategory || "",
        price: product.price || "",
        totalQty: product.totalQty || "",
        description: product.description || "",
      });
    }
  }, [product]);

  // Notify on success or error
  useEffect(() => {
    if (isUpdated) {
      toast.success("Product updated successfully");
      navigate("/admin/manage-products");
    }
    if (error) {
      toast.error(error.message || "Failed to update product");
    }
  }, [isUpdated, error, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!productId) {
      toast.error("Product ID missing");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    if (image) data.append("image", image);

    dispatch(updateProductAction({ productId, formData: data }));
  };

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Update Product
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
              >
                <option>-- Select Category --</option>
                {categories?.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Pet Category</label>
              <select
                name="petCategory"
                value={formData.petCategory}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
              >
                <option>-- Select Pet Category --</option>
                {petCategories?.map((pet) => (
                  <option key={pet._id} value={pet.name}>
                    {pet.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Total Quantity</label>
              <input
                type="number"
                name="totalQty"
                value={formData.totalQty}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
              />
            </div>

            <div>
              {loading ? (
                <LoadingComponent />
              ) : (
                <button
                  type="submit"
                  className="w-full rounded-md bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Update Product
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
