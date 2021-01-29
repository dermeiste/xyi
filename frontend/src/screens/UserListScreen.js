import React,{useEffect} from 'react'
import {LinkContainer} from 'react-router-bootstrap'
import {Table,Button} from 'react-bootstrap'
import {useDispatch,useSelector} from 'react-redux'
import {listUsers,userDelete} from '../actions/userActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import {USER_UPDATE_RESET} from '../constants/userConstants'

const UserListScreen = ({history}) => {
  const dispatch = useDispatch()
  const {userInfo} = useSelector(state => state.userLogin)
  const {success:successDelete} = useSelector(state => state.userDelete)
  const {success:successUpdate} = useSelector(state => state.userUpdate)
  const {loading:loadingUserList,users:usersUserList,error:errorUserList} = useSelector(state => state.userList)
  useEffect(() => {
    //dispatch({type:USER_UPDATE_RESET})
    if(userInfo && userInfo.isAdmin) {
      dispatch(listUsers())
    }else {
      history.push('/login')
    }

  },[dispatch,userInfo,successDelete,history,successUpdate])

  const deleteHandler = (id) => {
    console.log('delete')
    dispatch(userDelete(id))
  }
  return (
    <>
      {loadingUserList ? <Loader /> : errorUserList ? <Message variant="danger">{errorUserList}</Message> : (

          <Table responsive bordered striped hover className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>ADMIN</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {
                usersUserList && usersUserList.map(user => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                    <td>
                      {user.isAdmin ? <i className="fas fa-check"></i> : <i className="fas fa-times"></i>}
                    </td>
                    <td>
                      <LinkContainer to={`user/${user._id}/edit`}>
                        <Button variant="light" className="btn-sm"><i className="fas fa-edit"></i></Button>
                      </LinkContainer>
                      <Button variant="danger" className="btn-sm"  onClick={() => deleteHandler(user._id)}>
                        <i className="fas fa-trash" ></i>
                      </Button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </Table>

        )}
    </>

  )
}
export default UserListScreen
