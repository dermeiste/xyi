const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const protect = asyncHandler(async(req,res,next) => {
  let token
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
    try{
      const decoded = jwt.verify(token,process.env.TOKEN_SECRET)
      req.user = await User.findById(decoded.id).select('-password')
      next()
    }catch(err) {
      console.error(err)
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
  }
  if(!token) {
    res.status(401)
    throw new Error('No authorized, no token')
  }
})
const admin = (req,res,next) => {
  if(req.user && req.user.isAdmin) {
    next()
  }else {
    res.status(401)
    throw new Error('Not authorized as an admin')
  }
}
module.exports = {protect,admin}
