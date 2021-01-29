const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const storage = multer.diskStorage({
  destination(req,file,cb) {
    cb(null,'uploads/')
  },
  filename(req,file,cb) {
    cb(null,`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
  }
})

function checkFileFilter(file,cb) {
  const filetypes= /jpg|jpeg|png/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)
  if(extname && mimetype) {
    return cb(null,true)
  }else {
    return cb('Images only')
  }
}

const upload = multer({
  storage,
  fileFilter:function(req,file,cb) {
    checkFileFilter(file,cb)
  }
})

router.post('/',upload.single('image'), (req,res) => res.send(`/${req.file.path}`) )

module.exports = router
