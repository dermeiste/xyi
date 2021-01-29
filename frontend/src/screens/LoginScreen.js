import React,{useState,useEffect} from 'react'
import {Link} from 'react-router-dom'
import {useDispatch,useSelector} from 'react-redux'
import {Form,Button,Row,Col} from 'react-bootstrap'
import {login,resetError} from '../actions/userActions'
import FormContainer from '../components/FormContainer'
import Message from '../components/Message'

const LoginScreen = ({location,history}) => {
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const dispatch = useDispatch()
  const userLogin = useSelector(state => state.userLogin)
  const {loading,userInfo,error} = userLogin
  const redirect = location.search ? location.search.split("=").slice(1,3).join('=') : ''
  console.log('redirect: ',redirect)
  useEffect(() => {
    if(userInfo) {
      history.push(redirect)
    }
      dispatch(resetError())
  },[userInfo])
  const submitHandler = (e) => {
    e.preventDefault()

    dispatch(login(email,password))

  }
  return (
    <FormContainer>
      <h1>Sing In</h1>
      {error && <Message variant="danger">{error}</Message>}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
        </Form.Group>

        <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </Form.Group>
        <Button type="submit" variant="primary">Sign In</Button>
      </Form>
      <Row className="py-3">
        <Col>
          New Customer? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Register</Link>
        </Col>
      </Row>
    </FormContainer>
  )
}
export default LoginScreen
