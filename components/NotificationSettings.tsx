import React, { useState } from 'react';
import { BellIcon, CheckIcon } from './Icons';

interface NotificationPreferences {
  email: boolean;
  push: boolean;
  categories: {
    system: boolean;
    marketing: boolean;
    sales: boolean;
    alerts: boolean;
  };
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

interface NotificationSettingsProps {
  preferences: NotificationPreferences;
  onSave: (preferences: NotificationPreferences) => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  preferences,
  onSave
}) => {
  const [localPreferences, setLocalPreferences] = useState<NotificationPreferences>(preferences);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(localPreferences);
      // Mostrar feedback de sucesso
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const updatePreference = (key: keyof NotificationPreferences, value: string | boolean) => {
    setLocalPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateCategory = (category: keyof NotificationPreferences['categories'], value: boolean) => {
    setLocalPreferences(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: value
      }
    }));
  };

  const updateQuietHours = (key: keyof NotificationPreferences['quietHours'], value: string | boolean) => {
    setLocalPreferences(prev => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        [key]: value
      }
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-text-primary mb-2 flex items-center gap-3">
          <BellIcon className="h-8 w-8 text-brand-primary" />
          Configurações de Notificações
        </h1>
        <p className="text-dark-text-secondary">
          Personalize como e quando você deseja receber notificações do ACI.
        </p>
      </div>

      <div className="bg-dark-card border border-dark-border rounded-xl p-6 space-y-8">
        {/* Métodos de Notificação */}
        <div>
          <h3 className="text-lg font-semibold text-dark-text-primary mb-4">
            Métodos de Notificação
          </h3>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={localPreferences.email}
                onChange={(e) => updatePreference('email', e.target.checked)}
                className="w-4 h-4 text-brand-primary bg-slate-800 border-dark-border rounded focus:ring-brand-primary focus:ring-2"
              />
              <div>
                <span className="text-dark-text-primary font-medium">Email</span>
                <p className="text-sm text-dark-text-secondary">
                  Receber notificações por email
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={localPreferences.push}
                onChange={(e) => updatePreference('push', e.target.checked)}
                className="w-4 h-4 text-brand-primary bg-slate-800 border-dark-border rounded focus:ring-brand-primary focus:ring-2"
              />
              <div>
                <span className="text-dark-text-primary font-medium">Push (Navegador)</span>
                <p className="text-sm text-dark-text-secondary">
                  Notificações push no navegador
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Categorias */}
        <div>
          <h3 className="text-lg font-semibold text-dark-text-primary mb-4">
            Categorias de Notificação
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-800/30 rounded-lg border border-dark-border hover:bg-slate-800/50 transition-colors">
              <input
                type="checkbox"
                checked={localPreferences.categories.system}
                onChange={(e) => updateCategory('system', e.target.checked)}
                className="w-4 h-4 text-brand-primary bg-slate-800 border-dark-border rounded focus:ring-brand-primary focus:ring-2"
              />
              <div>
                <span className="text-dark-text-primary font-medium">🔧 Sistema</span>
                <p className="text-sm text-dark-text-secondary">
                  Atualizações e manutenções
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-800/30 rounded-lg border border-dark-border hover:bg-slate-800/50 transition-colors">
              <input
                type="checkbox"
                checked={localPreferences.categories.marketing}
                onChange={(e) => updateCategory('marketing', e.target.checked)}
                className="w-4 h-4 text-brand-primary bg-slate-800 border-dark-border rounded focus:ring-brand-primary focus:ring-2"
              />
              <div>
                <span className="text-dark-text-primary font-medium">📢 Marketing</span>
                <p className="text-sm text-dark-text-secondary">
                  Campanhas e promoções
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-800/30 rounded-lg border border-dark-border hover:bg-slate-800/50 transition-colors">
              <input
                type="checkbox"
                checked={localPreferences.categories.sales}
                onChange={(e) => updateCategory('sales', e.target.checked)}
                className="w-4 h-4 text-brand-primary bg-slate-800 border-dark-border rounded focus:ring-brand-primary focus:ring-2"
              />
              <div>
                <span className="text-dark-text-primary font-medium">💰 Vendas</span>
                <p className="text-sm text-dark-text-secondary">
                  Relatórios e métricas
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-800/30 rounded-lg border border-dark-border hover:bg-slate-800/50 transition-colors">
              <input
                type="checkbox"
                checked={localPreferences.categories.alerts}
                onChange={(e) => updateCategory('alerts', e.target.checked)}
                className="w-4 h-4 text-brand-primary bg-slate-800 border-dark-border rounded focus:ring-brand-primary focus:ring-2"
              />
              <div>
                <span className="text-dark-text-primary font-medium">⚠️ Alertas</span>
                <p className="text-sm text-dark-text-secondary">
                  Problemas e avisos importantes
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Frequência */}
        <div>
          <h3 className="text-lg font-semibold text-dark-text-primary mb-4">
            Frequência de Notificações
          </h3>
          <div className="space-y-3">
            {[
              { value: 'immediate', label: 'Imediata', description: 'Receber notificações instantaneamente' },
              { value: 'hourly', label: 'A cada hora', description: 'Resumo das notificações a cada hora' },
              { value: 'daily', label: 'Diária', description: 'Resumo diário das notificações' },
              { value: 'weekly', label: 'Semanal', description: 'Resumo semanal das notificações' }
            ].map((option) => (
              <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="frequency"
                  value={option.value}
                  checked={localPreferences.frequency === option.value}
                  onChange={(e) => updatePreference('frequency', e.target.value)}
                  className="w-4 h-4 text-brand-primary bg-slate-800 border-dark-border focus:ring-brand-primary focus:ring-2"
                />
                <div>
                  <span className="text-dark-text-primary font-medium">{option.label}</span>
                  <p className="text-sm text-dark-text-secondary">{option.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Horário Silencioso */}
        <div>
          <h3 className="text-lg font-semibold text-dark-text-primary mb-4">
            Horário Silencioso
          </h3>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={localPreferences.quietHours.enabled}
                onChange={(e) => updateQuietHours('enabled', e.target.checked)}
                className="w-4 h-4 text-brand-primary bg-slate-800 border-dark-border rounded focus:ring-brand-primary focus:ring-2"
              />
              <div>
                <span className="text-dark-text-primary font-medium">Ativar horário silencioso</span>
                <p className="text-sm text-dark-text-secondary">
                  Não receber notificações durante determinado período
                </p>
              </div>
            </label>

            {localPreferences.quietHours.enabled && (
              <div className="grid grid-cols-2 gap-4 ml-7">
                <div>
                  <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                    Início
                  </label>
                  <input
                    type="time"
                    value={localPreferences.quietHours.start}
                    onChange={(e) => updateQuietHours('start', e.target.value)}
                    className="w-full bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                    Fim
                  </label>
                  <input
                    type="time"
                    value={localPreferences.quietHours.end}
                    onChange={(e) => updateQuietHours('end', e.target.value)}
                    className="w-full bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center gap-4 pt-6 border-t border-dark-border">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-brand-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Salvando...
              </>
            ) : (
              <>
                <CheckIcon className="h-4 w-4" />
                Salvar Preferências
              </>
            )}
          </button>

          <button
            onClick={() => setLocalPreferences(preferences)}
            className="bg-slate-700 text-dark-text-primary font-bold py-3 px-6 rounded-lg hover:bg-slate-600 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};