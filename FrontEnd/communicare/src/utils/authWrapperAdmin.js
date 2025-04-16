import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";


export function parseJWT(token) {
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Failed to parse JWT:', error);
        return null;
    }
}

const AdminRouteWrapper = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);



    useEffect(() => {
        const checkAdminRole = () => {
            const token = localStorage.getItem("token");
            if (!token) {

                setIsAdmin(false);
                setIsLoading(false);
                return;
            }


            const userInfo = parseJWT(token);

            const role =
                userInfo["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];


            if (role === "2") {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
            setIsLoading(false);
        };

        checkAdminRole();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return isAdmin ? <Outlet /> : <Navigate to="/home" replace />;
};

export default AdminRouteWrapper;
