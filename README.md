# 🚀 ACI - Automações Comerciais Integradas

Sistema completo de automações para e-commerce com integração Shopee, Telegram e IA.

## 📋 Funcionalidades

### 🔐 Sistema de Autenticação
- Login com email/senha
- Login com Google (simulado)
- Gerenciamento de sessão
- Credenciais de teste disponíveis

### 📱 Integrações
- **Shopee**: Busca de produtos, top vendas, links de afiliado
- **Telegram**: Disparador de mensagens, automação de grupos
- **IA**: Geração de imagens, chat inteligente
- **WhatsApp**: Automação de mensagens (em desenvolvimento)

### ⚙️ Painel Administrativo
- Configuração de APIs
- Gerenciamento de usuários
- Dashboard com métricas
- Sistema de créditos

## 🧪 Credenciais de Teste

```
Administrador:
Email: admin@aci.com
Senha: admin123

Usuário:
Email: user@aci.com
Senha: user123
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- Git (para versionamento)

### Instalação
```bash
# Clonar repositório
git clone https://github.com/seu-usuario/aci-automacoes.git
cd aci-automacoes

# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev
```

### Configuração
1. Copie `.env.example` para `.env.local`
2. Configure suas chaves de API:
   - `GEMINI_API_KEY`: Chave do Google Gemini
   - `TELEGRAM_BOT_TOKEN`: Token do bot Telegram
   - `WHATSAPP_API_KEY`: Chave da API WhatsApp

## 📦 Scripts Disponíveis

### Desenvolvimento
```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
```

### Git (Automático)
```bash
npm run git:setup    # Configuração inicial do Git
npm run git:commit   # Commit interativo
npm run git:quick    # Commit rápido
npm run git:update   # Commit de atualização
npm run git:fix      # Commit de correção
npm run git:feature  # Commit de nova funcionalidade
```

### Qualidade de Código
```bash
npm run lint         # Verificar código
npm run lint:fix     # Corrigir automaticamente
npm run format       # Formatar código
```

## 🛠️ Tecnologias

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Build**: Vite
- **APIs**: Google Gemini, Telegram Bot API
- **Autenticação**: Sistema próprio com JWT simulado
- **Deployment**: Docker, Nginx

## 📁 Estrutura do Projeto

```
aci-automacoes/
├── components/          # Componentes React
│   ├── AdminPage.tsx   # Painel administrativo
│   ├── AuthPage.tsx    # Tela de login
│   ├── Sidebar.tsx     # Menu lateral
│   └── ...
├── services/           # Serviços e APIs
│   ├── authService.ts  # Autenticação
│   └── geminiService.ts # IA Gemini
├── scripts/            # Scripts de automação
│   ├── git-setup.ps1   # Configuração Git
│   └── git-commit.ps1  # Commit automático
├── docs/               # Documentação
└── ...
```

## 🐳 Docker

```bash
# Build da imagem
docker build -t aci-app .

# Executar container
docker run -p 3000:80 aci-app

# Docker Compose
docker-compose up -d
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit: `npm run git:feature`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

## 📄 Scripts Git Automáticos

### Configuração Inicial
```bash
# PowerShell
powershell -ExecutionPolicy Bypass -File scripts/git-setup.ps1

# Ou Batch
scripts\git-setup.bat
```

### Commits Rápidos
```bash
# Commit interativo
npm run git:commit

# Commits pré-definidos
npm run git:update    # Atualização geral
npm run git:fix       # Correção de bugs
npm run git:feature   # Nova funcionalidade
```

## 📊 Status do Projeto

- ✅ Sistema de autenticação
- ✅ Dashboard administrativo
- ✅ Integração Telegram básica
- ✅ Interface responsiva
- 🚧 Integração Shopee completa
- 🚧 IA para geração de conteúdo
- 🚧 WhatsApp automation
- 📋 Testes automatizados

## 📞 Suporte

Para dúvidas e suporte:
- 📧 Email: suporte@aci.com
- 💬 Telegram: @aci_suporte
- 📱 WhatsApp: +55 11 99999-9999

## 📜 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Desenvolvido com ❤️ pela equipe ACI**