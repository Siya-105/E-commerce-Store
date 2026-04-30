import { useEffect, useState } from "react";
// import { getCart, saveCart } from "../utils/cart";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Cart = () => {
    const [cart, setCart] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null)

    const fetchCart = async () => {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/api/cart", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        setCart(res.data.items);
    };

    useEffect(() => {
        fetchCart();

        const storedUser = localStorage.getItem("user")
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
    }, []);

    const navigate = useNavigate()

    const removeItem = async (id: string) => {

        const token = localStorage.getItem("token");

        await axios.delete(`http://localhost:5000/api/cart/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        window.dispatchEvent(new Event("cartUpdated"));

        fetchCart();

    };

    const hasStockIssue = cart.some(
        (item) => item.stock === 0 || item.qty > item.stock
    );

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
    );

    const handlePlaceOrder = async () => {
        const token = localStorage.getItem("token");

        const formattedItems = cart.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            qty: item.qty,
        }));

        const paymentMethod = prompt("Enter payment method: COD / ONLINE");

        if (!paymentMethod) return;

        try {
            await axios.post(
                "http://localhost:5000/api/orders",
                {
                    items: formattedItems,
                    address: user.address,
                    paymentMethod,
                    paymentStatus: paymentMethod === "ONLINE" ? "paid" : "pending",
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setCart([]);
            window.dispatchEvent(new Event("cartUpdated"));

            alert("Order placed successfully!");

        } catch (err: any) {
            alert(err.response?.data?.message || "Order failed");
        }
    };

    return (
        <div className="background h-screen">
            <div className="nav text-white flex justify-between items-center py-5 px-7 shadow">
                <button
                    className="btn font-bold px-2 py-0.2 rounded cursor-pointer"
                    onClick={() => { navigate("/account") }}
                >Account</button>
                <h1 className="cursor-default text-3xl font-bold">Cart</h1>
                <button
                    onClick={() => { navigate("/dashboard") }}
                    className='btn font-bold px-2 py-0.2 rounded cursor-pointer'>Dashboard</button>
            </div>


            {cart.length === 0 ? (
                <div>
                    <p className="p-6 font-semibold">No Items In Cart</p>
                    <div className="flex justify-center">
                        <img src="https://cdni.iconscout.com/illustration/premium/thumb/confusing-woman-due-to-empty-cart-illustration-svg-download-png-3780056.png" alt="" />
                    </div>
                </div>

            ) : (
                <div className="p-6">
                    <div className="flex gap-4">
                        {cart.map((item) => (

                            <div key={item._id} className="bg-white shadow p-3 w-60">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-40 w-full object-cover mb-2"
                                    onError={(e: any) => {
                                        e.target.src = "https://dummyimage.com/300x200/cccccc/000000&text=No+Image";
                                    }}
                                />

                                <h3 className="font-semibold capitalize">{item.qty} {item.name}</h3>
                                {item.qty > item.stock && (
                                    <p className="text-red-500 text-sm">
                                        Only {item.stock} items available
                                    </p>
                                )}
                                <p className="text-sm text-gray-500 capitalize">{item.description}</p>
                                <h4 className="font-bold">₹{item.price}</h4>
                                <p className="text-sm text-gray-500">
                                    Stock: {item.stock > 0 ? item.stock : "Out of Stock"}
                                </p>

                                <button
                                    onClick={() => removeItem(item.productId)}
                                    className="mt-2 w-full bg-black text-white py-1 cursor-pointer"
                                >
                                    Remove
                                </button>
                            </div>

                        ))}


                    </div>

                    <div className="my-5 p-3 bg-white rounded shadow">
                        <div>
                            {cart.map((item) => (
                                <div className="flex justify-between w-1/3">
                                    <p>{item.qty} {item.name}:</p>
                                    <p className="text-gray-600">{item.qty} * ₹{item.price}</p>
                                    <p className="font-semibold">₹{item.qty * item.price}</p>
                                </div>

                            ))}
                        </div>

                        <div className="mt-5">
                            <h3 className="font-bold">Delivery Address:</h3>
                            {user?.address ? (
                                <p>{user.address}</p>
                            ) : (
                                <div>
                                    <p className="font-semibold text-red-700">No address added</p>
                                    <button
                                        onClick={() => { navigate("/account") }}
                                        className="text-white p-2 nav cursor-pointer">
                                        Add Address
                                    </button>
                                </div>
                            )}
                        </div>


                        <h2 className="text-lg font-bold mt-5">Total: ₹{total}</h2>
                        <button
                            onClick={handlePlaceOrder}
                            disabled={!user?.address || hasStockIssue}
                            className={`px-4 py-2 mt-4 text-white ${!user?.address || hasStockIssue
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-500"
                                }`}
                        >
                            {hasStockIssue ? "Fix stock issues" : "Place Order"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart