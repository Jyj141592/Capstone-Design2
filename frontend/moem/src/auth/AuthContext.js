import {createContext, useContext, useState} from "react";
import { apiClient } from "../api/ApiClient";
import { AUTH_API } from "../api/AuthApi";

export const AuthContext = createContext();

export const useAuth = ()=>useContext(AuthContext);

function AuthProvider({children}){
    const [isAuthenticated, setAuthenticated] = useState(false);
    const [username, setUsername] = useState(null);
    const [token, setToken] = useState(null);

    async function login(username, password){
        try{
            const response = await apiClient.post(AUTH_API.LOGIN, {username, password});
            if(response.status == 200){
                const jwt = response.data;
                setAuthenticated(true);
                setUsername(username);
                setToken(jwt);

                apiClient.interceptors.request.use(
                    (request)=>{
                        if(isAuthenticated){
                            request.headers.Authorization = `Bearer ${token.accessToken}`;
                        }
                        return request;
                    },
                    (error) => Promise.reject(error)
                );
                apiClient.interceptors.response.use(
                    (response) => response,
                    (error) => {
                        if(error.response?.status === 401 && isAuthenticated){
                            logout();

                        }
                        return Promise.reject(error);
                    }
                );
                return true;
            }
            else{
                logout();
                return false;
            }
        }
        catch(error){
            logout();
            return false;
        }
    }
    function logout(){
        setAuthenticated(false);
        setUsername(null);
        setToken(null);
    }
    async function refresh(){

    }

    return (
        <AuthContext.Provider value ={{isAuthenticated, login, logout, username}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;