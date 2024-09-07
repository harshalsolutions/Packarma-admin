import React, { createContext, useContext, useState, ReactNode } from "react";

interface Permission {
  page_id: number;
  page_name: string;
  can_create: number;
  can_read: number;
  can_update: number;
  can_delete: number;
  can_export?: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  status: string;
  permissions?: Permission[];
}

const UserContext = createContext<{
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
} | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>({
    id: "",
    name: "",
    email: "",
    status: "",
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
