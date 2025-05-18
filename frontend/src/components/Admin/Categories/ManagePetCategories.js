import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchPetCategoriesAction,
  deletePetCategoryAction,
} from "../../../redux/slices/categories/petCategoriesSlice";
import ErrorMsg from "../../ErrorMsg/ErrorMsg";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import NoDataFound from "../../NoDataFound/NoDataFound";

export default function ManagePetCategories() {
  const dispatch = useDispatch();

  const { petCategories, loading, error } = useSelector((state) => state.petCategories);

  useEffect(() => {
    dispatch(fetchPetCategoriesAction());
  }, [dispatch]);

  const deletePetCategoryHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this pet category?")) {
      dispatch(deletePetCategoryAction(id));
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">All Pet Categories</h1>
          <p className="mt-2 text-sm text-gray-700">
            List of all pet categories in your platform.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/admin/add-pet-category"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
            Add New Pet Category
          </Link>
        </div>
      </div>

      {loading ? (
        <LoadingComponent />
      ) : error ? (
        <ErrorMsg message={error?.message} />
      ) : petCategories?.length <= 0 ? (
        <NoDataFound />
      ) : (
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">No. Products</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created At</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {petCategories?.map((category) => (
                      <tr key={category?._id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="flex items-center">
                            <img className="h-10 w-10 rounded-full" src={category?.image} alt={category?.name} />
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{category?.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500">{category?.products?.length}</td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          {new Date(category?.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-3 py-4 text-sm text-red-600 hover:text-red-900">
                          <button onClick={() => deletePetCategoryHandler(category?._id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
