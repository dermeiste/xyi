const mongoose = require('mongoose')


const db = async () => {
  try{
    const conn = await mongoose.connect(process.env.MONGO_URI,{
      useUnifiedTopology:true,
      useNewUrlParser:true,
      useCreateIndex:true
    })
    console.log(`mongo connected at ${conn.connection.host}` .cyan.underline)

  }catch(err) {
    console.error(`Error: ${err.message}` .red.bold);
    process.exit(1)
  }

}
module.exports = db
