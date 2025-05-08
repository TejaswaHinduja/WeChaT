import axios from 'axios';
export const axiosIn=axios.create({
    baseURL:import.meta.env.MODE==="devlopment"?"http://localhost:3000/api":"/api",
    withCredentials:true,
})