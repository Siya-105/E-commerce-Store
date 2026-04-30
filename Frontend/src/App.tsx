import Signup from './Pages/Signup'
import { Route, Routes } from 'react-router-dom'
import Login from './Pages/Login'
import DashBoard from './Pages/DashBoard'
import AdminDashboard from './Pages/AdminDashboard'
import VendorDashboard from './Pages/VendorDashboard'
import RoleProtectedRoute from './Components/RoleProtectedRoutes'
import Cart from './Components/Cart'
import Account from './Components/Account'
import WishList from './Components/WishList'
import MyOrders from './Pages/MyOrders'

const App = () => {
  return (
    <div className='background min-h-dvh'>
      <Routes>
        <Route
          path='/'
          element={<Signup />} />
        <Route
          path='/login'
          element={<Login />} />
        <Route
          path='/dashboard'
          element={
            <RoleProtectedRoute allowedRole='user'>
              <DashBoard />
            </RoleProtectedRoute>} />
        <Route
          path="/vendor"
          element={
            <RoleProtectedRoute allowedRole='vendor'>
              <VendorDashboard />
            </RoleProtectedRoute>} />
        <Route
          path="/admin"
          element={
            <RoleProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<WishList />} />
        <Route
          path='/account'
          element={<Account />} />
          <Route path="/my-orders" element={<MyOrders />} />
      </Routes>

    </div>
  )
}

export default App