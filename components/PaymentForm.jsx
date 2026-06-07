import React, { useState } from 'react';
import apiClient from '../api/client';
import { CheckCircle, Loader2 } from 'lucide-react';
export default function PaymentForm({ clienteId, onSuccess }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await apiClient.post('/payments/record', {
        user_id: clienteId,
        amount: parseFloat(amount),
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setAmount('');
        onSuccess();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || "Error al registrar el pago");
    } finally {
      setLoading(false);
    }
  };
  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-green-600">
        <CheckCircle className="w-12 h-12 mb-2" />
        <p className="font-bold">¡Pago registrado con éxito!</p>
      </div>
    );
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Monto del Cobro (COP)</label>
        <input 
          type="number" 
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 outline-none"
          placeholder="Ej: 5000"
          required
        />
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
      <button 
        type="submit" 
        disabled={loading}
        className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirmar Pago'}
      </button>
    </form>
  );
}