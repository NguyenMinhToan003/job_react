import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { createContext, useContext, useState, ReactNode } from 'react';

interface AlertDialogOptions {
  title: React.ReactNode;
  content: React.ReactNode;
  confirmText: string;
  cancelText?: string;
  handleConfirm?: () => void;
};

interface AlertDialogContextType {
  showAlert: (options: AlertDialogOptions) => void;
}

const AlertDialogContext = createContext<AlertDialogContextType | undefined>(undefined);

export const AlertDialogProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<AlertDialogOptions>({
    title: 'Xác nhận',
    content: 'Bạn có chắc muốn tiếp tục?',
    confirmText: 'Xác nhận',
    cancelText: 'Hủy',
    handleConfirm: undefined,
  });

  const showAlert = (opts: AlertDialogOptions) => {
    setOptions(opts);
    setOpen(true);
  };

  const onConfirm = () => {
    if (options.handleConfirm) {
      options.handleConfirm();
    }
    setOpen(false);
  };

  return (
    <AlertDialogContext.Provider value={{ showAlert }}>
      {children}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>

            {options.title}
            </AlertDialogTitle>
            <AlertDialogDescription>{options.content}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='flex gap-2'>
            <AlertDialogCancel className='flex-1 rounded-none'>{options.cancelText}</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm}
              className="bg-[#451DA0] text-white hover:bg-[#451DA0] hover:text-white rounded-none flex-1"
            >
              {options.confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlertDialogContext.Provider>
  );
};

export const useAlertDialog = () => {
  const context = useContext(AlertDialogContext);
  if (!context) {
    throw new Error("useAlertDialog must be used within AlertDialogProvider");
  }
  return context;
};
