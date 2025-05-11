import { useEffect, useState, useLayoutEffect } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";

const AuthWrapper = () => {
  const location = useLocation();
  const [auth, setAuth] = useState();
  const [isLoading, setIsLoading] = useState(true);
  useLayoutEffect(() => {
    const authCheck = async () => {
      setIsLoading(true);
      const JWT = localStorage.getItem("token");
      if (!JWT) {
        setAuth(false); 
        return;
      }

      try {
        const auth = await fetch(
          "http://localhost:5182/api/TipoUtilizadores",
          {
            headers: {
              Authorization: `Bearer ${JWT}`,
            },
          }
        );
        if (auth.status == 200) {
          setAuth(auth);
        } else {
          setAuth(false);
        }
      } catch (error) {
        setAuth(false); 
      } finally {
        setIsLoading(false);
      }
    };
    authCheck();
    return () => {

    };
  }, [location.pathname]);
  if (auth != false && isLoading) {
    return null; 
  }
  return auth ? <Outlet /> : <Navigate to="/" replace />;
};
export default AuthWrapper;
