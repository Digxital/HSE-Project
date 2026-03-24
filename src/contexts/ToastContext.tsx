import { createContext, useContext, type ReactNode } from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface ToastContextType {
  showToast: (options: { 
    type: 'success' | 'error' | 'warning'; 
    message: string;
  }) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const showToast = ({ type, message }: { type: 'success' | 'error' |  'warning'; message: string }) => {
    if (type === 'success') {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#363636',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '14px',
          },
        }}
      />
    </ToastContext.Provider>
  );
};