import { createRoot } from 'react-dom/client'
import '@/index.css'
import App from '@/App'
import "tailwindcss";
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { LoadingProvider } from './providers/loadingProvider';
import { AlertDialogProvider } from './providers/alertDialogProvider';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <LoadingProvider>
      <AlertDialogProvider>
        <App />
        <Toaster richColors position='top-center' />
      </AlertDialogProvider>
    </LoadingProvider>
  </BrowserRouter>
)
