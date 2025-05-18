import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import { fetchCategoriesAction } from "../../../redux/slices/categories/categoriesSlice";
import { fetchPetCategoriesAction } from "../../../redux/slices/categories/petCategoriesSlice";
import { createProductAction } from "../../../redux/slices/products/productSlices";
import { toast } from "react-toastify";
import { resetSuccessAction, resetErrAction } from "../../../redux/slices/globalActions/globalActions";

export default function AddProduct() {
  const dispatch = useDispatch();

  const [files, setFiles] = useState([]);
  const [fileErrs, setFileErrs] = useState([]);
  const fileHandleChange = (event) => {
    const newFiles = Array.from(event.target.files);
    const newErrs = [];

    newFiles.forEach((file) => {
      if (file?.size > 10000000) newErrs.push(`${file?.name} is too large`);
      if (!file?.type?.startsWith("image/")) newErrs.push(`${file?.name} is not an image`);
    });

    setFiles(newFiles);
    setFileErrs(newErrs);
  };

  // Fetch categories
  useEffect(() => {
    dispatch(fetchCategoriesAction());
    dispatch(fetchPetCategoriesAction());
  }, [dispatch]);

  const { categories } = useSelector((state) => state?.categories?.categories);
  const { petCategories } = useSelector((state) => state?.petCategories?.petCategories);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    petCategory: "",
    price: "",
    totalQty: "",
  });

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { product, isAdded, loading, error } = useSelector((state) => state?.products);

  useEffect(() => {
    if (isAdded && product?.message) {
      toast.success(product.message);
      dispatch(resetSuccessAction());
    }
    if (error?.message) {
      toast.error(error.message);
      dispatch(resetErrAction());
    }
  }, [isAdded, error, product?.message, dispatch]);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (fileErrs.length > 0) {
      toast.error("File error: Only image files under 10MB allowed.");
      return;
    }
    dispatch(createProductAction({ ...formData, files }));
    setFormData({
      name: "",
      description: "",
      category: "",
      petCategory: "",
      price: "",
      totalQty: "",
    });
  };

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Create New Product
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          <span className="font-medium text-indigo-600 hover:text-indigo-500">
            Manage Products
          </span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleOnSubmit}>
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleOnChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleOnChange}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base sm:text-sm"
              >
                <option>-- Select Category --</option>
                {categories?.map((cat) => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Pet Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Pet Category</label>
              <select
                name="petCategory"
                value={formData.petCategory}
                onChange={handleOnChange}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base sm:text-sm"
              >
                <option>-- Select Pet Category --</option>
                {petCategories?.map((pet) => (
                  <option key={pet._id} value={pet.name}>{pet.name}</option>
                ))}
              </select>
            </div>

            {/* Upload Images */}
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:pt-5">
              <label className="block text-sm font-medium text-gray-700 sm:pt-2">
                Upload Images
              </label>
              <div className="sm:col-span-2">
                <input
                  type="file"
                  onChange={fileHandleChange}
                  name="images"
                  multiple
                  className="block w-full text-sm text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB each</p>
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                name="price"
                value={formData.price}
                onChange={handleOnChange}
                type="number"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 sm:text-sm"
              />
            </div>

            {/* Total Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Total Quantity</label>
              <input
                name="totalQty"
                value={formData.totalQty}
                onChange={handleOnChange}
                type="number"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 sm:text-sm"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Add Product Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleOnChange}
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm sm:text-sm"
              />
            </div>

            <div>
              {loading ? (
                <LoadingComponent />
              ) : (
                <button
                  type="submit"
                  disabled={fileErrs.length > 0}
                  className="w-full rounded-md bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow hover:bg-indigo-700"
                >
                  Add Product
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
