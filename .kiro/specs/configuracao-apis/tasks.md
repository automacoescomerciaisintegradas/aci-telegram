# Plano de Implementação - Configuração de APIs

- [x] 1. Criar serviço de configuração centralizado
  - Implementar ConfigService com métodos load, save, get e isConfigured
  - Criar interfaces TypeScript para ApiConfig e estruturas de dados
  - Implementar funções de criptografia simples (Base64 com salt)
  - Adicionar validação de dados de entrada
  - _Requisitos: 1.3, 3.1, 5.1_

- [x] 2. Implementar serviço de validação de APIs
  - Criar ApiValidationService com métodos de teste para cada API
  - Implementar testGemini() para validar chave da Google Gemini AI
  - Implementar testTelegram() para validar bot token do Telegram
  - Implementar testWhatsApp() para validar API key do WhatsApp
  - Implementar testShopee() para validar configurações do Shopee
  - Adicionar método testAll() para validar todas as configurações
  - _Requisitos: 2.1, 2.2, 2.3, 3.3_

- [x] 3. Criar sistema de notificações
  - Implementar NotificationService com métodos show, hide e clear
  - Criar componente NotificationToast para exibir mensagens
  - Implementar diferentes tipos de notificação (success, error, warning, info)
  - Adicionar auto-dismiss com timeout configurável
  - _Requisitos: 1.4, 2.2, 2.3_

- [x] 4. Finalizar integração do AdminPage com os serviços

  - Adicionar imports dos serviços (configService, apiValidationService, notificationService)
  - Implementar estado para isSaving, isValidating e validationResults
  - Corrigir estrutura de dados do config para usar interfaces do ConfigService
  - Integrar carregamento automático de configurações na inicialização
  - _Requisitos: 1.1, 1.2, 1.3, 1.4, 3.2_

- [x] 5. Integrar configurações com serviços existentes
  - Atualizar geminiService.ts para usar ConfigService
  - Modificar componentes que usam APIs para carregar configurações automaticamente
  - Implementar fallbacks para quando configurações não estão disponíveis
  - Adicionar validação de configurações antes de fazer chamadas de API
  - _Requisitos: 3.1, 5.1, 5.2_

- [x] 6. Implementar tratamento de erros robusto
  - Criar enum ValidationErrorCode com códigos de erro específicos
  - Implementar tratamento específico para cada tipo de erro de API
  - Adicionar timeout para chamadas de API (10 segundos)
  - Criar mensagens de erro user-friendly para cada cenário
  - _Requisitos: 2.3, 3.3, 5.3_

- [x] 7. Adicionar configurações específicas por tipo de API
  - Implementar campos específicos para configuração do Gemini (temperatura, prompt)
  - Adicionar configurações do Telegram (webhook URL, comandos)
  - Implementar configurações do WhatsApp (número de telefone, templates)
  - Adicionar configurações do Shopee (ID de afiliado, categorias)
  - _Requisitos: 4.1, 4.2, 4.3, 4.4_

- [x] 8. Criar componente NotificationToast
  - Implementar componente para exibir notificações toast
  - Adicionar diferentes estilos para cada tipo de notificação
  - Implementar botão de fechar e auto-dismiss
  - Integrar com NotificationService
  - _Requisitos: 1.4, 2.2, 2.3_

- [ ] 9. Implementar validação contínua de configurações
  - Criar sistema de verificação periódica de validade das APIs
  - Implementar notificações proativas para chaves próximas do vencimento
  - Adicionar indicadores visuais de status das APIs no painel
  - Criar logs de auditoria para mudanças de configuração
  - _Requisitos: 3.3, 3.4_

- [ ] 10. Finalizar integração e testes de sistema
  - Testar fluxo completo de configuração → validação → uso
  - Verificar persistência de configurações entre sessões
  - Testar cenários de erro e recuperação
  - Validar que todas as funcionalidades existentes continuam funcionando
  - _Requisitos: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4_