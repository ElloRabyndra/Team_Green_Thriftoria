import React, { useContext, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { ThemeContext } from '@/context/ThemeContext';
export default function ToastWrapper() {
  const { theme } = useContext(ThemeContext);

    useEffect(() => {
    toast.dismiss();
  }, [theme]);
  
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={theme}
    />
  );
}