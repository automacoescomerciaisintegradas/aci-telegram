import React, { useState, useEffect } from 'react';

// Teste dos serviços
const AppDebugServices: React.FC = () => {
  const [status, setStatus] = useState<string[]>([]);

  useEffect(() => {
    const testServices = async () => {
      const results: string[] = [];

      const getErrorMessage = (error: unknown): string => {
        if (error instanceof Error) {
          return error.message;
        }
        return String(error);
      };
      
      try {
        // Teste 1: ConfigService
        const { configService } = await import('./services/configService');
        const config = configService.getAll();
        results.push('✅ ConfigService carregado');
        results.push(`📋 Config: ${JSON.stringify(config).substring(0, 50)}...`);
      } catch (error) {
        results.push(`❌ ConfigService erro: ${getErrorMessage(error)}`);
      }

      try {
        // Teste 2: ApiValidationService
        await import('./services/apiValidationService');
        results.push('✅ ApiValidationService carregado');
      } catch (error) {
        results.push(`❌ ApiValidationService erro: ${getErrorMessage(error)}`);
      }

      try {
        // Teste 3: NotificationService
        await import('./services/notificationService');
        results.push('✅ NotificationService carregado');
      } catch (error) {
        results.push(`❌ NotificationService erro: ${getErrorMessage(error)}`);
      }

      setStatus(results);
    };

    testServices();
  }, []);

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text-primary p-8">
      <h1 className="text-3xl font-bold mb-6">🔍 Debug dos Serviços</h1>
      
      <div className="bg-dark-card border border-dark-border p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Status dos Serviços:</h2>
        <div className="space-y-2">
          {status.length === 0 ? (
            <p className="text-yellow-400">🔄 Testando serviços...</p>
          ) : (
            status.map((item, index) => (
              <div key={index} className="text-sm font-mono">
                {item}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-6 bg-slate-800/30 border border-dark-border p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Próximo Passo:</h3>
        <p className="text-dark-text-secondary">
          Se todos os serviços carregarem com sucesso, o problema está nos componentes.
          Se algum serviço falhar, precisamos corrigir esse serviço primeiro.
        </p>
      </div>
    </div>
  );
};

export default AppDebugServices;