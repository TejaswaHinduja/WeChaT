const mongoose =require('mongoose');
async function connect(){
    try{
        await mongoose.connect(process.env.DBC);
        console.log("connected")
    }
    catch(error){
        console.log("Failed to connect",error)
    }

}
module.exports=connect;