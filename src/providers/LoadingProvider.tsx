/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, ReactNode } from 'react';
import { LoaderCircle } from 'lucide-react';

interface LoadingContextProps {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextProps | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading: setIsLoading }}>
      {children}

      {isLoading && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
          <div className='p-4 rounded-full bg-white shadow-md'>
            <LoaderCircle className='h-10 w-10 animate-spin text-[#2c95ff]' />
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context)
    return context;
};
