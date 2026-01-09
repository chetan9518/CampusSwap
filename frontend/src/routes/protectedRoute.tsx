import { Navigate } from "react-router-dom";
import { useJWTAuth } from "../context/jwtAuthContext";

export default function ProtectedRouteNew({ children }: { children: React.ReactElement }) {
    const { user, loading } = useJWTAuth();
    
    if (loading) return <div>Loading...</div>;
    
    if (!user) return <Navigate to="/" replace />;
    
    return children;
}
