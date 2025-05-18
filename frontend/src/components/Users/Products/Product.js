import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductAction } from "../../../redux/slices/products/productSlices";
import { addToCart } from "../../../redux/slices/cart/cartSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Utility function
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Product() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchProductAction(id));
  }, [dispatch, id]);

  const { loading, error, product: { product } = {} } = useSelector((state) => state?.products);
  const { cartItems } = useSelector((state) => state?.cart);
  const { userAuth } = useSelector((state) => state.users);

  const inStock = product?.totalQty > 0;

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty: 1 }));
    toast.success("Product added to cart!");
  };

  const handleCheckout = () => {
    if (!userAuth?.userInfo?.token) {
      toast.warn("Please login to proceed to checkout.");
      navigate("/login");
    } else {
      navigate("/order-payment");
    }
  };

  return (
    <div className="bg-white">
      <main className="mx-auto mt-8 max-w-2xl px-4 pb-16 sm:px-6 sm:pb-24 lg:max-w-7xl lg:px-8">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error?.message}</p>
        ) : (
          <div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8">
            <div className="lg:col-span-5 lg:col-start-8">
              <div className="flex justify-between">
                <h1 className="text-xl font-medium text-gray-900">{product?.name}</h1>
                <p className="text-xl font-medium text-gray-900">Rs. {product?.price}.00</p>
              </div>
              <p className={`mt-2 text-sm font-medium ${inStock ? "text-green-600" : "text-red-600"}`}>
                {inStock ? `In Stock (${product.totalQty} available)` : "Out of Stock"}
              </p>
            </div>

            {/* Images */}
            <div className="mt-8 lg:col-span-7 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
              <h2 className="sr-only">Images</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-3 lg:gap-8">
                {product?.images?.map((image, idx) => (
                  <img
                    key={idx}
                    src={image}
                    alt={`Product image ${idx + 1}`}
                    className={classNames(
                      idx === 0 ? "lg:col-span-2 lg:row-span-2" : "hidden lg:block",
                      "rounded-lg object-cover"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Add to cart + description */}
            <div className="mt-8 lg:col-span-5">
              {inStock && (
                <button
                  onClick={addToCartHandler}
                  className="mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700"
                >
                  Add to cart
                </button>
              )}

              {inStock &&
                cartItems?.find((item) => item._id === product?._id) && (
                  <button
                    onClick={handleCheckout}
                    className="mt-4 flex w-full items-center justify-center rounded-md border border-transparent bg-green-700 py-3 px-8 text-base font-medium text-white hover:bg-green-600"
                  >
                    Proceed to Checkout
                  </button>
                )}

              <div className="mt-10">
                <h2 className="text-sm font-medium text-gray-900">Description</h2>
                <p className="mt-4 text-gray-700">{product?.description}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
