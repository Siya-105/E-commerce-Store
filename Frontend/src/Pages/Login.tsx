import axios from 'axios'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useNavigate } from "react-router-dom"

const Login = () => {

    const [form, setForm] = useState({
        email: "",
        password: ""
    })

    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                form
            );

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.user.role);
            localStorage.setItem("user", JSON.stringify(response.data.user))

            const role = response.data.user.role;

            if (role === "admin") {
                navigate("/admin");
            } else if (role === "vendor") {
                navigate("/vendor");
            } else {
                navigate("/dashboard");
            }

        } catch (err: any) {
            console.log(err.response?.data);
            alert(err.response?.data?.msg || "Login failed");
        }
    }

    return (
        <div className="background min-h-screen p-5 md:p-8">
            <div className="mx-auto grid min-h-[calc(100vh-40px)] w-full max-w-6xl overflow-hidden rounded-lg bg-white shadow-2xl md:min-h-[calc(100vh-64px)] md:grid-cols-2">
                <section className="nav flex flex-col justify-between p-8 text-white md:p-10">
                    <div>
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#004E89] cursor-pointer"
                        >
                            Create account
                        </button>
                    </div>

                    <div className="py-12 md:py-0">
                        <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">Welcome back</p>
                        <h1 className="mt-3 text-4xl font-extrabold leading-tight md:text-5xl">
                            Login to continue shopping.
                        </h1>
                        <p className="mt-5 max-w-md text-blue-100">
                            Access your orders, cart, wishlist, and delivery details in one place.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="rounded-lg bg-white/10 p-3">
                            <p className="text-2xl font-bold">24/7</p>
                            <p className="text-xs text-blue-100">Shopping</p>
                        </div>
                        <div className="rounded-lg bg-white/10 p-3">
                            <p className="text-2xl font-bold">Fast</p>
                            <p className="text-xs text-blue-100">Checkout</p>
                        </div>
                        <div className="rounded-lg bg-white/10 p-3">
                            <p className="text-2xl font-bold">Safe</p>
                            <p className="text-xs text-blue-100">Account</p>
                        </div>
                    </div>
                </section>

                <section className="flex items-center justify-center p-6 md:p-10">
                    <div className="w-full max-w-md">
                        <div className="mb-8">
                            <p className="text-sm font-semibold uppercase text-[#F8481C]">Account login</p>
                            <h2 className="mt-2 text-3xl font-extrabold text-gray-900">Sign in</h2>
                            <p className="mt-2 text-gray-600">Enter your details to open your account.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <label className="block">
                                <span className="mb-2 block font-semibold text-gray-800">Email</span>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    className="w-full rounded border border-gray-300 bg-gray-50 p-3 outline-none focus:border-[#004E89] focus:bg-white focus:ring-2 focus:ring-blue-100"
                                    onChange={handleChange}
                                />
                            </label>

                            <label className="block">
                                <span className="mb-2 block font-semibold text-gray-800">Password</span>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    className="w-full rounded border border-gray-300 bg-gray-50 p-3 outline-none focus:border-[#004E89] focus:bg-white focus:ring-2 focus:ring-blue-100"
                                    onChange={handleChange}
                                />
                            </label>

                            <button
                                type="submit"
                                className="btn mt-2 rounded px-4 py-3 font-bold text-white shadow cursor-pointer"
                            >
                                Log in
                            </button>

                            <p className="text-center text-gray-600">
                                Don't have an account?{" "}
                                <Link to="/" className="font-bold text-[#004E89]">
                                    Sign up
                                </Link>
                            </p>
                        </form>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Login
