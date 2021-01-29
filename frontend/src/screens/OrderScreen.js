import React,{useEffect,useState} from 'react'
import {Link} from 'react-router-dom'
import {PayPalButton} from 'react-paypal-button-v2'
import {useSelector,useDispatch} from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import {Row,Col,ListGroup,Image,Card,Button} from 'react-bootstrap'
import {getOrderDetails,payOrder,orderDeliver} from '../actions/orderActions'
import axios from 'axios'
import {ORDER_PAY_RESET,ORDER_DELIVER_RESET} from '../constants/orderConstants'

const OrderScreen = ({match,history}) => {
  const {order,loading,error} = useSelector(state =>state.orderDetails)
  const dispatch = useDispatch()
  const {userInfo} = useSelector(state =>state.userLogin)
  const orderId = match.params.id

  const {success:successPay,error:errorPay,loading:loadingPay} = useSelector(state => state.orderPay)
  const {success:successDeliver,error:errorDeliver,loading:loadingDeliver} = useSelector(state => state.orderDeliver)
  const [sdk,setSdk] = useState(false)
  const addDecimals = (num) => {
    return (Math.round(num*100)/100).toFixed(2)
  }
  if(order) {
    order.itemsPrice = Number(addDecimals(order.orderItems.reduce((acc,item) => acc+item.price*item.qty,0)))

  }
  useEffect(() => {
    if(!userInfo) {
      history.push('/login')
    }
    const addPayPalScript = async() => {
      const {data:clientId} = await axios.get('/api/config/pay')
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.async = true
      script.src = `https://www.paypal.com/sdk/js?currency=RUB&client-id=${clientId}`

      script.onLoad = () => {
        setSdk(true)

      }
      document.body.appendChild(script)
    }

    if(!order || successPay || orderId !== order._id||successDeliver) {
        dispatch({type:ORDER_PAY_RESET})
        dispatch({type:ORDER_DELIVER_RESET})
        dispatch(getOrderDetails(orderId))
    }else if(!order.isPaid) {
      if(!window.paypal) {
        console.log('addpaypal()')
        addPayPalScript()
      }else {
        setSdk(true)
        console.log('setSdk')
      }
    }

  },[order,successPay,dispatch,userInfo,history,successDeliver])

  const successPaymentHandler = (paymentResult) => {

    console.log('paymentResult: ',paymentResult)
    dispatch(payOrder(orderId,paymentResult))
    alert("Transaction completed by ")
  }

  const deliverHandler = () => {
    if(order) {
      dispatch(orderDeliver(order))
    }

  }
  return (
    loading ? <Loader/> : error ? <Message variant="danger">{error}</Message> :(
      <>
        <h1>Order {order._id}</h1>
        <Row>
          <Col md={8}>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Shipping</h2>
                <p>
                  <strong>Name: </strong>
                  {order.user.name}
                </p>
                <p>
                  <strong>Email: </strong>
                  <a href={`mailto:${order.user.email}`}> {order.user.email}</a>
                </p>
                <p><strong>Address: </strong>
                  {order.shippingAddress.address}, {order.shippingAddress.city},{order.shippingAddress.postCode},{order.shippingAddress.country}
                </p>

                  {
                    order.isDelivered ? <Message variant="success">Delivered on {order.DeliveredAt}</Message> :(
                      <Message variant="danger">Not Delivered</Message>
                    )
                  }

              </ListGroup.Item>
              <ListGroup.Item>
                <h2>Payment Method</h2>
                <p><strong>Method: </strong>
                  {order.paymentMethod}
                </p>

                  {
                    order.isPaid ? <Message variant="success">Paid on {order.paidAt}</Message> :(
                      <Message variant="danger">Not Paid</Message>
                    )
                  }

              </ListGroup.Item>
              <ListGroup.Item>
                <ListGroup variant="flush">
                  <h2>Order Items</h2>
                  {
                      order.orderItems.length == 0 ? <Message variant="danger">{error}</Message> :(
                        order.orderItems.map((item,index) => (
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
                      )

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
                    <Col>${order.itemsPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${order.shippingPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${order.taxPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Total</Col>
                    <Col>${order.totalPrice}</Col>
                  </Row>
                </ListGroup.Item>

                {
                  !order.isPaid && (
                    <ListGroup.Item>
                      {loadingPay && <Loader />}
                      {errorPay && <Message variant="danger">{errorPay}</Message>}
                      {!sdk ? <Loader /> :(
                        <PayPalButton amout={order.totalPrice} onSuccess={successPaymentHandler}
                        createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    currency_code: "RUB",
                    value: "0.01"
                  }
                }],
                // application_context: {
                //   shipping_preference: "NO_SHIPPING" // default is "GET_FROM_FILE"
                // }
              });
            }}
                        />
                    )}

                    </ListGroup.Item>
                  )
                }


                <ListGroup.Item>
                {
                  userInfo && userInfo.isAdmin && order.isPaid && (
                    <Button type="button" className="btn btn-block" onClick={deliverHandler} disabled={order.isDelivered}>
                      Mart as Delivered
                    </Button>
                  )
                }
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </>
    )
  )
}



export default OrderScreen
