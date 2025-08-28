import { getDataCandidate } from '@/apis/candidateAPI';
import { getEmployerInfo } from '@/apis/companyAPI';
import { CandidateResponse, EmployerResponse } from '@/types/accountType';
import { ROLE_LIST } from '@/types/type';

import { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

interface AccountContextType {
  dataUser: CandidateResponse | EmployerResponse| null;
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
  const [dataUser, setDataUser] = useState<CandidateResponse| EmployerResponse | null>(null);

  const fetchDataUser = async () => {
    const role = localStorage.getItem('role');
    try {
      let response = {} as CandidateResponse| EmployerResponse;
      if (role === ROLE_LIST.CANDIDATE) {
        response = await getDataCandidate();
      }
      if (role === ROLE_LIST.EMPLOYER) {
        response = await getEmployerInfo();
      }
      setDataUser(response);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (role === ROLE_LIST.CANDIDATE) {
        toast.error(
          error?.response?.data?.message || 'Lấy thông tin người dùng thất bại'
        );
      }
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
