import { useSelector } from "react-redux";

export default function ShippingAddressDetails() {
  const user = useSelector((state) => state.users?.profile?.user);
  const shippingAddress = user?.shippingAddress;

  if (!shippingAddress) {
    return (
      <div className="text-gray-500 text-sm">
        No shipping address found. Please add it in the checkout page.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded shadow-sm border">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Shipping Address</h2>
      <ul className="text-sm text-gray-700 space-y-1">
        <li><strong>Name:</strong> {shippingAddress.firstName}{" "}{shippingAddress.lastName}</li>
        <li><strong>Address:</strong> {shippingAddress.address}</li>
        <li><strong>City:</strong> {shippingAddress.city}</li>
        <li><strong>Postal Code:</strong> {shippingAddress.postalCode}</li>
        <li><strong>Province:</strong> {shippingAddress.province}</li>
        <li><strong>Country:</strong> {shippingAddress.country}</li>
        <li><strong>Phone:</strong> {shippingAddress.phone}</li>
      </ul>
    </div>
  );
}
