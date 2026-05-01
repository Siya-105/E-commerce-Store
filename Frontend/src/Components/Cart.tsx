import { useEffect, useState } from "react";
// import { getCart, saveCart } from "../utils/cart";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MapPin, ShoppingBag, Trash2 } from "lucide-react";

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
        <div className="background min-h-screen">
            <div className="nav flex items-center justify-between px-7 py-5 text-white shadow">
                <button
                    className="btn cursor-pointer rounded px-3 py-1 font-bold transition hover:brightness-95"
                    onClick={() => { navigate("/account") }}
                >Account</button>
                <h1 className="cursor-default text-3xl font-bold">My Cart</h1>
                <button
                    onClick={() => { navigate("/dashboard") }}
                    className="btn cursor-pointer rounded px-3 py-1 font-bold transition hover:brightness-95">Dashboard</button>
            </div>


            {cart.length === 0 ? (
                <div className="mx-auto flex max-w-4xl flex-col items-center px-6 py-10 text-center">
                    <div className="mb-5 rounded-full bg-white p-5 text-[#004E89] shadow">
                        <ShoppingBag size={42} />
                    </div>
                    <h2 className="text-2xl font-bold text-[#004E89]">Your cart is empty</h2>
                    <p className="mt-2 max-w-md text-gray-600">Looks like you have not added anything yet.</p>
                    <button
                        onClick={() => { navigate("/dashboard") }}
                        className="btn mt-5 cursor-pointer rounded px-5 py-2 font-semibold text-white shadow transition hover:brightness-95"
                    >
                        Browse Products
                    </button>
                    <img
                        src="https://cdni.iconscout.com/illustration/premium/thumb/confusing-woman-due-to-empty-cart-illustration-svg-download-png-3780056.png"
                        alt="Empty cart"
                        className="mt-6 max-h-80 max-w-full object-contain"
                    />
                </div>

            ) : (
                <div className="mx-auto grid max-w-6xl gap-6 p-6 lg:grid-cols-[1fr_360px]">
                    <div>
                        <div className="mb-4">
                            <p className="text-sm font-bold uppercase text-[#F8481C]">Shopping Bag</p>
                            <h2 className="text-2xl font-bold text-[#004E89]">{cart.length} item{cart.length > 1 ? "s" : ""} in your cart</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {cart.map((item) => (

                                <div key={item._id} className="overflow-hidden rounded-lg bg-white shadow transition hover:-translate-y-1 hover:shadow-lg">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="h-40 w-full object-cover"
                                        onError={(e: any) => {
                                            e.target.src = "https://dummyimage.com/300x200/cccccc/000000&text=No+Image";
                                        }}
                                    />

                                    <div className="p-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h3 className="font-semibold capitalize text-gray-900">{item.name}</h3>
                                                <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                                            </div>
                                            <h4 className="font-bold text-[#004E89]">Rs. {item.price}</h4>
                                        </div>

                                        {item.qty > item.stock && (
                                            <p className="mt-2 rounded bg-red-50 px-2 py-1 text-sm font-semibold text-red-600">
                                                Only {item.stock} items available
                                            </p>
                                        )}
                                        <p className="mt-2 line-clamp-2 text-sm capitalize text-gray-500">{item.description}</p>
                                        <p className="mt-2 text-sm text-gray-600">
                                            Stock: {item.stock > 0 ? item.stock : "Out of Stock"}
                                        </p>

                                        <button
                                            onClick={() => removeItem(item.productId)}
                                            className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded bg-gray-900 py-2 font-semibold text-white transition hover:bg-red-600"
                                        >
                                            <Trash2 size={16} />
                                            Remove
                                        </button>
                                    </div>
                                </div>

                            ))}
                        </div>
                    </div>

                    <div className="h-fit rounded-lg bg-white p-5 shadow">
                        <h3 className="mb-4 text-xl font-bold text-[#004E89]">Order Summary</h3>
                        <div>
                            {cart.map((item) => (
                                <div key={item.productId} className="mb-3 flex items-center justify-between gap-3 border-b border-gray-100 pb-3 text-sm">
                                    <p className="font-medium capitalize text-gray-800">{item.qty} x {item.name}</p>
                                    <p className="font-semibold text-gray-700">Rs. {item.qty * item.price}</p>
                                </div>

                            ))}
                        </div>

                        <div className="mt-5">
                            <h3 className="flex items-center gap-2 font-bold text-gray-900">
                                <MapPin size={18} />
                                Delivery Address
                            </h3>
                            {user?.address ? (
                                <p className="mt-2 rounded bg-[#EFEFD0] p-3 text-sm text-gray-700">{user.address}</p>
                            ) : (
                                <div className="mt-2">
                                    <p className="font-semibold text-red-700">No address added</p>
                                    <button
                                        onClick={() => { navigate("/account") }}
                                        className="nav mt-2 cursor-pointer rounded p-2 text-white">
                                        Add Address
                                    </button>
                                </div>
                            )}
                        </div>


                        <div className="mt-5 flex items-center justify-between border-t pt-4">
                            <h2 className="text-lg font-bold">Total</h2>
                            <p className="text-xl font-bold text-[#F8481C]">Rs. {total}</p>
                        </div>
                        <button
                            onClick={handlePlaceOrder}
                            disabled={!user?.address || hasStockIssue}
                            className={`mt-4 w-full rounded px-4 py-3 font-semibold text-white transition ${!user?.address || hasStockIssue
                                ? "bg-gray-400 cursor-not-allowed"
                                : "cursor-pointer bg-green-500 hover:bg-green-600"
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
