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
      console.log(form);

      console.log(response.data);

      alert("Signup successful ✅");

      // 👉 go to login page
      navigate("/login");

    } catch (err: any) {
      console.log(err.response?.data);
      alert(err.response?.data?.msg || "Signup failed ❌");
    }
  }

  return (
    <div className='flex justify-center items-center h-screen'>
      <div className="bg-orange-100 flex flex-col justify-center px-5 rounded-2xl shadow-2xl w-full h-full sm:w-110 sm:h-120">

        <h1 className="text-5xl font-extrabold text-center mb-5">
          Sign Up
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-5">

          <select
            name="role"
            onChange={handleChange}
            className="bg-orange-200 rounded border-2 p-1"
          >
            <option value="user">Customer</option>
            <option value="vendor">Vendor</option>
          </select>

          <input
            type="text"
            name="name"
            placeholder="Enter Your Name"
            className="bg-orange-200 rounded border-2 p-1"
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Enter Your Email"
            className="bg-orange-200 rounded border-2 p-1"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Your Password"
            className="bg-orange-200 rounded border-2 p-1"
            onChange={handleChange}
          />

          <button
            type="submit"
            className="bg-orange-400 py-2 cursor-pointer">
            Sign Up
          </button>

          <p>
            Already have an account?
            <Link to="/login" className="text-blue-900 font-semibold">
              Log in
            </Link>
          </p>

        </form>
      </div>
    </div>
  )
}

export default Signup