import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const navigate = useNavigate();

    const fetchOrders = async () => {
        const res = await axios.get(
            "http://localhost:5000/api/orders/my",
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );

        setOrders(res.data);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="background min-h-screen">

            {/* Navbar */}
            <div className="nav text-white flex justify-between items-center py-5 px-7 shadow">

                <button
                    onClick={() => navigate("/account")}
                    className="btn px-3 py-1 rounded"
                >
                    Account
                </button>
                <h1 className="text-2xl font-bold">My Orders</h1>

                <button
                    onClick={() => navigate("/dashboard")}
                    className="btn px-3 py-1 rounded"
                >
                    Dashboard
                </button>

            </div>

            {/* Orders */}
            <div className="p-6 space-y-5">

                {orders.length === 0 ? (
                    <p>No orders yet</p>
                ) : (
                    orders.map((order) => (
                        <div key={order._id} className="bg-white p-4 rounded shadow">

                            {/* Top Info */}
                            <div className="flex justify-between items-center">
                                <h2 className="font-bold">
                                    Order ID: {order._id.slice(-6)}
                                </h2>
                                <p>Payment: {order.paymentMethod}</p>
                                <p>Status: {order.paymentStatus}</p>

                                <span
                                    className={`px-3 py-1 rounded text-white text-sm ${order.status === "completed"
                                        ? "bg-green-500"
                                        : "bg-yellow-500"
                                        }`}
                                >
                                    {order.status}
                                </span>
                            </div>

                            {/* Items */}
                            <div className="mt-3">
                                {order.items.map((item: any) => (
                                    <div
                                        key={item.productId}
                                        className="flex flex-col border-b py-2"
                                    >
                                        <div className="flex justify-between">
                                            <p>
                                                {item.name} x {item.qty}
                                            </p>
                                            <p>₹{item.price * item.qty}</p>
                                        </div>

                                        {/* 👇 Vendor Info */}
                                        <div className="text-xs text-gray-500 mt-1">
                                            Sold by: {item.vendorId?.name}
                                        </div>

                                        <div className="text-xs text-gray-400">
                                            {item.vendorId?.email}
                                        </div>

                                        <div className="text-xs mt-1">
                                            Status:
                                            <span className={`ml-1 ${item.status === "completed"
                                                ? "text-green-600"
                                                : "text-yellow-600"
                                                }`}>
                                                {item.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Address */}
                            <div className="mt-3">
                                <p className="font-semibold">Address:</p>
                                <p className="text-gray-600">{order.address}</p>
                            </div>

                            {/* Total */}
                            <div className="mt-3 font-bold text-right">
                                Total: ₹{order.totalAmount}
                            </div>

                        </div>
                    ))
                )}

            </div>
        </div>
    );
};

export default MyOrders;