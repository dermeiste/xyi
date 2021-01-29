const db = require('./config/db')
const mongoose = require('mongoose')
const colors = require('colors')
const products = require('./data/products')
const users = require('./data/users')
const dotenv = require('dotenv')
const User = require('./models/userModel')
const Product = require('./models/productModel')
const Order = require('./models/orderModel')

dotenv.config()
db()

const importData  = async() => {
  try {
    await User.deleteMany()
    await Order.deleteMany()
    await Product.deleteMany()

    const insertedUsers = await User.insertMany(users)
    const admin = insertedUsers[0]._id
    console.log('admin: ',admin)
    const samplePproducts = products.map(product => {
       return {...product,user:admin}
    })
    console.log('products: ',samplePproducts)
    await Product.insertMany(samplePproducts)
    console.log('Data imported!'.green.inverse)
    process.exit()
  } catch (e) {
    console.log(`importData Error: ${e.message}`)
    process.exit(1)
  }
}

const destroyData = async() => {
  try{
    await User.deleteMany()
    await Order.deleteMany()
    await Product.deleteMany()
    console.log('Data destroyed' .red.inverse)
    process.exit()
  }catch(e) {
    console.log(`${e}`.red.inverse)
    process.exit(1)
  }
}

if(process.argv[2] === '-d') {
  destroyData()
}else {
  importData()
}
