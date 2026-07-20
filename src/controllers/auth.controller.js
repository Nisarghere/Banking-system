const userModel = require("../models/users.model");
const jwt = require("jsonwebtoken");

exports.registerUser=async (req, res)=>{
    const {name, email, password }= req.body

    const isExist = await userModel.findOne({
        email: email
    })

    if (isExist){
        return res.status(422).json({
            message:"User already exist !",
            status:"failed"
        })
    }

    const user = await userModel.create({
        email, 
        password, 
        name
    })

    const token = jwt.sign(
        {userId:user._id},
         process.env.JWT_SECRET,
         {expiresIn:"3d"})

    res.cookie("token", token)

    res.status(201).json({
        user:{
            id:user._id,
            name:user.name,
            email:user.email
        }
    })

}

exports.loginUser = async (req, res)=>{
    const { email, password } = req.body

    const user = await userModel.findOne({
        email:email
    }).select("+password")

    if (!user){
        return res.status(401).json({
            message:"Invalid credentials!"
        })
    }
    const isvalidPasswd = await user.comparePassword(password)

    if (!isvalidPasswd){
        return res.status(401).json({
            message:"Invalid credentials"
        })
    }

    const token = jwt.sign({userId:user._id},
        process.env.JWT_SECRET,
        {expiresIn:"3d"}
    )

    res.cookie("token", token)

    res.status(200).json({
        id:user._id,
        email:user.email,
        name:user.name
    })

     


}