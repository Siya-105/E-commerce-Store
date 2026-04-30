import { useEffect, useState } from "react";
import axios from "axios";
import { Heart } from "lucide-react";

const API = "http://localhost:5000/api/products/all";

const Product = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const token = localStorage.getItem("token");

  // 🔥 Fetch all products
  const fetchProducts = async () => {
    const res = await axios.get(API);
    setProducts(res.data);
  };

  // 🔥 Fetch wishlist
  const fetchWishlist = async () => {
    const res = await axios.get("http://localhost:5000/api/wishlist", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const ids = res.data.items.map((item: any) => item.productId);
    setWishlist(ids);
  };

  useEffect(() => {
    fetchProducts();
    fetchWishlist();
  }, []);

  // ❤️ Toggle wishlist
  const handleAddToWish = async (product: any) => {
    // Optimistic UI (instant change)
    setWishlist((prev) =>
      prev.includes(product._id)
        ? prev.filter((id) => id !== product._id)
        : [...prev, product._id]
    );

    await axios.post(
      "http://localhost:5000/api/wishlist/toggle",
      {
        productId: product._id,
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
  };

  // 🛒 Add to cart
  const handleAddToCart = async (product: any) => {
    if (product.stock <= 0) {
      alert("Product is out of stock");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/cart/add",
        {
          productId: product._id,
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

      window.dispatchEvent(new Event("cartUpdated"));
      alert("Added to cart");
      
    } catch (err: any) {
      alert(err.response?.data?.message || "Cannot add item")
    }

  };

  return (
    <div className="flex gap-7 justify-start px-[6vw] flex-wrap mt-4">
      {products.map((p: any) => (
        <div key={p._id} className="relative bg-white shadow p-3 w-60">

          {/* 🔴 OUT OF STOCK BADGE */}
          {p.stock <= 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              Out of Stock
            </span>
          )}

          <img
            src={p.image}
            alt={p.name}
            className="h-40 w-full object-cover mb-2"
            onError={(e: any) => {
              e.target.src =
                "https://dummyimage.com/300x200/cccccc/000000&text=No+Image";
            }}
          />

          <h3 className="font-semibold capitalize">{p.name}</h3>

          <p className="text-sm text-gray-500 capitalize">
            {p.description}
          </p>

          <h4 className="font-bold">₹{p.price}</h4>

          {/* ✅ STOCK DISPLAY */}
          <p className="text-sm text-gray-600">
            {p.stock > 0 ? `Stock: ${p.stock}` : "Out of Stock"}
          </p>

          {/* 🛒 BUTTON */}
          <button
            onClick={() => handleAddToCart(p)}
            disabled={p.stock <= 0}
            className={`mt-2 w-full py-1 text-white ${p.stock > 0
              ? "bg-black"
              : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            {p.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </button>

          {/* ❤️ Wishlist */}
          <span className="absolute top-44 right-3">
            <button onClick={() => handleAddToWish(p)}>
              <Heart
                size={25}
                fill={wishlist.includes(p._id) ? "red" : "none"}
                color={wishlist.includes(p._id) ? "red" : "black"}
              />
            </button>
          </span>
        </div>
      ))}
    </div>
  );
};

export default Product;