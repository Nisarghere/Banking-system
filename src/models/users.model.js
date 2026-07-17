const  mongoose  = require("mongoose");
const bcrypt = require('bcryptjs')
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true, 
        trim:true
    },
    email:{
        type: String,
        required: true,
        unique: [true,"Email already exists"],
        trim: true,
        lowercase: true,
        match: [
             /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
             "Please enter a valid email address"
        ]      
    },
    password:{
        type:String,
        required:[true, "Password is required."],
        minlength:[6, "Password length must contain 6 or more characters"],
        select:false
    }
},
    {
        timestamps:true
    })

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);

    next();
});

userSchema.methods.comparePassword = async function (password){
    return bcrypt.compare(password, this.password)
}

const userModel = mongoose.model("user", userSchema)

module.exports = userModel