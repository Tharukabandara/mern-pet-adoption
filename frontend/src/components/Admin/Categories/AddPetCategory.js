import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPetCategoryAction } from "../../../redux/slices/categories/petCategoriesSlice";
import ErrorComponent from "../../ErrorMsg/ErrorMsg";
import SuccessMsg from "../../SuccessMsg/SuccessMsg";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import { resetSuccessAction } from "../../../redux/slices/globalActions/globalActions";

export default function AddPetCategory() {
  const [formData, setFormData] = useState({ name: "" });
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();

  const { loading, error, isAdded } = useSelector((state) => state.petCategories);

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleOnSubmit = (e) => {
  e.preventDefault();
  const formDataObj = new FormData();
  formDataObj.append("name", formData.name);
  if (image) {
    formDataObj.append("image", image);
  }
  dispatch(createPetCategoryAction(formDataObj));
};


  useEffect(() => {
    if (isAdded) {
      const timeout = setTimeout(() => {
        dispatch(resetSuccessAction());
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [dispatch, isAdded]);

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Add Pet Category
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && <ErrorComponent message={error.message} />}
          {isAdded && <SuccessMsg message="Pet category added successfully!" />}
          <form className="space-y-6" onSubmit={handleOnSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                onChange={handleOnChange}
                value={formData.name}
                name="name"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

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

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                {loading ? <LoadingComponent /> : "Add Pet Category"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
