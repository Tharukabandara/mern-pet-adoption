import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsAction } from "../../redux/slices/products/productSlices";
import { Link } from "react-router-dom";

const HomeProductTrending = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProductsAction());
  }, [dispatch]);

  const trendingProducts = products?.slice(0, 4); // or filter for isTrending

  return (
    <section aria-labelledby="trending-heading">
      <div className="mx-auto max-w-7xl py-24 px-4 sm:px-6 sm:py-32 lg:px-8 lg:pt-32">
        <div className="md:flex md:items-center md:justify-between">
          <h2
            id="favorites-heading"
            className="text-2xl font-bold tracking-tight text-gray-900"
          >
            Pet Accessories
          </h2>
          <Link
            to="/products-filters"
            className="hidden text-sm font-medium text-indigo-600 hover:text-indigo-500 md:block"
          >
            Shop the collection <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-0 lg:gap-x-8">
          {trendingProducts?.map((product) => (
            <Link
              to={`/products/${product._id}`}
              key={product._id}
              className="group relative"
            >
              <div className="h-56 w-full overflow-hidden rounded-md group-hover:opacity-75 lg:h-72 xl:h-80">
                <img
                  src={product?.images?.[0] || "https://via.placeholder.com/300"}
                  alt={product?.name}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
              <p className="mt-1 text-sm font-medium text-gray-900">Rs.{product.price}</p>
              {/* Product details */}
            <div className="mt-1000">
              <div className="prose prose-sm mt-4 text-gray-500">
                {product?.description}
              </div>
            </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeProductTrending;
