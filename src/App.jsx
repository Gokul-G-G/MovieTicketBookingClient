import React from 'react'
import AppRoutes from './routes/AppRoutes'
import { ToastContainer } from 'react-toastify'


const App = () => {
  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <AppRoutes />
    </div>
  );
}

export default App
