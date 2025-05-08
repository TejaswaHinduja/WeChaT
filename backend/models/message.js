const mongoose=require('mongoose');

const msgSchema=new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Sender",
        required:true

    },
    text:{
        type:String
    },
    image:{
        type:String
    }
     
},{timestamps:true})
const msg=mongoose.model("msg",msgSchema)
module.exports=msg;