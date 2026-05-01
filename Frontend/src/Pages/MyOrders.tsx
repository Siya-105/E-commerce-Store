import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    CheckCircle2,
    Clock3,
    History,
    MapPin,
    PackageCheck,
    PackageSearch,
    ReceiptText,
    ShoppingBag,
} from "lucide-react";

type OrderItem = {
    productId: string;
    name: string;
    price: number;
    qty: number;
    status?: string;
    vendorId?: {
        name?: string;
        email?: string;
    };
};

type Order = {
    _id: string;
    items: OrderItem[];
    address: string;
    paymentMethod: string;
    paymentStatus: string;
    status: string;
    totalAmount: number;
};

type OrderTab = "current" | "history";

const isCompleted = (status?: string) => status?.toLowerCase() === "completed";

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);

const MyOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [activeTab, setActiveTab] = useState<OrderTab>("current");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await axios.get("http://localhost:5000/api/orders/my", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            setOrders(res.data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Unable to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const currentOrders = useMemo(
        () => orders.filter((order) => !isCompleted(order.status)),
        [orders]
    );

    const historyOrders = useMemo(
        () => orders.filter((order) => isCompleted(order.status)),
        [orders]
    );

    const visibleOrders = activeTab === "current" ? currentOrders : historyOrders;

    const renderStatusBadge = (status?: string) => {
        const completed = isCompleted(status);

        return (
            <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold capitalize ${completed
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                    }`}
            >
                {completed ? <CheckCircle2 size={14} /> : <Clock3 size={14} />}
                {status || "pending"}
            </span>
        );
    };

    return (
        <div className="background min-h-screen text-slate-900">
            <div className="nav text-white shadow">
                <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                    <button
                        onClick={() => navigate("/account")}
                        className="btn inline-flex w-fit items-center gap-2 rounded px-4 py-2 font-bold shadow-sm transition hover:brightness-95 cursor-pointer"
                    >
                        <ArrowLeft size={18} />
                        Account
                    </button>

                    <div className="text-center sm:text-left">
                        <p className="text-sm font-semibold uppercase tracking-wide text-white/75">
                            Your purchases
                        </p>
                        <h1 className="text-3xl font-bold">My Orders</h1>
                    </div>

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="btn flex items-center gap-2 rounded px-4 py-2 font-bold text-white cursor-pointer"
                    >
                        <ShoppingBag size={18} />
                        Shop More
                    </button>
                </div>
            </div>

            <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
                <div className="mb-5 flex flex-col gap-4 rounded-lg bg-white p-4 shadow sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-[#004E89]">Your orders</h2>
                        <p className="text-sm text-slate-500">View active and completed orders.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 rounded bg-[#EFEFD0] p-1">
                        <button
                            onClick={() => setActiveTab("current")}
                            className={`flex items-center justify-center gap-2 rounded px-3 py-2 text-sm font-bold transition cursor-pointer ${activeTab === "current"
                                ? "bg-[#004E89] text-white"
                                : "text-[#004E89]"
                                }`}
                        >
                            <PackageSearch size={17} />
                            Current
                        </button>
                        <button
                            onClick={() => setActiveTab("history")}
                            className={`flex items-center justify-center gap-2 rounded px-3 py-2 text-sm font-bold transition cursor-pointer ${activeTab === "history"
                                ? "bg-[#004E89] text-white"
                                : "text-[#004E89]"
                                }`}
                        >
                            <History size={17} />
                            History
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="rounded-lg bg-white p-8 text-center font-semibold text-[#004E89] shadow">
                        Loading your orders...
                    </div>
                ) : error ? (
                    <div className="rounded-lg border border-red-200 bg-white p-8 text-center shadow">
                        <p className="font-bold text-red-600">{error}</p>
                        <button
                            onClick={fetchOrders}
                            className="btn mt-4 rounded px-4 py-2 font-bold text-white cursor-pointer"
                        >
                            Try Again
                        </button>
                    </div>
                ) : visibleOrders.length === 0 ? (
                    <div className="rounded-lg bg-white p-8 text-center shadow">
                        <PackageCheck className="mx-auto text-[#004E89]" size={48} />
                        <h3 className="mt-4 text-xl font-bold text-[#004E89]">
                            {activeTab === "current" ? "No current orders" : "No order history yet"}
                        </h3>
                        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                            {activeTab === "current"
                                ? "Looks like nothing is on the way right now. Find something you like and place your next order."
                                : "Delivered orders will appear here after your purchases are completed."}
                        </p>
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="btn mt-5 inline-flex items-center gap-2 rounded px-4 py-2 font-bold text-white cursor-pointer"
                        >
                            <ShoppingBag size={18} />
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {visibleOrders.map((order) => (
                            <article key={order._id} className="rounded-lg bg-white p-5 shadow">
                                <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <ReceiptText size={20} className="text-[#F8481C]" />
                                            <h2 className="text-lg font-bold text-[#004E89]">
                                                Order #{order._id.slice(-6).toUpperCase()}
                                            </h2>
                                            {renderStatusBadge(order.status)}
                                        </div>
                                        <p className="mt-2 text-sm text-slate-500">
                                            Payment: {order.paymentMethod} • {order.paymentStatus}
                                        </p>
                                    </div>

                                    <div className="text-left sm:text-right">
                                        <p className="text-sm text-slate-500">Total</p>
                                        <p className="text-xl font-bold text-[#004E89]">
                                            {formatCurrency(order.totalAmount)}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 space-y-3">
                                    {order.items.map((item) => (
                                        <div
                                            key={`${order._id}-${item.productId}`}
                                            className="flex flex-col gap-2 rounded border border-slate-100 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between"
                                        >
                                            <div>
                                                <p className="font-semibold capitalize">
                                                    {item.name} x {item.qty}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    Sold by {item.vendorId?.name || "seller"}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3 sm:justify-end">
                                                {renderStatusBadge(item.status)}
                                                <p className="font-bold text-[#004E89]">
                                                    {formatCurrency(item.price * item.qty)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 rounded bg-[#EFEFD0] p-4">
                                    <div className="flex items-center gap-2 font-bold text-[#004E89]">
                                        <MapPin size={18} />
                                        Delivery Address
                                    </div>
                                    <p className="mt-2 text-sm text-slate-700">{order.address}</p>
                                </div>


                            </article>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyOrders;
