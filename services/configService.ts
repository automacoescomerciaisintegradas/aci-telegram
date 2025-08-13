// Interfaces para configuração de APIs
export interface GeminiConfig {
  apiKey: string;
  temperature: number;
  systemPrompt: string;
}

export interface TelegramConfig {
  botToken: string;
  chatId: string;
  isConfigured: boolean;
}

export interface ShopeeConfig {
  affiliateId: string;
  isConfigured: boolean;
}

export interface WhatsAppConfig {
  apiKey: string;
  instanceName: string;
  apiUrl: string;
  channelUrl: string;
  isConfigured: boolean;
}

export interface SystemConfig {
  telegram: TelegramConfig;
  shopee: ShopeeConfig;
  whatsapp: WhatsAppConfig;
  lastUpdated: string;
}

export interface BitlyConfig {
  accessToken?: string;
}

export interface ApiConfig {
  gemini: GeminiConfig;
  telegram: TelegramConfig;
  whatsapp: WhatsAppConfig;
  shopee: ShopeeConfig;
  bitly: BitlyConfig;
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
    chatId: '',
    isConfigured: false
  },
  whatsapp: {
    apiKey: '',
    instanceName: '',
    apiUrl: '',
    channelUrl: '',
    isConfigured: false
  },
  shopee: {
    affiliateId: '',
    isConfigured: false
  },
  bitly: {
    accessToken: ''
  }
};

const CONFIG_KEY = 'aci_config';
const CONFIG_VERSION = '1.0';

class ConfigService {
  private cache: ApiConfig | null = null;
  private readonly STORAGE_KEY = 'aci_system_config';

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
          chatId: parsedConfig.apis.telegram.chatId || '',
          isConfigured: false
        },
        whatsapp: {
          apiKey: decryptKey(parsedConfig.apis.whatsapp.apiKey),
          instanceName: parsedConfig.apis.whatsapp.instanceName || '',
          apiUrl: parsedConfig.apis.whatsapp.apiUrl || '',
          channelUrl: parsedConfig.apis.whatsapp.channelUrl || '',
          isConfigured: false
        },
        shopee: {
          affiliateId: parsedConfig.apis.shopee.affiliateId,
          isConfigured: !!parsedConfig.apis.shopee.affiliateId
        },
        bitly: {
          accessToken: decryptKey(parsedConfig.apis.bitly?.accessToken || '')
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
            chatId: config.telegram.chatId,
            isConfigured: config.telegram.isConfigured,
            status: config.telegram.botToken ? 'active' : 'inactive'
          },
          whatsapp: {
            apiKey: encryptKey(config.whatsapp.apiKey),
            instanceName: config.whatsapp.instanceName,
            apiUrl: config.whatsapp.apiUrl,
            channelUrl: config.whatsapp.channelUrl,
            isConfigured: config.whatsapp.isConfigured,
            status: config.whatsapp.apiKey ? 'active' : 'inactive'
          },
          shopee: {
            affiliateId: config.shopee.affiliateId,
            isConfigured: config.shopee.isConfigured,
            status: config.shopee.affiliateId ? 'active' : 'inactive'
          },
          bitly: {
            accessToken: encryptKey(config.bitly?.accessToken || ''),
            status: config.bitly?.accessToken ? 'active' : 'inactive'
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
        return !!config.shopee.affiliateId;
      case 'bitly':
        return !!config.bitly.accessToken;
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

    // Validar URL da API do WhatsApp
    if (config.whatsapp?.apiUrl && 
        config.whatsapp.apiUrl && 
        !/^https?:\/\/.+/.test(config.whatsapp.apiUrl)) {
      throw new Error('URL da API do WhatsApp deve ser uma URL válida');
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
        chatId: config.telegram.chatId || '',
        isConfigured: config.telegram.isConfigured
      },
      whatsapp: {
        apiKey: config.whatsapp.apiKey ? '***configurado***' : '',
        instanceName: config.whatsapp.instanceName || '',
        apiUrl: config.whatsapp.apiUrl || '',
        channelUrl: config.whatsapp.channelUrl || '',
        isConfigured: config.whatsapp.isConfigured
      },
      shopee: {
        affiliateId: config.shopee.affiliateId,
        isConfigured: config.shopee.isConfigured
      },
      bitly: {
        accessToken: config.bitly.accessToken ? '***configurado***' : ''
      }
    };
  }

  // Obter configurações do sistema
  getSystemConfig(): SystemConfig {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }

    // Configuração padrão
    return {
      telegram: { botToken: '', chatId: '', isConfigured: false },
      shopee: { affiliateId: '', isConfigured: false },
      whatsapp: { apiKey: '', instanceName: '', apiUrl: '', channelUrl: '', isConfigured: false },
      lastUpdated: new Date().toISOString()
    };
  }

  // Salvar configurações do sistema
  saveSystemConfig(config: Partial<SystemConfig>): void {
    try {
      const current = this.getSystemConfig();
      const updated = { ...current, ...config, lastUpdated: new Date().toISOString() };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    }
  }

  // Configurar Telegram
  setTelegramConfig(botToken: string, chatId: string): void {
    const config = this.getSystemConfig();
    config.telegram = {
      botToken,
      chatId,
      isConfigured: !!(botToken && chatId)
    };
    this.saveSystemConfig(config);
  }

  // Configurar Shopee
  setShopeeConfig(affiliateId: string): void {
    const config = this.getSystemConfig();
    config.shopee = {
      affiliateId,
      isConfigured: !!affiliateId
    };
    this.saveSystemConfig(config);
  }

  // Configurar WhatsApp
  setWhatsAppConfig(apiKey: string, instanceName: string, apiUrl: string, channelUrl: string): void {
    const config = this.getSystemConfig();
    config.whatsapp = {
      apiKey,
      instanceName,
      apiUrl,
      channelUrl,
      isConfigured: !!(apiKey && instanceName && apiUrl && channelUrl)
    };
    this.saveSystemConfig(config);
  }

  // Obter configuração específica
  getTelegramConfig(): TelegramConfig {
    return this.getSystemConfig().telegram;
  }

  getShopeeConfig(): ShopeeConfig {
    return this.getSystemConfig().shopee;
  }

  getWhatsAppConfig(): WhatsAppConfig {
    return this.getSystemConfig().whatsapp;
  }

  // Verificar se todas as configurações necessárias estão prontas
  isFullyConfigured(): boolean {
    const config = this.getSystemConfig();
    return config.telegram.isConfigured && config.shopee.isConfigured && config.whatsapp.isConfigured;
  }

  // Limpar todas as configurações
  clearAllConfigs(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Erro ao limpar configurações:', error);
    }
  }

  // Migrar configurações antigas (se existirem)
  migrateOldConfigs(): void {
    try {
      // Verificar se existem configurações antigas
      const oldTelegram = localStorage.getItem('aci_api_config');
      const oldUser = localStorage.getItem('aci_user');

      if (oldTelegram || oldUser) {
        const config = this.getSystemConfig();

        // Migrar configurações do Telegram
        if (oldTelegram) {
          try {
            const telegramConfig = JSON.parse(oldTelegram);
            if (telegramConfig.botToken && telegramConfig.destinations?.[0]?.chatId) {
              config.telegram = {
                botToken: telegramConfig.botToken,
                chatId: telegramConfig.destinations[0].chatId,
                isConfigured: true
              };
            }
          } catch (e) {
            console.log('Configuração antiga do Telegram não encontrada');
          }
        }

        // Migrar ID de afiliado
        if (oldUser) {
          try {
            const userConfig = JSON.parse(oldUser);
            if (userConfig.affiliateId) {
              config.shopee = {
                affiliateId: userConfig.affiliateId,
                isConfigured: true
              };
            }
          } catch (e) {
            console.log('Configuração antiga do usuário não encontrada');
          }
        }

        // Verificar se há configurações antigas do WhatsApp
        const oldWhatsApp = localStorage.getItem('aci_whatsapp_config');
        if (oldWhatsApp) {
          try {
            const whatsappConfig = JSON.parse(oldWhatsApp);
            if (whatsappConfig.apiKey || whatsappConfig.phoneNumber) {
              config.whatsapp = {
                apiKey: whatsappConfig.apiKey || '',
                instanceName: whatsappConfig.phoneNumber || '', // Migrar phoneNumber para instanceName
                apiUrl: whatsappConfig.apiUrl || 'https://evolution.iau2.com.br/',
                channelUrl: whatsappConfig.channelUrl || '',
                isConfigured: !!(whatsappConfig.apiKey && whatsappConfig.phoneNumber)
              };
            }
          } catch (e) {
            console.log('Configuração antiga do WhatsApp não encontrada');
          }
        }

        this.saveSystemConfig(config);
        console.log('Configurações antigas migradas com sucesso');
      }
    } catch (error) {
      console.error('Erro na migração:', error);
    }
  }
}

export const configService = new ConfigService();

// Executar migração na inicialização
configService.migrateOldConfigs();