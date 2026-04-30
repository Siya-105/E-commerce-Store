import { Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import CartIcon from './CartIcon'

const Navbar = () => {

  const navigate = useNavigate()


  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    localStorage.removeItem("user")

    navigate("/login")
  }

  return (
    <div
      className='nav text-white flex justify-between items-center py-5 px-7 shadow'>
      <div className='flex gap-2'>
        <button
        onClick={() => { navigate("/account") }}
        className='btn font-bold px-2 py-0.2 rounded bg-orange-400 cursor-pointer'>
        Account
      </button>
      <button
          onClick={() => { navigate("/my-orders") }}
          className='btn font-bold px-2 py-0.2 rounded bg-orange-400 cursor-pointer'>
          Orders
        </button>
      </div>
      <h1 className='cursor-default text-3xl font-bold'>E-Commerce Store</h1>
      <div
        className='flex gap-5'>
        <button
          onClick={() => { navigate("/wishlist") }}
          className='cursor-pointer'>
          <Heart size={30} />
        </button>
        <CartIcon />
        <button
          onClick={handleLogout}
          className='btn font-bold px-2 py-0.2 rounded bg-orange-400 cursor-pointer'
        >Logout</button>

      </div>
    </div>
  )
}

export default Navbar