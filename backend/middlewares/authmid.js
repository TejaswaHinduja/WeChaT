const User=require("../models/user.js");
const jwt=require('jsonwebtoken')
const protectroute=async(req,res,next)=>{
    try {
        const token=req.cookies.jwt;
        if(!token){
            return res.status(400).json({message:"Not authorized"}) 
        }
        const decoded=jwt.verify(token,process.env.JWT);
        const user=await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "User not found" });
          }
          req.user = user;
          
        next()
        
    } catch (error) {
        console.log("Error",error)
        res.status(401).json({message:"Not auth"})
        
    }
}
module.exports=protectroute