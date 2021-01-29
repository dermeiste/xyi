import React,{useEffect,useState} from 'react'
import Loader from '../components/Loader'
import Message from '../components/Message'
import {useDispatch,useSelector} from 'react-redux'
import {Row, Col, Image,ListGroup,Card,Button,Form} from 'react-bootstrap'
import {Link} from 'react-router-dom'
//import products from '../products'
import Rating from '../components/Rating'
import {listProductDetails,createReview} from '../actions/productActions'
import {PRODUCT_REVIEW_CREATE_RESET} from '../constants/productConstants'
import Meta from '../components/Meta'

const ProductScreen = ({match,history}) => {
  const [qty,setQty] = useState(1)
  const [comment,setComment] = useState('')
  const [rating,setRating] = useState(0)

  const dispatch = useDispatch()
  console.log('d')
  const {loading,product,error} = useSelector(state => state.productDetails)
  const {userInfo} = useSelector(state => state.userLogin)
  const {success:successReview,error:errorReview} = useSelector(state => state.productReviewCreate)

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(createReview(match.params.id,{
      comment,
      rating
    }))
  }
  useEffect(() => {
      if(successReview || errorReview) {
        dispatch({type:PRODUCT_REVIEW_CREATE_RESET})
        setComment('')
        setRating(0)
      }
      if(!userInfo) history.push(`/login?redirect=/products/${match.params.id}`)
      dispatch(listProductDetails(match.params.id))
  },[match,history,userInfo,successReview])

  const addToCartHandler = () => {
    history.push(`/login?redirect=/cart/${match.params.id}?qty=${qty}`)
    //history.push(`/cart/${match.params.id}?qty=${qty}`)
  }

  //const product = products.find(pr => pr._id === match.params.id)
  return (
    <>
      <Meta title={product.name} />
      <Link className="btn btn-light my-3" to="/">Back</Link>
      {loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
        <>
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid/>
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating value={product.rating} text={`${product.numReviews} reviews`}/>
                </ListGroup.Item>
                <ListGroup.Item>
                  Price: ${product.price}
                </ListGroup.Item>
                <ListGroup.Item>
                  Price: ${product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        Price:
                      </Col>
                      <Col>
                        ${product.price}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status: </Col>
                      <Col>{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</Col>
                    </Row>
                  </ListGroup.Item>
                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col>
                          <Form.Control as='select' value={qty} onChange={(e) =>setQty(e.target.value) }>
                            {

                              [...Array(product.countInStock).keys()].map(x =>
                                <option key={x+1} value={x+1}>{x+1}</option>

                              )
                            }
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <Button className="btn-block" type="button" disabled={product.countInStock === 0} onClick={() => addToCartHandler()} >Add to Cart</Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row>

            <Col md={6}>
              <h2>Reviews</h2>
              {
                product.reviews && product.reviews.length == 0 ? <Message>No reviews</Message> : (
                  <ListGroup variant="flush">
                    {
                      product.reviews && product.reviews.map(review => (
                        <ListGroup.Item key={review._id}>
                            <strong>{review.name}</strong>
                            <Rating value={review.rating}/>
                            <p>{review.createdAt && review.createdAt.substring(0,10)}</p>
                            <p>{review.comment}</p>
                        </ListGroup.Item>
                      ))
                    }
                    <ListGroup.Item>
                      <h2>Write a Customer Review</h2>
                      {errorReview && <Message variant="danger">{errorReview}</Message>}
                      {
                        userInfo ? (

                          <Form onSubmit={submitHandler}>
                            <Form.Group controlId='rating'>
                              <Form.Label>Rating</Form.Label>
                              <Form.Control as="select" value={rating} onChange={e => setRating(e.target.value)} required>
                                <option value="">Select...</option>
                                <option value="1">1 - Poor</option>
                                <option value="2">2 - Fair</option>
                                <option value="3">3 - Good</option>
                                <option value="4">4 - Very Good</option>
                                <option value="5">5 - Excellent</option>
                              </Form.Control>

                            </Form.Group>
                            <Form.Group>
                              <Form.Control as='textarea' onChange={e => setComment(e.target.value)} value={comment} row={3} required>

                              </Form.Control>
                            </Form.Group>
                            <Button type="submit">Submit</Button>
                          </Form>
                        )

                         : (
                          <Message>Please <Link to="/login">Sign in</Link> to write a review</Message>
                        )
                      }

                    </ListGroup.Item>
                  </ListGroup>
                )
              }

            </Col>
          </Row>
        </>
      )}

    </>
  )
}
export default ProductScreen
