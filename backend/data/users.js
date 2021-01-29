const bcryptjs = require('bcryptjs')

const users = [
  {
    name:"Admin",
    email:"admin@example.com",
    password:bcryptjs.hashSync('123456',10),
    isAdmin:true
  },
  {
    name:"Xyi",
    email:"xyi@example.com",
    password:bcryptjs.hashSync('123456',10)
  },
  {
    name:"Pizda",
    email:"pizda@example.com",
    password:bcryptjs.hashSync('123456',10)
  }
]

module.exports = users
