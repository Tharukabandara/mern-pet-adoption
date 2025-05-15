import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchCategoriesAction } from "../../redux/slices/categories/categoriesSlice";

const HomeCategories = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.categories);

  const categoriesArray = categories?.categories ?? [];

  useEffect(() => {
    dispatch(fetchCategoriesAction());
  }, [dispatch]);

  const categoriesToShow = categoriesArray.slice(0, 5);

  if (loading) return <p className="text-center py-4">Loading categories...</p>;
  if (error) return <p className="text-center py-4 text-red-500">{error.message}</p>;

  return (
    <div className="mt-4 flow-root">
      <div className="-my-2">
        <div className="relative box-content h-80 overflow-x-auto py-2 xl:overflow-visible">
          <div className="min-w-screen-xl absolute flex space-x-8 px-4 sm:px-6 lg:px-8 xl:relative xl:grid xl:grid-cols-5 xl:gap-x-8 xl:space-x-0 xl:px-0">
            {categoriesToShow.map((category) => (
              <Link
                key={category.name}
                to={`/products-filters?category=${encodeURIComponent(category.name)}`}
                className="relative flex h-80 w-56 flex-col overflow-hidden rounded-lg p-6 hover:opacity-75 xl:w-auto"
              >
                <span aria-hidden="true" className="absolute inset-0">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover object-center"
                  />
                </span>
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-gray-800 opacity-50"
                />
                <span className="relative mt-auto text-center text-xl font-bold text-white">
                  {category.name} ({category.products?.length || 0})
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeCategories;
