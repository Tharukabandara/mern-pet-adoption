import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchCategoriesAction } from "../../redux/slices/categories/categoriesSlice";

const AllCategories = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.categories);
  const categoriesArray = categories?.categories ?? [];

  useEffect(() => {
    dispatch(fetchCategoriesAction());
  }, [dispatch]);

  if (loading) return <p className="text-center py-4">Loading categories...</p>;
  if (error) return <p className="text-center text-red-500">{error.message}</p>;

  return (
    <>
      <div className="bg-white">
        <div className="mx-auto max-w-7xl py-12 px-4 text-center sm:px-6 lg:py-16 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">
              Total Categories [{categoriesArray.length}]
            </span>
          </h2>
          <p className="mt-2 text-gray-600">Browse our categories and find the best products for you.</p>
        </div>
      </div>

      <div className="mt-4 flow-root">
        <div className="-my-2">
          <div className="relative box-content min-h-[300px] overflow-x-auto py-2 xl:overflow-visible">
            <div className="min-w-screen-xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4 sm:px-6 lg:px-8">
              {categoriesArray.map((category) => (
                <Link
                  key={category._id}
                  to={`/products?category=${encodeURIComponent(category.name)}`}
                  className="relative flex flex-col h-64 rounded-lg overflow-hidden shadow hover:opacity-80"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-center py-2">
                    <h3 className="text-lg font-bold">{category.name}</h3>
                    <p>{category.products?.length || 0} products</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllCategories;
