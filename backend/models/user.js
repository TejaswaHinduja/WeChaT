const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    fullName:{
        
            type:String,
            required:true,
            minlength:[3,"Must be at least 3 chars"]
        
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:[6,"Must be at least 6 chars"]
    },
    profilePic:{
        type:"string",
        default:""
    },
    

},{ timestamps:true}
)
const User =mongoose.model("User",userSchema);
module.exports=User;
