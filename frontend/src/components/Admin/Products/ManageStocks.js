import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import LoadingComponent from "../../LoadingComp/LoadingComponent";
import NoDataFound from "../../NoDataFound/NoDataFound";
import {
  fetchProductsAction,
  deleteProductAction,
} from "../../../redux/slices/products/productSlices";
import { toast } from "react-toastify";

export default function ManageStocks() {
  const dispatch = useDispatch();

  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProductsAction());
  }, [dispatch]);

  const deleteProductHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProductAction(id))
        .unwrap()
        .then((res) => {
          toast.success(res?.message || "Product deleted successfully");
          dispatch(fetchProductsAction()); // optional reload
        })
        .catch((err) => {
          toast.error(err?.message || "Error deleting product");
        });
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">
            Product List - [{products?.length}]
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            List of all the products in your account including their name, category, quantity, and more.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/admin/add-product"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            Add New Product
          </Link>
        </div>
      </div>

      {loading ? (
        <LoadingComponent />
      ) : error ? (
        <error message={error?.message} />
      ) : products?.length <= 0 ? (
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
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total Qty</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total Sold</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Qty Left</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
                      <th className="py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-gray-900 sm:pr-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {products.map((product) => (
                      <tr key={product._id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img
                                className="h-10 w-10 rounded-full"
                                src={product?.images?.[0]}
                                alt={product?.name}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{product.name}</div>
                              <div className="text-gray-500">{product.petCategory}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {product?.productCategory}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          {product?.qtyLeft === 0 ? (
                            <span className="inline-flex px-2 text-xs font-semibold leading-5 rounded-full bg-red-100 text-red-800">
                              Out of Stock
                            </span>
                          ) : (
                            <span className="inline-flex px-2 text-xs font-semibold leading-5 rounded-full bg-green-100 text-green-800">
                              In Stock
                            </span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.totalQty}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.totalSold || 0}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.qtyLeft}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">Rs. {product.price}</td>
                        <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm sm:pr-6 flex justify-end gap-4">
                          <Link to={`/admin/products/edit/${product._id}`} className="text-indigo-600 hover:text-indigo-900">
                            Edit
                          </Link>
                          <button
                            onClick={() => deleteProductHandler(product._id)}
                            className="text-red-600 hover:text-red-800"
                          >
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
