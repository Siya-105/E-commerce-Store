import { ShoppingCart } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const CartIcon = () => {

    const [count, setCount] = useState(0)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchCartCount = async () => {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:5000/api/cart", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            const totalQty = data.items.reduce(
                (sum: number, item: any) => sum + item.qty,
                0
            );

            setCount(totalQty);
        };

        fetchCartCount();

        window.addEventListener("cartUpdated", fetchCartCount);

        return () => {
            window.removeEventListener("cartUpdated", fetchCartCount);
        };
    }, []);

    return (
        < div className="relative cursor-pointer" onClick={() => navigate("/cart")}>
            <ShoppingCart size={30} />
            {count > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                    {count}
                </span>
            )}
        </div >
    )
}

export default CartIcon