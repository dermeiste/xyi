import {
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_LIST_DELETE_REQUEST,
  PRODUCT_LIST_DELETE_SUCCESS,
  PRODUCT_LIST_DELETE_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_REVIEW_CREATE_REQUEST,
  PRODUCT_REVIEW_CREATE_SUCCESS,
  PRODUCT_REVIEW_CREATE_FAIL,
  PRODUCT_TOP_REQUEST,
  PRODUCT_TOP_SUCCESS,
  PRODUCT_TOP_FAIL
} from '../constants/productConstants'
import axios from 'axios'



export const listProducts = (keyword='',pageNumber='') => async(dispatch) => {
  dispatch({type:PRODUCT_LIST_REQUEST})
  try {
    const {data} = await axios.get(`/api/products/?keyword=${keyword}&pageNumber=${pageNumber}`)
    dispatch({
      type:PRODUCT_LIST_SUCCESS,
      payload:data

    })
  } catch (error) {
    dispatch({
      type:PRODUCT_LIST_FAIL,
      payload:  error.response && error.response.data.message ? error.response.data.message : error.message
    })

  }

}
export const listProductDetails = (id) => async(dispatch) => {
  console.log('listProductDetails')
  dispatch({
    type:PRODUCT_DETAILS_REQUEST
  })
  try {
    const {data} = await axios.get(`/api/products/${id}`)
    console.log('data: ',data)
    dispatch({
      type:PRODUCT_DETAILS_SUCCESS,
      payload:data
    })
  } catch (error) {
    dispatch({
      type:PRODUCT_DETAILS_FAIL,
      payload:error.response && error.response.data.message ? error.response.data.message : error.message
    })
  }
}
export const listProductDelete = (id) => async(dispatch,getState) => {
  dispatch({type:PRODUCT_LIST_DELETE_REQUEST})
  try{
    const {userInfo} = getState().userLogin
    const config = {
      headers:{
        Authorization:`Bearer ${userInfo.token}`
      }
    }
    await axios.delete(`/api/products/${id}`,config)
    dispatch({
      type:PRODUCT_LIST_DELETE_SUCCESS
    })

  }catch(err) {
    dispatch({
      type:PRODUCT_LIST_DELETE_FAIL,
      payload:err.response && err.response.data.message ? err.response.data.message : err.message
    })
  }
}
export const createProduct = () => async(dispatch,getState) => {
  dispatch({type:PRODUCT_CREATE_REQUEST})
  try{
    const {userInfo} = getState().userLogin
    const config ={
      headers:{
        'Content-Type':'application/json',
        Authorization:`Bearer ${userInfo.token}`
      }
    }
    const {data} = await axios.post('/api/products',{},config)
    dispatch({
      type:PRODUCT_CREATE_SUCCESS,
      payload:data
    })
  }catch(err) {
    dispatch({
      type:PRODUCT_CREATE_FAIL,
      payload:err.response && err.response.data.message ? err.response.data.message : err.message
    })
  }
}

export const updateProduct = (product) => async(dispatch,getState) => {
  dispatch({type:PRODUCT_UPDATE_REQUEST})
  try{
    const {userInfo} = getState().userLogin
    const config ={
      headers:{
        'Content-Type':'application/json',
        Authorization:`Bearer ${userInfo.token}`
      }
    }
    const {data} = await axios.put(`/api/products/${product._id}`,product,config)
    dispatch({
      type:PRODUCT_UPDATE_SUCCESS,
      payload:data
    })
  }catch(err) {
    dispatch({
      type:PRODUCT_UPDATE_FAIL,
      payload:err.response && err.response.data.message ? err.response.data.message : err.message
    })
  }
}

export const createReview = (productId,review) => async(dispatch,getState) => {
  dispatch({type:PRODUCT_REVIEW_CREATE_REQUEST})
  try{
    const {userInfo} = getState().userLogin
    const config ={
      headers:{
        'Content-Type':'application/json',
        Authorization:`Bearer ${userInfo.token}`
      }
    }
    const {data} = await axios.post(`/api/products/${productId}/reviews`,review,config)
    dispatch({
      type:PRODUCT_REVIEW_CREATE_SUCCESS,

    })
  }catch(err) {
    dispatch({
      type:PRODUCT_REVIEW_CREATE_FAIL,
      payload:err.response && err.response.data.message ? err.response.data.message : err.message
    })
  }
}

export const getTopRated = () => async(dispatch,getState) => {
  dispatch({type:PRODUCT_TOP_REQUEST})
  try{

    const {data} = await axios.get('/api/products/top')
    dispatch({
      type:PRODUCT_TOP_SUCCESS,
      payload:data
    })
  }catch(err) {
    dispatch({
      type:PRODUCT_TOP_FAIL,
      payload:err.response && err.response.data.message ? err.response.data.message : err.message
    })
  }
}
