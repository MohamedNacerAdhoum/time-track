import { Navigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../../lib/constants";
import { useState, useEffect } from "react";


function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    }, [])

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthorized(false);
            return;
        }
        setIsAuthorized(true);
    }

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }
    console.log("isAuthorized", isAuthorized);
    return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;