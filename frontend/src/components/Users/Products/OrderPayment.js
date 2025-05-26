import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createOrderAction } from "../../../redux/slices/orders/orderSlice";
import { getUserProfileAction } from "../../../redux/slices/users/usersSlice";
import AddShippingAddress from "../Forms/AddShippingAddress";
import { toast } from "react-toastify";

export default function OrderPayment() {
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.cartItems);
  const shippingAddress = useSelector(
    (state) => state.users?.profile?.user?.shippingAddress
  );
  const { loading } = useSelector((state) => state.orders);

  const totalPrice = cartItems?.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  useEffect(() => {
    dispatch(getUserProfileAction());
  }, [dispatch]);

  const createOrderSubmitHandler = (e) => {
    e.preventDefault();

    if (!shippingAddress || Object.values(shippingAddress).some((v) => !v)) {
      toast.error("Please fill out your shipping address first");
      return;
    }

    dispatch(
      createOrderAction({
        orderItems: cartItems,
        shippingAddress,
        totalPrice,
      })
    )
      .unwrap()
      .then((res) => {
        window.location.href = res.url;
      })
      .catch((err) => {
        toast.error(err?.message || "Failed to place order");
      });
  };

  return (
    <div className="bg-gray-50">
      <main className="mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
            {/* Left section: Shipping */}
            <div className="mt-10 border-t border-gray-200 pt-10">
              {!shippingAddress ||
              Object.values(shippingAddress).some((v) => !v) ? (
                <AddShippingAddress />
              ) : (
                <div className="bg-white p-4 rounded shadow">
                  <h2 className="text-lg font-medium text-gray-900 mb-2">
                    Shipping Address
                  </h2>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>
                      <strong>Name:</strong> {shippingAddress.firstName}{" "}
                      {shippingAddress.lastName}
                    </li>
                    <li>
                      <strong>Address:</strong> {shippingAddress.address}
                    </li>
                    <li>
                      <strong>City:</strong> {shippingAddress.city}
                    </li>
                    <li>
                      <strong>Postal Code:</strong>{" "}
                      {shippingAddress.postalCode}
                    </li>
                    <li>
                      <strong>Province:</strong> {shippingAddress.province}
                    </li>
                    <li>
                      <strong>Country:</strong> {shippingAddress.country}
                    </li>
                    <li>
                      <strong>Phone:</strong> {shippingAddress.phone}
                    </li>
                  </ul>
                </div>
              )}
            </div>
            {/* Right section: Summary */}
            <div className="mt-10 lg:mt-0">
              <h2 className="text-lg font-medium text-gray-900">
                Order summary
              </h2>
              <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
                <ul className="divide-y divide-gray-200">
                  {cartItems?.map((product) => (
                    <li
                      key={product._id}
                      className="flex py-6 px-4 sm:px-6"
                    >
                      <img
                        src={product.images?.[0]}
                        className="w-20 rounded-md"
                        alt={product.name}
                      />
                      <div className="ml-6 flex flex-1 flex-col">
                        <div className="flex justify-between text-sm font-medium text-gray-900">
                          <p>{product.name}</p>
                          <p>Rs. {product.price * product.qty}</p>
                        </div>
                        <div className="text-sm text-gray-500">
                          Qty: {product.qty}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="px-4 py-6 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Total</p>
                    <p>Rs. {totalPrice}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 px-4 sm:px-6">
                <button
                  onClick={createOrderSubmitHandler}
                  disabled={loading}
                  className="w-full rounded-md border border-transparent bg-green-700 hover:bg-green-600 py-3 px-4 text-base font-medium text-white"
                >
                  {loading ? "Placing Order..." : "Place Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
