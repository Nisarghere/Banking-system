const  mongoose  = require("mongoose");

exports.connectDB=()=>{
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('connected to db')
    })
    .catch(err=>{
        console.log('something went wrong')
        process.exit(1)
    }
    )
}