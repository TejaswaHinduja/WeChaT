const jwt=require("jsonwebtoken")

 const gentoken=(userId,res)=>{
    const token=jwt.sign({userId},process.env.JWT,{expiresIn:"7d"})

    res.cookie("jwt",token,{
    maxAge:7*24*60*60*1000,
    httpOnly:true,
    sameSite:"strict",
    secure:process.env.NODE !=="Development",

});
return token;
};
module.exports=gentoken;