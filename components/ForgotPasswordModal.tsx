import React, { useState } from 'react';
import { MailIcon, XIcon } from './Icons';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const { resetPassword, isLoading } = useAuth();
  const { showToast } = useToast();

  const validateEmail = (email: string): boolean => {
    if (!email.trim()) {
      setEmailError('Email é obrigatório');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email inválido');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) return;

    try {
      const message = await resetPassword({ email });
      showToast(message, 'success');
      setEmail('');
      onClose();
    } catch (error) {
      // Erro já é tratado pelo hook useAuth
    }
  };

  const handleClose = () => {
    setEmail('');
    setEmailError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Recuperar Senha</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-gray-400 text-sm mb-6">
            Digite seu email para receber instruções de recuperação de senha.
          </p>

          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MailIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
              }}
              className={`w-full pl-10 pr-3 py-3 bg-slate-700 border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:border-primary-500 transition duration-200 ${
                emailError ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-primary-500'
              }`}
              placeholder="Seu email"
              required
            />
            {emailError && <p className="mt-1 text-sm text-red-500">{emailError}</p>}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 px-4 border border-gray-600 rounded-lg text-gray-300 hover:bg-slate-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};