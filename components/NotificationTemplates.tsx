import React, { useState } from 'react';
import { notificationService } from '../services/notificationService';
import { MagicWandIcon, CheckIcon, CopyIcon } from './Icons';

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'promotion' | 'campaign' | 'task';
  category: 'system' | 'marketing' | 'sales' | 'alerts';
  priority: 'low' | 'medium' | 'high';
  titleTemplate: string;
  messageTemplate: string;
  variables: string[];
  description: string;
}

const defaultTemplates: NotificationTemplate[] = [
  {
    id: 'product-found',
    name: 'Produto Encontrado',
    type: 'success',
    category: 'system',
    priority: 'medium',
    titleTemplate: '✅ Produto Encontrado!',
    messageTemplate: '{productName} encontrado por {price}. {description}',
    variables: ['productName', 'price', 'description'],
    description: 'Notificação quando um produto é encontrado com sucesso'
  },
  {
    id: 'campaign-complete',
    name: 'Campanha Concluída',
    type: 'campaign',
    category: 'marketing',
    priority: 'high',
    titleTemplate: '🎉 Campanha "{campaignName}" Concluída!',
    messageTemplate: 'Resultados: {results}. Total de {interactions} interações.',
    variables: ['campaignName', 'results', 'interactions'],
    description: 'Notificação de conclusão de campanha de marketing'
  },
  {
    id: 'api-error',
    name: 'Erro de API',
    type: 'error',
    category: 'alerts',
    priority: 'high',
    titleTemplate: '⚠️ Erro na API {serviceName}',
    messageTemplate: 'Falha na conexão: {errorMessage}. Tentativa {attempt} de {maxAttempts}.',
    variables: ['serviceName', 'errorMessage', 'attempt', 'maxAttempts'],
    description: 'Notificação para erros de API e conexão'
  },
  {
    id: 'promotion-alert',
    name: 'Alerta de Promoção',
    type: 'promotion',
    category: 'marketing',
    priority: 'high',
    titleTemplate: '🔥 {productName} em Promoção!',
    messageTemplate: '{discount} de desconto! De {originalPrice} por apenas {salePrice}. Válido até {endDate}.',
    variables: ['productName', 'discount', 'originalPrice', 'salePrice', 'endDate'],
    description: 'Notificação para produtos em promoção'
  },
  {
    id: 'task-reminder',
    name: 'Lembrete de Tarefa',
    type: 'task',
    category: 'system',
    priority: 'medium',
    titleTemplate: '⏰ Lembrete: {taskName}',
    messageTemplate: 'Prazo: {dueDate}. Prioridade: {priority}. {notes}',
    variables: ['taskName', 'dueDate', 'priority', 'notes'],
    description: 'Lembrete para tarefas pendentes'
  },
  {
    id: 'sales-milestone',
    name: 'Meta de Vendas',
    type: 'success',
    category: 'sales',
    priority: 'high',
    titleTemplate: '🎯 Meta Atingida!',
    messageTemplate: 'Parabéns! Você atingiu {percentage}% da meta mensal com {amount} em vendas.',
    variables: ['percentage', 'amount'],
    description: 'Notificação quando metas de vendas são atingidas'
  }
];

export const NotificationTemplates: React.FC = () => {
  const [templates] = useState<NotificationTemplate[]>(defaultTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [previewTitle, setPreviewTitle] = useState('');
  const [previewMessage, setPreviewMessage] = useState('');

  const handleTemplateSelect = (template: NotificationTemplate) => {
    setSelectedTemplate(template);
    const initialVars: Record<string, string> = {};
    template.variables.forEach(variable => {
      initialVars[variable] = '';
    });
    setVariables(initialVars);
    updatePreview(template, initialVars);
  };

  const handleVariableChange = (variable: string, value: string) => {
    const newVariables = { ...variables, [variable]: value };
    setVariables(newVariables);
    if (selectedTemplate) {
      updatePreview(selectedTemplate, newVariables);
    }
  };

  const updatePreview = (template: NotificationTemplate, vars: Record<string, string>) => {
    let title = template.titleTemplate;
    let message = template.messageTemplate;

    Object.entries(vars).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      title = title.replace(new RegExp(placeholder, 'g'), value || `[${key}]`);
      message = message.replace(new RegExp(placeholder, 'g'), value || `[${key}]`);
    });

    setPreviewTitle(title);
    setPreviewMessage(message);
  };

  const handleSendNotification = () => {
    if (!selectedTemplate) return;

    notificationService.addNotification(
      selectedTemplate.type,
      previewTitle,
      previewMessage,
      {
        priority: selectedTemplate.priority,
        category: selectedTemplate.category
      }
    );

    // Limpar formulário
    setSelectedTemplate(null);
    setVariables({});
    setPreviewTitle('');
    setPreviewMessage('');
  };

  const copyTemplate = (template: NotificationTemplate) => {
    const templateText = `Título: ${template.titleTemplate}\nMensagem: ${template.messageTemplate}\nVariáveis: ${template.variables.join(', ')}`;
    navigator.clipboard.writeText(templateText);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-400 bg-green-900/20 border-green-700';
      case 'error': return 'text-red-400 bg-red-900/20 border-red-700';
      case 'warning': return 'text-yellow-400 bg-yellow-900/20 border-yellow-700';
      case 'promotion': return 'text-purple-400 bg-purple-900/20 border-purple-700';
      case 'campaign': return 'text-blue-400 bg-blue-900/20 border-blue-700';
      case 'task': return 'text-orange-400 bg-orange-900/20 border-orange-700';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-text-primary mb-2 flex items-center gap-3">
          <MagicWandIcon className="h-8 w-8 text-brand-primary" />
          Templates de Notificação
        </h1>
        <p className="text-dark-text-secondary">
          Use templates pré-definidos para criar notificações padronizadas rapidamente.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lista de Templates */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-dark-text-primary mb-4">
            📋 Templates Disponíveis
          </h2>
          
          {templates.map((template) => (
            <div
              key={template.id}
              className={`bg-dark-card border border-dark-border rounded-lg p-4 cursor-pointer transition-all hover:border-brand-primary/50 ${
                selectedTemplate?.id === template.id ? 'border-brand-primary bg-brand-primary/5' : ''
              }`}
              onClick={() => handleTemplateSelect(template)}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-dark-text-primary">{template.name}</h3>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded border ${getTypeColor(template.type)}`}>
                    {template.type}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyTemplate(template);
                    }}
                    className="p-1 hover:bg-slate-700 rounded transition-colors"
                    title="Copiar template"
                  >
                    <CopyIcon className="h-4 w-4 text-dark-text-secondary" />
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-dark-text-secondary mb-3">
                {template.description}
              </p>
              
              <div className="flex items-center gap-4 text-xs">
                <span className="text-dark-text-secondary">
                  Categoria: <span className="text-dark-text-primary">{template.category}</span>
                </span>
                <span className="text-dark-text-secondary">
                  Prioridade: <span className={getPriorityColor(template.priority)}>{template.priority}</span>
                </span>
                <span className="text-dark-text-secondary">
                  Variáveis: <span className="text-dark-text-primary">{template.variables.length}</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Editor de Template */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          {selectedTemplate ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-dark-text-primary mb-2">
                  ✏️ Editar: {selectedTemplate.name}
                </h2>
                <p className="text-sm text-dark-text-secondary">
                  Preencha as variáveis para personalizar a notificação.
                </p>
              </div>

              {/* Variáveis */}
              <div className="space-y-4">
                <h3 className="font-medium text-dark-text-primary">Variáveis:</h3>
                {selectedTemplate.variables.map((variable) => (
                  <div key={variable}>
                    <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                      {variable}
                    </label>
                    <input
                      type="text"
                      value={variables[variable] || ''}
                      onChange={(e) => handleVariableChange(variable, e.target.value)}
                      className="w-full bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary placeholder-gray-500 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                      placeholder={`Digite o valor para ${variable}`}
                    />
                  </div>
                ))}
              </div>

              {/* Preview */}
              <div className="border-t border-dark-border pt-6">
                <h3 className="font-medium text-dark-text-primary mb-4">👁️ Preview:</h3>
                <div className={`border rounded-lg p-4 ${getTypeColor(selectedTemplate.type)}`}>
                  <h4 className="font-semibold mb-2">{previewTitle}</h4>
                  <p className="text-sm">{previewMessage}</p>
                </div>
              </div>

              {/* Ações */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSendNotification}
                  disabled={selectedTemplate.variables.some(v => !variables[v])}
                  className="flex-1 bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <CheckIcon className="h-4 w-4" />
                  Enviar Notificação
                </button>
                
                <button
                  onClick={() => {
                    setSelectedTemplate(null);
                    setVariables({});
                    setPreviewTitle('');
                    setPreviewMessage('');
                  }}
                  className="px-4 py-3 bg-slate-700 text-dark-text-primary rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <MagicWandIcon className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-dark-text-primary mb-2">
                Selecione um Template
              </h3>
              <p className="text-dark-text-secondary">
                Escolha um template da lista ao lado para começar a personalizar sua notificação.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};