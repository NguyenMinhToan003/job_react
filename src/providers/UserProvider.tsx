import { getDataUser } from "@/apis/userAPI";
import { UserResponse } from "@/types/accountType";
import { ROLE_LIST } from "@/types/type";

import { createContext, useContext, useState, ReactNode } from "react";

interface AccountContextType {
  dataUser: UserResponse | null;
  updateDataUser: () => void;
}

const AccountContext = createContext<AccountContextType>({
  dataUser: null,
  updateDataUser: () => {},
});

interface AccountProviderProps {
  children: ReactNode;
}

export const AccountProvider = ({ children }: AccountProviderProps) => {
  const [dataUser, setDataUser] = useState<UserResponse | null>(null);

  const fetchDataUser = async () => {
    try {
      const response = await getDataUser();
      setDataUser(response);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const updateDataUser = () => {
    const role = localStorage.getItem("role");
    if(!role) return;
    else if (role === ROLE_LIST.CANDIDATE) {
      fetchDataUser();
    } else {
      console.log("role", role);
    }
  };

  return (
    <AccountContext.Provider
      value={{
        dataUser,
        updateDataUser,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => useContext(AccountContext);
