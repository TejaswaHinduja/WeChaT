const dotenv = require('dotenv');
dotenv.config();
const path=require("path");
const {app,server}=require("./socket")
const cors = require('cors');
const cookieParser = require('cookie-parser');
const express=require("express");
const connect = require('./db');
const authRoutes = require('./routes/auth');
const msgRoutes = require('./routes/messageRoutes');

const port = process.env.PORT || 5001;


connect(); // Connect to the database

app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));


app.use("/api/auth", authRoutes);
app.use("/api/message", msgRoutes);
if(process.env.NODE_ENV==="production"){
  app.use(express.static(path.join(__dirname,"../frontend/dist")));
  app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname),"../frontend/dist","index.html");
  })
}

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
