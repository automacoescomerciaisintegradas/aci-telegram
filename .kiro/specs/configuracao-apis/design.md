# Documento de Design - Configuração de APIs

## Visão Geral

O sistema de configuração de APIs será implementado como um serviço centralizado que gerencia todas as chaves de API e configurações da plataforma ACI. O design foca em segurança, usabilidade e facilidade de manutenção, utilizando localStorage para persistência local e um padrão de serviço para acesso centralizado.

O sistema será integrado ao AdminPage existente e utilizará React 19.1.0 com TypeScript, seguindo os padrões estabelecidos no projeto. A integração com Google Gemini AI será priorizada, considerando que é a principal ferramenta de IA do projeto.

## Arquitetura

### Estrutura de Componentes

```
services/
├── configService.ts          # Serviço principal de configuração
├── apiValidationService.ts   # Validação e teste de APIs
├── geminiService.ts         # Integração com Gemini (existente - será estendido)
└── notificationService.ts    # Sistema de notificações

components/
├── AdminPage.tsx            # Componente principal (existente - será estendido)
├── ApiConfigForm.tsx        # Formulário de configuração de API
├── ApiStatusIndicator.tsx   # Indicador de status da API
├── NotificationToast.tsx    # Componente de notificação
└── ConfigurationTabs.tsx    # Abas de configuração dentro do AdminPage
```

### Integração com Estrutura Existente

O design aproveitará a estrutura existente do projeto:
- **AdminPage.tsx**: Será estendido para incluir a aba de configuração de APIs
- **geminiService.ts**: Será modificado para usar configurações do configService
- **Padrão de componentes**: Seguirá a convenção PascalCase já estabelecida

### Fluxo de Dados

1. **Carregamento**: AdminPage → configService.load() → localStorage
2. **Salvamento**: AdminPage → configService.save() → localStorage → notificação
3. **Validação**: ApiConfigForm → apiValidationService.test() → API externa → status
4. **Uso**: Qualquer componente → configService.get() → configuração

## Componentes e Interfaces

### ConfigService

```typescript
interface ApiConfig {
  gemini: {
    apiKey: string;
    temperature: number;
    systemPrompt: string;
    model?: string; // Modelo do Gemini (gemini-pro, gemini-pro-vision, etc.)
  };
  telegram: {
    botToken: string;
    webhookUrl?: string;
    chatId?: string; // Para automação de mensagens
  };
  whatsapp: {
    apiKey: string;
    phoneNumber?: string;
    instanceId?: string; // Para APIs de WhatsApp Business
  };
  shopee: {
    affiliateId?: string;
    apiKey?: string;
    partnerId?: string; // ID do parceiro Shopee
    region?: 'BR' | 'SG' | 'MY'; // Região da API Shopee
  };
  database?: {
    connectionString?: string;
    provider?: 'sqlite' | 'mysql' | 'postgresql';
  };
}

interface ConfigService {
  load(): ApiConfig;
  save(config: ApiConfig): Promise<void>;
  get<K extends keyof ApiConfig>(key: K): ApiConfig[K] | null;
  getApiKey(service: keyof ApiConfig): string | null;
  isConfigured(key: keyof ApiConfig): boolean;
  validate(): Promise<ValidationResult[]>;
  reset(service?: keyof ApiConfig): void;
  export(): string; // Para backup das configurações
  import(configJson: string): Promise<void>; // Para restaurar configurações
}
```

### ApiValidationService

```typescript
interface ValidationResult {
  service: string;
  status: 'success' | 'error' | 'warning' | 'testing';
  message: string;
  timestamp: Date;
  details?: {
    responseTime?: number;
    apiVersion?: string;
    quotaUsed?: number;
    quotaLimit?: number;
  };
}

interface ApiValidationService {
  testGemini(config: ApiConfig['gemini']): Promise<ValidationResult>;
  testTelegram(config: ApiConfig['telegram']): Promise<ValidationResult>;
  testWhatsApp(config: ApiConfig['whatsapp']): Promise<ValidationResult>;
  testShopee(config: ApiConfig['shopee']): Promise<ValidationResult>;
  testDatabase(config: ApiConfig['database']): Promise<ValidationResult>;
  testAll(config: ApiConfig): Promise<ValidationResult[]>;
  getServiceStatus(service: keyof ApiConfig): ValidationResult | null;
  clearCache(): void; // Para limpar cache de validações
}
```

### NotificationService

```typescript
interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  persistent?: boolean; // Para notificações que não desaparecem automaticamente
}

interface NotificationService {
  show(notification: Omit<Notification, 'id'>): string; // Retorna ID da notificação
  hide(id: string): void;
  clear(): void;
  showConfigSuccess(service: string): void; // Método específico para sucesso de configuração
  showConfigError(service: string, error: string): void; // Método específico para erro de configuração
  showValidationResult(result: ValidationResult): void; // Para resultados de validação
}
```

## Modelos de Dados

### Estrutura de Configuração no localStorage

```json
{
  "aci_config": {
    "version": "1.1",
    "lastUpdated": "2025-02-08T10:30:00Z",
    "environment": "development",
    "apis": {
      "gemini": {
        "apiKey": "encrypted_key_here",
        "temperature": 0.7,
        "systemPrompt": "Você é um assistente especializado em e-commerce brasileiro...",
        "model": "gemini-pro",
        "lastValidated": "2025-02-08T10:30:00Z",
        "status": "active",
        "quotaUsed": 1250,
        "quotaLimit": 10000
      },
      "telegram": {
        "botToken": "encrypted_token_here",
        "webhookUrl": "https://api.aci.com/webhook/telegram",
        "chatId": "encrypted_chat_id",
        "lastValidated": "2025-02-08T10:30:00Z",
        "status": "active"
      },
      "whatsapp": {
        "apiKey": "encrypted_key_here",
        "phoneNumber": "+5511999999999",
        "instanceId": "instance_123",
        "lastValidated": "2025-02-08T10:30:00Z",
        "status": "inactive"
      },
      "shopee": {
        "affiliateId": "12345",
        "apiKey": "encrypted_key_here",
        "partnerId": "partner_456",
        "region": "BR",
        "lastValidated": "2025-02-08T10:30:00Z",
        "status": "active"
      },
      "database": {
        "connectionString": "encrypted_connection_string",
        "provider": "sqlite",
        "lastValidated": "2025-02-08T10:30:00Z",
        "status": "active"
      }
    },
    "preferences": {
      "autoValidate": true,
      "validationInterval": 3600000,
      "theme": "dark",
      "language": "pt-BR"
    }
  }
}
```

### Criptografia e Segurança

Para segurança das chaves de API, será implementado um sistema de criptografia simples mas efetivo:

```typescript
// Utilitário de criptografia
class CryptoUtils {
  private static readonly SALT = 'aci_2025_secure';
  
  static encrypt(value: string): string {
    const timestamp = Date.now().toString();
    const combined = `${this.SALT}_${value}_${timestamp}`;
    return btoa(combined);
  }
  
  static decrypt(encryptedValue: string): string {
    try {
      const decoded = atob(encryptedValue);
      const parts = decoded.split('_');
      if (parts.length >= 3 && parts[0] === this.SALT.split('_')[0]) {
        // Remove salt e timestamp, mantém apenas o valor
        return parts.slice(2, -1).join('_');
      }
      throw new Error('Invalid encrypted value');
    } catch {
      return ''; // Retorna string vazia se não conseguir descriptografar
    }
  }
  
  static mask(value: string, visibleChars: number = 4): string {
    if (!value || value.length <= visibleChars) return '••••••••';
    return value.substring(0, visibleChars) + '••••••••';
  }
}
```

## Tratamento de Erros

### Estratégias de Erro

1. **Configuração Inválida**: Exibir mensagem específica e destacar campo problemático
2. **API Indisponível**: Mostrar status offline e permitir retry
3. **Chave Expirada**: Notificar usuário e solicitar reconfiguração
4. **Erro de Rede**: Exibir mensagem de conectividade e tentar novamente

### Códigos de Erro

```typescript
enum ConfigErrorCode {
  INVALID_API_KEY = 'INVALID_API_KEY',
  NETWORK_ERROR = 'NETWORK_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  EXPIRED_TOKEN = 'EXPIRED_TOKEN',
  MISSING_CONFIG = 'MISSING_CONFIG'
}
```

## Estratégia de Testes

### Testes Unitários

1. **ConfigService**: 
   - Testar load, save, get, validate
   - Testar métodos de import/export
   - Testar reset de configurações
2. **ApiValidationService**: 
   - Testar cada método de validação
   - Testar cache de resultados
   - Testar timeout de validações
3. **NotificationService**: 
   - Testar show, hide, clear
   - Testar métodos específicos de configuração
4. **CryptoUtils**: 
   - Testar encrypt/decrypt
   - Testar mask de valores
   - Testar casos de erro

### Testes de Integração

1. **Fluxo Completo**: Configurar → Salvar → Validar → Usar
2. **Recuperação de Erro**: Simular falhas de API e verificar recuperação
3. **Persistência**: Verificar se configurações persistem entre sessões
4. **Migração**: Testar upgrade de versões de configuração
5. **Integração com geminiService**: Verificar se o serviço existente usa as novas configurações

### Testes de API

1. **Gemini AI**: 
   - Testar chamada com chave válida/inválida
   - Testar diferentes modelos (gemini-pro, gemini-pro-vision)
   - Testar limites de quota
2. **Telegram**: 
   - Testar getMe com bot token
   - Testar webhook configuration
3. **WhatsApp**: 
   - Testar endpoint de status
   - Testar envio de mensagem de teste
4. **Shopee**: 
   - Testar endpoint de afiliado
   - Testar busca de produtos por região
5. **Database**: 
   - Testar conexão com diferentes providers
   - Testar queries básicas

## Considerações de Segurança

### Proteções Implementadas

1. **Mascaramento**: Chaves exibidas como "••••••••"
2. **Codificação**: Base64 com salt para armazenamento
3. **Validação**: Sanitização de entrada
4. **Timeout**: Limite de tempo para chamadas de API

### Limitações Conhecidas

1. **localStorage**: Não é completamente seguro, mas adequado para MVP
2. **Criptografia**: Implementação simples, não é criptografia militar
3. **HTTPS**: Dependente da configuração do servidor
4. **Sincronização**: Sem sincronização entre abas/dispositivos
5. **Backup**: Dependente do usuário fazer export manual

## Padrões de UI/UX

### Design System

Seguindo o padrão estabelecido no projeto:

```typescript
// Cores do tema (baseado no Tailwind CSS customizado)
const theme = {
  colors: {
    primary: 'var(--color-primary)',
    secondary: 'var(--color-secondary)',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  }
};
```

### Componentes de Interface

1. **ApiConfigForm**: 
   - Layout em grid responsivo
   - Campos com validação em tempo real
   - Botões de ação com estados de loading
   - Indicadores visuais de status

2. **ApiStatusIndicator**:
   - Ícones coloridos (verde/vermelho/amarelo)
   - Tooltip com detalhes do status
   - Animação de loading durante testes

3. **NotificationToast**:
   - Posicionamento fixo no canto superior direito
   - Animações de entrada/saída suaves
   - Auto-dismiss configurável
   - Suporte a ações (botões)

### Responsividade

- **Desktop**: Layout em 2 colunas (formulário + status)
- **Tablet**: Layout em 1 coluna com cards empilhados
- **Mobile**: Interface simplificada com accordions

## Integração com Vite e Ambiente de Desenvolvimento

### Variáveis de Ambiente

O sistema utilizará o padrão Vite para variáveis de ambiente:

```typescript
// Configuração de ambiente para desenvolvimento
interface EnvironmentConfig {
  VITE_GEMINI_API_KEY?: string;
  VITE_TELEGRAM_BOT_TOKEN?: string;
  VITE_WHATSAPP_API_KEY?: string;
  VITE_SHOPEE_AFFILIATE_ID?: string;
  VITE_ENVIRONMENT?: 'development' | 'production';
}

// Fallback para variáveis de ambiente em desenvolvimento
const getEnvFallback = (key: string): string | undefined => {
  return import.meta.env[key] || process.env[key];
};
```

### Build e Deploy

- **Desenvolvimento**: Configurações salvas em localStorage
- **Produção**: Configurações podem ser injetadas via variáveis de ambiente
- **Build**: Vite otimizará automaticamente os imports e tree-shaking

## Melhorias Futuras

### Fase 2

1. **Backend Seguro**: Mover configurações para servidor com API REST
2. **Criptografia Real**: Implementar AES-256 com chaves derivadas
3. **Auditoria**: Log de alterações de configuração com timestamp
4. **Backup**: Sincronização com nuvem (Google Drive, Dropbox)
5. **Monitoramento**: Dashboard de status em tempo real

### Fase 3

1. **Multi-tenant**: Configurações por usuário/organização
2. **Permissões**: Controle de acesso granular por funcionalidade
3. **Versionamento**: Histórico de configurações com rollback
4. **Alertas**: Notificações automáticas de falha de API
5. **Analytics**: Métricas de uso das APIs e performance

### Fase 4

1. **Marketplace**: Configurações pré-definidas para diferentes casos de uso
2. **Templates**: Modelos de configuração para diferentes tipos de negócio
3. **Automação**: Configuração automática baseada em detecção de uso
4. **Integração**: Conectores para mais plataformas (Amazon, Mercado Livre, etc.)