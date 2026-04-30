import { useNavigate } from 'react-router-dom'

const VendorNavbar = () => {

  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")

    navigate("/login")
  }

  return (
    <div>
      <div className="nav text-white flex justify-between items-center py-5 px-7 shadow">
        <div />
        {/* <button
        onClick={() => {navigate("/account")}}
        className='btn font-bold px-2 py-0.2 rounded bg-orange-400 cursor-pointer'
        >Account</button> */}
        <h1 className="cursor-default text-3xl font-bold">Vendor DashBoard</h1>
        <div className="flex items-center gap-4">
          <button
          onClick={handleLogout}
          className="btn font-bold px-2 py-0.2 rounded bg-orange-400 cursor-pointer">
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default VendorNavbar