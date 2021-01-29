import React,{useState,useEffect} from 'react'
import {Link} from 'react-router-dom'
import {Form,Button} from 'react-bootstrap'
import {useDispatch,useSelector} from 'react-redux'
import FormContainer from '../components/FormContainer'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {getUserDetails,updateUser} from '../actions/userActions'
import {USER_UPDATE_RESET} from '../constants/userConstants'

const UserEditScreen = ({location,history,match}) => {
  const userId = match.params.id
  const dispatch = useDispatch()
  const userLogin = useSelector(state => state.userLogin)
  const userDetails = useSelector(state => state.userDetails)

  const {loading,error,user} = userDetails
  console.log('userDetails: ',userDetails)
  console.log('userId: ',userId)
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [isAdmin,setIsAdmin] = useState(false)
  console.log('name: ',user.name)

  const userUpdate = useSelector(state => state.userUpdate)
  const {success:successUpdate,error:errorUpdate,loading:loadingUpdate} = userUpdate

  useEffect(() => {
    if(successUpdate) {
      dispatch({type:USER_UPDATE_RESET})
      history.push('/admin/userlist')
    }else {
      if(!user.name || userId !== user._id) {
          dispatch(getUserDetails(userId))
      }else {
        setName(user.name)
        setEmail(user.email)
        setIsAdmin(user.isAdmin)
        console.log('aaaaaaa')
      }
    }







  },[history,dispatch,user.name,successUpdate])






  const redirect = location.search ? location.search.split("=")[1] : null



  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(updateUser({_id:userId,name,email,isAdmin}))

  }

  return (
    <>
      <Link to='/admin/userlist' className="btn btn-light py-3">Go Back</Link>
      <FormContainer>
        <h1>Edit User</h1>
        {loadingUpdate && <Loader/>}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
        {
          loading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
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

              <Form.Group controlId="check">
                <Form.Check
                  type="checkbox"
                  label="is Admin"
                  checked={isAdmin}
                  onChange={(e) =>setIsAdmin(e.target.checked)}
                />
              </Form.Group>
              <Button type="submit">Update</Button>
            </Form>


          )
        }
      </FormContainer>
    </>



  )
}
export default UserEditScreen
