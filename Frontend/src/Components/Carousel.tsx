const Carousel = () => {
  return (
    <div className='mx-auto mt-5 flex max-w-6xl items-center justify-center px-4'>
      <div className='flex w-full flex-col overflow-hidden rounded-lg bg-white shadow sm:h-72 sm:flex-row'>
        {/* <div className='flex flex-1 flex-col justify-center px-5 py-8 sm:px-8 sm:py-0'>
          <p className='text-sm font-bold uppercase text-[#F8481C]'>Fresh deals</p>
          <h2 className='mt-2 text-2xl font-bold text-[#004E89] sm:text-3xl'>Shop your everyday favorites</h2>
          <p className='mt-2 max-w-md text-sm text-gray-600'>
            Browse the latest products and add your picks to cart in just a click.
          </p>
        </div> */}
        <div className='flex h-48 flex-1 items-center justify-center sm:h-auto'>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvZYkq3ZvaorpBpdbbofBc-fUXq9TunoyIcg&s"
            alt="Shopping banner"
            className='h-full max-w-full object-contain p-4'
          />
        </div>
      </div>
    </div>
  )
}

export default Carousel
