import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0,
  });

  const token = localStorage.getItem("token");

  const fetchStats = async () => {
    try {
      // Products
      const productsRes = await axios.get(
        "http://localhost:5000/api/products/all"
      );

      // Orders (using user endpoint as fallback)
      const ordersRes = await axios.get(
        "http://localhost:5000/api/orders/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const totalRevenue = ordersRes.data.reduce(
        (sum: number, order: any) => sum + order.totalAmount,
        0
      );

      setStats({
        users: 1, // placeholder (no admin API yet)
        products: productsRes.data.length,
        orders: ordersRes.data.length,
        revenue: totalRevenue,
      });
    } catch (err) {
      console.log("Admin stats error:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="p-6 background min-h-screen">

      {/* Header */}
      <h1 className="text-3xl font-bold mb-6 text-white">
        Admin Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-gray-500">Users</h2>
          <p className="text-2xl font-bold">{stats.users}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-gray-500">Products</h2>
          <p className="text-2xl font-bold">{stats.products}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-gray-500">Orders</h2>
          <p className="text-2xl font-bold">{stats.orders}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-gray-500">Revenue</h2>
          <p className="text-2xl font-bold">₹{stats.revenue}</p>
        </div>

      </div>

      {/* Placeholder Section */}
      <div className="mt-8 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">
          Admin Controls (Future Scope)
        </h2>

        <ul className="list-disc pl-5 text-gray-600">
          <li>Manage Users</li>
          <li>Manage Vendors</li>
          <li>Approve Products</li>
          <li>View System Analytics</li>
        </ul>
      </div>

    </div>
  );
};

export default AdminDashboard;