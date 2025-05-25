import { getDataCandidate } from '@/apis/userAPI';
import { CandidateResponse } from '@/types/accountType';
import { ROLE_LIST } from '@/types/type';

import { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

interface AccountContextType {
  dataUser: CandidateResponse | null;
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
  const [dataUser, setDataUser] = useState<CandidateResponse | null>(null);

  const fetchDataUser = async () => {
    const role = localStorage.getItem('role');
    try {
      const response = await getDataCandidate();
      setDataUser(response);
      console.log('login', response);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      role === ROLE_LIST.CANDIDATE
        && toast.error(
        error?.response?.data?.message || 'Lấy thông tin người dùng thất bại'
      );
    }
  };

  const updateDataUser = () => {
    fetchDataUser();
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

// eslint-disable-next-line react-refresh/only-export-components
export const useAccount = () => useContext(AccountContext);
