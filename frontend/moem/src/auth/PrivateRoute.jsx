import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

function PrivateRoute({children}){
    const {isAuthenticated, isLoading} = useAuth();
    if(isLoading) return null;
    if(!isAuthenticated){
        return <Navigate to="/login" replace />;
    }
    return children;
}

export default PrivateRoute;