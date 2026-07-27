const BlacklistToken = require("../models/blackList.model");
const userModel = require("../models/users.model");


const jwt = require("jsonwebtoken")


async function authMiddleware(req, res, next){
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

   

    if (!token){
        return res.status(401).json({
            message:"Unauthorized"
        })
    }

    const isLoggedOut = await BlacklistToken.findOne({
        token
    })

    if (isLoggedOut){
        return res.status(401).json({
            message:"Token is invalid"
        })
    }
    try{

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findById(decoded.userId)
        req.user = user

        return next()

    } catch(err){
        return res.status(401).json({
            message:"Unauthorized",
            err
        })
    }
}

async function systemUserMiddleware(req, res, next){
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

    if (!token){
        return res.status(401).json({
            message:"Unauthorized"
        })
    }
     const isLoggedOut = await BlacklistToken.findOne({
        token
    })

    if (isLoggedOut){
        return res.status(401).json({
            message:"Token is invalid"
        })
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decoded.userId).select("+systemUser")
        if (!user.systemUser){
            return res.status(403).json({
                message:"Forbidden: You do not have permission to access this resource"
            })
        }

        req.user = user
        return next()
        
     } catch(err){
        return res.status(401).json({
            message:"Unauthorized",
            err
        })
    }
}


module.exports = {authMiddleware, systemUserMiddleware}