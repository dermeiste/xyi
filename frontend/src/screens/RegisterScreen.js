import React,{useState,useEffect} from 'react'
import {Link} from 'react-router-dom'
import {Form,Row,Col,Button} from 'react-bootstrap'
import {useDispatch,useSelector} from 'react-redux'
import FormContainer from '../components/FormContainer'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {register} from '../actions/userActions'


const RegisterScreen = ({location,history}) => {
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [confirmPassword,setConfirmPassword] = useState('')

  const [message,setMessage] = useState('')

  const dispatch = useDispatch()
  const userRegister = useSelector(state => state.userRegister)
  const {loading,error,userInfo} = userRegister
  const userLogin = useSelector(state => state.userLogin)
  const redirect = location.search ? location.search.split("=")[1] : '/'
  console.log("userInfo: ",userInfo)
  useEffect(() => {
    if(userLogin.userInfo) {
      history.push(redirect)
    }
  },[redirect,userLogin.userInfo,history])

  const submitHandler = (e) => {
    e.preventDefault()
    if(password !== confirmPassword) {
      setMessage('Password not equal')
    }else {
      dispatch(register(name,email,password))
    }
  }

  return (
    <FormContainer>
      <h1>Sign Up</h1>
      {error && <Message variant="danger">{error}</Message>}
      {message && <Message variant="danger">{message}</Message>}
      {loading && <Loader/>}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="name">
          <Form.Label>Enter Your Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) =>setName(e.target.value)}
            placeholder="Enter name"
          />
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Label>Enter Your Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) =>setEmail(e.target.value)}
            placeholder="Enter Email"
          />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Enter Your Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) =>setPassword(e.target.value)}
            placeholder="Enter Password"
          />
        </Form.Group>

        <Form.Group controlId="confirmPassword">
          <Form.Label>Confirm Your Password</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            onChange={(e) =>setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
          />
        </Form.Group>
        <Button type="submit">Register</Button>
      </Form>
      <Row className="py-3">
        <Col>
          Have an Account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Login</Link>
        </Col>
      </Row>
    </FormContainer>
  )
}
export default RegisterScreen
