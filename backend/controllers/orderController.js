const asyncHandler = require('express-async-handler')
const Order = require('../models/orderModel')

const addOrderItems = asyncHandler(async(req,res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  } = req.body

  if(orderItems && orderItems.length == 0) {
    res.status(400)
    throw new Error('No order items')
    return
  }else {
    const order = new Order({
      user:req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    })

    const savedOrder = await order.save()
    res.status(201).json(savedOrder)


  }
})

const getOrderById = asyncHandler(async(req,res) =>{
  const order = await Order.findById(req.params.id).populate('user','name email')
  if(!order) {
    res.status(404)
    throw new Error('Order not found')
  }else {
    res.json(order)
  }
})

const updateOrderToPaid = asyncHandler(async(req,res) => {
  const order = await Order.findById(req.params.id)
  if(order) {
    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResuls = {
      id:req.body.id,
      status:req.body.status,
      update_time:req.body.update_time,
      email:req.body.payer.email_address
    }
    const updatedOrder = await order.save()
    res.json(updatedOrder)
  }else {
    res.status(404)
    throw new Error('Order not found')
  }

})
const getMyOrders = asyncHandler(async(req,res) =>{
  const orders = await Order.find({user:req.user._id})
  res.json(orders)
})

const getOrders = asyncHandler(async(req,res) => {
  const orders = await Order.find({}).populate('user','id name')
  res.json(orders)
})

const updateOrderToBeDelivered = asyncHandler(async(req,res) => {
  const order = await Order.findById(req.params.id)
  if(order) {
    order.isDelivered = true
    order.deliveredAt = Date.now()
    const savedOrder = await order.save()
    res.json(savedOrder)
  }else {
    res.status(404)
    throw new Error('Order not found')
  }
})
module.exports = {addOrderItems,getOrderById,updateOrderToPaid,getMyOrders,getOrders,updateOrderToBeDelivered}