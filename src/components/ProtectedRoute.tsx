import React, { useEffect, ReactNode, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import { BACKEND_API_KEY } from "../../utils/ApiKey";
import api from "../../utils/axiosInstance";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
}: {
  children: ReactNode;
}) => {
  const userContext = useUser();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isUserDataFetched, setIsUserDataFetched] = useState(false);

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
            permissions: response.data.data.permissions,
            status: response.data.data.status,
          });
          setIsUserDataFetched(true);
        } catch (error) {
          navigate("/login");
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [token, userContext?.user.id, isUserDataFetched]);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
