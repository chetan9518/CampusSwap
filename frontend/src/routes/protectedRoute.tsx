import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function ProtectedRoute ({children}:{children:React.ReactElement}){
    const { user, loading } = useAuth();
   if (loading) return <div>Loading...</div>;
   return user?children:children
}
//<Navigate to={"/"}/>