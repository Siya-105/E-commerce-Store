import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"


const Account = () => {

    const [user, setUser] = useState<any>(null)
    const [address, setAddress] = useState<string>("")
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [isSaving, setIsSaving] = useState<boolean>(false)

    const navigate = useNavigate()

    useEffect(() => {
        const storedUser = localStorage.getItem("user")

        if (storedUser) {
            setUser(JSON.parse(storedUser))
            setAddress(JSON.parse(storedUser).address || "")
        }

    }, [])

    const handleSaveAddress = async () => {
        const token = localStorage.getItem("token");

        try {
            setIsSaving(true);

            const res = await axios.put(
                "http://localhost:5000/api/auth/address",
                { address },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            localStorage.setItem("user", JSON.stringify(res.data));
            setUser(res.data);
            setIsEditing(false);
            alert("Address updated!");
        } catch (err: any) {
            alert(err.response?.data?.message || "Unable to update address");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAddress = async () => {
        const token = localStorage.getItem("token");

        const res = await axios.put(
            "http://localhost:5000/api/auth/address",
            { address: "" },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        localStorage.setItem("user", JSON.stringify(res.data));
        setUser(res.data);
        setAddress("");
        setIsEditing(false);
        alert("Address deleted!");
    };

    const handleLogout = () => {
        localStorage.clear()
        navigate("/login")
    }

    const initials = user?.name
        ?.split(" ")
        .map((namePart: string) => namePart[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "U";

    const accountActions = [
        {
            title: "My Orders",
            description: "Track your recent purchases and order history.",
            path: "/my-orders",
        },
        {
            title: "Cart",
            description: "Review products ready for checkout.",
            path: "/cart",
        },
        {
            title: "Wishlist",
            description: "View products you saved for later.",
            path: "/wishlist",
        },
    ];

    if (!user) {
        return (
            <div className="background min-h-screen flex items-center justify-center p-6">
                <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl font-bold text-red-600">
                        !
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">No user found</h2>
                    <p className="mt-2 text-gray-600">Please login again to view your account details.</p>
                    <button
                        onClick={() => navigate("/login")}
                        className="mt-6 w-full rounded nav px-4 py-3 font-semibold text-white cursor-pointer"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="background min-h-screen">
            <div className="nav text-white flex justify-between items-center py-5 px-7 shadow">
                <h1 className="text-3xl font-bold">My Account</h1>
                <button
                    onClick={() => { navigate('/dashboard') }}
                    className="btn font-bold px-3 py-2 rounded cursor-pointer"
                >
                    Dashboard
                </button>
            </div>

            <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-5 md:p-8">
                <section className="overflow-hidden rounded-lg bg-white shadow-xl">
                    <div className="nav px-6 py-8 text-white md:px-8">
                        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white text-3xl font-bold text-[#004E89] shadow">
                                    {initials}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">Welcome back</p>
                                    <h2 className="text-3xl font-bold capitalize">{user.name}</h2>
                                    <p className="mt-1 text-blue-100">{user.email}</p>
                                </div>
                            </div>
                            <span className="w-fit rounded-full bg-white px-4 py-2 text-sm font-bold uppercase text-[#004E89] shadow">
                                Customer
                            </span>
                        </div>
                    </div>

                    <div className="grid gap-6 p-6 md:grid-cols-2 md:p-8">
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
                            <p className="text-sm font-semibold uppercase text-gray-500">Name</p>
                            <p className="mt-2 text-lg font-bold capitalize text-gray-900">{user.name}</p>
                        </div>
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
                            <p className="text-sm font-semibold uppercase text-gray-500">Email</p>
                            <p className="mt-2 break-words text-lg font-bold text-gray-900">{user.email}</p>
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-3">
                    {accountActions.map((action) => (
                        <button
                            key={action.title}
                            onClick={() => navigate(action.path)}
                            className="rounded-lg bg-white p-5 text-left shadow-lg cursor-pointer hover:shadow-xl"
                        >
                            <h3 className="text-lg font-bold text-gray-900">{action.title}</h3>
                            <p className="mt-2 text-sm leading-6 text-gray-600">{action.description}</p>
                        </button>
                    ))}
                </section>

                <section className="rounded-lg bg-white p-6 shadow-xl md:p-8">
                    <div className="flex flex-col gap-2 border-b border-gray-200 pb-5 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">Delivery Address</h3>
                            <p className="mt-1 text-gray-600">This address will be used while placing orders.</p>
                        </div>
                        {address && !isEditing && (
                            <button
                                onClick={() => { setIsEditing(true) }}
                                className="rounded nav px-5 py-2 font-semibold text-white cursor-pointer"
                            >
                                Edit Address
                            </button>
                        )}
                    </div>

                    {!address && !isEditing && (
                        <div className="mt-6 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center">
                            <h4 className="text-lg font-bold text-gray-900">No address added yet</h4>
                            <p className="mt-2 text-gray-600">Add your delivery address to make checkout faster.</p>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="mt-5 rounded nav px-5 py-3 font-semibold text-white cursor-pointer"
                            >
                                Add Address
                            </button>
                        </div>
                    )}

                    {address && !isEditing && (
                        <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-5">
                            <p className="whitespace-pre-line leading-7 text-gray-800">{address}</p>
                            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                                <button
                                    onClick={() => { setIsEditing(true) }}
                                    className="rounded nav px-5 py-2 font-semibold text-white cursor-pointer sm:w-auto"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={handleDeleteAddress}
                                    className="rounded btn px-5 py-2 font-semibold text-white cursor-pointer sm:w-auto"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    )}

                    {isEditing && (
                        <div className="mt-6">
                            <label className="mb-2 block font-semibold text-gray-900" htmlFor="address">
                                Address
                            </label>
                            <textarea
                                id="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="min-h-36 w-full resize-none rounded border border-gray-300 bg-white p-4 leading-7 outline-none focus:border-[#004E89] focus:ring-2 focus:ring-blue-100"
                                placeholder="House number, street, city, state, pincode"
                            />

                            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                                <button
                                    onClick={handleSaveAddress}
                                    disabled={isSaving}
                                    className={`rounded px-5 py-3 font-semibold text-white sm:flex-1 ${isSaving
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "nav cursor-pointer"
                                        }`}
                                >
                                    {isSaving ? "Saving..." : "Save Address"}
                                </button>
                                <button
                                    onClick={() => {
                                        setAddress(user.address || "")
                                        setIsEditing(false)
                                    }}
                                    className="rounded border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-700 cursor-pointer sm:flex-1"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </section>

                <button
                    onClick={handleLogout}
                    className="self-start rounded btn px-6 py-3 font-bold text-white shadow cursor-pointer"
                >
                    Logout
                </button>
            </main>
        </div>

    )
}

export default Account
