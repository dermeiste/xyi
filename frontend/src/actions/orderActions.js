import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_PAY_REQUEST,
  ORDER_PAY_SUCCESS,
  ORDER_PAY_FAIL,
  ORDER_LIST_MY_REQUEST,
  ORDER_LIST_MY_SUCCESS,
  ORDER_LIST_MY_FAIL,
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_FAIL,
  ORDER_DELIVER_REQUEST,
  ORDER_DELIVER_SUCCESS,
  ORDER_DELIVER_FAIL
} from  '../constants/orderConstants'
import axios from 'axios'

export const createOrder = (body) => async(dispatch,getState) => {
  dispatch({type:ORDER_CREATE_REQUEST})
  try{
      const userLogin = getState().userLogin
      const {userInfo} = userLogin
      const config = {
        headers:{
          'Content-Type':'application/json',
          Authorization:`Bearer ${userInfo.token}`
        }
      }

      const {data} = await axios.post('/api/orders/',body,config)
      dispatch({
        type:ORDER_CREATE_SUCCESS,
        payload:data
      })
  }catch(err) {
    dispatch({
      type:ORDER_CREATE_FAIL,
      payload:err.response && err.response.data.message ? err.response.data.message : err.message
    })
  }
}

export const getOrderDetails = (id) => async(dispatch,getState) => {
  dispatch({
    type:ORDER_DETAILS_REQUEST
  })
  try{
    const{userInfo} = getState().userLogin
    const config={
      headers:{
        'Content-Type':'application/json',
        Authorization:`Bearer ${userInfo.token}`
      }
    }
    const {data} = await axios.get(`/api/orders/${id}`,config)
    dispatch({
      type:ORDER_DETAILS_SUCCESS,
      payload:data
    })
  }catch(err) {
    dispatch({
      type:ORDER_DETAILS_FAIL,
      payload:err.response && err.response.data.message ? err.response.data.message : err.message
    })
  }
}

export const payOrder = (orderId,paymentResult) => async(dispatch,getState) => {
  dispatch({type:ORDER_PAY_REQUEST})
  try{
    const {userInfo} = getState().userLogin
    const config = {
      headers:{
        'Content-Type':'application/json',
        Authorization:`Bearer ${userInfo.token}`
      }
    }
    const {data} = await axios.put(`/api/orders/${orderId}/pay`,paymentResult,config)
    dispatch({
      type:ORDER_PAY_SUCCESS,
      payload:data
    })
  }catch(err) {
    dispatch({
      type:ORDER_PAY_FAIL,
      payload:err.response && err.response.data.message ? err.response.data.message : err.message
    })

  }
}

export const orderDeliver = (order) => async(dispatch,getState) => {
  dispatch({type:ORDER_DELIVER_REQUEST})
  try{
    const {userInfo} = getState().userLogin
    const config = {
      headers:{
        'Content-Type':'application/json',
        Authorization:`Bearer ${userInfo.token}`
      }
    }
    const {data} = await axios.put(`/api/orders/${order._id}/deliver`,config)
    console.log(`orderDeliver Bearer ${userInfo.token}`)
    dispatch({
      type:ORDER_DELIVER_SUCCESS,
      payload:data
    })
  }catch(err) {
    dispatch({
      type:ORDER_DELIVER_FAIL,
      payload:err.response && err.response.data.message ? err.response.data.message : err.message
    })
  }
}

export const listMyOrders = () => async(dispatch,getState) => {
  console.log('XUI')
  dispatch({type:ORDER_LIST_MY_REQUEST})
  try{
    const {userInfo} = getState().userLogin
    const config = {
      headers:{
        'Content-Type':'application/json',
        Authorization:`Bearer ${userInfo.token}`
      }
    }
    const {data} = await axios.get(`/api/orders/myorders`,config)
    dispatch({
      type:ORDER_LIST_MY_SUCCESS,
      payload:data
    })
  }catch(err) {
    dispatch({
      type:ORDER_LIST_MY_FAIL,
      payload:err.response && err.response.data.message ? err.response.data.message : err.message
    })
  }
}


export const getOrders = () => async(dispatch,getState) => {
  dispatch({type:ORDER_LIST_REQUEST})
  try{
    const {userInfo} = getState().userLogin
    const config = {
      headers:{
        Authorization:`Bearer ${userInfo.token}`
      }
    }
    const {data} = await axios.get('/api/orders',config)
    dispatch({
      type:ORDER_LIST_SUCCESS,
      payload:data
    })
  }catch(err) {
    dispatch({
      type:ORDER_LIST_FAIL,
      action:err.response && err.response.data.message ? err.response.data.message : err.message
    })
  }
}
