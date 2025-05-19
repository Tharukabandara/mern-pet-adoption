import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateOrderStatusAction } from "../../../redux/slices/orders/orderSlice";
import { toast } from "react-toastify";

const UpdateOrders = ({ id, currentStatus }) => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState(currentStatus || "pending");

  useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);

  const onChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    try {
      await dispatch(updateOrderStatusAction({ id, status: newStatus })).unwrap();
      toast.success("Order status updated");
    } catch (error) {
      toast.error(error?.message || "Failed to update status");
    }
  };

  return (
    <div className="mt-6 flex items-center space-x-4 divide-x divide-gray-200 border-t border-gray-200 pt-4 text-sm font-medium sm:mt-0 sm:ml-4 sm:border-none sm:pt-0">
      <div className="flex flex-1 justify-center">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Update Order
          </label>
          <select
            id="status"
            name="status"
            onChange={onChange}
            value={status}
            className="mt-1 block w-full rounded-md border-2 border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default UpdateOrders;
