// Interfaces para configuração de APIs
export interface GeminiConfig {
  apiKey: string;
  temperature: number;
  systemPrompt: string;
}

export interface TelegramConfig {
  botToken: string;
  webhookUrl?: string;
}

export interface WhatsAppConfig {
  apiKey: string;
  phoneNumber?: string;
}

export interface ShopeeConfig {
  affiliateId?: string;
  apiKey?: string;
}

export interface ApiConfig {
  gemini: GeminiConfig;
  telegram: TelegramConfig;
  whatsapp: WhatsAppConfig;
  shopee: ShopeeConfig;
}

export interface StoredConfig {
  version: string;
  lastUpdated: string;
  apis: {
    [K in keyof ApiConfig]: ApiConfig[K] & {
      lastValidated?: string;
      status: 'active' | 'inactive' | 'error';
    };
  };
}

// Funções de criptografia simples
const SALT = 'aci_secure_';

export const encryptKey = (key: string): string => {
  if (!key) return '';
  return btoa(`${SALT}${key}_${Date.now()}`);
};

export const decryptKey = (encryptedKey: string): string => {
  if (!encryptedKey) return '';
  try {
    const decoded = atob(encryptedKey);
    return decoded.replace(new RegExp(`^${SALT}`), '').replace(/_\d+$/, '');
  } catch {
    return '';
  }
};

// Configuração padrão
const DEFAULT_CONFIG: ApiConfig = {
  gemini: {
    apiKey: '',
    temperature: 0.7,
    systemPrompt: 'Você é um assistente de marketing amigável e prestativo especializado em criar conteúdo para o mercado brasileiro.'
  },
  telegram: {
    botToken: '',
    webhookUrl: ''
  },
  whatsapp: {
    apiKey: '',
    phoneNumber: ''
  },
  shopee: {
    affiliateId: '',
    apiKey: ''
  }
};

const CONFIG_KEY = 'aci_config';
const CONFIG_VERSION = '1.0';

class ConfigService {
  private cache: ApiConfig | null = null;

  /**
   * Carrega as configurações do localStorage
   */
  load(): ApiConfig {
    if (this.cache) {
      return this.cache;
    }

    try {
      const stored = localStorage.getItem(CONFIG_KEY);
      if (!stored) {
        this.cache = { ...DEFAULT_CONFIG };
        return this.cache;
      }

      const parsedConfig: StoredConfig = JSON.parse(stored);
      
      // Descriptografar as chaves
      const decryptedConfig: ApiConfig = {
        gemini: {
          apiKey: decryptKey(parsedConfig.apis.gemini.apiKey),
          temperature: parsedConfig.apis.gemini.temperature,
          systemPrompt: parsedConfig.apis.gemini.systemPrompt
        },
        telegram: {
          botToken: decryptKey(parsedConfig.apis.telegram.botToken),
          webhookUrl: parsedConfig.apis.telegram.webhookUrl
        },
        whatsapp: {
          apiKey: decryptKey(parsedConfig.apis.whatsapp.apiKey),
          phoneNumber: parsedConfig.apis.whatsapp.phoneNumber
        },
        shopee: {
          affiliateId: parsedConfig.apis.shopee.affiliateId,
          apiKey: decryptKey(parsedConfig.apis.shopee.apiKey || '')
        }
      };

      this.cache = decryptedConfig;
      return decryptedConfig;
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      this.cache = { ...DEFAULT_CONFIG };
      return this.cache;
    }
  }

  /**
   * Salva as configurações no localStorage
   */
  async save(config: ApiConfig): Promise<void> {
    try {
      // Validar dados de entrada
      this.validateConfig(config);

      // Criptografar chaves sensíveis
      const encryptedConfig: StoredConfig = {
        version: CONFIG_VERSION,
        lastUpdated: new Date().toISOString(),
        apis: {
          gemini: {
            apiKey: encryptKey(config.gemini.apiKey),
            temperature: config.gemini.temperature,
            systemPrompt: config.gemini.systemPrompt,
            status: config.gemini.apiKey ? 'active' : 'inactive'
          },
          telegram: {
            botToken: encryptKey(config.telegram.botToken),
            webhookUrl: config.telegram.webhookUrl,
            status: config.telegram.botToken ? 'active' : 'inactive'
          },
          whatsapp: {
            apiKey: encryptKey(config.whatsapp.apiKey),
            phoneNumber: config.whatsapp.phoneNumber,
            status: config.whatsapp.apiKey ? 'active' : 'inactive'
          },
          shopee: {
            affiliateId: config.shopee.affiliateId,
            apiKey: encryptKey(config.shopee.apiKey || ''),
            status: config.shopee.affiliateId || config.shopee.apiKey ? 'active' : 'inactive'
          }
        }
      };

      localStorage.setItem(CONFIG_KEY, JSON.stringify(encryptedConfig));
      this.cache = config;
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      throw new Error('Falha ao salvar configurações');
    }
  }

  /**
   * Obtém uma configuração específica
   */
  get<K extends keyof ApiConfig>(key: K): ApiConfig[K] {
    const config = this.load();
    return config[key];
  }

  /**
   * Verifica se uma configuração está definida
   */
  isConfigured(key: keyof ApiConfig): boolean {
    const config = this.load();
    
    switch (key) {
      case 'gemini':
        return !!config.gemini.apiKey;
      case 'telegram':
        return !!config.telegram.botToken;
      case 'whatsapp':
        return !!config.whatsapp.apiKey;
      case 'shopee':
        return !!(config.shopee.affiliateId || config.shopee.apiKey);
      default:
        return false;
    }
  }

  /**
   * Limpa o cache (força recarregamento)
   */
  clearCache(): void {
    this.cache = null;
  }

  /**
   * Obtém todas as configurações
   */
  getAll(): ApiConfig {
    return this.load();
  }

  /**
   * Valida a estrutura da configuração
   */
  private validateConfig(config: ApiConfig): void {
    if (!config || typeof config !== 'object') {
      throw new Error('Configuração inválida');
    }

    // Validar Gemini
    if (config.gemini) {
      if (typeof config.gemini.temperature !== 'number' || 
          config.gemini.temperature < 0 || 
          config.gemini.temperature > 1) {
        throw new Error('Temperatura do Gemini deve estar entre 0 e 1');
      }
    }

    // Validar números de telefone do WhatsApp
    if (config.whatsapp?.phoneNumber && 
        config.whatsapp.phoneNumber && 
        !/^\+\d{10,15}$/.test(config.whatsapp.phoneNumber)) {
      throw new Error('Número de telefone do WhatsApp deve estar no formato internacional (+5511999999999)');
    }
  }

  /**
   * Exporta configurações (sem chaves sensíveis)
   */
  exportConfig(): Partial<ApiConfig> {
    const config = this.load();
    return {
      gemini: {
        apiKey: config.gemini.apiKey ? '***configurado***' : '',
        temperature: config.gemini.temperature,
        systemPrompt: config.gemini.systemPrompt
      },
      telegram: {
        botToken: config.telegram.botToken ? '***configurado***' : '',
        webhookUrl: config.telegram.webhookUrl
      },
      whatsapp: {
        apiKey: config.whatsapp.apiKey ? '***configurado***' : '',
        phoneNumber: config.whatsapp.phoneNumber
      },
      shopee: {
        affiliateId: config.shopee.affiliateId,
        apiKey: config.shopee.apiKey ? '***configurado***' : ''
      }
    };
  }
}

// Instância singleton
export const configService = new ConfigService();