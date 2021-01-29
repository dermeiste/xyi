import React,{useState,useEffect} from 'react'
import {Form,Button} from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import {useDispatch,useSelector} from 'react-redux'
import {saveShippingAddress} from '../actions/cartActions'
import CheckoutSteps from '../components/CheckoutSteps'

const ShippingScreen = ({history}) => {
  const cart = useSelector(state => state.cart)
  const {shippingAddress,cartItems} = cart
  const [address,setAddress] = useState(shippingAddress.address)
  const [city,setCity] = useState(shippingAddress.city)
  const [postCode,setPostCode] = useState(shippingAddress.postCode)
  const [country,setCountry] = useState(shippingAddress.country)
  const {userInfo} = useSelector(state => state.userLogin)
  const dispatch = useDispatch()

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(saveShippingAddress({address,city,postCode,country}))

    history.push('/payment')
  }
  useEffect(() => {
    if(!userInfo) history.push('/login?redirect=shipping')
    if(cartItems.length == 0) {
      history.push('/')
    }
  },[cartItems,userInfo])

  return (
    <FormContainer>
      <CheckoutSteps step1 step2/>
      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="address">
          <Form.Label>Enter Your Address</Form.Label>
          <Form.Control
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address"
            required
          />
        </Form.Group>

        <Form.Group controlId="city">
          <Form.Label>Enter Your City</Form.Label>
          <Form.Control
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city"
            required
          />
        </Form.Group>

        <Form.Group controlId="city">
          <Form.Label>Enter Your Postal Code</Form.Label>
          <Form.Control
            type="text"
            value={postCode}
            onChange={(e) => setPostCode(e.target.value)}
            placeholder="Enter Postal Code"
            required
          />
        </Form.Group>

        <Form.Group controlId="country">
          <Form.Label>Enter Your Country</Form.Label>
          <Form.Control
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Enter Country"
            required
          />
        </Form.Group>
        <Button type="submit">Continue</Button>
      </Form>
    </FormContainer>
  )
}

export default ShippingScreen
