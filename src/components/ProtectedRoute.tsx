import React, { useEffect, ReactNode } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import axios from "axios";
import { BACKEND_API_KEY } from "../../utils/ApiKey";

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

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const response = await axios.get(
            `${BACKEND_API_KEY}/auth/get-admin`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          userContext?.setUser({
            id: response.data.data.id,
            name: response.data.data.name,
            email: response.data.data.email,
            access: response.data.data.access,
          });
        } catch (error) {
          navigate("/login");
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [token, userContext]);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
