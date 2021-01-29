const express = require('express')
const router = express.Router()
const {getProducts,getProductById,deleteProduct,createProduct,updateProduct,createProductReview,getTopRatingProducts} = require('../controllers/productController')
const {protect,admin} = require('../middleware/authMiddleware')

router.route('/').get(getProducts).post(protect,admin,createProduct)
router.get('/top',getTopRatingProducts)
router.route('/:id/reviews').post(protect,createProductReview)
router.route('/:id').get(getProductById).delete(protect,admin,deleteProduct).put(protect,admin,updateProduct)


module.exports = router
