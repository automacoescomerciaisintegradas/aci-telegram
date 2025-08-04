import React, { useState } from 'react';
import { LockIcon, XIcon } from './Icons';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { changePassword, isLoading } = useAuth();
  const { showToast } = useToast();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Senha atual é obrigatória';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'Nova senha é obrigatória';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Nova senha deve ter pelo menos 8 caracteres';
    } else if (!/(?=.*[a-z])/.test(formData.newPassword)) {
      newErrors.newPassword = 'Nova senha deve conter pelo menos uma letra minúscula';
    } else if (!/(?=.*[A-Z])/.test(formData.newPassword)) {
      newErrors.newPassword = 'Nova senha deve conter pelo menos uma letra maiúscula';
    } else if (!/(?=.*\d)/.test(formData.newPassword)) {
      newErrors.newPassword = 'Nova senha deve conter pelo menos um número';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'Nova senha deve ser diferente da atual';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const message = await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      showToast(message, 'success');
      handleClose();
    } catch {
      // Erro já é tratado pelo hook useAuth
    }
  };

  const handleClose = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setErrors({});
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Alterar Senha</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              value={formData.currentPassword}
              onChange={(e) => handleInputChange('currentPassword', e.target.value)}
              className={`w-full pl-10 pr-3 py-3 bg-slate-700 border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:border-primary-500 transition duration-200 ${
                errors.currentPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-primary-500'
              }`}
              placeholder="Senha atual"
              required
            />
            {errors.currentPassword && <p className="mt-1 text-sm text-red-500">{errors.currentPassword}</p>}
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              className={`w-full pl-10 pr-3 py-3 bg-slate-700 border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:border-primary-500 transition duration-200 ${
                errors.newPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-primary-500'
              }`}
              placeholder="Nova senha"
              required
            />
            {errors.newPassword && <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>}
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={`w-full pl-10 pr-3 py-3 bg-slate-700 border rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:border-primary-500 transition duration-200 ${
                errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-primary-500'
              }`}
              placeholder="Confirmar nova senha"
              required
            />
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
          </div>

          <div className="bg-slate-700 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-white mb-2">Requisitos da senha:</h4>
            <ul className="text-xs text-gray-400 space-y-1">
              <li className={formData.newPassword.length >= 8 ? 'text-green-400' : ''}>
                • Pelo menos 8 caracteres
              </li>
              <li className={/(?=.*[a-z])/.test(formData.newPassword) ? 'text-green-400' : ''}>
                • Uma letra minúscula
              </li>
              <li className={/(?=.*[A-Z])/.test(formData.newPassword) ? 'text-green-400' : ''}>
                • Uma letra maiúscula
              </li>
              <li className={/(?=.*\d)/.test(formData.newPassword) ? 'text-green-400' : ''}>
                • Um número
              </li>
            </ul>
          </div>

          <div className="flex gap-3 pt-4">
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
              {isLoading ? 'Alterando...' : 'Alterar Senha'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};