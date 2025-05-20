import { useEffect, useState } from "react";
import axios from "axios";
import baseURL from "../../../utils/baseURL"; // adjust path if needed
import {
  ArrowTrendingUpIcon,
  ArrowDownIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

const StatCard = ({ title, value, Icon, color }) => (
  <div className={`relative overflow-hidden rounded-lg bg-${color}-600 px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6`}>
    <dt>
      <div className="absolute rounded-md bg-indigo-500 p-3">
        <Icon className="h-6 w-6 text-white" />
      </div>
      <p className="ml-16 truncate text-sm font-medium text-white">{title}</p>
    </dt>
    <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
      <p className="text-2xl font-semibold text-white">Rs. {value?.toFixed(2)}</p>
    </dd>
  </div>
);

export default function OrdersStats() {
  const [stats, setStats] = useState({});
  const [todaySales, setTodaySales] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get(`${baseURL}/orders/sales/sum`, config);
        setStats(data.orders?.[0] || {});
        setTodaySales(data.salesToday?.[0]?.totalTodaySales || 0);
      } catch (err) {
        console.error("Failed to fetch order stats:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6 bg-gray-50">
      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Income" value={stats.totalSales} Icon={CurrencyDollarIcon} color="green" />
        <StatCard title="Average Sale" value={stats.avgSale} Icon={ChartBarIcon} color="blue" />
        <StatCard title="Highest Sale" value={stats.maxSale} Icon={ArrowTrendingUpIcon} color="indigo" />
        <StatCard title="Lowest Sale" value={stats.minimumSale} Icon={ArrowDownIcon} color="red" />
        <StatCard title="Today's Sales" value={todaySales} Icon={CalendarDaysIcon} color="purple" />
      </dl>
    </div>
  );
}
