import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { Calendar, DollarSign, LogOut, Clock } from 'lucide-react';
export default function DashboardCliente() {
  const [data, setData] = useState({ balance: 0, payments: [], pendingDays: 0 });
  useEffect(() => {
    fetchClientData();
  }, []);
  const fetchClientData = async () => {
    try {
      const res = await apiClient.get('/payments/my-status');
      setData(res.data);
    } catch (err) {
      console.error("Error cargando datos");
    }
  };
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <header className="max-w-4xl mx-auto flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Mi Estado de Cuenta</h1>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Salir</span>
        </button>
      </header>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-gray-500 font-medium">Saldo Pendiente</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">${data.balance?.toLocaleString()} <span className="text-sm font-normal text-gray-400">COP</span></p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-gray-500 font-medium">Días Pendientes</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{data.pendingDays} <span className="text-sm font-normal text-gray-400">días</span></p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <Calendar className="w-6 h-6" />
            </div>
            <span className="text-gray-500 font-medium">Último Pago</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {data.payments[0]?.date || 'Sin pagos'}
          </p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">Historial de Pagos</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Fecha</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Monto</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.payments.map((p, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-600">{p.date}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">${p.amount?.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Pagado</span>
                  </td>
                </tr>
              ))}
              {data.payments.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-10 text-center text-gray-400">No hay registros de pagos</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}