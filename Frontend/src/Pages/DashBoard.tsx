import Carousel from "../Components/Carousel"
import Navbar from "../Components/Navbar"
import Product from "../Components/Product"

const DashBoard = () => {
  return (
    <div className="pb-5">
      <Navbar />
      <Carousel />
      <Product />
    </div>
  )
}

export default DashBoard