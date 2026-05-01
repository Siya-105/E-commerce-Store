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
      className='nav text-white flex flex-col gap-4 px-4 py-5 shadow md:flex-row md:items-center md:justify-between md:px-7'>
      <div className='order-2 flex justify-center gap-2 md:order-1 md:justify-start'>
        <button
        onClick={() => { navigate("/account") }}
        className='btn rounded px-3 py-1 text-sm font-bold shadow-sm cursor-pointer sm:text-base'>
        Account
      </button>
      <button
          onClick={() => { navigate("/my-orders") }}
          className='btn rounded px-3 py-1 text-sm font-bold shadow-sm cursor-pointer sm:text-base'>
          Orders
        </button>
      </div>
      <h1 className='order-1 cursor-default text-center text-2xl font-bold sm:text-3xl md:order-2'>E-Commerce Store</h1>
      <div
        className='order-3 flex items-center justify-center gap-4 md:justify-end'>
        <button
          onClick={() => { navigate("/wishlist") }}
          className='cursor-pointer'>
          <Heart size={30} />
        </button>
        <CartIcon />
        <button
          onClick={handleLogout}
          className='btn rounded px-3 py-1 text-sm font-bold shadow-sm cursor-pointer sm:text-base'
        >Logout</button>

      </div>
    </div>
  )
}

export default Navbar
