import axios from 'axios'
import { API } from './api'

const axiosinst=axios.create({
    baseURL:API,
    timeout:10000,
    headers:{
        "Content-Type":"application/json",
    },
});

axiosinst.interceptors.request.use(
    (config)=>{
        const accessToken=localStorage.getItem('token');
        if (accessToken) {
            config.headers.Authorization=`Bearer ${accessToken}`;
        }
        return config;
    },
    (error)=>{
        return Promise.reject(error);
    }
)

export default axiosinst;