import React,{useEffect} from 'react'
import {Carousel,Image} from 'react-bootstrap'
import {useSelector,useDispatch} from 'react-redux'
import {Link} from 'react-router-dom'
import {getTopRated} from '../actions/productActions'
import Message from '../components/Message'
import Loader from '../components/Loader'


const ProductCarousel = () => {
  const dispatch = useDispatch()
  const {loading,error,products} = useSelector(state => state.productTopRated)
  useEffect(() => {
    dispatch(getTopRated())
  },[dispatch])
  return (
      loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
        <Carousel pause="hover" className="bg-dark">
          {
            products.map(product => (
              <Carousel.Item key={product.key}>
                <Link to={`/products/${product._id}`}>
                  <Image src={product.image} alt={product.name} fluid/>
                  <Carousel.Caption className="carousel-caption">
                    <h2>{`${product.name} ($${product.price})`}</h2>
                  </Carousel.Caption>
                </Link>
              </Carousel.Item>
            ))
          }
        </Carousel>
      )
  )
}

export default ProductCarousel
