import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartIcon from "./CartIcon";
import axios from "axios";

const WishList = () => {
    const navigate = useNavigate();
    const [wishlist, setWishlist] = useState<any[]>([]);

    const token = localStorage.getItem("token");

    // 🔥 Fetch wishlist
    const fetchWishlist = async () => {
        const res = await axios.get("http://localhost:5000/api/wishlist", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        setWishlist(res.data.items);
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    // ❤️ Toggle (remove if exists)
    const handleToggleWish = async (product: any) => {
        await axios.post(
            "http://localhost:5000/api/wishlist/toggle",
            {
                productId: product.productId || product._id,
                name: product.name,
                price: product.price,
                image: product.image,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        fetchWishlist();
    };

    // 🛒 Add to cart (NOW USING BACKEND)
    const handleAddToCart = async (product: any) => {
        await axios.post(
            "http://localhost:5000/api/cart/add",
            {
                productId: product.productId || product._id,
                name: product.name,
                price: product.price,
                qty: 1,
                image: product.image,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        await handleToggleWish(product);

        window.dispatchEvent(new Event("cartUpdated"));

        alert("Added to cart");
    };

    return (
        <div>
            {/* Navbar */}
            <div className="nav text-white flex justify-between items-center py-5 px-7 shadow">
                <button
                    onClick={() => navigate("/account")}
                    className="btn font-bold px-2 py-0.2 rounded cursor-pointer"
                >
                    Account
                </button>

                <h1 className="text-3xl font-bold">Wish List</h1>

                <div className="flex gap-5">
                    <CartIcon />
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="btn font-bold px-2 py-0.2 rounded cursor-pointer"
                    >
                        Dashboard
                    </button>
                </div>
            </div>

            {wishlist.length === 0 ? (
                <div className="p-5">
                    <p>No items in wishlist</p>
                </div>
            ) : (
                <div className="flex gap-5 p-5 flex-wrap">
                    {wishlist.map((item: any) => (
                        <div key={item.productId} className="bg-white shadow p-3 w-60">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="h-40 w-full object-cover mb-2"
                                onError={(e: any) => {
                                    e.target.src =
                                        "https://dummyimage.com/300x200/cccccc/000000&text=No+Image";
                                }}
                            />

                            <h3 className="font-semibold">{item.name}</h3>
                            <h4 className="font-bold">₹{item.price}</h4>

                            <button
                                onClick={() => handleAddToCart(item)}
                                className="mt-2 w-full bg-black text-white py-1"
                            >
                                Add to Cart
                            </button>

                            <button
                                onClick={() => handleToggleWish(item)}
                                className="mt-2 w-full bg-red-500 text-white py-1"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishList;