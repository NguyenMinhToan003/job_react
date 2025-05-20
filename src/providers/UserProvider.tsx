// import { Account } from "@/types/accountType";
// import { createContext, useContext, useState } from "react";


// const AccountContext = createContext({
//   account: {} as Account,
//   setAccount: (account: Account) => {},
// } as {
//   account: Account | null;
//   setAccount: (account: Account) => void;
// })

// export const AccountProvider = ({ children }) => {
//   const [account, setAccount] = useState<Account>({} as Account) 
//   return (
//     <AccountContext.Provider value={{
//       account,
//       setAccount,
//     }}>
//       {children}
//     </AccountContext.Provider>
//   )
// }
// export const useAccount = () => useContext(AccountContext)