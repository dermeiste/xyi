import React,{useEffect} from 'react'
import {useDispatch,useSelector} from 'react-redux'
import {Link} from 'react-router-dom'
import Message from '../components/Message'
import CheckoutSteps from '../components/CheckoutSteps'
import {Row,Col,Button,ListGroup,Image,Card} from 'react-bootstrap'
import {createOrder} from '../actions/orderActions'

const PlaceOrderScreen = ({history}) => {
  const cart = useSelector(state => state.cart)
  const addDecimals = (num) => {
    return (Math.round(num*100)/100).toFixed(2)
  }
  const dispatch = useDispatch()
  const orderCreate = useSelector(state => state.orderCreate)
  const {order,success,error} = orderCreate

  useEffect(() => {
    if(success) {
      history.push(`/order/${order._id}`)
    }
  },[history,success,order])



  cart.itemsPrice = Number(addDecimals(cart.cartItems.reduce((acc,item) => acc+item.price*item.qty,0)))
  cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100)
  cart.taxPrice = Number(addDecimals((cart.itemsPrice*0.15).toFixed(2)))
  cart.totalPrice = addDecimals(Number(cart.itemsPrice) + Number(cart.shippingPrice) +Number(cart.taxPrice))
  cart.paymentMethod  = 'PayPal'

  const placeOrderHandler = () => {
    dispatch(createOrder({
      orderItems:cart.cartItems,
      shippingAddress:cart.shippingAddress,
      paymentMethod:cart.paymentMethod,
      itemsPrice:cart.itemsPrice,
      shippingPrice:cart.shippingPrice,
      taxPrice:cart.taxPrice,
      totalPrice:cart.totalPrice
    }))
  }

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4/>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p><strong>Address: </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city},{cart.shippingAddress.postCode},{cart.shippingAddress.country}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p><strong>Method: </strong>
                {cart.paymentMethod}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <ListGroup variant="flush">
                {
                  cart.cartItems.map((item,index) => (
                    <ListGroup.Item key={index}>
                    <Row>
                      <Col md={1}>
                        <Image src={item.image} alt={item.name} rounded fluid/>
                      </Col>
                      <Col>
                        <Link to={`/products/${item.product}`}>
                          {item.name}
                        </Link>
                      </Col>
                      <Col md={4}>
                      {item.qty} x ${item.price} = ${(item.qty*item.price).toFixed(2)}
                      </Col>
                    </Row>
                    </ListGroup.Item>
                  ))
                }
              </ListGroup>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary:</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && <Message variant="danger">{error}</Message>}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button type="button" className="btn btn-block" disabled={cart.cartItems.length == 0} onClick={placeOrderHandler}>Place Order</Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}
export default PlaceOrderScreen
