import React, { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';

interface MessageLog {
  id: string;
  timestamp: string;
  number: string;
  message: string;
  status: 'success' | 'error' | 'info';
}

interface SendingStats {
  total: number;
  sent: number;
  errors: number;
  current: number;
}

export const WhatsAppDispatcher: React.FC = () => {
  const [numbers, setNumbers] = useState('');
  const [message, setMessage] = useState('');
  const [interval, setInterval] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<MessageLog[]>([]);
  const [stats, setStats] = useState<SendingStats>({
    total: 0,
    sent: 0,
    errors: 0,
    current: 0
  });
  const [progress, setProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState('0 segundos');

  // Calcular tempo estimado
  useEffect(() => {
    const numberList = parseNumbers(numbers);
    const totalSeconds = numberList.length * interval;
    
    let timeText = '';
    if (totalSeconds < 60) {
      timeText = `${totalSeconds} segundos`;
    } else if (totalSeconds < 3600) {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      timeText = `${minutes}m ${seconds}s`;
    } else {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      timeText = `${hours}h ${minutes}m`;
    }
    
    setEstimatedTime(timeText);
  }, [numbers, interval]);

  // Função para parsear números
  const parseNumbers = (numbersText: string): string[] => {
    return numbersText
      .split(/[\n,]/)
      .map(num => num.trim())
      .filter(num => num.length > 0)
      .filter(num => /^\d+$/.test(num));
  };

  // Função para adicionar log
  const addLog = (number: string, message: string, status: 'success' | 'error' | 'info') => {
    const newLog: MessageLog = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      number,
      message,
      status
    };

    setLogs(prev => {
      const updated = [...prev, newLog];
      // Manter apenas os últimos 50 logs
      return updated.slice(-50);
    });

    // Log no console também
    console.log(`[${newLog.timestamp}] ${message}`);
  };

  // Função para enviar mensagem individual
  const sendMessage = async (number: string, messageText: string): Promise<void> => {
    const response = await fetch('https://webhook.iau2.com.br/webhook/disparador', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        numero: number,
        mensagem: messageText
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  };

  // Função para aguardar
  const sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  // Função principal de envio
  const handleStartSending = async () => {
    const numberList = parseNumbers(numbers);
    
    if (numberList.length === 0) {
      alert('Por favor, insira pelo menos um número válido!');
      return;
    }

    if (!message.trim()) {
      alert('Por favor, digite uma mensagem!');
      return;
    }

    setIsRunning(true);
    setLogs([]);
    setStats({
      total: numberList.length,
      sent: 0,
      errors: 0,
      current: 0
    });
    setProgress(0);

    addLog('', `🚀 Iniciando envio para ${numberList.length} número(s)...`, 'info');
    
    notificationService.info(
      'Disparo Iniciado',
      `Enviando mensagens para ${numberList.length} número(s)`
    );

    for (let i = 0; i < numberList.length; i++) {
      if (!isRunning) break;

      const number = numberList[i];
      
      setStats(prev => ({ ...prev, current: i + 1 }));
      setProgress(((i + 1) / numberList.length) * 100);

      addLog(number, `📤 Enviando para ${number}...`, 'info');

      try {
        await sendMessage(number, message);
        setStats(prev => ({ ...prev, sent: prev.sent + 1 }));
        addLog(number, `✅ Enviado com sucesso para ${number}`, 'success');
      } catch (error: any) {
        setStats(prev => ({ ...prev, errors: prev.errors + 1 }));
        addLog(number, `❌ Erro ao enviar para ${number}: ${error.message}`, 'error');
      }

      // Aguardar intervalo antes do próximo envio (exceto no último)
      if (i < numberList.length - 1) {
        addLog('', `⏱️ Aguardando ${interval} segundo(s)...`, 'info');
        await sleep(interval * 1000);
      }
    }

    setIsRunning(false);
    const finalStats = `Total: ${numberList.length} | Sucesso: ${stats.sent + 1} | Erros: ${stats.errors}`;
    addLog('', `🎉 Envio concluído! ${finalStats}`, 'info');
    
    notificationService.success(
      '✅ Disparo Concluído!',
      finalStats,
      {
        priority: 'high'
      }
    );
  };

  // Função para parar envio
  const handleStopSending = () => {
    setIsRunning(false);
    addLog('', '⏹️ Envio interrompido pelo usuário', 'info');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-text-primary mb-2 flex items-center gap-3">
          <span className="text-4xl">📱</span>
          Disparador WhatsApp
        </h1>
        <p className="text-dark-text-secondary">
          Configure mensagens automáticas e disparos em massa para WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulário */}
        <div className="bg-dark-card border border-dark-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-dark-text-primary mb-6">
            📝 Configuração do Disparo
          </h2>

          <div className="space-y-6">
            {/* Números */}
            <div>
              <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                📱 Números de Telefone
              </label>
              <textarea
                value={numbers}
                onChange={(e) => setNumbers(e.target.value)}
                placeholder="Digite os números separados por linha ou vírgula&#10;Exemplo:&#10;5511999999999&#10;5511888888888&#10;5511777777777"
                rows={6}
                className="w-full bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary placeholder-gray-500 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary resize-vertical"
                disabled={isRunning}
              />
              <p className="text-xs text-dark-text-secondary mt-2">
                💡 Insira um número por linha ou separados por vírgula
              </p>
            </div>

            {/* Mensagem */}
            <div>
              <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                💬 Mensagem
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Digite sua mensagem aqui..."
                rows={4}
                className="w-full bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary placeholder-gray-500 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary resize-vertical"
                disabled={isRunning}
              />
            </div>

            {/* Intervalo e Tempo Estimado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                  ⏱️ Intervalo (segundos)
                </label>
                <input
                  type="number"
                  value={interval}
                  onChange={(e) => setInterval(parseInt(e.target.value) || 5)}
                  min="1"
                  max="3600"
                  className="w-full bg-slate-800 border border-dark-border rounded-lg p-3 text-dark-text-primary focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  disabled={isRunning}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-text-secondary mb-2">
                  📊 Tempo Total Estimado
                </label>
                <input
                  type="text"
                  value={estimatedTime}
                  readOnly
                  className="w-full bg-slate-700 border border-dark-border rounded-lg p-3 text-dark-text-secondary cursor-not-allowed"
                />
              </div>
            </div>

            {/* Botão de Envio */}
            <div className="pt-4">
              {!isRunning ? (
                <button
                  onClick={handleStartSending}
                  disabled={!numbers.trim() || !message.trim()}
                  className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                >
                  🚀 Iniciar Envio
                </button>
              ) : (
                <button
                  onClick={handleStopSending}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 text-lg"
                >
                  ⏹️ Parar Envio
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Status e Logs */}
        <div className="bg-dark-card border border-dark-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-dark-text-primary mb-6">
            📈 Status do Envio
          </h2>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-brand-primary">{stats.sent}</div>
              <div className="text-sm text-dark-text-secondary">Enviados</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{stats.errors}</div>
              <div className="text-sm text-dark-text-secondary">Erros</div>
            </div>
          </div>

          {/* Barra de Progresso */}
          {stats.total > 0 && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-dark-text-secondary mb-2">
                <span>Progresso</span>
                <span>{stats.current} de {stats.total}</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-brand-primary to-blue-400 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Logs */}
          <div>
            <h3 className="text-lg font-medium text-dark-text-primary mb-4">📋 Logs de Envio</h3>
            <div className="bg-slate-800/50 rounded-lg p-4 max-h-80 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-dark-text-secondary text-center py-8">
                  Nenhum log ainda. Inicie um envio para ver os logs aqui.
                </p>
              ) : (
                <div className="space-y-2">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className={`p-2 rounded text-sm font-mono ${
                        log.status === 'success'
                          ? 'bg-green-900/50 text-green-300 border border-green-700'
                          : log.status === 'error'
                          ? 'bg-red-900/50 text-red-300 border border-red-700'
                          : 'bg-blue-900/50 text-blue-300 border border-blue-700'
                      }`}
                    >
                      <span className="text-gray-400">[{log.timestamp}]</span> {log.message}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};