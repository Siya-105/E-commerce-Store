import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import axios from "axios";
import {
  AlertTriangle,
  ArrowUpRight,
  Boxes,
  Download,
  PackageCheck,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
  createdAt?: string;
};

type User = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "vendor" | "admin";
  address?: string;
  createdAt?: string;
};

type Order = {
  _id: string;
  totalAmount?: number;
  status?: "pending" | "completed";
  createdAt?: string;
  items?: {
    status?: "pending" | "completed";
    qty?: number;
  }[];
};

const API_BASE = "http://localhost:5000/api";
const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const AdminDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<"products" | "users">("products");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | User["role"]>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const authHeaders = token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined;

      const [productsRes, usersRes, ordersRes] = await Promise.allSettled([
        axios.get<Product[]>(`${API_BASE}/products/all`),
        axios.get<User[]>(`${API_BASE}/users/all`),
        axios.get<Order[]>(`${API_BASE}/orders/my`, {
          headers: authHeaders,
        }),
      ]);

      if (productsRes.status === "fulfilled") {
        setProducts(productsRes.value.data);
      }

      if (usersRes.status === "fulfilled") {
        setUsers(usersRes.value.data);
      }

      if (ordersRes.status === "fulfilled") {
        setOrders(ordersRes.value.data);
      } else {
        setOrders([]);
      }

      if (productsRes.status === "rejected" || usersRes.status === "rejected") {
        setError("Some dashboard data could not be loaded. Check the backend server.");
      }
    } catch {
      setError("Unable to load admin dashboard data.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const stats = useMemo(() => {
    const revenue = orders.reduce(
      (sum, order) => sum + Number(order.totalAmount || 0),
      0
    );
    const lowStock = products.filter((product) => product.stock <= 5).length;
    const inventoryValue = products.reduce(
      (sum, product) => sum + product.price * product.stock,
      0
    );
    const vendors = users.filter((user) => user.role === "vendor").length;

    return {
      users: users.length,
      vendors,
      products: products.length,
      orders: orders.length,
      revenue,
      lowStock,
      inventoryValue,
    };
  }, [orders, products, users]);

  const roleData = useMemo(() => {
    const counts = users.reduce<Record<User["role"], number>>(
      (acc, user) => {
        acc[user.role] += 1;
        return acc;
      },
      { user: 0, vendor: 0, admin: 0 }
    );

    return [
      { role: "Users", total: counts.user },
      { role: "Vendors", total: counts.vendor },
      { role: "Admins", total: counts.admin },
    ];
  }, [users]);

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase().trim();

    return products
      .filter((product) =>
        [product.name, product.description].some((value) =>
          value.toLowerCase().includes(query)
        )
      )
      .sort((a, b) => a.stock - b.stock);
  }, [products, search]);

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase().trim();

    return users.filter((user) => {
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesSearch = [user.name, user.email, user.role].some((value) =>
        value.toLowerCase().includes(query)
      );

      return matchesRole && matchesSearch;
    });
  }, [roleFilter, search, users]);

  const recentProducts = useMemo(
    () =>
      [...products]
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        )
        .slice(0, 4),
    [products]
  );

  const exportProducts = () => {
    const rows = [
      ["Name", "Description", "Price", "Stock"],
      ...filteredProducts.map((product) => [
        product.name,
        product.description,
        String(product.price),
        String(product.stock),
      ]),
    ];
    const csv = rows
      .map((row) =>
        row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "admin-products.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#f7f7ed] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 rounded-lg bg-[#004E89] p-5 text-white shadow-lg sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-orange-100">
              <ShieldCheck size={18} />
              Admin Workspace
            </div>
            <h1 className="text-3xl font-bold">Dashboard Overview</h1>
            <p className="mt-2 max-w-2xl text-sm text-blue-50">
              Track users, products, inventory health, and recent marketplace
              activity from one place.
            </p>
          </div>

          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#F8481C] px-4 py-2 font-semibold text-white shadow transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </header>

        {error && (
          <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-800">
            <AlertTriangle size={18} />
            {error}
          </div>
        )}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={<Users size={22} />}
            label="Total Users"
            value={stats.users}
            detail={`${stats.vendors} vendors registered`}
            tone="bg-sky-50 text-sky-700"
          />
          <StatCard
            icon={<Boxes size={22} />}
            label="Products"
            value={stats.products}
            detail={`${stats.lowStock} low-stock items`}
            tone="bg-orange-50 text-orange-700"
          />
          <StatCard
            icon={<ShoppingBag size={22} />}
            label="Orders"
            value={stats.orders}
            detail="Visible from current admin account"
            tone="bg-emerald-50 text-emerald-700"
          />
          <StatCard
            icon={<ArrowUpRight size={22} />}
            label="Inventory Value"
            value={currency.format(stats.inventoryValue)}
            detail={`Tracked revenue ${currency.format(stats.revenue)}`}
            tone="bg-violet-50 text-violet-700"
          />
        </section>

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-lg bg-white p-5 shadow">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">User Roles</h2>
                <p className="text-sm text-slate-500">Distribution across the marketplace</p>
              </div>
              <PackageCheck className="text-[#004E89]" size={24} />
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={roleData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="role" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="total" fill="#004E89" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-lg bg-white p-5 shadow">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Recently Added</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                Products
              </span>
            </div>

            <div className="space-y-3">
              {recentProducts.length === 0 && (
                <p className="rounded-md bg-slate-50 p-4 text-sm text-slate-500">
                  No products available yet.
                </p>
              )}

              {recentProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center gap-3 rounded-md border border-slate-100 p-3"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-14 w-14 rounded-md object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold capitalize">{product.name}</h3>
                    <p className="text-sm text-slate-500">
                      {currency.format(product.price)} · Stock {product.stock}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-lg bg-white shadow">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex rounded-md bg-slate-100 p-1">
              <button
                onClick={() => setActiveTab("products")}
                className={`rounded px-4 py-2 text-sm font-semibold transition ${
                  activeTab === "products"
                    ? "bg-white text-[#004E89] shadow"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Products
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`rounded px-4 py-2 text-sm font-semibold transition ${
                  activeTab === "users"
                    ? "bg-white text-[#004E89] shadow"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Users
              </button>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative block">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={`Search ${activeTab}`}
                  className="w-full rounded-md border border-slate-200 py-2 pl-10 pr-3 text-sm outline-none transition focus:border-[#004E89] focus:ring-2 focus:ring-sky-100 sm:w-72"
                />
              </label>

              {activeTab === "users" && (
                <select
                  value={roleFilter}
                  onChange={(event) =>
                    setRoleFilter(event.target.value as "all" | User["role"])
                  }
                  className="rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#004E89] focus:ring-2 focus:ring-sky-100"
                >
                  <option value="all">All roles</option>
                  <option value="user">Users</option>
                  <option value="vendor">Vendors</option>
                  <option value="admin">Admins</option>
                </select>
              )}

              {activeTab === "products" && (
                <button
                  onClick={exportProducts}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#004E89] hover:text-[#004E89]"
                >
                  <Download size={17} />
                  Export CSV
                </button>
              )}
            </div>
          </div>

          {activeTab === "products" ? (
            <ProductTable products={filteredProducts} loading={loading} />
          ) : (
            <UserTable users={filteredUsers} loading={loading} />
          )}
        </section>
      </div>
    </div>
  );
};

type StatCardProps = {
  icon: ReactNode;
  label: string;
  value: number | string;
  detail: string;
  tone: string;
};

const StatCard = ({ icon, label, value, detail, tone }: StatCardProps) => (
  <div className="rounded-lg bg-white p-5 shadow">
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className={`rounded-lg p-3 ${tone}`}>{icon}</div>
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        Live
      </span>
    </div>
    <p className="text-sm font-medium text-slate-500">{label}</p>
    <h2 className="mt-1 text-2xl font-bold text-slate-950">{value}</h2>
    <p className="mt-2 text-sm text-slate-500">{detail}</p>
  </div>
);

const ProductTable = ({
  products,
  loading,
}: {
  products: Product[];
  loading: boolean;
}) => (
  <div className="overflow-x-auto">
    <table className="w-full min-w-[760px] text-left text-sm">
      <thead className="bg-slate-50 text-xs uppercase text-slate-500">
        <tr>
          <th className="px-5 py-3">Product</th>
          <th className="px-5 py-3">Price</th>
          <th className="px-5 py-3">Stock</th>
          <th className="px-5 py-3">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {loading && (
          <tr>
            <td className="px-5 py-8 text-center text-slate-500" colSpan={4}>
              Loading products...
            </td>
          </tr>
        )}

        {!loading && products.length === 0 && (
          <tr>
            <td className="px-5 py-8 text-center text-slate-500" colSpan={4}>
              No matching products found.
            </td>
          </tr>
        )}

        {!loading &&
          products.map((product) => (
            <tr key={product._id} className="hover:bg-slate-50">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-12 w-12 rounded-md object-cover"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold capitalize text-slate-900">{product.name}</p>
                    <p className="max-w-md truncate text-slate-500">
                      {product.description}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4 font-semibold">
                {currency.format(product.price)}
              </td>
              <td className="px-5 py-4">{product.stock}</td>
              <td className="px-5 py-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    product.stock <= 0
                      ? "bg-red-50 text-red-700"
                      : product.stock <= 5
                        ? "bg-amber-50 text-amber-700"
                        : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {product.stock <= 0
                    ? "Out of stock"
                    : product.stock <= 5
                      ? "Low stock"
                      : "In stock"}
                </span>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
);

const UserTable = ({ users, loading }: { users: User[]; loading: boolean }) => (
  <div className="overflow-x-auto">
    <table className="w-full min-w-[720px] text-left text-sm">
      <thead className="bg-slate-50 text-xs uppercase text-slate-500">
        <tr>
          <th className="px-5 py-3">Name</th>
          <th className="px-5 py-3">Email</th>
          <th className="px-5 py-3">Role</th>
          <th className="px-5 py-3">Address</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {loading && (
          <tr>
            <td className="px-5 py-8 text-center text-slate-500" colSpan={4}>
              Loading users...
            </td>
          </tr>
        )}

        {!loading && users.length === 0 && (
          <tr>
            <td className="px-5 py-8 text-center text-slate-500" colSpan={4}>
              No matching users found.
            </td>
          </tr>
        )}

        {!loading &&
          users.map((user) => (
            <tr key={user._id} className="hover:bg-slate-50">
              <td className="px-5 py-4 font-semibold capitalize text-slate-900">
                {user.name}
              </td>
              <td className="px-5 py-4 text-slate-600">{user.email}</td>
              <td className="px-5 py-4">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                  {user.role}
                </span>
              </td>
              <td className="max-w-sm truncate px-5 py-4 text-slate-500">
                {user.address || "Not provided"}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
);

export default AdminDashboard;
