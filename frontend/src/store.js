import {combineReducers,createStore,applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'

import {productReviewCreateReducer,productListReducer,productDetailsReducer,productListDeleteReducer,productCreateReducer,productUpdateReducer,productTopRatedReducer} from './reducers/productReducers'
import {orderCreateReducer,orderDetailsReducer,orderPayReducer,orderListMyReducer,orderListReducer,orderDeliverReducer} from './reducers/orderReducers'
import {userUpdateReducer,userDeleteReducer,userLoginReducer,userRegisterReducer,userDetailsReducer,userUpdateProfileReducer,userListReducer} from './reducers/userReducers'
import {cartReducer} from './reducers/cartReducers'

const reducers = combineReducers({
  productList:productListReducer,
  productDetails:productDetailsReducer,
  productListDelete:productListDeleteReducer,
  productCreate:productCreateReducer,
  productUpdate:productUpdateReducer,
  productReviewCreate:productReviewCreateReducer,
  productTopRated:productTopRatedReducer,
  cart:cartReducer,
  userLogin:userLoginReducer,
  userRegister:userRegisterReducer,
  userDetails:userDetailsReducer,
  userUpdateProfile:userUpdateProfileReducer,
  userList:userListReducer,
  userDelete:userDeleteReducer,
  orderCreate:orderCreateReducer,
  orderDetails:orderDetailsReducer,
  orderPay:orderPayReducer,
  orderDeliver:orderDeliverReducer,
  orderListMy:orderListMyReducer,
  orderList:orderListReducer,
  userUpdate:userUpdateReducer
})
const middleware = [thunk]
const userLoginFromLocalStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
const cartItemsFromLocalStorage = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []
const shippingAddressFromLocalStorage = localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) : 'xui'
const initialState={
  cart:{
      cartItems:cartItemsFromLocalStorage,
      shippingAddress:shippingAddressFromLocalStorage
  },
  userLogin:{
    userInfo:userLoginFromLocalStorage
  },
  orderListMy:{
    orders:[]
  }
}
const store = createStore(reducers,initialState,composeWithDevTools(applyMiddleware(...middleware)))

export default store
