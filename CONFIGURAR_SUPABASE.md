# 🚀 Configuração Rápida do Supabase

## ✅ Passo 1: Credenciais Configuradas
As credenciais já foram configuradas no arquivo `.env.local`

## 📋 Passo 2: Executar SQL no Supabase

1. **Acesse o Supabase Dashboard**: https://app.supabase.com/
2. **Vá para seu projeto**: uunuonapovtyuwtelrng
3. **Clique em "SQL Editor"** no menu lateral
4. **Cole o SQL abaixo** e clique em "Run":

```sql
-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  role VARCHAR(10) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política para usuários poderem ver apenas seus próprios dados
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

-- Política para usuários poderem atualizar apenas seus próprios dados
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Política para permitir inserção durante o cadastro
CREATE POLICY "Enable insert for authenticated users only" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Política para administradores verem todos os usuários
CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
```

## 👤 Passo 3: Criar Usuário Administrador

1. **Vá para "Authentication" > "Users"**
2. **Clique em "Add user"**
3. **Preencha**:
   - Email: `admin@aci.com`
   - Password: `admin123`
   - Confirm email: ✅ (marque)
4. **Clique em "Create user"**
5. **Copie o UUID** do usuário criado
6. **Volte para "SQL Editor"** e execute:

```sql
-- Substitua 'UUID_DO_ADMIN' pelo UUID copiado
INSERT INTO users (id, email, name, phone, role) 
VALUES ('UUID_DO_ADMIN', 'admin@aci.com', 'Administrador do Sistema', '(11) 99999-9999', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

## ⚙️ Passo 4: Configurar Autenticação

1. **Vá para "Authentication" > "Settings"**
2. **Em "User Signups"**: Habilite "Enable email confirmations" = **OFF** (para desenvolvimento)
3. **Em "Site URL"**: `http://localhost:5173`
4. **Em "Redirect URLs"**: Adicione `http://localhost:5173/**`

## 🧪 Passo 5: Testar

Execute o projeto e teste:

```bash
npm run dev
```

1. **Teste cadastro de usuário** (página inicial)
2. **Teste login de usuário**
3. **Clique em "Acesso Administrativo"**
4. **Teste login admin** com `admin@aci.com` / `admin123`

## ✅ Pronto!

Agora você tem:
- ✅ Cadastro de usuários funcionando
- ✅ Login de usuários com Supabase
- ✅ Login de administrador separado
- ✅ Dados salvos no banco de dados
- ✅ Segurança com RLS habilitada

---

**Precisa de ajuda?** Execute `node scripts/test-supabase.js` para testar a conexão.