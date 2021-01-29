import React,{useEffect} from 'react'
import {LinkContainer} from 'react-router-bootstrap'
import {Table,Button} from 'react-bootstrap'
import {useDispatch,useSelector} from 'react-redux'
import {listUsers,userDelete} from '../actions/userActions'
import {getOrders} from '../actions/orderActions'
import Loader from '../components/Loader'
import Message from '../components/Message'


const OrderListScreen = ({history}) => {
  const dispatch = useDispatch()
  const {userInfo} = useSelector(state => state.userLogin)


  const {loading:loadingOrderList,orders,error:errorOrderList} = useSelector(state => state.orderList)
  useEffect(() => {
    //dispatch({type:USER_UPDATE_RESET})
    if(userInfo && userInfo.isAdmin) {
      dispatch(getOrders())
    }else {
      history.push('/login')
    }

  },[dispatch,userInfo,history])


  return (
    <>
      <h1>Orders</h1>
      {loadingOrderList ? <Loader /> : errorOrderList ? <Message variant="danger">{errorOrderList}</Message> : (

          <Table responsive bordered striped hover className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>USER</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {
                orders && orders.map(order => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.user && order.user.name}</td>
                    <td>{order.createdAt.substring(0,10)}</td>
                    <td>${order.totalPrice}</td>
                    <td>
                      {order.isPaid ? order.paidAt.substring(0,10) : <i className="fas fa-times"></i>}
                    </td>
                    <td>
                      {order.isDelivered ? order.deliveredAt.substring(0,10) : <i className="fas fa-times"></i>}
                    </td>
                    <td>
                      <LinkContainer to={`/order/${order._id}`}>
                        <Button variant="light" className="btn-sm">Details</Button>
                      </LinkContainer>

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
export default OrderListScreen
