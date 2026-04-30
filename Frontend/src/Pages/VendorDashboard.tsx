import { useEffect, useState } from "react";
import axios from "axios";
import VendorNavbar from "../Components/VendorNavbar";
import VendorProducts from "../Components/VendorProducts";
import VendorOrders from "../Components/VendorOrder";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const VendorDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    pending: 0,
    completed: 0,
    revenue: 0
  });

  const [chartData, setChartData] = useState<any[]>([]);


  const API = "http://localhost:5000/api/products";

  const fetchStats = async () => {
  const productsRes = await axios.get(API, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const response = await axios.get(
    "http://localhost:5000/api/orders/vendor",
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  const active = response.data.active;
  const history = response.data.history;

  const revenue = history.reduce(
    (sum: number, o: any) => sum + o.totalAmount,
    0
  );

  // ✅ STEP: create chart data
  const grouped: any = {};

  history.forEach((order: any) => {
    const date = new Date(order.createdAt).toLocaleDateString();

    if (!grouped[date]) {
      grouped[date] = 0;
    }

    grouped[date] += order.totalAmount;
  });

  const formattedChart = Object.keys(grouped).map((date) => ({
    date,
    revenue: grouped[date],
  }));

  formattedChart.sort(
  (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
);

  setChartData(formattedChart);

  setStats({
    products: productsRes.data.length,
    orders: active.length + history.length,
    pending: active.length,
    completed: history.length,
    revenue,
  });
};

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="background">
      <VendorNavbar />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-6">

        <div className="bg-white p-4 rounded shadow">
          <p>Total Products</p>
          <h2 className="text-xl font-bold">{stats.products}</h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p>Total Orders</p>
          <h2 className="text-xl font-bold">{stats.orders}</h2>
        </div>

        <div className="bg-yellow-100 p-4 rounded shadow">
          <p>Pending Orders</p>
          <h2 className="text-xl font-bold">{stats.pending}</h2>
        </div>

        <div className="bg-green-100 p-4 rounded shadow">
          <p>Completed Orders</p>
          <h2 className="text-xl font-bold">{stats.completed}</h2>
        </div>

        <div className="bg-blue-100 p-4 rounded shadow">
          <p>Total Revenue</p>
          <h2 className="text-xl font-bold">₹{stats.revenue}</h2>
        </div>

      </div>

      <div className="bg-white p-5 mx-6 rounded shadow mb-4">
        <h3 className="text-lg font-semibold mb-4">
          Revenue Over Time
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#4f46e5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Products */}
      <VendorProducts refreshStats={fetchStats} />
      <VendorOrders refreshStats={fetchStats} />
    </div>
  );
};

export default VendorDashboard;