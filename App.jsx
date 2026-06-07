import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import DashboardMaestro from './components/DashboardMaestro';
import DashboardCliente from './components/DashboardCliente';
const ProtectedRoute = ({ children, roleRequired }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  if (!token) return <Navigate to="/login" />;
  if (roleRequired && userRole !== roleRequired) return <Navigate to="/" />;
  return children;
};
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard/maestro" 
            element={
              <ProtectedRoute roleRequired="maestro">
                <DashboardMaestro />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard/cliente" 
            element={
              <ProtectedRoute roleRequired="cliente">
                <DashboardCliente />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;