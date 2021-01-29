const express = require('express')
const router = express.Router()

const {getUserProfile,updateUserProfile,authUser,registerUser,getUsers,deleteUser,getUserByid,updateUser} = require('../controllers/userController')
const {protect,admin} = require('../middleware/authMiddleware')
router.route('/').post(registerUser).get(protect,admin,getUsers)
router.route('/profile').get(protect,getUserProfile).put(protect,updateUserProfile)
router.route('/:id').delete(protect,admin,deleteUser).get(protect,admin,getUserByid).put(protect,admin,updateUser)
router.post('/login',authUser)



module.exports = router
