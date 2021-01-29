import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DETAILS_RESET,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_LOGIN_ERROR_RESET,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_RESET,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAIL
} from '../constants/userConstants'
import {ORDER_LIST_MY_RESET} from '../constants/orderConstants'
import axios from 'axios'

export const login = (email,password) => async(dispatch) => {
  dispatch({type:USER_LOGIN_REQUEST})
  try{
    const config = {
      headers:{
        'Content-Type':'application/json'
      }
    }
    const {data} = await axios.post('/api/users/login',{email,password},config)
    dispatch({
      type:USER_LOGIN_SUCCESS,
      payload:data
    })
    localStorage.setItem('userInfo',JSON.stringify(data))
  }catch(err) {
    console.log('err: ',err.response && err.response.data.message ? err.response.data.message : err.message)
    dispatch({
      type:USER_LOGIN_FAIL,
      payload:err.response && err.response.data.message ? err.response.data.message : err.message
    })
  }

}
export const logout = () => dispatch => {
  dispatch({
    type:USER_LOGOUT
  })
  dispatch({
    type:USER_DETAILS_RESET
  })
  dispatch({
    type:ORDER_LIST_MY_RESET
  })
  dispatch({type:USER_LIST_RESET})
  localStorage.removeItem('userInfo')
}
export const resetError = () => dispatch => {
  dispatch({type:USER_LOGIN_ERROR_RESET})
}

export const register = (name,email,password) => async(dispatch) => {
  const config ={
    headers:{
      'Content-Type':'application/json'
    }
  }
  dispatch({type:USER_REGISTER_REQUEST})
  try{
    const {data} = await axios.post('/api/users',{name,email,password},config)
    dispatch({
      type:USER_REGISTER_SUCCESS,
      payload:data
    })
    dispatch({
      type:USER_LOGIN_SUCCESS,
      payload:data
    })
    localStorage.setItem('userInfo',JSON.stringify(data))
  }catch(err) {
    dispatch({
      type:USER_REGISTER_FAIL,
      payload:err.response && err.response.data.message ? err.response.data.message : err.message
    })
  }
}

export const getUserDetails = (id) => async(dispatch,getState) => {
  dispatch({type:USER_DETAILS_REQUEST})
  const {userLogin:{userInfo}} = getState()
  try{
    const config = {
      headers:{
        'Content-Type':'application/json',
        Authorization:`Bearer ${userInfo.token}`
      }
    }
    const {data} = await axios.get(`/api/users/${id}`,config)
    dispatch({
      type:USER_DETAILS_SUCCESS,
      payload:data
    })
  }catch(err) {
    dispatch({
      type:USER_DETAILS_FAIL,
      payload:err.response && err.response.data.message ? err.response.data.message : err.message

    })
  }
}

export const updateUserProfile = (user) => async(dispatch,getState) => {
  dispatch({type:USER_UPDATE_PROFILE_REQUEST})

  try{
    const {userLogin:{userInfo}} = getState()
    const config = {
      headers:{
        'Content-Type':'application/json',
        Authorization:`Bearer ${userInfo.token}`
      }
    }
    const {data} = await axios.put('/api/users/profile',user,config)
    dispatch({
      type:USER_UPDATE_PROFILE_SUCCESS,
      payload:data
    })
  }catch(err) {
    dispatch({
      type:USER_UPDATE_PROFILE_FAIL,
      payload:err.response && err.response.data.message ? err.response.data.message : err.message
    })
  }
}

export const updateUser = (user) => async(dispatch,getState) => {
  dispatch({type:USER_UPDATE_REQUEST})

  try{
    const {userLogin:{userInfo}} = getState()
    const config = {
      headers:{
        'Content-Type':'application/json',
        Authorization:`Bearer ${userInfo.token}`
      }
    }
    const {data} = await axios.put(`/api/users/${user._id}`,user,config)
    dispatch({
      type:USER_UPDATE_SUCCESS,
      payload:data
    })
    dispatch({type:USER_DETAILS_SUCCESS,payload:data})
  }catch(err) {
    dispatch({
      type:USER_UPDATE_FAIL,
      payload:err.response && err.response.data.message ? err.response.data.message : err.message
    })
  }
}

export const listUsers = () => async(dispatch,getState) => {
  dispatch({type:USER_LIST_REQUEST})
  try{
    const {userInfo} = getState().userLogin
    const config = {
      headers:{
        Authorization:`Bearer ${userInfo.token}`
      }
    }
    const {data} = await axios.get('/api/users/',config)
    dispatch({
      type:USER_LIST_SUCCESS,
      payload:data
    })
  }catch(err) {
    dispatch({
      type:USER_LIST_FAIL,
      payload:err.response && err.response.data.message ? err.response.data.message : err.message
    })
  }
}

export const userDelete = (id) => async(dispatch,getState) => {
  dispatch({type:USER_DELETE_REQUEST})
  try{
    const {userInfo} = getState().userLogin
    const config = {
      headers:{
        Authorization:`Bearer ${userInfo.token}`
      }
    }
    const {data} = await axios.delete(`/api/users/${id}`,config)
    dispatch({
      type:USER_DELETE_SUCCESS,

    })
  }catch(err) {
    dispatch({
      type:USER_DELETE_FAIL,
      payload:err.response && err.response.data.message ? err.response.data.message : err.message
    })
  }
}
