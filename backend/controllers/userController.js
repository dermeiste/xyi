const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const generateToken = require('../utils/generateToken')

const authUser = asyncHandler(async(req,res) => {
  const {email,password} = req.body


  const user = await User.findOne({email})

  // res.json({
  //   equal
  // })
  if(user) {
    const equal = await bcrypt.compare(password,user.password)
    if(equal) {
      res.json({
        _id:user._id,
        name:user.name,
        email:user.email,
        isAdmin:user.isAdmin,
        token:generateToken(user._id)
      })
    }else {
        res.status(401)
        throw new Error('Invalid email or password')
    }

  }else {
    res.status(401)
    throw new Error('Invalid email or password')
  }


})

const registerUser = asyncHandler(async(req,res) => {
  const {name,email,password} = req.body
  const existUser = await User.findOne({email})
  if(existUser) {
    res.status(400)
    throw new Error('user already exists')
  }else {
    const user = await User.create({
      name,
      email,
      password
    })
    if(user) {
      res.status(201).json({
        _id:user._id,
        name:user.name,
        email:user.email,
        isAdmin:user.isAdmin,
        token:generateToken(user._id)
      })
    }else {
      res.status(400)
      throw new Error('invalid user data')
    }
  }
})

const getUsers = asyncHandler(async(req,res) => {
  const users = await User.find({})
  res.json(users)
})

const getUserProfile = asyncHandler(async(req,res) => {

  const user = await User.findById(req.user._id)
  if(user) {
    res.json({
      _id:user._id,
      name:user.name,
      email:user.email,
      isAdmin:user.isAdmin,
    })
  }else {
    res.status(404)
    throw new Error('User not found')
  }
})

const updateUserProfile = asyncHandler(async(req,res) => {
  const user = await User.findById(req.user._id)
  if(user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    if(req.body.password) {
      user.password = req.body.password
    }
    const updatedUser = await user.save()
    res.json({
      _id:updatedUser._id,
      name:updatedUser.name,
      email:updatedUser.email,
      isAdmin:updatedUser.isAdmin,
      token:generateToken(updatedUser._id)
    })
  }else {
    res.status(404)
    throw new Error('User not found')
  }
})
const deleteUser = asyncHandler(async(req,res) => {
  const user = await User.findById(req.params.id)
  if(user) {
    await user.remove()
    res.json({message:'user deleted'})
  }else {
    res.status(401)
    throw new Error('User not found')
  }
})

const getUserByid = asyncHandler(async(req,res) => {
  const user = await User.findById(req.params.id).select('-password')
  if(user) {
    res.json(user)
  }else {
    res.status(404)
    throw new Error('User not found')
  }
})

const updateUser = asyncHandler(async(req,res) => {
  const user = await User.findById(req.params.id)
  if(user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.isAdmin = req.body.isAdmin || user.isAdmin

    const updatedUser = await user.save()
    res.json({
      _id:updatedUser._id,
      name:updatedUser.name,
      email:updatedUser.email,
      isAdmin:updatedUser.isAdmin
    })
  }else {
    res.status(404)
    throw new Error('User not found')
  }
})

module.exports = {authUser,getUserProfile,registerUser,updateUserProfile,getUsers,deleteUser,getUserByid,updateUser}
