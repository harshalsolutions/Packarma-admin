import React, { useEffect, ReactNode, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import { BACKEND_API_KEY } from "../../utils/ApiKey";
import api from "../../utils/axiosInstance";
import { Spinner } from "flowbite-react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const userContext = useUser();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isUserDataFetched, setIsUserDataFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      if (token && !userContext?.user.id && !isUserDataFetched) {
        try {
          const response = await api.get(`${BACKEND_API_KEY}/auth/get-admin`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          userContext?.setUser({
            id: response.data.data.id,
            name: response.data.data.name,
            email: response.data.data.email,
            status: response.data.data.status,
            permissions: response.data.data.permissions,
          });

          setIsUserDataFetched(true);
        } catch (error) {
          navigate("/login");
          console.error("Error fetching user data:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    if (!token) {
      setIsLoading(false);
    } else {
      fetchUserData();
    }
  }, [token, userContext, isUserDataFetched, navigate]);

  const hasPermission = (permissionName: string) => {
    return userContext?.user.permissions?.some(
      (permission) => permission.page_name === permissionName
    );
  };

  const hasAccess = hasPermission(pathname.pathname);

  useEffect(() => {
    if (!hasAccess && !isLoading) {
      navigate("/no-access");
    }
  }, [
    hasAccess,
    navigate,
    pathname.pathname,
    userContext?.user.permissions,
    isLoading,
  ]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }
  if (!token) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
