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
        <div className='flex justify-center items-center h-screen'>
            <div className="bg-orange-100 flex flex-col justify-center px-5 rounded-2xl shadow-2xl w-full h-full sm:w-110 sm:h-120">

                <h1 className="text-5xl font-extrabold text-center mb-5">
                    Log in
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-5">

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter Your Email"
                        className="bg-orange-200 rounded border-2 p-1 outline-0"
                        onChange={handleChange}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Enter Your Password"
                        className="bg-orange-200 rounded border-2 p-1 outline-0"
                        onChange={handleChange}
                    />

                    <button
                        type="submit"
                        className="bg-orange-400 py-2 cursor-pointer">
                        Log in
                    </button>

                    <p>
                        Don't have an account?
                        <Link to="/" className="text-blue-900 font-semibold">
                            Sign Up
                        </Link>
                    </p>

                </form>
            </div>
        </div>
    )
}

export default Login