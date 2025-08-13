# Configuração do Supabase para ACI

## 1. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com suas credenciais do Supabase:

```env
REACT_APP_SUPABASE_URL=https://seu-projeto.supabase.co
REACT_APP_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
```

## 2. Executar Script SQL

No painel do Supabase, vá para **SQL Editor** e execute o script em `database/schema.sql` para criar:
- Tabela `users`
- Índices para performance
- Políticas de segurança (RLS)
- Triggers para atualização automática

## 3. Configurar Autenticação

No painel do Supabase:

### Authentication > Settings:
- **Enable email confirmations**: Desabilitado (para desenvolvimento)
- **Enable phone confirmations**: Desabilitado
- **Minimum password length**: 6

### Authentication > URL Configuration:
- **Site URL**: `http://localhost:5173` (para desenvolvimento)
- **Redirect URLs**: `http://localhost:5173/**`

## 4. Criar Usuário Administrador

### Opção 1: Via Interface do Supabase
1. Vá para **Authentication > Users**
2. Clique em **Add user**
3. Email: `admin@aci.com`
4. Senha: `admin123` (ou sua preferência)
5. Confirme o email automaticamente

### Opção 2: Via SQL (após criar o usuário na interface)
```sql
-- Substitua 'uuid-do-admin' pelo UUID real do usuário criado
INSERT INTO users (id, email, name, phone, role) 
VALUES ('uuid-do-admin', 'admin@aci.com', 'Administrador do Sistema', '(11) 99999-9999', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

## 5. Testar a Configuração

1. Inicie o projeto: `npm run dev`
2. Acesse a página de cadastro de usuário
3. Crie uma conta de teste
4. Teste o login de usuário
5. Teste o login de administrador

## 6. Estrutura da Tabela Users

```sql
users (
  id UUID PRIMARY KEY,           -- Referência ao auth.users
  email VARCHAR(255) UNIQUE,     -- Email do usuário
  name VARCHAR(255),             -- Nome completo
  phone VARCHAR(20),             -- Telefone
  role VARCHAR(10),              -- 'user' ou 'admin'
  created_at TIMESTAMP,          -- Data de criação
  updated_at TIMESTAMP           -- Data de atualização
)
```

## 7. Funcionalidades Implementadas

### Para Usuários:
- ✅ Cadastro com email, senha, nome e telefone
- ✅ Login com email e senha
- ✅ Dados salvos no Supabase
- ✅ Sessão persistente

### Para Administradores:
- ✅ Login separado com validação de role
- ✅ Interface diferenciada
- ✅ Acesso restrito

### Segurança:
- ✅ Row Level Security (RLS) habilitado
- ✅ Usuários só veem seus próprios dados
- ✅ Admins podem ver todos os usuários
- ✅ Senhas criptografadas pelo Supabase Auth

## 8. Próximos Passos

Após configurar o Supabase, você pode:
1. Personalizar os campos da tabela users
2. Adicionar mais funcionalidades de perfil
3. Implementar recuperação de senha
4. Adicionar autenticação social (Google, etc.)
5. Configurar webhooks para eventos de auth