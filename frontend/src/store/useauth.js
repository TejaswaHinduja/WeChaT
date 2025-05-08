import {create} from "zustand";
import { axiosIn } from "../lib/axios";
import toast from "react-hot-toast";
import {io} from "socket.io-client";
const BASE_URL=import.meta.env.MODE==="devlopment"?"http://localhost:3000":"/";

export const useAuth=create((set,get)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    onlineUsers:[],
    socket:null,


checkAuth:async()=>{
        try {
            const res= await axiosIn.get("/auth/check")
            console.log(res.data);  
            set({authUser:res.data})
            get().connectSocket();
        } catch (error) {
            set({authUser:null});
            
        }
        finally{
            set({isCheckingAuth:false});
        }
    },
signup:async(data)=>{
    set({isSigningUp:true});
    try {
        const res=await axiosIn.post("auth/signup",data);
        set({authUser:res.data})
        toast.success("Account Created");
        get().connectSocket();
    } catch (error) {
        console.log(error)
        toast.error(error?.response?.data?.message || "Something went wrong");
    }
    finally{
        set({isSigningUp:false})
    }
},
logout:async()=>{
    try {
        await axiosIn.post("/auth/logout");
        set({authUser:null});
        toast.success("Logged Out");
        get().disconnectSocket();

    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Something went wrong");
    }
},
login:async(data)=>{
    set({isLoggingIn:true});
    try {
        const res=await axiosIn.post("/auth/login",data);
        set({authUser:res.data});
        toast.success("Logged In");

        get().connectSocket();
    } catch (error) {
        console.log(error);
        toast.error(error.response.data.message)
        
    }
    finally{
        set({isLoggingIn:false})
    }

},
updateProfile:async(data)=>{
    set({isUpdatingProfile:true});
    try {
        const res=await axiosIn.put("/auth/update",data);
        set({authUser:res.data});
        toast.success("Profile Updated");

    } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
        
    }
    finally{
        set({isUpdatingProfile:false})
    }

},
connectSocket:()=>{
    const{authUser}=get()
    if(!authUser ||get().socket?.connected)return;
    const socket=io(BASE_URL,{
        query:{
            userId:authUser._id,
        } 
    })
    socket.connect();
    set({socket:socket});
    socket.on("getOnlineUsers",(userIds)=>{

        set({onlineUsers:userIds});

    })
},
disconnectSocket:()=>{
    if(get().socket?.connected)get().socket.disconnect();

},

}));