import { ApiConfig } from './configService';

export interface ValidationResult {
  service: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  timestamp: Date;
  details?: any;
}

export enum ValidationErrorCode {
  INVALID_API_KEY = 'INVALID_API_KEY',
  NETWORK_ERROR = 'NETWORK_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  EXPIRED_TOKEN = 'EXPIRED_TOKEN',
  MISSING_CONFIG = 'MISSING_CONFIG',
  RATE_LIMITED = 'RATE_LIMITED',
  UNAUTHORIZED = 'UNAUTHORIZED'
}

class ApiValidationService {
  private readonly TIMEOUT = 10000; // 10 segundos

  /**
   * Testa a conexão com a API do Google Gemini
   */
  async testGemini(apiKey: string): Promise<ValidationResult> {
    const result: ValidationResult = {
      service: 'Gemini AI',
      status: 'error',
      message: '',
      timestamp: new Date()
    };

    if (!apiKey || apiKey.trim() === '') {
      result.message = 'Chave de API do Gemini não fornecida';
      result.details = { code: ValidationErrorCode.MISSING_CONFIG };
      return result;
    }

    try {
      // Importar dinamicamente o serviço do Gemini
      const { GoogleGenerativeAI } = await import('@google/genai');

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      // Fazer uma chamada de teste simples
      const testPrompt = 'Responda apenas "OK" se você está funcionando.';

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);

      const response = await model.generateContent(testPrompt);
      clearTimeout(timeoutId);

      const text = response.response.text();

      if (text) {
        result.status = 'success';
        result.message = 'Conexão com Gemini AI estabelecida com sucesso';
        result.details = { responseLength: text.length };
      } else {
        result.status = 'warning';
        result.message = 'Gemini AI respondeu, mas sem conteúdo';
      }

    } catch (error: any) {
      result.status = 'error';

      if (error.name === 'AbortError') {
        result.message = 'Timeout na conexão com Gemini AI';
        result.details = { code: ValidationErrorCode.NETWORK_ERROR };
      } else if (error.message?.includes('API_KEY_INVALID')) {
        result.message = 'Chave de API do Gemini inválida';
        result.details = { code: ValidationErrorCode.INVALID_API_KEY };
      } else if (error.message?.includes('QUOTA_EXCEEDED')) {
        result.message = 'Cota da API do Gemini excedida';
        result.details = { code: ValidationErrorCode.RATE_LIMITED };
      } else if (error.message?.includes('403')) {
        result.message = 'Acesso negado à API do Gemini';
        result.details = { code: ValidationErrorCode.UNAUTHORIZED };
      } else {
        result.message = `Erro na API do Gemini: ${error.message || 'Erro desconhecido'}`;
        result.details = { code: ValidationErrorCode.SERVICE_UNAVAILABLE, originalError: error.message };
      }
    }

    return result;
  }

  /**
   * Testa a conexão com a API do Telegram
   */
  async testTelegram(botToken: string): Promise<ValidationResult> {
    const result: ValidationResult = {
      service: 'Telegram Bot',
      status: 'error',
      message: '',
      timestamp: new Date()
    };

    if (!botToken || botToken.trim() === '') {
      result.message = 'Token do bot Telegram não fornecido';
      result.details = { code: ValidationErrorCode.MISSING_CONFIG };
      return result;
    }

    // Validar formato básico do token
    if (!/^\d+:[A-Za-z0-9_-]+$/.test(botToken)) {
      result.message = 'Formato do token do Telegram inválido';
      result.details = { code: ValidationErrorCode.INVALID_API_KEY };
      return result;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);

      const response = await fetch(`https://api.telegram.org/bot${botToken}/getMe`, {
        method: 'GET',
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (response.ok && data.ok) {
        result.status = 'success';
        result.message = `Bot conectado: @${data.result.username}`;
        result.details = {
          botId: data.result.id,
          botName: data.result.first_name,
          username: data.result.username
        };
      } else {
        result.status = 'error';
        result.message = data.description || 'Erro desconhecido na API do Telegram';

        if (data.error_code === 401) {
          result.details = { code: ValidationErrorCode.UNAUTHORIZED };
        } else {
          result.details = { code: ValidationErrorCode.SERVICE_UNAVAILABLE, errorCode: data.error_code };
        }
      }

    } catch (error: any) {
      result.status = 'error';

      if (error.name === 'AbortError') {
        result.message = 'Timeout na conexão com Telegram';
        result.details = { code: ValidationErrorCode.NETWORK_ERROR };
      } else {
        result.message = `Erro de rede ao conectar com Telegram: ${error.message}`;
        result.details = { code: ValidationErrorCode.NETWORK_ERROR };
      }
    }

    return result;
  }

  /**
   * Testa a conexão com a API do WhatsApp
   */
  async testWhatsApp(apiKey: string): Promise<ValidationResult> {
    const result: ValidationResult = {
      service: 'WhatsApp API',
      status: 'error',
      message: '',
      timestamp: new Date()
    };

    if (!apiKey || apiKey.trim() === '') {
      result.message = 'Chave de API do WhatsApp não fornecida';
      result.details = { code: ValidationErrorCode.MISSING_CONFIG };
      return result;
    }

    try {
      // Como não temos uma API específica do WhatsApp configurada,
      // vamos fazer uma validação básica do formato da chave
      if (apiKey.length < 10) {
        result.status = 'warning';
        result.message = 'Chave de API do WhatsApp muito curta - verifique se está correta';
        result.details = { code: ValidationErrorCode.INVALID_API_KEY };
        return result;
      }

      // Simulação de teste (substituir por chamada real quando API estiver disponível)
      result.status = 'warning';
      result.message = 'WhatsApp API configurada (validação completa pendente)';
      result.details = {
        note: 'Implementar validação real quando endpoint estiver disponível',
        keyLength: apiKey.length
      };

    } catch (error: any) {
      result.status = 'error';
      result.message = `Erro ao validar WhatsApp API: ${error.message}`;
      result.details = { code: ValidationErrorCode.SERVICE_UNAVAILABLE };
    }

    return result;
  }

  /**
   * Testa a configuração do Shopee
   */
  async testShopee(affiliateId?: string, apiKey?: string): Promise<ValidationResult> {
    const result: ValidationResult = {
      service: 'Shopee',
      status: 'error',
      message: '',
      timestamp: new Date()
    };

    if (!affiliateId && !apiKey) {
      result.message = 'ID de afiliado ou chave de API do Shopee não fornecidos';
      result.details = { code: ValidationErrorCode.MISSING_CONFIG };
      return result;
    }

    try {
      // Validação básica do ID de afiliado
      if (affiliateId && !/^\d+$/.test(affiliateId)) {
        result.status = 'warning';
        result.message = 'ID de afiliado do Shopee deve conter apenas números';
        result.details = { code: ValidationErrorCode.INVALID_API_KEY };
        return result;
      }

      // Como a API do Shopee pode não estar disponível publicamente,
      // fazemos uma validação básica
      result.status = 'success';
      result.message = 'Configuração do Shopee válida';
      result.details = {
        hasAffiliateId: !!affiliateId,
        hasApiKey: !!apiKey,
        affiliateIdLength: affiliateId?.length || 0
      };

    } catch (error: any) {
      result.status = 'error';
      result.message = `Erro ao validar configuração do Shopee: ${error.message}`;
      result.details = { code: ValidationErrorCode.SERVICE_UNAVAILABLE };
    }

    return result;
  }

  /**
   * Testa todas as configurações de uma vez
   */
  async testAll(config: ApiConfig): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    // Testar em paralelo para melhor performance
    const promises: Promise<ValidationResult>[] = [];

    // Gemini
    if (config.gemini.apiKey) {
      promises.push(this.testGemini(config.gemini.apiKey));
    }

    // Telegram
    if (config.telegram.botToken) {
      promises.push(this.testTelegram(config.telegram.botToken));
    }

    // WhatsApp
    if (config.whatsapp.apiKey) {
      promises.push(this.testWhatsApp(config.whatsapp.apiKey));
    }

    // Shopee
    if (config.shopee.affiliateId || config.shopee.apiKey) {
      promises.push(this.testShopee(config.shopee.affiliateId, config.shopee.apiKey));
    }

    try {
      const allResults = await Promise.allSettled(promises);

      allResults.forEach((promiseResult) => {
        if (promiseResult.status === 'fulfilled') {
          results.push(promiseResult.value);
        } else {
          results.push({
            service: 'Desconhecido',
            status: 'error',
            message: `Erro interno: ${promiseResult.reason}`,
            timestamp: new Date(),
            details: { code: ValidationErrorCode.SERVICE_UNAVAILABLE }
          });
        }
      });

    } catch (error: any) {
      results.push({
        service: 'Sistema',
        status: 'error',
        message: `Erro ao executar validações: ${error.message}`,
        timestamp: new Date(),
        details: { code: ValidationErrorCode.SERVICE_UNAVAILABLE }
      });
    }

    return results;
  }

  /**
   * Formata resultado de validação para exibição
   */
  formatResult(result: ValidationResult): string {
    const statusEmoji = {
      success: '✅',
      warning: '⚠️',
      error: '❌'
    };

    return `${statusEmoji[result.status]} ${result.service}: ${result.message}`;
  }

  /**
   * Verifica se todas as validações passaram
   */
  allValid(results: ValidationResult[]): boolean {
    return results.every(result => result.status === 'success');
  }

  /**
   * Conta resultados por status
   */
  getStatusCounts(results: ValidationResult[]): { success: number; warning: number; error: number } {
    return results.reduce(
      (counts, result) => {
        counts[result.status]++;
        return counts;
      },
      { success: 0, warning: 0, error: 0 }
    );
  }
}

// Instância singleton
export const apiValidationService = new ApiValidationService();