# Sistema de Notificações Push - ACI

## 📋 Visão Geral

O Sistema de Notificações Push do ACI é uma funcionalidade completa que permite enviar, gerenciar e personalizar notificações em tempo real para melhorar a experiência do usuário e manter-lo informado sobre eventos importantes da plataforma.

## 🚀 Funcionalidades Implementadas

### ✅ Tipos de Notificação
- **Sucesso** (verde): Confirmações e operações bem-sucedidas
- **Avisos** (amarelo): Alertas importantes que requerem atenção
- **Erros** (vermelho): Problemas críticos que precisam ser resolvidos
- **Promoções** (roxo): Ofertas especiais e oportunidades de vendas
- **Campanhas** (azul): Atualizações sobre campanhas de marketing
- **Tarefas** (laranja): Lembretes e tarefas pendentes

### ⚙️ Configurações Avançadas
- **Push Notifications Nativas**: Notificações do navegador mesmo com a aba fechada
- **Horário Silencioso**: Configurar períodos sem notificações
- **Filtros por Categoria**: Escolher quais tipos de notificação receber
- **Frequência Personalizada**: Imediata, por hora, diária ou semanal
- **Persistência Local**: Notificações salvas no localStorage

### 🎯 Sistema de Prioridades
- **Alta** (vermelho): Notificações críticas que requerem ação imediata
- **Média** (amarelo): Notificações importantes mas não urgentes
- **Baixa** (verde): Informações gerais e atualizações

### 📱 Interface Intuitiva
- **Centro de Notificações**: Painel lateral com todas as notificações
- **Contador de Não Lidas**: Badge visual no ícone do sino
- **Ações Rápidas**: Marcar como lida, excluir, acessar links
- **Timestamps Relativos**: "2m atrás", "1h atrás", etc.

## 🛠️ Componentes Principais

### 1. NotificationService (`services/notificationService.ts`)
Serviço principal que gerencia todas as operações de notificação:

```typescript
// Criar notificação
notificationService.success('Título', 'Mensagem', {
  priority: 'high',
  actionUrl: '/link',
  actionText: 'Ver Mais'
});

// Métodos de conveniência
notificationService.error('Erro', 'Descrição do erro');
notificationService.promotion('Oferta!', 'Produto em promoção');
```

### 2. NotificationCenter (`components/NotificationCenter.tsx`)
Interface principal para visualizar e gerenciar notificações.

### 3. NotificationButton (`components/NotificationButton.tsx`)
Botão do sino com contador de não lidas que abre o centro de notificações.

### 4. NotificationSettings (`components/NotificationSettings.tsx`)
Página de configurações para personalizar preferências de notificação.

### 5. useNotifications Hook (`hooks/useNotifications.ts`)
Hook personalizado para facilitar o uso do sistema em componentes React.

## 🔧 Como Usar

### Integração Básica
```typescript
import { notificationService } from '../services/notificationService';

// Em qualquer componente
const handleSuccess = () => {
  notificationService.success(
    'Operação Concluída',
    'Dados salvos com sucesso!'
  );
};
```

### Usando o Hook
```typescript
import { useNotifications } from '../hooks/useNotifications';

const MyComponent = () => {
  const { notify, unreadCount } = useNotifications();
  
  const handleAction = () => {
    notify.success('Sucesso!', 'Ação realizada');
  };
  
  return <div>Não lidas: {unreadCount}</div>;
};
```

### Notificações com Ações
```typescript
notificationService.promotion(
  'Produto em Oferta!',
  'iPhone 15 com 20% de desconto',
  {
    actionUrl: 'https://shopee.com.br/produto',
    actionText: 'Ver Oferta',
    priority: 'high'
  }
);
```

## 🎨 Personalização

### Configurar Preferências
```typescript
const preferences = {
  email: true,
  push: true,
  categories: {
    system: true,
    marketing: false,
    sales: true,
    alerts: true
  },
  frequency: 'immediate',
  quietHours: {
    enabled: true,
    start: '22:00',
    end: '08:00'
  }
};

notificationService.updatePreferences(preferences);
```

## 🔄 Integração Automática

O sistema já está integrado com as funcionalidades existentes do ACI:

### TelegramShopeePage
- ✅ Produto encontrado com sucesso
- ❌ Erro ao buscar produto
- 🤖 Mensagem gerada pela IA
- 🚀 Oferta enviada para o Telegram

### WhatsAppDispatcher
- 📤 Início do disparo em massa
- ✅ Disparo concluído com estatísticas
- ⚠️ Erros durante o envio

### AdminPage
- 🔧 Configurações salvas
- ⚠️ Erros de API
- ✅ Testes de conexão bem-sucedidos

## 📊 Métricas e Analytics

O sistema coleta automaticamente:
- Número total de notificações enviadas
- Taxa de leitura por categoria
- Horários de maior engajamento
- Preferências mais utilizadas

## 🔒 Segurança e Privacidade

- **Dados Locais**: Todas as notificações são armazenadas localmente
- **Sem Tracking**: Não enviamos dados para servidores externos
- **Permissões**: Solicita permissão do usuário para push notifications
- **Controle Total**: Usuário pode desabilitar qualquer tipo de notificação

## 🚀 Próximas Funcionalidades

- [ ] Notificações por email
- [ ] Integração com Slack/Discord
- [ ] Templates de notificação personalizáveis
- [ ] Analytics avançados
- [ ] Notificações baseadas em localização
- [ ] Integração com calendário

## 🐛 Troubleshooting

### Push Notifications não funcionam
1. Verifique se o navegador suporta notifications
2. Confirme se a permissão foi concedida
3. Teste em modo HTTPS (required para push notifications)

### Notificações não persistem
1. Verifique se o localStorage está habilitado
2. Confirme se não há bloqueios de cookies/storage
3. Teste em modo privado para descartar extensões

### Performance
- O sistema limita automaticamente a 100 notificações
- Notificações antigas são removidas automaticamente
- Use `clearAll()` para limpar o histórico se necessário

## 📞 Suporte

Para dúvidas ou problemas com o sistema de notificações:
1. Consulte a página "Demo Notificações" no ACI
2. Verifique os logs do console do navegador
3. Teste as configurações na página "Notificações"

---

**Desenvolvido para ACI - Automações Comerciais Integradas**  
*Sistema de notificações moderno e intuitivo para e-commerce brasileiro*