import React,{useState,useEffect} from 'react'
import {Form,Row,Col,Button,Table} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import {Link} from 'react-router-dom'
import {useDispatch,useSelector} from 'react-redux'
import FormContainer from '../components/FormContainer'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {listMyOrders} from '../actions/orderActions'
import {getUserDetails,updateUserProfile,login} from '../actions/userActions'
import {USER_UPDATE_PROFILE_RESET,USER_LOGIN_SUCCESS} from '../constants/userConstants'

const ProfileScreen = ({location,history}) => {
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [confirmPassword,setConfirmPassword] = useState('')

  const [message,setMessage] = useState('')

  const dispatch = useDispatch()
  const userLogin = useSelector(state => state.userLogin)
  const {userInfo,error:errorInfo} = userLogin
  const userDetails= useSelector(state => state.userDetails)
  const {user,loading,error} = userDetails

  const orderListMy= useSelector(state => state.orderListMy)
  const {orders:ordersListMy,loading:loadingListMy,error:errorListMy} = orderListMy

  const userUpdateProfile = useSelector(state => state.userUpdateProfile)
  const {success,userInfo:userInfoUpdate} = userUpdateProfile
  useEffect(() => {
    if(!userInfo) {
      history.push('/login')
    }else {
      if(success) {

        const dat = {...userInfoUpdate,token:userInfo.token}
        console.log('dat: ',dat)
        dispatch({type:USER_UPDATE_PROFILE_RESET})
        dispatch({type:USER_LOGIN_SUCCESS,payload:dat})
        localStorage.setItem('userInfo',JSON.stringify(dat))

      }else {
        if(!user.name || user.name != userInfo.name || user.email != userInfo.email) {
          dispatch(getUserDetails('profile'))
          dispatch(listMyOrders())
        }else {
          console.log('user: ',user)
          setName(user.name)
          setEmail(user.email)
        }

      }




    }

  },[userInfo,history,success,user.name,user.email,dispatch,ordersListMy])

  const submitHandler = (e) => {
    e.preventDefault()
    if(password !== confirmPassword) {
      setMessage('Password not equal')
    }else {
      dispatch(updateUserProfile({_id:user._id,name,email,password}))

    }
  }

  return (
    <Row>
      <Col md={3}>
        <h2>Update Profile</h2>
        {errorInfo && <Message variant="danger">{errorInfo}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        {message && <Message variant="danger">{message}</Message>}
        {success && <Message variant="success">Profile Updated</Message>}
        {loading && <Loader/>}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="ControlName">
            <Form.Label>Enter Your Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) =>setName(e.target.value)}
              placeholder="Enter name"
            />
          </Form.Group>

          <Form.Group controlId="ControlEmail">
            <Form.Label>Enter Your Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) =>setEmail(e.target.value)}
              placeholder="Enter Email"
            />
          </Form.Group>

          <Form.Group controlId="ControlPassword">
            <Form.Label>Enter Your Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) =>setPassword(e.target.value)}
              placeholder="Enter Password"
            />
          </Form.Group>

          <Form.Group controlId="ControlConfirmPassword">
            <Form.Label>Confirm Your Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) =>setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
            />
          </Form.Group>
          <Button type="submit">Update</Button>

            <Link to="/" className="btn btn-light mx-1">Back</Link>

        </Form>
      </Col>
      <Col md={9}>
        <h2>My Orders</h2>
        {
          loadingListMy ? <Loader /> : errorListMy ? <Message variant="danger">{errorListMy}</Message> : (
            <Table responsive striped hover bordered className="table-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  <th>PAID</th>
                  <th>DELIVERED</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {
                  ordersListMy.length >0 && ordersListMy.map((order,index) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{order.createdAt ? order.createdAt.substring(0,10) : 'someday'}</td>
                      <td>{order.totalPrice}</td>
                      <td>
                        {order.isPaid ?
                           order.paidAt.substring(0,10) :
                           <i className="fas fa-times" style={{color:'red'}}></i>}
                      </td>
                      <td>
                        {order.isDelivered ?
                           order.deliveredAt.substring(0,10) :
                           <i className="fas fa-times" style={{color:'red'}}></i>}
                      </td>
                      <td>
                        <LinkContainer to={`/order/${order._id}`}>
                          <Button className="btn-sm" variant="light">Details</Button>
                        </LinkContainer>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </Table>
          )
        }
      </Col>
    </Row>
  )
}
export default ProfileScreen
