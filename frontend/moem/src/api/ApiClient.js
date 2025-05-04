import axios from 'axios';

const BASE_URL = "http://localhost:8080";

export const apiClient = axios.create(
    {
        baseURL: BASE_URL
    }
);

apiClient.interceptors.request.use(
    (request)=>{
        const savedToken = JSON.parse(localStorage.getItem("token"));
        if(savedToken){
            request.headers.Authorization = `Bearer ${savedToken.accessToken}`;
        }
        return request;
    },
    (error) => Promise.reject(error)
);
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response?.status === 401){
            localStorage.setItem("token", null);
        }
        return Promise.reject(error);
    }
);