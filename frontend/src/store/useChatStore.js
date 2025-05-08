import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosIn } from "../lib/axios";
import{useAuth} from "../store/useauth"


export const useChatStore=create((set,get)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,


    getUsers:async()=>{
        set({isUsersLoading:true});
        try {
            const res=await axiosIn.get("/message/user");
            set({users:res.data})
        } catch (error) {
            toast.error(error.response.data.message);
            
        }
        finally{
            set({isUsersLoading:false})
        }
    },
    getMessages:async(userId)=>{
        set({isMessagesLoading:true});
        try {
            const res=await axiosIn.get(`/message/${userId}`);
            set({messages:res.data});
        } catch (error) {
            toast.error(error.response.data.message)
            
        }
        finally{
            set({isMessagesLoading:false})
        }
    },
    sendMessages:async(messageData)=>{
        const {messages,selectedUser}=get();
        try {
            const res=await axiosIn.post(`/message/send/${selectedUser._id}`,messageData);
            set({messages:[...messages,res.data]})
        } catch (error) {
            toast.error(error.response.data.message)
            
        }

    },
    subscribeToMessages:()=>{
        const {selectedUser}=get();
        if(!selectedUser)return;

        const socket=useAuth.getState().socket;
        socket.off("newmessage");

        socket.on("newmessage",(newmessage)=>{
            
            if(newmessage.senderId!==selectedUser._id)return;
            set({
                messages:[...get().messages,newmessage]
            });
        });

    },
    unsubscribeFromMessages:()=>{
        const socket=useAuth.getState().socket;
        socket.off("newmessage");

    },
    setSelectedUser:async(selectedUser)=>set({ selectedUser})

}))