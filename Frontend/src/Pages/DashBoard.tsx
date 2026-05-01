import Carousel from "../Components/Carousel"
import Navbar from "../Components/Navbar"
import Product from "../Components/Product"

const DashBoard = () => {
  return (
    <div className="background min-h-screen pb-8">
      <Navbar />
      <Carousel />
      <Product />
    </div>
  )
}

export default DashBoard
