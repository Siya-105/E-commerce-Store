import { useEffect, useState } from "react";
import axios from "axios";

const VendorOrders = ({ refreshStats }: any) => {
  const [activeOrders, setActiveOrders] = useState([]);
  const [historyOrders, setHistoryOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/orders/vendor",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setActiveOrders(res.data.active);
    setHistoryOrders(res.data.history);
  };
  const handleMarkComplete = async (orderId: string, productId: string) => {
    await axios.put(
      `http://localhost:5000/api/orders/${orderId}/item/${productId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log("clicked complete", orderId, productId);

    fetchOrders();
    refreshStats();
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Vendor Orders</h2>

      {/* ACTIVE ORDERS */}
      <h3 className="text-lg font-semibold mb-3">Active Orders</h3>

      {activeOrders.length === 0 ? (
        <p>No active orders</p>
      ) : (
        activeOrders.map((order: any) => (
          <div key={order._id} className="bg-white p-5 shadow mb-5 rounded">

            <p><b>Customer:</b> {order.user?.name}</p>
            <p><b>Address:</b> {order.address}</p>

            {order.items.map((item: any) => (
              <div
                key={item.productId}
                className="flex justify-between items-center border-b py-2"
              >
                <div>
                  <p>{item.name} x {item.qty}</p>
                  <p className="text-sm text-gray-500">
                    ₹{item.price * item.qty}
                  </p>
                </div>

                {item.status !== "completed" ? (
                  <button
                    onClick={() => handleMarkComplete(order._id, item.productId)}
                    className="bg-blue-500 text-white px-2 py-1 text-sm rounded"
                  >
                    Complete
                  </button>
                ) : (
                  <span className="text-green-600 text-sm">Done</span>
                )}
              </div>
            ))}

            <p className="font-bold mt-2">Total: ₹{order.totalAmount}</p>

            <span className="text-xs bg-yellow-200 text-yellow-800 px-2 mx-2 py-0.5 rounded">
              Pending
            </span>
          </div>
        ))
      )}

      {/* ORDER HISTORY */}
      <h3 className="text-lg font-semibold mt-8 mb-3">Order History</h3>

      {historyOrders.length === 0 ? (
        <p>No completed orders</p>
      ) : (
        historyOrders.map((order: any) => (
          <div key={order._id} className="bg-gray-100 p-5 shadow mb-5 rounded">

            <p><b>Customer:</b> {order.user?.name}</p>
            <p><b>Address:</b> {order.address}</p>

            {order.items.map((item: any) => (
              <div key={item.productId} className="flex justify-between">
                <span>{item.name} x {item.qty}</span>
                <span>₹{item.price} * {item.qty}</span>
                <span>₹{item.price * item.qty}</span>
              </div>
            ))}

            <p className="font-bold mt-2">Total: ₹{order.totalAmount}</p>

            {/* Completed badge */}
            <span className="inline-block mt-2 bg-green-200 text-green-800 px-2 py-1 text-sm rounded">
              Completed
            </span>

          </div>
        ))
      )}
    </div>
  );
};

export default VendorOrders;