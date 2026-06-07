import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { Users, PlusCircle, DollarSign, LogOut, Search } from 'lucide-react';
import PaymentForm from './PaymentForm';
export default function DashboardMaestro() {
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  useEffect(() => {
    fetchClientes();
  }, []);
  const fetchClientes = async () => {
    try {
      const res = await apiClient.get('/users/clientes');
      setClientes(res.data);
    } catch (err) {
      console.error("Error cargando clientes");
    }
  };
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };
  const filteredClientes = clientes.filter(c => 
    c.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-primary-800 text-white hidden md:flex flex-col p-6">
        <div className="text-2xl font-bold mb-10 flex items-center gap-2">
          <DollarSign className="w-8 h-8" />
          <span>CobrosApp</span>
        </div>
        <nav className="space-y-2 flex-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary-700 rounded-lg transition-colors">
            <Users className="w-5 h-5" />
            <span>Clientes</span>
          </button>
        </nav>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-primary-100 hover:bg-primary-700 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Cerrar Sesión</span>
        </button>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Panel de Control</h1>
            <p className="text-gray-500">Gestiona tus cobros diarios y clientes</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Buscar cliente..." 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 outline-none w-full md:w-64"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Clientes */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Cliente</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Saldo Pendiente</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredClientes.map(cliente => (
                    <tr key={cliente.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{cliente.full_name}</td>
                      <td className="px-6 py-4 text-gray-600">${cliente.balance?.toLocaleString()} COP</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setSelectedCliente(cliente)}
                          className="text-primary-600 hover:text-primary-800 font-semibold text-sm"
                        >
                          Cobrar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Detalle y Formulario */}
          <div className="space-y-6">
            {selectedCliente ? (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold mb-4">Registrar Cobro</h2>
                <div className="mb-6 p-4 bg-primary-50 rounded-lg">
                  <p className="text-sm text-primary-700">Cliente seleccionado:</p>
                  <p className="text-lg font-bold text-primary-900">{selectedCliente.full_name}</p>
                </div>
                <PaymentForm 
                  clienteId={selectedCliente.id} 
                  onSuccess={() => {
                    fetchClientes();
                    setSelectedCliente(null);
                  }} 
                />
              </div>
            ) : (
              <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Selecciona un cliente de la lista para registrar un pago</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}