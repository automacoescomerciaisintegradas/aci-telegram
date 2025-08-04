# Documento de Design - Configuração de APIs

## Visão Geral

O sistema de configuração de APIs será implementado como um serviço centralizado que gerencia todas as chaves de API e configurações da plataforma ACI. O design foca em segurança, usabilidade e facilidade de manutenção, utilizando localStorage para persistência local e um padrão de serviço para acesso centralizado.

## Arquitetura

### Estrutura de Componentes

```
services/
├── configService.ts          # Serviço principal de configuração
├── apiValidationService.ts   # Validação e teste de APIs
└── notificationService.ts    # Sistema de notificações

components/
├── AdminPage.tsx            # Componente principal (existente)
├── ApiConfigForm.tsx        # Formulário de configuração de API
├── ApiStatusIndicator.tsx   # Indicador de status da API
└── NotificationToast.tsx    # Componente de notificação
```

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
  };
  telegram: {
    botToken: string;
    webhookUrl?: string;
  };
  whatsapp: {
    apiKey: string;
    phoneNumber?: string;
  };
  shopee: {
    affiliateId?: string;
    apiKey?: string;
  };
}

interface ConfigService {
  load(): ApiConfig;
  save(config: ApiConfig): Promise<void>;
  get(key: keyof ApiConfig): any;
  isConfigured(key: keyof ApiConfig): boolean;
  validate(): Promise<ValidationResult[]>;
}
```

### ApiValidationService

```typescript
interface ValidationResult {
  service: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  timestamp: Date;
}

interface ApiValidationService {
  testGemini(apiKey: string): Promise<ValidationResult>;
  testTelegram(botToken: string): Promise<ValidationResult>;
  testWhatsApp(apiKey: string): Promise<ValidationResult>;
  testAll(config: ApiConfig): Promise<ValidationResult[]>;
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
}

interface NotificationService {
  show(notification: Omit<Notification, 'id'>): void;
  hide(id: string): void;
  clear(): void;
}
```

## Modelos de Dados

### Estrutura de Configuração no localStorage

```json
{
  "aci_config": {
    "version": "1.0",
    "lastUpdated": "2025-02-08T10:30:00Z",
    "apis": {
      "gemini": {
        "apiKey": "encrypted_key_here",
        "temperature": 0.7,
        "systemPrompt": "Você é um assistente...",
        "lastValidated": "2025-02-08T10:30:00Z",
        "status": "active"
      },
      "telegram": {
        "botToken": "encrypted_token_here",
        "webhookUrl": "https://...",
        "lastValidated": "2025-02-08T10:30:00Z",
        "status": "active"
      },
      "whatsapp": {
        "apiKey": "encrypted_key_here",
        "phoneNumber": "+5511999999999",
        "lastValidated": "2025-02-08T10:30:00Z",
        "status": "inactive"
      },
      "shopee": {
        "affiliateId": "12345",
        "apiKey": "encrypted_key_here",
        "lastValidated": "2025-02-08T10:30:00Z",
        "status": "active"
      }
    }
  }
}
```

### Criptografia Simples

Para segurança básica, as chaves serão codificadas em Base64 com um salt simples:

```typescript
const encryptKey = (key: string): string => {
  return btoa(`aci_${key}_${Date.now()}`);
};

const decryptKey = (encryptedKey: string): string => {
  const decoded = atob(encryptedKey);
  return decoded.replace(/^aci_/, '').replace(/_\d+$/, '');
};
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

1. **ConfigService**: Testar load, save, get, validate
2. **ApiValidationService**: Testar cada método de validação
3. **NotificationService**: Testar show, hide, clear
4. **Utilitários**: Testar encrypt/decrypt

### Testes de Integração

1. **Fluxo Completo**: Configurar → Salvar → Validar → Usar
2. **Recuperação de Erro**: Simular falhas de API e verificar recuperação
3. **Persistência**: Verificar se configurações persistem entre sessões

### Testes de API

1. **Gemini AI**: Testar chamada com chave válida/inválida
2. **Telegram**: Testar getMe com bot token
3. **WhatsApp**: Testar endpoint de status
4. **Shopee**: Testar endpoint de afiliado

## Considerações de Segurança

### Proteções Implementadas

1. **Mascaramento**: Chaves exibidas como "••••••••"
2. **Codificação**: Base64 com salt para armazenamento
3. **Validação**: Sanitização de entrada
4. **Timeout**: Limite de tempo para chamadas de API

### Limitações Conhecidas

1. **localStorage**: Não é completamente seguro, mas adequado para MVP
2. **Criptografia**: Base64 não é criptografia real, apenas ofuscação
3. **HTTPS**: Dependente da configuração do servidor

## Melhorias Futuras

### Fase 2

1. **Backend Seguro**: Mover configurações para servidor
2. **Criptografia Real**: Implementar AES-256
3. **Auditoria**: Log de alterações de configuração
4. **Backup**: Sincronização com nuvem

### Fase 3

1. **Multi-tenant**: Configurações por usuário/organização
2. **Permissões**: Controle de acesso granular
3. **Versionamento**: Histórico de configurações
4. **Monitoramento**: Alertas de falha de API