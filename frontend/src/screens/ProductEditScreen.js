import React,{useState,useEffect} from 'react'
import axios from 'axios'
import {Row,Col,Button,Form} from 'react-bootstrap'
import {useDispatch,useSelector} from 'react-redux'
import {listProductDetails,updateProduct} from '../actions/productActions'
import FormContainer from '../components/FormContainer'
import {Link} from 'react-router-dom'
import Loader from '../components/Loader'
import Message from '../components/Message'
import {PRODUCT_UPDATE_RESET} from '../constants/productConstants'

const ProductEditScreen = ({history,match}) => {
  const productId = match.params.id
  const {userInfo} = useSelector(state => state.userLogin)
  const dispatch = useDispatch()

  const [name,setName] = useState('')
  const [price,setPrice] = useState(0)
  const [image,setImage] = useState('')
  const [countInStock,setCountInStock] = useState('')
  const [brand,setBrand] = useState('')
  const [category,setCategory] = useState('')
  const [description,setDescription] = useState('')
  const [uploading,setUploading] = useState(false)

  const {loading,product,error} = useSelector(state => state.productDetails)
  const {loading:loadingUpdate,error:errorUpdate,success:successUpdate} = useSelector(state => state.productUpdate)

  useEffect(() => {
    if(userInfo && !userInfo.isAdmin) {
      history.push('/login')
    }
    if(successUpdate) {
      dispatch({type:PRODUCT_UPDATE_RESET})
      history.push('/admin/productlist')
    }
    if(!product.name || productId !== product._id) {
      dispatch(listProductDetails(productId))
    }else {
      setName(product.name)
      setPrice(product.price)
      setImage(product.image)
      setCountInStock(product.countInStock)
      setBrand(product.brand)
      setCategory(product.category)
      setDescription(product.description)
    }


  },[dispatch,productId,match,product.name,successUpdate])
  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(updateProduct({
      _id:productId,
      name,
      price,
      image,
      countInStock,
      brand,
      category,
      description
    }))

  }
  const uploadHandler = async(e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('image',file)
    setUploading(true)
    try{
      const config = {
        'Content-Type':'multipart/form-data'
      }
      const {data} = await axios.post('/api/upload',formData,config)
      setImage(data)
      setUploading(false)
    }catch(err) {
      console.error(err.message)
      setUploading(false)
    }
  }
  return (
    <>

     {
      loading ? <Loader/> : error ? <Message variant="danger">{error}</Message> :(
        <FormContainer>
          <h1>Edit Product</h1>
          <Link to='/admin/productlist'><Button className="btn-light">Go Back</Button></Link>
          {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
          {loadingUpdate && <Loader />}
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                placeHolder="Enter name"
                onChange={e => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={price}
                placeHolder="Enter price"
                onChange={e => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                value={image}
                placeHolder="Enter image"
                onChange={e => setImage(e.target.value)}
              ></Form.Control>
              <Form.File id="image-file" custom label="Choose file" onChange={uploadHandler}></Form.File>
              {uploading && <Loader />}
            </Form.Group>
            <Form.Group controlId="brand">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                value={brand}
                placeHolder="Enter brand"
                onChange={e => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="countInStock">
              <Form.Label>CountInStock</Form.Label>
              <Form.Control
                type="number"
                value={countInStock}
                placeHolder="Enter count In Stock"
                onChange={e => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                value={category}
                placeHolder="Enter category"
                onChange={e => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={description}
                placeHolder="Enter Description"
                onChange={e => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Button type="submit" >Update</Button>
          </Form>
        </FormContainer>
      )
     }

    </>

  )
}

export default ProductEditScreen
