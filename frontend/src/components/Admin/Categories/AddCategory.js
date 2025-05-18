import { useEffect, useState } from "react";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import { useDispatch, useSelector } from "react-redux";
import { createCategoryAction } from "../../../redux/slices/categories/categoriesSlice";
import { toast } from "react-toastify";
import { resetSuccessAction, resetErrAction } from "../../../redux/slices/globalActions/globalActions";

export default function AddProductCategory() {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ name: "" });
  const [image, setImage] = useState(null);

  const { error, isAdded, loading, category } = useSelector((state) => state.categories);

  // Trigger toast on success or error
  useEffect(() => {
    if (isAdded && category?.message) {
      toast.success(category.message);
      dispatch(resetSuccessAction());
    }
    if (error?.message) {
      toast.error(error.message);
      dispatch(resetErrAction());
    }
  }, [isAdded, error, category?.message, dispatch]);

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    dispatch(createCategoryAction({ name: formData.name, image }));
    setFormData({ name: "" });
    setImage(null);
  };

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <svg
          className="mx-auto h-10 text-blue-600 w-auto"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
          />
        </svg>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Add Product Category
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleOnSubmit}>
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                onChange={handleOnChange}
                value={formData.name}
                name="name"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            {/* Image */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Category Image
              </label>
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className="mt-1 text-sm"
              />
            </div>

            {/* Submit */}
            <div>
              {loading ? (
                <LoadingComponent />
              ) : (
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                  Add Category
                </button>
              )}
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
