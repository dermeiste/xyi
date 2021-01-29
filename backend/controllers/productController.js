const asyncHandler = require('express-async-handler')
const Product = require('../models/productModel')



const getProducts = asyncHandler(async(req,res) => {
  const keyword = req.query.keyword
  const page = req.query.pageNumber || 1
  console.log('page',page)
  const pageSize =2
  if(keyword) {
    search = {
      name:{
        $regex:keyword,
        $options:'i'
      }

    }
  }else {
    search = {}
  }
  const count = await Product.countDocuments({...search})
  console.log('count: ',count)
  const products = await Product.find({...search}).limit(pageSize).skip(pageSize*(page - 1))
  if(products) {
    console.log(Math.ceil(count/pageSize))
    res.json({products,page,pages:Math.ceil(count/pageSize)}  )
  }else {
    res.status(404)
    throw new Error('products not found')
  }
})
const getProductById = asyncHandler(async(req,res) => {
  const product = await Product.findById(req.params.id)
  if(product) {
    res.json(product)
  }else{
    res.status(404)
    throw new Error('Product not found')
  }
})
const deleteProduct = asyncHandler(async(req,res) => {
  const product = await Product.findById(req.params.id)
  if(product) {
    await product.remove()
    res.json({message:'product removed'})
  }else {
    res.status(404)
    throw new Error('Product not found')
  }
})

const createProduct = asyncHandler(async(req,res) => {
  const product = await new Product({
      name:'Sample nama',
      price:0,
      user:req.user._id,
      image:'/images/sample.jpg',
      brand:'Sample brand',
      category:'Sample category',
      countInStock:0,
      numReviews:0,
      description:'Sample description'
  })

  const savedProduct = await product.save()
  res.status(201).json(savedProduct)
})

const updateProduct = asyncHandler(async(req,res) => {
  const {
    name,
    price,
    image,
    brand,
    category,
    description,
    countInStock
  } =req.body

  const product = await Product.findById(req.params.id)
  if(product) {
    product.name = name
    product.price = price
    product.image = image
    product.brand = brand
    product.category = category
    product.description = description
    product.countInStock = countInStock

    const savedProduct = await product.save()
    res.status(201).json(savedProduct)
  }else {
    res.status(404)
    throw new Error('Product not found')
  }
})

const createProductReview = asyncHandler(async(req,res) => {
  const product = await Product.findById(req.params.id)
  const {comment,rating} = req.body
  console.log(comment,rating)
  if(product) {
    const reviewedProduct = product.reviews.find(r => r.user.toString() == req.user._id.toString())
    if(reviewedProduct) {
      res.status(400)
      throw new Error('Product already reviewed')
    }else {
      const review = {
        name:req.user.name,
        comment,
        rating:Number(rating),
        user:req.user._id
      }
      product.reviews.push(review)
      console.log(product.reviews)
      product.numReviews =   product.reviews.length
      product.rating = (product.reviews.reduce((acc,i) => acc+i.rating,0))/product.reviews.length
      console.log('rating: ',product.rating)
      await product.save()
      res.status(201).json(product)
    }
  }else {
    res.status(404)
    throw new Error('Product not found')
  }
})

const getTopRatingProducts = asyncHandler(async(req,res) => {
  const products = await Product.find({}).sort({rating:-1}).limit(3)
  if(products) {
    res.json(products)
  }else {
    res.status(404)
    throw new Error('No Top Products')
  }
})



module.exports = {getProducts,getProductById,deleteProduct,createProduct,updateProduct,createProductReview,getTopRatingProducts}
