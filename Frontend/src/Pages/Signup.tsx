import axios from "axios"
import { useState, type ChangeEvent, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"

const Signup = () => {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  })

  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        form
      );
      console.log(response.data);

      alert("Signup successful");
      navigate("/login");

    } catch (err: any) {
      console.log(err.response?.data);
      alert(err.response?.data?.msg || "Signup failed");
    }
  }

  return (
    <div className="background min-h-screen p-5 md:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-40px)] w-full max-w-6xl overflow-hidden rounded-lg bg-white shadow-2xl md:min-h-[calc(100vh-64px)] md:grid-cols-2">
        <section className="flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase text-[#F8481C]">Join us</p>
              <h1 className="mt-2 text-3xl font-extrabold text-gray-900">Create your account</h1>
              <p className="mt-2 text-gray-600">Start shopping as a customer or sell products as a vendor.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <label className="block">
                <span className="mb-2 block font-semibold text-gray-800">Account type</span>
                <select
                  name="role"
                  onChange={handleChange}
                  className="w-full rounded border border-gray-300 bg-gray-50 p-3 outline-none focus:border-[#004E89] focus:bg-white focus:ring-2 focus:ring-blue-100"
                >
                  <option value="user">Customer</option>
                  <option value="vendor">Vendor</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block font-semibold text-gray-800">Full name</span>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  className="w-full rounded border border-gray-300 bg-gray-50 p-3 outline-none focus:border-[#004E89] focus:bg-white focus:ring-2 focus:ring-blue-100"
                  onChange={handleChange}
                />
              </label>

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
                  placeholder="Create a password"
                  className="w-full rounded border border-gray-300 bg-gray-50 p-3 outline-none focus:border-[#004E89] focus:bg-white focus:ring-2 focus:ring-blue-100"
                  onChange={handleChange}
                />
              </label>

              <button
                type="submit"
                className="btn mt-2 rounded px-4 py-3 font-bold text-white shadow cursor-pointer"
              >
                Sign up
              </button>

              <p className="text-center text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="font-bold text-[#004E89]">
                  Log in
                </Link>
              </p>
            </form>
          </div>
        </section>

        <section className="nav flex flex-col justify-between p-8 text-white md:p-10">
          <div>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#004E89] cursor-pointer"
            >
              Login
            </button>
          </div>

          <div className="py-12 md:py-0">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">New marketplace account</p>
            <h2 className="mt-3 text-4xl font-extrabold leading-tight md:text-5xl">
              Build your shopping space in minutes.
            </h2>
            <p className="mt-5 max-w-md text-blue-100">
              Save addresses, manage orders, keep a wishlist, or open a vendor account from the same sign up.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-white/10 p-3">
              <p className="text-2xl font-bold">Easy</p>
              <p className="text-xs text-blue-100">Signup</p>
            </div>
            <div className="rounded-lg bg-white/10 p-3">
              <p className="text-2xl font-bold">Smart</p>
              <p className="text-xs text-blue-100">Orders</p>
            </div>
            <div className="rounded-lg bg-white/10 p-3">
              <p className="text-2xl font-bold">Ready</p>
              <p className="text-xs text-blue-100">Vendor</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Signup
