import {createContext, useContext, useState, useCallback, useEffect, useRef} from "react";
import { apiClient } from "../api/ApiClient";
import { AUTH_API } from "../api/AuthApi";

export const AuthContext = createContext();

export const useAuth = ()=>useContext(AuthContext);

function AuthProvider({children}){
    const [isAuthenticated, setAuthenticated] = useState(false);
    const [username, setUsername] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const logout = useCallback(() => {
        setAuthenticated(false);
        setUsername(null);
        setToken(null);
        localStorage.setItem("token", null);
    }, []);

    useEffect(()=>{
        const savedToken = JSON.parse(localStorage.getItem("token"));
        if(savedToken){
            const savedUsername = localStorage.getItem("username");
            setAuthenticated(true);
            setToken(savedToken);
            setUsername(savedUsername);
        }
        setIsLoading(false);
    }, []);

    async function login(username, password){
        try{
            const response = await apiClient.post(AUTH_API.LOGIN, {username, password});
            if(response.status == 200){
                const jwt = response.data;
                setAuthenticated(true);
                setUsername(username);
                setToken(jwt);
                localStorage.setItem("token", JSON.stringify(jwt));
                localStorage.setItem("username", username);
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
    async function refresh(){

    }

    return (
        <AuthContext.Provider value ={{isAuthenticated, login, logout, username, isLoading}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;