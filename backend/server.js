const express = require('express')
const products = require('./data/products')
const dotenv = require('dotenv')
const path = require('path')
const morgan = require('morgan')
const db = require('./config/db')
const colors = require('colors')
const productRoutes = require('./routes/productRoutes')
const userRoutes = require('./routes/userRoutes')
const orderRoutes = require('./routes/orderRoutes')
const {notFound,errorHandler} = require('./middleware/errorMiddleware')
const uploadRoutes = require('./routes/uploadRoutes')
const app = express()
app.use(express.json())
dotenv.config()
if(process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'))
}
db()


app.use('/api/products',productRoutes)
app.use('/api/users',userRoutes)
app.use('/api/orders',orderRoutes)
app.use('/api/config/pay',(req,res) => res.send(process.env.PAY_CLIENT_ID))
app.use('/api/upload',uploadRoutes)

app.use('/uploads',express.static(path.join(path.resolve(),'/uploads')))
if(process.env.NODE_ENV == 'production') {
  app.use(express.static(path.join(path.resolve(),'/frontend/build')))
  app.get('*',(req,res) => res.sendFile(path.resolve(),'frontend','build','index.html'))
}else {
  console.log('XUY')

}

// app.get('/api/products',(req,res) => {
//   console.log('products:',products)
//   res.json(products)
// })
// app.get('/api/product/:id',(req,res) => {
//
//   const product = products.find(pr => pr.id == req.params.id)
//   console.log('product:',product)
//   res.json(product)
// })
app.use(notFound)
app.use(errorHandler)
const PORT = process.env.PORT || 5000
app.listen(5005,console.log(`server is running on ${process.env.NODE_ENV} mode in port ${PORT}` .yellow.bold))
