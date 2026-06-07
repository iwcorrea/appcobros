import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import { Lock, User, LogIn } from 'lucide-react';
export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post('/users/login', formData);
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('role', response.data.role);
      if (response.data.role === 'maestro') {
        navigate('/dashboard/maestro');
      } else {
        navigate('/dashboard/cliente');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Credenciales incorrectas. Intente nuevamente.');
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Bienvenido</h1>
          <p className="mt-2 text-gray-500">Inicia sesión para gestionar tus cobros</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none transition-all"
                placeholder="nombre_usuario"
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="password" 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button 
            type="submit" 
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors shadow-md"
          >
            <LogIn className="w-5 h-5" />
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}